import { createAction, ActionType } from 'typesafe-actions';

import {
    ADDRESSBOOK_FETCH_REQ,
    ADDRESSBOOK_FETCH_OK,
    ADDRESSBOOK_FETCH_FAIL,
    NEW_REGISTRATION_EVENT,
    ADDRESSBOOK_SUBSCRIBE_REQ,
    ADDRESSBOOK_LOAD_OK,
    ADDRESSBOOK_UPDATE_OK,
    ADDRESSBOOK_WRITE_REQ,
} from './actionTypes';

// Address book fetch request
export const addressBookFetch = createAction(ADDRESSBOOK_FETCH_REQ)();

// All users from address book have been succesfully retrieved
export const addressBookFetchOk = createAction(
    ADDRESSBOOK_FETCH_OK,
    (addresses: Array<string>) => ({ addresses }),
)();

// Failed to fetch address book
export const addressBookFetchFail = createAction(
    ADDRESSBOOK_FETCH_FAIL,
    (error: any) => ({ error }),
)();

// New registration event
export const newRegistrationEvent = createAction(
    NEW_REGISTRATION_EVENT,
    (event: any) => ({ event }),
)();

// Firebase
export const addressBookSubscribe = createAction(ADDRESSBOOK_SUBSCRIBE_REQ)();
export const addressBookLoadOk = createAction(
    ADDRESSBOOK_LOAD_OK,
    (addresses: Array<string>) => ({ addresses }),
)();

export const addressBookUpdateOk = createAction(
    ADDRESSBOOK_UPDATE_OK,
    (address: string, createdAt: number) => ({ address, createdAt }),
)();

export const addressBookWrite = createAction(
    ADDRESSBOOK_WRITE_REQ,
    (address: string) => ({ address }),
)();

const AddressBookActions = {
    addressBookFetch,
    addressBookFetchOk,
    addressBookFetchFail,
    newRegistrationEvent,
};

export type AddressBookAction = ActionType<typeof AddressBookActions>;
