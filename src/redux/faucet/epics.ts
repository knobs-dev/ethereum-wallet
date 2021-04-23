import { combineEpics, Epic } from 'redux-observable';
import { of, from } from 'rxjs';
import { catchError, mergeMap, map, filter } from 'rxjs/operators';
import axios from 'axios';
import {
    faucetOk,
    faucetFail,
    faucetTxFailed,
    faucetTxConfirmed,
    faucet,
    FaucetAction,
} from './actionCreators';
import { FaucetReducerState } from './types';
import { isActionOf } from 'typesafe-actions';
import {
    faucetURL,
    provider,
} from '../../imports/config';

// Request an ether from faucet
const faucetEpic: Epic<FaucetAction, FaucetAction, FaucetReducerState> = (
    action$,
    state$,
) => {
    return action$.pipe(
        filter(isActionOf(faucet)),
        mergeMap(({ payload }) => {
            const request = axios.post(faucetURL, { to: payload.to });
            return from(request).pipe(
                map(result => {
                    return faucetOk(result.data.hash);
                }),
                catchError(error => {
                    return of(faucetFail(error));
                }),
            );
        }),
    );
};

// Request an ether from faucet
const faucetWaitingEpic: Epic<
    FaucetAction,
    FaucetAction,
    FaucetReducerState
> = (action$, state$) =>
    action$.pipe(
        filter(isActionOf(faucetOk)),
        mergeMap(({ payload }) => {
            return from(provider.waitForTransaction(payload.txHash)).pipe(
                map(result => {
                    return faucetTxConfirmed(result);
                }),
                catchError(error => {
                    return of(faucetTxFailed(error));
                }),
            );
        }),
    );

export default combineEpics(faucetEpic, faucetWaitingEpic);
