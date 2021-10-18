import {
  WALLET_CONNECT_INITIALIZE_REQ,
  WALLET_CONNECT_INITIALIZE_OK,
  WALLET_CONNECT_UPDATE_SESSION,
  WALLET_CONNECT_CONNECTED,
  WALLET_CONNECT_RESET,
} from "./actionTypes";

import { WalletconnectReducerState } from "./types";

const initialState: WalletconnectReducerState = {
  loading: false,
  initialized: false,
  connector: null,
  connected: false,
  chainId: 1,
  accounts: [],
  address: "",
};

export function walletconnect(
  state = initialState,
  action: any
): WalletconnectReducerState {
  switch (action.type) {
    case WALLET_CONNECT_INITIALIZE_REQ:
      state.loading = true;

      return state;
    case WALLET_CONNECT_INITIALIZE_OK:
      state.loading = false;
      state.initialized = true;
      state.connector = action.payload.connector;

      return state;
    case WALLET_CONNECT_UPDATE_SESSION:
      state.chainId = action.payload.chainId;
      state.accounts = action.payload.accounts;
      state.address = action.payload.address;

      return state;
    case WALLET_CONNECT_CONNECTED:
      state.connected = true;
      state.chainId = action.payload.chainId;
      state.accounts = action.payload.accounts;
      state.address = action.payload.address;

      return state;
    case WALLET_CONNECT_RESET:
      state = initialState;
      return state;
    default:
      return state;
  }
}
