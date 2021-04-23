// TODO: Integrate createReducer from typesafe-actions
import { GUIDE_COMPLETED, CLEAR_DATA_OK, NETWORK_SELECT } from './actionTypes';

import { CommonReducerState } from './types';

const initialState: CommonReducerState = {
    guide: {},
    selectedNetwork: 'ropsten',
};

export function common(state = initialState, action: any): CommonReducerState {
    switch (action.type) {
        case NETWORK_SELECT:
            state.selectedNetwork = action.payload.network;
            return state;

        case GUIDE_COMPLETED:
            state.guide[action.payload.guideName] = true;
            return state;

        case CLEAR_DATA_OK:
            state = initialState;
            return state;
        default:
            return state;
    }
}
