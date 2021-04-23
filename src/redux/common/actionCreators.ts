import { createAction, ActionType } from 'typesafe-actions';

import {
    CLEAR_DATA_REQ,
    CLEAR_DATA_OK,
    CLEAR_DATA_FAIL,
    GUIDE_COMPLETED,
    NETWORK_SELECT,
} from './actionTypes';

import { AvailableNetworks } from './types';

// Generate Wallet Request
export const clearData = createAction(CLEAR_DATA_REQ)();
export const clearDataOk = createAction(CLEAR_DATA_OK)();
export const clearDataFail = createAction(CLEAR_DATA_FAIL)();

// Completed guide
export const guideCompleted = createAction(
    GUIDE_COMPLETED,
    (guideName: string) => ({ guideName }),
)();

// Select the network to connect with
export const networkSelect = createAction(
    NETWORK_SELECT,
    (network: AvailableNetworks) => ({ network }),
)();

const CommonActions = {
    clearData,
    clearDataOk,
    clearDataFail,
    guideCompleted,
    networkSelect,
};

export type CommonAction = ActionType<typeof CommonActions>;
