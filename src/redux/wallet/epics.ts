import { ethers } from 'ethers';
import { combineEpics, Epic } from 'redux-observable';

// import { of, from, interval } from 'rxjs';
import { of, from } from 'rxjs';
import { filter, catchError, mergeMap, map, delay } from 'rxjs/operators';
import {
    importWallet,
    generateWallet,
    generateWalletOk,
    generateWalletFail,
    // balanceUpdateOk,
    // balanceUpdateFail,
    WalletAction,
    // generateWalletCurrentBlock,
} from './actionCreators';
import { WalletReducerState } from './types';

// import { balanceRefreshInterval, provider } from '../../imports/config';
import { isActionOf } from 'typesafe-actions';

const walletCreationEpic: Epic<
    WalletAction,
    WalletAction,
    WalletReducerState
> = (action$, state$) => 
    action$.pipe(
        filter(isActionOf(generateWallet)),
        mergeMap(() => {
            const walletPromise: Promise<any> = new Promise(resolve => {
                const wallet = ethers.Wallet.createRandom();
                resolve(wallet);
            });
            return from(walletPromise).pipe(
                delay(2000),
                map(wallet => {
                    return generateWalletOk(wallet);
                }),
                catchError(error => {
                    return of(generateWalletFail(error));
                }),
            );
        }),
    );

const walletImportEpic: Epic<
    WalletAction,
    WalletAction,
    WalletReducerState
> = (action$, state$) => 
    action$.pipe(
        filter(isActionOf(importWallet)),
        mergeMap(({payload: {key}}) => {
            const walletPromise: Promise<any> = new Promise(resolve => {
                const wallet = new ethers.Wallet(key);
                resolve(wallet);
            });
            return from(walletPromise).pipe(
                map(wallet => {
                    return generateWalletOk(wallet);
                }),
                catchError(error => {
                    return of(generateWalletFail(error));
                }),
            );
        }),
    );

// const walletCreationCurrBlockEpic: Epic<
//     WalletAction,
//     WalletAction,
//     WalletReducerState
// > = (action$, state$) =>
//     action$.pipe(
//         filter(isActionOf(generateWalletOk)),
//         mergeMap(() =>
//             from(provider.getBlockNumber()).pipe(
//                 map(blockNumber => {
//                     return generateWalletCurrentBlock(blockNumber);
//                 }),
//                 catchError(error => {
//                     return of(generateWalletFail(error));
//                 }),
//             ),
//         ),
//     );

// const balanceUpdateEpic: Epic<
//     WalletAction,
//     WalletAction,
//     WalletReducerState
// > = (action$, state$) =>
//     action$.pipe(
//         filter(isActionOf(generateWalletOk)),
//         mergeMap(({ payload }) => {
//             const address = payload.wallet.address;
//             console.log(
//                 `Fetching new balance for address ${address} every ${balanceRefreshInterval} seconds`,
//             );
//             return interval(balanceRefreshInterval).pipe(
//                 mergeMap(result => {
//                     return from(provider.getBalance(address)).pipe(
//                         map(result => {
//                             return balanceUpdateOk(result.toNumber());
//                         }),
//                         catchError(error => {
//                             console.log(error);
//                             return of(balanceUpdateFail(error));
//                         }),
//                     );
//                 }),
//                 catchError(error => {
//                     console.log(error);
//                     return of(balanceUpdateFail(error));
//                 }),
//             );
//         }),
//     );

export default combineEpics(walletCreationEpic, walletImportEpic);
