// Libraries
import { combineEpics } from 'redux-observable';

// Epics
import walletCreationEpic from './wallet/epics';
import faucetEpic from './faucet/epics';
import commonEpic from './common/epics';
import txSyncEpic from './transaction/epics';
import addressBookEpic from './addressbook/epics';

export default combineEpics(
    walletCreationEpic,
    faucetEpic,
    commonEpic,
    txSyncEpic,
    addressBookEpic,
);
