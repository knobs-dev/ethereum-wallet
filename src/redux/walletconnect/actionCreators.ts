import { createAction, ActionType } from "typesafe-actions";

import {
  WALLET_CONNECT_INITIALIZE_REQ,
  WALLET_CONNECT_INITIALIZE_OK,
  WALLET_CONNECT_UPDATE_SESSION,
  WALLET_CONNECT_CONNECTED,
  WALLET_CONNECT_RESET,
} from "./actionTypes";

// WalletConnect initialize
export const walletconnectInitialize = createAction(
  WALLET_CONNECT_INITIALIZE_REQ
)();

// WalletConnect connection has been initialized
export const walletconnectInitializeOk = createAction(
  WALLET_CONNECT_INITIALIZE_OK,
  (connector: any) => ({ connector })
)();

// WalletConnect update session
export const walletconnectUpdateSession = createAction(
  WALLET_CONNECT_UPDATE_SESSION,
  (chainId: any, accounts: any, address: string) => ({
    chainId,
    accounts,
    address,
  })
)();

// WalletConnect connection has been established
export const walletconnectConnected = createAction(
  WALLET_CONNECT_CONNECTED,
  (chainId: any, accounts: any, address: string) => ({
    chainId,
    accounts,
    address,
  })
)();

export const walletconnectReset = createAction(WALLET_CONNECT_RESET)();

const WalletconnectActions = {
  walletconnectInitialize,
  walletconnectInitializeOk,
  walletconnectUpdateSession,
  walletconnectConnected,
  walletconnectReset,
};

export type WalletconnectAction = ActionType<typeof WalletconnectActions>;
