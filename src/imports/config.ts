import { getProvider } from './utils';

// ENV Variables
const providerType = process.env['REACT_APP_PROVIDER_TYPE'] || '';
export const infuraApiKey = process.env['REACT_APP_INFURA_API_KEY'] || '';
const network = process.env['REACT_APP_NETWORK'] || '';
export const addressBookAddress =
    process.env['REACT_APP_REGISTRY_ADDRESS'] || '';

export const faucetURL = `${process.env['REACT_APP_FAUCET_HOST']}:${process.env['REACT_APP_FAUCET_PORT']}/givemeeth`;
export const balanceRefreshInterval = 18000;
export const provider = getProvider(providerType, {
    network,
    infuraApiKey,
});

export const etherscanLinks = {
    mainnet: 'etherscan.io',
    ropsten: 'ropsten.etherscan.io',
};

// Versioning
export const VERSION = '0.4.2';