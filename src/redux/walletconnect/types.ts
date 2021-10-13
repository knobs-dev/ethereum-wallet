// Reducer
export type WalletconnectReducerState = {
  loading: boolean;
  initialized: boolean;
  connector: any;
  connected: boolean;
  chainId: number;
  accounts: Array<string>;
  address: string;
};
