import { BigNumber } from 'ethers';
import { createAction, ActionType } from 'typesafe-actions';

import {
    TX_SYNC_REQ,
    TX_SYNC_OK,
    TX_SYNC_FAIL,
    TX_NEW_TX,
    TX_SEND_REQ,
    TX_SEND_OK,
    TX_SEND_FAIL,
    TX_SEND_CONFIRMED,
    TX_SEND_FAILED,
    TX_ETHERSCAN_REQ,
    TX_ETHERSCAN_OK,
    TX_ETHERSCAN_FAIL,
} from './actionTypes';

// Start to sync for historical transaction from a specific block number
export const txSync = createAction(TX_SYNC_REQ, (initialBlock: number) => ({
    initialBlock,
}))();

// Sync has complete
export const txSyncOk = createAction(TX_SYNC_OK)();

// Sync failed
export const txSyncFail = createAction(TX_SYNC_FAIL, (error: any) => ({
    error,
}))();

// New transaction has been found in a block
export const txNewTx = createAction(TX_NEW_TX, (tx: any) => ({
    tx,
}))();

// New tx request
export const txSend = createAction(
    TX_SEND_REQ,
    (to: string, amount: BigNumber, gasPrice: BigNumber, data?: string) => ({
        to,
        amount,
        gasPrice,
        data,
    }),
)();

// Tx has been successfully sent
export const txSendOk = createAction(TX_SEND_OK, (tx: any) => ({
    tx,
}))();

// It is not pollible to send the tx
export const txSendFail = createAction(TX_SEND_FAIL, (error: any) => ({
    error,
}))();

// Whenever a sent transaction has been registered with success status
export const txSendConfirmed = createAction(
    TX_SEND_CONFIRMED,
    (receipt: any) => ({
        receipt,
    }),
)();

// Whenever a sent transaction has been registered with failed status
export const txSendFailed = createAction(TX_SEND_FAILED, (receipt: any) => ({
    receipt,
}))();

// Start get request for getting all transactions
export const txEtherscanReq = createAction(
    TX_ETHERSCAN_REQ,
    (address: any) => ({
        address,
    }),
)();

// Get request for getting all transactions OK
export const txEtherscanOk = createAction(TX_ETHERSCAN_OK, (data: any) => ({
    data,
}))();

// Get request for getting all transactions FAIL
export const txEtherscanFail = createAction(TX_ETHERSCAN_FAIL)();

const TxActions = {
    txSync,
    txSyncOk,
    txSyncFail,
    txNewTx,
    txSend,
    txSendOk,
    txSendFail,
    txSendConfirmed,
    txSendFailed,
    txEtherscanReq,
    txEtherscanOk,
    txEtherscanFail,
};

export type TransactionActions = ActionType<typeof TxActions>;
