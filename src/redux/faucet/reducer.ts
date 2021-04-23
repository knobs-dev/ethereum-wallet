// TODO: Integrate createReducer from typesafe-actions

import { CLEAR_DATA_OK } from '../common/actionTypes';
import { FaucetReducerState } from './types';

const initialState: FaucetReducerState = {
    loading: false,
};

export function faucet(state = initialState, action: any): FaucetReducerState {
    switch (action.type) {
        case CLEAR_DATA_OK:
            state = initialState;
            return state;
        default:
            return state;
    }
}
