import { createTransform } from 'redux-persist';
import { WalletReducerState } from './types';
import { ethers } from 'ethers';

const WalletTransform = createTransform(
    // transform state on its way to being serialized and persisted.
    ({ wallet, ...other }: WalletReducerState, key) => {
        // Save mnemonic instead of wallet instance
        return { ...other, mnemonic: wallet?.mnemonic };
    },
    // transform state being rehydrated
    ({ mnemonic, ...other }: any, key) => {
        // Restore wallet from mnemonic if present
        if (mnemonic?.phrase) {
            const wallet = ethers.Wallet.fromMnemonic(mnemonic.phrase);
            return { ...other, wallet };
        } else {
            return { ...other };
        }
    },
    // define which reducers this transform gets called for.
    { whitelist: ['wallet'] },
);

export default WalletTransform;
