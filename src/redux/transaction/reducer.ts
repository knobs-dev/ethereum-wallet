// TODO: Integrate createReducer from typesafe-actions
import { CLEAR_DATA_OK } from "../common/actionTypes";
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
} from "./actionTypes";

import { TransactionReducerState } from "./types";

const initialState: TransactionReducerState = {
  loading: false,
  lastSyncedBlock: null,
  transactions: {},
  pendingTransactions: {},
  transactionHistory: [],
};

export function transaction(
  state = initialState,
  action: any
): TransactionReducerState {
  switch (action.type) {
    case TX_SYNC_REQ:
      return state;
    case TX_SYNC_OK:
      return state;
    case TX_SYNC_FAIL:
      return state;
    case TX_NEW_TX:
      return state;
    case TX_SEND_REQ:
      state.loading = true;
      return state;
    case TX_SEND_OK:
      state.loading = false;
      state.pendingTransactions[action.payload?.tx?.hash] = action.payload.tx;
      return state;
    case TX_SEND_FAIL:
      state.loading = false;
      if (state.pendingTransactions[action.payload?.tx?.hash]) {
        state.pendingTransactions[action.payload?.tx?.hash].error =
          action.payload?.error;
      }
      return state;
    case TX_SEND_CONFIRMED:
      state.transactions[action.payload?.receipt?.transactionHash] = {
        ...state.pendingTransactions[action.payload?.receipt?.transactionHash],
        receipt: action.payload?.receipt,
      };

      delete state.pendingTransactions[
        action.payload?.receipt?.transactionHash
      ];
      return state;
    // TODO: remove
    case TX_SEND_FAILED:
      state.transactions[action.payload?.receipt?.transactionHash] = {
        ...state.pendingTransactions[action.payload?.receipt?.transactionHash],
        receipt: action.payload?.receipt,
      };

      delete state.pendingTransactions[
        action.payload?.receipt?.transactionHash
      ];
      return state;

    case TX_ETHERSCAN_REQ:
      state.loading = true;
      return state;
    case TX_ETHERSCAN_OK:
      state.loading = false;
      state.transactionHistory = action.payload.data.result;
      return state;
    case TX_ETHERSCAN_FAIL:
      state.loading = false;
      return state;
    case CLEAR_DATA_OK:
      state = initialState;
      return state;
    default:
      return state;
  }
}
