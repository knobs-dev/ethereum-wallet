import { AvailableNetworks } from "../../imports/config";

export type CommonReducerState = {
    guide: { [key: string]: boolean };
    selectedNetwork: AvailableNetworks;
};
