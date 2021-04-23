import { combineEpics, Epic } from 'redux-observable';
import { map, filter } from 'rxjs/operators';
import {
    CommonAction,
    clearData,
    clearDataOk,
} from './actionCreators';

import { isActionOf } from 'typesafe-actions';

import { customHistory as history } from '../../router';

// Request an ether from faucet
const clearDataEpic: Epic<CommonAction, CommonAction> = (action$, state$) => {
    return action$.pipe(
        filter(isActionOf(clearData)),
        map(() => {
            history.replace('/wallet/create');
            return clearDataOk();
        }),
    );
};

export default combineEpics(clearDataEpic);
