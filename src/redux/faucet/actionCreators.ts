import { createAction, ActionType } from 'typesafe-actions';
import {
    FAUCET_REQ,
    FAUCET_OK,
    FAUCET_FAIL,
    FAUCET_TX_CONFIRM,
    FAUCET_TX_FAIL,
} from './actionTypes';

// Register Wallet Request
export const faucet = createAction(FAUCET_REQ, (to: string) => ({
    to,
}))();

// Wallet has been succesfully registered
export const faucetOk = createAction(FAUCET_OK, (txHash: string) => ({
    txHash,
}))();

// Wallet registration failed
export const faucetFail = createAction(FAUCET_FAIL, (error: any) => ({
    error,
}))();

// Faucet transaction has been included in a block with success status
export const faucetTxConfirmed = createAction(FAUCET_TX_CONFIRM, (tx: any) => ({
    tx,
}))();

// Faucet transaction has been included in a block with fail status
export const faucetTxFailed = createAction(FAUCET_TX_FAIL, (tx: any) => ({
    tx,
}))();

// Compose the export object separately in order to use
// it for typescript ActionType composition
const FaucetActions = {
    faucet,
    faucetOk,
    faucetFail,
    faucetTxConfirmed,
    faucetTxFailed,
};

export type FaucetAction = ActionType<typeof FaucetActions>;
