// TODO: Integrate createReducer from typesafe-actions

// import { WalletAction } from '../wallet/actionCreators';
// import { CommonAction } from '../common/actionCreators';

import { CLEAR_DATA_OK } from '../common/actionTypes';
import {
    ADDRESSBOOK_FETCH_REQ,
    ADDRESSBOOK_FETCH_OK,
    ADDRESSBOOK_FETCH_FAIL,
    ADDRESSBOOK_UPDATE_OK,
    ADDRESSBOOK_LOAD_OK,
} from './actionTypes';

import { AddressBookReducerState } from './types';

const initialState: AddressBookReducerState = {
    loading: false,
    addresses: [],
};

export function addressbook(
    state = initialState,
    action: any,
): AddressBookReducerState {
    switch (action.type) {
        case ADDRESSBOOK_FETCH_REQ:
            state.loading = true;
            return state;
        case ADDRESSBOOK_FETCH_OK:
            state.loading = false;
            state.addresses = action.payload.addresses;
            return state;
        case ADDRESSBOOK_FETCH_FAIL:
            state.loading = false;
            state.error = action.payload.error;
            state.addresses = [];
            return state;
        case ADDRESSBOOK_LOAD_OK:
            state.addresses = action.payload?.addresses;
            return state;
        case ADDRESSBOOK_UPDATE_OK:
            if (!state.addresses.includes(action.payload)) {
                state.addresses.push(action.payload);
            }
            return state;
        case CLEAR_DATA_OK:
            state = initialState;
            return state;
        default:
            return state;
    }
}
