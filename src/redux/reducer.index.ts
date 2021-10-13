import { combineReducers } from "redux-immer";
import produce from "immer";
import { wallet } from "./wallet/reducer";
import { addressbook } from "./addressbook/reducer";
import { common } from "./common/reducer";
import { transaction } from "./transaction/reducer";
import { walletconnect } from "./walletconnect/reducer";

export const rootReducer = combineReducers(produce, {
  wallet,
  addressbook,
  common,
  transaction,
  walletconnect,
});
