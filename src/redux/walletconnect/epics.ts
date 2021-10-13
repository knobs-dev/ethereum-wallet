import { combineEpics, Epic } from "redux-observable";
import WalletConnect from "@walletconnect/client";

import { EMPTY, Observable, of } from "rxjs";
import { filter, mergeMap } from "rxjs/operators";

import {
  WalletconnectAction,
  walletconnectInitialize,
  walletconnectInitializeOk,
  walletconnectConnected,
  walletconnectReset,
} from "./actionCreators";
import { generateWalletOk } from "../wallet/actionCreators";
import { WalletconnectReducerState } from "./types";

import { isActionOf } from "typesafe-actions";

const walletconnectInitializeEpic: Epic<
  WalletconnectAction,
  WalletconnectAction,
  WalletconnectReducerState
> = (action$, state$) => {
  return action$.pipe(
    filter(isActionOf(walletconnectInitialize)),
    mergeMap(async () => {
      const bridge = "https://bridge.walletconnect.org";
      const connector = new WalletConnect({ bridge });

      if (!connector.connected) {
        await connector.createSession();
      }

      return walletconnectInitializeOk(connector);
    })
  );
};

const walletconnectConnectedEpic = (action$: any, state$: any) => {
  return action$.pipe(
    filter(isActionOf(walletconnectConnected)),
    mergeMap(() => {
      if (!state$.value.wallet.wallet) {
        return of(
          generateWalletOk({ address: state$.value.walletconnect.address })
        );
      } else {
        return EMPTY;
      }
    })
  );
};

export default combineEpics(
  walletconnectInitializeEpic,
  walletconnectConnectedEpic
);
