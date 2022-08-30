// ENV Variables
export const infuraApiKey = process.env["REACT_APP_INFURA_API_KEY"] || "";
export const addressBookAddress =
  process.env["REACT_APP_REGISTRY_ADDRESS"] || "";

export const faucetURL = `${process.env["REACT_APP_FAUCET_HOST"]}:${process.env["REACT_APP_FAUCET_PORT"]}/givemeeth`;
export const balanceRefreshInterval = 18000;

// Versioning
export const VERSION = "0.5.1";

export const AvailableProviders = {
  mainnet: process.env.REACT_APP_ETHEREUM_MAINNET_RPC_PROVIDER,
  ropsten: process.env.REACT_APP_ETHEREUM_ROPSTEN_RPC_PROVIDER,
  "polygon-mainnet": process.env.REACT_APP_POLYGON_MAINNET_RPC_PROVIDER,
  "polygon-mumbai": process.env.REACT_APP_POLYGON_MUMBAI_RPC_PROVIDER,
};

export type AvailableNetworks = keyof typeof AvailableProviders;

export const explorerLinks = {
  mainnet: process.env.REACT_APP_ETHEREUM_MAINNET_EXPLORER,
  ropsten: process.env.REACT_APP_ETHEREUM_ROPSTEN_EXPLORER,
  "polygon-mainnet": process.env.REACT_APP_POLYGON_MAINNET_EXPLORER,
  "polygon-mumbai": process.env.REACT_APP_POLYGON_MUMBAI_EXPLORER,
};

export const ExplorerApiKeys = {
  mainnet: process.env.REACT_APP_ETHEREUM_MAINNET_API_KEY,
  ropsten: process.env.REACT_APP_ETHEREUM_ROPSTEN_API_KEY,
  "polygon-mainnet": process.env.REACT_APP_POLYGON_MAINNET_API_KEY,
  "polygon-mumbai": process.env.REACT_APP_POLYGON_MUMBAI_API_KEY,
};

export const ExplorerApiEndpoints = {
  mainnet: process.env.REACT_APP_ETHEREUM_MAINNET_API_ENDPOINT,
  ropsten: process.env.REACT_APP_ETHEREUM_ROPSTEN_API_ENDPOINT,
  "polygon-mainnet": process.env.REACT_APP_POLYGON_MAINNET_API_ENDPOINT,
  "polygon-mumbai": process.env.REACT_APP_POLYGON_MUMBAI_API_ENDPOINT,
};

export const CoinSymbol = {
  mainnet: "ETH",
  ropsten: "ETH",
  "polygon-mainnet": "MATIC",
  "polygon-mumbai": "MATIC",
};
