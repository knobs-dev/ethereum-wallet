import { FunctionComponent } from 'react';
import useSWR from 'swr';
import { ethers } from 'ethers';

type LiveBalanceProps = {
    refreshInterval?: number;
    walletAddress: string;
    contractInstance?: any;
    provider?: any;
};

const contractBalanceFetcher = (contractInstance: any) => (
    walletAddress: string,
) => {
    if (!contractInstance) {
        console.error('Missing or invalid contract instance');
        return;
    }

    return contractInstance.balanceOf(walletAddress);
};

const ethBalanceFetcher = (provider: any) => (walletAddress: string) => {
    if (!provider) {
        console.error('Missing or invalid provider');
        return;
    }

    return provider.getBalance(walletAddress);
};

const LiveBalance: FunctionComponent<LiveBalanceProps> = ({
    refreshInterval = 18000,
    walletAddress,
    contractInstance,
    provider,
}) => {
    const fetcher = contractInstance
        ? contractBalanceFetcher(contractInstance)
        : ethBalanceFetcher(provider);

    const { data } = useSWR([walletAddress, contractInstance?.address || ''], {
        fetcher: fetcher,
        refreshInterval: refreshInterval,
    });

    return <>{data ? ethers.utils.formatEther(data) : 0}</>;
};

export default LiveBalance;
