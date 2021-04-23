export type AvailableNetworks = 'ropsten' | 'mainnet';

// Reducer
export type CommonReducerState = {
    guide: { [key: string]: boolean };
    selectedNetwork: AvailableNetworks;
};
