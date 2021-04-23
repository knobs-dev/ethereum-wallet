// Import external libraries
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import WalletTransform from '../redux/wallet/persistTransform';
import TransactionTransform from '../redux/transaction/persistTransform';
// Epic
import rootEpic from './epics.index';

// Import reducers
import { rootReducer } from './reducer.index';

// Firebase
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initialize firebase
const firebaseConfig = {
    apiKey: process.env[`REACT_APP_FIREBASE_KEY`],
    authDomain: process.env[`REACT_APP_AUTH_DOMAIN`],
    projectId: process.env[`REACT_APP_PROJECT_ID`],
    storageBucket: process.env[`REACT_APP_STORAGE_BUCKET`],
    messagingSenderId: process.env[`REACT_APP_MESSAGING_SENDER_ID`],
    appId: process.env[`REACT_APP_APP_ID`],
};

firebase.initializeApp(firebaseConfig);

// Add redux observable
const epicMiddleware = createEpicMiddleware({ dependencies: { firebase } });

const persistConfig = {
    key: 'bishub_wallet',
    storage,
    transforms: [WalletTransform, TransactionTransform],
    blacklist: ['addressbook'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Export store
export const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(epicMiddleware)),
);

export const persistor = persistStore(store);

// Start epic middleware
epicMiddleware.run(rootEpic);
