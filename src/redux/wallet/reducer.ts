// TODO: Integrate createReducer from typesafe-actions

// import { WalletAction } from '../wallet/actionCreators';
// import { CommonAction } from '../common/actionCreators';

import { CLEAR_DATA_OK } from '../common/actionTypes';
import {
    WALLET_IMPORT_REQ,
    WALLET_GENERATE_REQ,
    WALLET_GENERATE_OK,
    WALLET_GENERATE_FAIL,
    WALLET_STEPS_NEXT,
    WALLET_RESET_ERROR,
} from './actionTypes';

import { CreationSteps, WalletReducerState } from './types';

const initialState: WalletReducerState = {
    loading: false,
    wallet: null,
    creationStep: CreationSteps.INITIAL,
};

export function wallet(state = initialState, action: any): WalletReducerState {
    switch (action.type) {
        case WALLET_IMPORT_REQ:
            state.loading = true;
            return state;
        case WALLET_GENERATE_REQ:
            state.loading = true;
            return state;
        case WALLET_GENERATE_OK:
            state.loading = false;
            state.wallet = action.payload.wallet;
            return state;
        case WALLET_GENERATE_FAIL:
            state.loading = false;
            state.wallet = null;
            state.error = action.payload.error;
            return state;
        case WALLET_RESET_ERROR:
            state.error = null;
            return state;
        case WALLET_STEPS_NEXT:
            state.creationStep = state.creationStep + 1;
            return state;
        case CLEAR_DATA_OK:
            state = initialState;
            return state;
        default:
            return state;
    }
}
