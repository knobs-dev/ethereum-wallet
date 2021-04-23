// Common
interface GenericErrorAction {
    type: string;
    payload: { error: any };
}

// Wallet generation
interface WalletGenerateReqAction {
    type: string;
    payload?: any;
}
interface WalletGenerateOkAction {
    type: string;
    payload: { wallet: any };
}

// Faucet
interface FaucetReqAction {
    type: string;
    payload: {
        to: string;
    };
}
interface FaucetOkAction {
    type: string;
    payload: {
        txHash: string;
    };
}

// General Wallet action
export type WalletAction =
    | GenericErrorAction
    | WalletGenerateReqAction
    | WalletGenerateOkAction
    | FaucetReqAction
    | FaucetOkAction;

// Wallet Actions
export interface WalletActions {
    generateWallet: () => WalletAction;
    generateWalletOk: (wallet: any) => WalletAction;
    generateWalletFail: (error: any) => WalletAction;
}

export type WalletActionCreator = () => WalletAction;

export enum CreationSteps {
    'INITIAL',
    'PRIVATE_KEY',
    'PUBLIC_KEY',
    'SHOW_PUBLIC_KEY',
}

// Reducer
export type WalletReducerState = {
    loading: boolean;
    wallet?: any;
    error?: any;
    creationStep: CreationSteps;
};
