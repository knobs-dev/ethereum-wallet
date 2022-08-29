import { ethers } from "ethers";
import { combineEpics, Epic, ofType } from "redux-observable";
import { of, from, fromEventPattern } from "rxjs";
import {
  filter,
  catchError,
  mergeMap,
  map,
  exhaustMap,
  takeUntil,
} from "rxjs/operators";
import {
  addressBookFetch,
  addressBookFetchOk,
  addressBookFetchFail,
  AddressBookAction,
  addressBookSubscribe,
  addressBookLoadOk,
  addressBookUpdateOk,
} from "./actionCreators";

import { generateWalletOk } from "../wallet/actionCreators";
// import { AddressBookReducerState } from './types';

import { addressBookAddress } from "../../imports/config";
import { isActionOf } from "typesafe-actions";

import addressBookAbi from "../../imports/abis/address_book.abi.json";
import { getProviderByNetwork } from "../../imports/utils";
import { CLEAR_DATA_OK } from "../common/actionTypes";
import { RootState } from "../store";

const addressBookFetchEpic: Epic<
  AddressBookAction,
  AddressBookAction,
  RootState
> = (action$, state$) =>
  action$.pipe(
    filter(isActionOf(addressBookFetch)),
    mergeMap(() => {
      const network = state$.value.common.selectedNetwork;
      const provider = getProviderByNetwork(network);

      const addressBookContract = new ethers.Contract(
        addressBookAddress,
        addressBookAbi,
        provider
      );
      const promise: Promise<Array<string>> = new Promise((resolve, reject) => {
        addressBookContract.getAllUsers().then(resolve).catch(reject);
      });

      return from(promise).pipe(
        map((addresses) => {
          return addressBookFetchOk(addresses);
        }),
        catchError((error) => {
          console.log(error);
          return of(addressBookFetchFail(error));
        })
      );
    })
  );

const handleWalletAdrdessSnapshot = (
  collectionEvent: any
): Array<AddressBookAction> => {
  const [type, data] = collectionEvent;

  const actions: Array<AddressBookAction> = [];

  if (type === "firstload") {
    actions.push(
      addressBookLoadOk(
        data.map((d: any) => ({
          address: d.id,
          createdAt: d.data.createdAt,
        }))
      )
    );
  } else if (type === "added") {
    actions.push(addressBookUpdateOk(data.id, data.data.createdAt));
  } else if (type === "modified") {
    // actions.push(
    // )
  } else if (type === "removed") {
    // Nothing here
  }

  return actions;
};

const loadAndListen = (ref: any, listener: any) => {
  let firstLoad = true;
  let loadedDocuments: Array<any> = [];

  return ref.onSnapshot((snapshot: any) => {
    snapshot.docChanges().forEach((change: any) => {
      const id = change.doc.id;
      const data = change.doc.data();

      if (firstLoad) {
        loadedDocuments.push({ id, data });
      } else if (change.type === "added") {
        listener(["added", { id, data }]);
      } else if (change.type === "modified") {
        listener(["modified", { id, data }]);
      } else if (change.type === "removed") {
        listener(["removed", { id, data }]);
      }
    });

    if (firstLoad) {
      listener(["firstload", loadedDocuments]);
      firstLoad = false;
    }
  });
};

const addressBookSubscribeEpic: Epic<
  AddressBookAction,
  AddressBookAction,
  any
> = (action$, state$, { firebase }) =>
  action$.pipe(
    filter(isActionOf(addressBookSubscribe)),
    mergeMap(() => {
      const firestore = firebase.firestore();

      const walletAddressesRef = firestore.collection("walletAddresses");

      return fromEventPattern<AddressBookAction>(
        (handler) => loadAndListen(walletAddressesRef, handler),
        (handler, unsubscribe) => unsubscribe()
      ).pipe(
        mergeMap((collectionEvent: any) => {
          return handleWalletAdrdessSnapshot(collectionEvent);
        }),
        takeUntil(action$.pipe(ofType(CLEAR_DATA_OK))),
        catchError((error) => {
          console.log(error);
          return of(addressBookFetchFail(error));
        })
      );
    })
  );

const addressBookWriteEpic: Epic<AddressBookAction, AddressBookAction, any> = (
  action$,
  state$,
  { firebase }
) =>
  action$.pipe(
    filter(isActionOf(generateWalletOk)),
    exhaustMap(({ payload }: any) => {
      const firestore = firebase.firestore();

      const walletAddress = payload.wallet?.address;
      const data = { address: walletAddress, createdAt: Date.now() };

      const walletAddressesRef = firestore
        .collection("walletAddresses")
        .doc(walletAddress);

      return from(walletAddressesRef.set(data)).pipe(
        map(() => {
          return addressBookUpdateOk(walletAddress, data.createdAt);
        }),
        catchError((error) => {
          return of(addressBookFetchFail(error));
        })
      );
    })
  );

export default combineEpics(
  addressBookFetchEpic,
  addressBookSubscribeEpic,
  addressBookWriteEpic
);
