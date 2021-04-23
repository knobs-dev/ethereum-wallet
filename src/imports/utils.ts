import { ethers } from 'ethers';
import { createStandaloneToast, useMediaQuery } from '@chakra-ui/react';
import { AvailableNetworks } from '../redux/common/types';
import { etherscanLinks, infuraApiKey } from './config';

export function getProvider(providerType: string, data: any = {}) {
    switch (providerType) {
        case 'infura':
            return new ethers.providers.InfuraProvider(
                data.network,
                data.infuraApiKey,
            );
        default:
            return ethers.getDefaultProvider(data.network);
    }
}

export function infuraProviderByNetwork(network: AvailableNetworks) {
    return new ethers.providers.InfuraProvider(network, infuraApiKey);
}

export function etherscanLinkByNetwork(network: AvailableNetworks) {
    return `https://${etherscanLinks[network]}`;
}

// Returns the formatted etherscan link based on the link type and network
type EtherscanLinkTypes = 'tx' | 'address';
export function viewOnEtherscan(
    network: AvailableNetworks,
    linkType: EtherscanLinkTypes,
    hashOrAddress: string,
) {
    return `${etherscanLinkByNetwork(network)}/${linkType}/${hashOrAddress}`;
}

export function truncStringPortion(
    str: string,
    firstCharCount: number,
    endCharCount: number,
): string {
    let convertedStr = '';
    convertedStr += str.substring(0, firstCharCount);
    convertedStr += '...';
    convertedStr += str.substring(endCharCount, str.length);

    return convertedStr;
}

export function truncateStringByWidth(
    inputString: string,
    maxWidth: number,
    charWidth = 20,
) {
    const maxChar = Math.floor(maxWidth / charWidth);
    const addressMiddle = Math.floor(inputString.length / 2);
    const toRemove = inputString.length - maxChar;
    const halfToRemove = Math.floor(toRemove / 2);

    return toRemove > 0
        ? truncStringPortion(
              inputString,
              addressMiddle - halfToRemove,
              addressMiddle + halfToRemove,
          )
        : inputString;
}

export const downloadJSON = (data: any, filename: string) => {
    var json = data;
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        let blob = new Blob([json], { type: 'application/json' });
        window.navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        let file = new File([json], filename, { type: 'application/json' });
        let a = document.createElement('a');
        a.setAttribute('style', 'display: none');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        try {
            a.click();
        } catch (error) {
            a.click();
        }
        setImmediate(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        });
    }
};

export const gweiToEth = (gwei: number | string): number | string =>
    ethers.utils.formatEther(
        ethers.utils.parseUnits(gwei.toString(), 'gwei').toString(),
    );

export const toast = createStandaloneToast();

export const usePlatformDetector = () => {
    const [isTablet] = useMediaQuery(['(max-width: 1024px)']);
    const [isMobile] = useMediaQuery(['(max-width: 512px)']);

    
    if (isMobile) {
        return 'isMobile'
    } else if (isTablet) {
        return 'isTablet'
    } else {
        return 'isDesktop'
    }
};

export function mobileTruncString(isMobile: string, str: string, firstCharCount: number, endCharCount: number) {
    if (isMobile === 'isDesktop') {
        return str;
    }
    
    return truncStringPortion(str, firstCharCount, endCharCount);
}