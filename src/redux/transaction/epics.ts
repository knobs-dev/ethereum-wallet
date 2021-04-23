import axios from 'axios';
import { combineEpics, Epic } from 'redux-observable';
import { of, from, fromEventPattern } from 'rxjs';
import { filter, catchError, mergeMap, map } from 'rxjs/operators';
import {
    TransactionActions,
    txSync,
    txSyncFail,
    txSyncOk,
    txSend,
    txSendOk,
    txSendFail,
    txSendConfirmed,
    txSendFailed,
    txEtherscanReq,
    txEtherscanOk,
    txEtherscanFail
} from './actionCreators';
import { TransactionReducerState } from './types';

// TODO: replace provider with infuraProviderByNetwork

import { provider } from '../../imports/config';
import { isActionOf } from 'typesafe-actions';

import { customHistory } from '../../router';

const syncTransactions = async (
    lastSyncedBlock: number,
    handler: (event: string, transactions: Array<any>) => void,
) => {
    const currBlock: number = await provider.getBlockNumber();

    let syncedBlock = lastSyncedBlock;
    while (currBlock > syncedBlock) {
        const block = await provider.getBlockWithTransactions(syncedBlock + 1);

        console.log(block);

        handler('NEW_TX', block.transactions);

        syncedBlock += 1;

        break;
    }

    handler('COMPLETE', []);

    // txSyncObservable.next()
};

const txSyncEpic: Epic<
    TransactionActions,
    TransactionActions,
    TransactionReducerState
> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(txSync)),
        mergeMap(({ payload }) => {
            const syncedBlocks$ = fromEventPattern(
                handler => syncTransactions(payload.initialBlock, handler),
                (handler, unsubscribe) => unsubscribe(),
            );

            return syncedBlocks$.pipe(
                map((event, transactions) => {
                    console.log(event, transactions);
                    return txSyncOk();
                }),
                catchError(error => {
                    return of(txSyncFail(error));
                }),
            );
        }),
    );

const txSendEpic: Epic<TransactionActions, TransactionActions, any> = (
    action$,
    state$,
) =>
    action$.pipe(
        filter(isActionOf(txSend)),
        mergeMap(({ payload }) => {
            const wallet = state$.value.wallet?.wallet;
            const account = wallet.connect(provider);

            const tx = {
                to: payload.to,
                value: payload.amount,
                gasPrice: payload.gasPrice,
                data: payload.data || '0x',
            };

            return from(account.sendTransaction(tx)).pipe(
                map((transaction: any) => {
                    return txSendOk(transaction);
                }),
                catchError(error => {
                    return of(txSendFail(error));
                }),
            );
        }),
    );

const txSendWaitTxEpic: Epic<TransactionActions, TransactionActions, any> = (
    action$,
    state$,
) =>
    action$.pipe(
        filter(isActionOf(txSendOk)),
        mergeMap(({ payload }) => {
            // Change page
            customHistory.replace(`/tx/${payload.tx.hash}`);
            return from(provider.waitForTransaction(payload.tx.hash)).pipe(
                map(result => {
                    return txSendConfirmed(result);
                }),
                catchError(error => {
                    return of(txSendFailed(error));
                }),
            );
        }),
    );


    const txEtherscanReqEpic: Epic<TransactionActions, TransactionActions, any> = (
        action$,
        state$,
    ) =>
        action$.pipe(
            filter(isActionOf(txEtherscanReq)),
            mergeMap(({ payload }) => {
                const etherscanGetAllTx = `https://api-ropsten.etherscan.io/api?module=account&action=txlist&address=${payload.address}&apikey=${process.env.REACT_APP_ETH_API_KEY}`
                const axiosPromise = axios.get(etherscanGetAllTx);
                return from(axiosPromise).pipe(
                    map((data: any) => {
                        if(data?.data?.result) {return txEtherscanOk(data.data)} else {return txEtherscanFail()}
                    }),
                    catchError(error => {
                        console.log("error",error)
                        return of(txEtherscanFail());
                    }),
                );
            })
        )
    

export default combineEpics(txSyncEpic, txSendEpic, txSendWaitTxEpic, txEtherscanReqEpic);
