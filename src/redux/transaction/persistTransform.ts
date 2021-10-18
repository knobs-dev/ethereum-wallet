import { createTransform } from "redux-persist";
import { TransactionReducerState } from "./types";
import { BigNumber, ethers } from "ethers";

const serializeTransaction = ({
  gasPrice,
  value,
  ...transaction
}: ethers.providers.TransactionResponse) => ({
  ...transaction,
  gasPrice: gasPrice.toString(),
  value: value.toString(),
});

const serializeReceipt = ({
  gasUsed,
  cumulativeGasUsed,
  ...receipt
}: ethers.providers.TransactionReceipt) => ({
  ...receipt,
  gasUsed: gasUsed.toString(),
  cumulativeGasUsed: cumulativeGasUsed.toString(),
});

const deserializeTransaction = ({
  gasPrice,
  value,
  ...transaction
}: ethers.providers.TransactionResponse) => ({
  ...transaction,
  gasPrice: BigNumber.from(gasPrice),
  value: BigNumber.from(value),
});

const deserializeReceipt = ({
  gasUsed,
  cumulativeGasUsed,
  ...receipt
}: ethers.providers.TransactionReceipt) => ({
  ...receipt,
  gasUsed: BigNumber.from(gasUsed),
  cumulativeGasUsed: BigNumber.from(cumulativeGasUsed),
});

interface TxObj extends ethers.providers.TransactionResponse {
  receipt: ethers.providers.TransactionReceipt;
}

const serialize = (obj: any) => {
  let serialized: any = {};
  for (let key of Object.keys(obj)) {
    const tx: TxObj = obj[key];
    const { receipt, ...transaction } = tx;

    serialized[key] = serializeTransaction(transaction);

    if (receipt) {
      serialized[key].receipt = serializeReceipt(receipt);
    }
  }

  return serialized;
};

const deserialize = (obj: any) => {
  let deserialized: any = {};
  for (let key of Object.keys(obj)) {
    const tx: TxObj = obj[key];
    const { receipt, ...transaction } = tx;

    deserialized[key] = deserializeTransaction(transaction);

    if (receipt) {
      deserialized[key].receipt = deserializeReceipt(receipt);
    }
  }

  return deserialized;
};

const TransactionTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (
    { transactions, pendingTransactions, ...other }: TransactionReducerState,
    key
  ) => {
    // Save mnemonic instead of wallet instance
    return {
      ...other,
      transactions: serialize(transactions),
      pendingTransactions: serialize(pendingTransactions),
    };
  },
  // transform state being rehydrated
  ({ transactions, pendingTransactions, ...other }: any, key) => {
    return {
      ...other,
      transactions: deserialize(transactions),
      pendingTransactions: deserialize(pendingTransactions),
    };
  },
  // define which reducers this transform gets called for.
  { whitelist: ["transaction"] }
);

export default TransactionTransform;
