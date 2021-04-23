// Reducer
export type TransactionReducerState = {
    loading: boolean;
    error?: any;
    lastSyncedBlock: number | null;
    transactions: { [key: string]: any };
    pendingTransactions: { [key: string]: any };
    transactionHistory: Array<any>;
};
