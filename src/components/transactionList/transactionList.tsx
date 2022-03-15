import { FunctionComponent, useCallback } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react';
import {
    viewOnEtherscan,
    mobileTruncString,
    usePlatformDetector,
} from '../../imports/utils';
import { ethers } from 'ethers';
import { EtherscanIcon } from '../icons/icons';
import { useTranslation } from 'react-i18next';
import { AvailableNetworks } from '../../imports/config';
export type TransactionListProps = {
    wallet?: any;
    transactions: Array<any>;
    network?: AvailableNetworks;
    caption?: string;
    onSelect?: (tx: any) => void;
    th: string;
};

const TransactionList: FunctionComponent<TransactionListProps> = ({
    wallet,
    transactions,
    network,
    onSelect,
    caption,
    th,
}) => {
    const platform = usePlatformDetector();
    const { t } = useTranslation();

    const handleSelect = useCallback(tx => (onSelect ? onSelect(tx) : null), [
        onSelect,
    ]);

    const TxHash = (props: any) => {
        const hash = mobileTruncString('isMobile', props.tx.hash, 22, 50);
        return platform === 'isDesktop' ? <Td>{hash}</Td> : null;
    };

    const TxFromTo = (props: any) => {
        if (th === 'from') {
            const value = mobileTruncString(platform, props.tx.from, 9, 33);
            return <Td>{value}</Td>;
        } else {
            const value = mobileTruncString(platform, props.tx.to, 9, 33);
            return <Td>{value}</Td>;
        }
    };

    const TableHeader = () => {
        return platform === 'isDesktop' ? (
            <Th>{t('transaction_list.txn_hash')}</Th>
        ) : null;
    };

    const EtherScanCell = () => {
        return platform === 'isDesktop' || platform === 'isTablet' ? (
            <Td>
                <a
                    href={viewOnEtherscan('polygon-mumbai', 'address', wallet.address)}
                    target='_blank'
                    rel='noreferrer'
                >
                    <EtherscanIcon />
                </a>
            </Td>
        ) : null;
    };

    const EtherScanHeader = () => {
        return platform === 'isDesktop' || platform === 'isTablet' ? (
            <Th>Etherscan</Th>
        ) : null;
    };

    const ThFromTo = () => {
        if (th === 'from') {
            return <Th>{t('transaction_list.from')}</Th>;
        } else {
            return <Th>{t('transaction_list.to')}</Th>;
        }
    };

    return (
        <Table variant='simple' style={{ fontSize: 12 }}>
            {caption && <TableCaption>{caption}</TableCaption>}
            <Thead>
                {transactions.length ? (
                    <Tr>
                        <ThFromTo />
                        <TableHeader />
                        <Th>{t('transaction_list.amount')}</Th>
                        <EtherScanHeader />
                    </Tr>
                ) : null}
            </Thead>
            <Tbody>
                {transactions.map(tx => {
                    if (th === 'from') {
                        if (tx.to !== tx.from && tx.value !== 0)
                            return (
                                <Tr
                                    key={tx.blockHash}
                                    onClick={() => handleSelect(tx)}
                                >
                                    <TxFromTo tx={tx} />
                                    <TxHash tx={tx} />
                                    <Td>
                                        {ethers.utils
                                            .formatEther(tx.value)
                                            .slice(0, 8)}
                                    </Td>
                                    <EtherScanCell />
                                </Tr>
                            );
                    } else {
                        return (
                            <Tr
                                key={tx.blockHash}
                                onClick={() => handleSelect(tx)}
                            >
                                <TxFromTo tx={tx} />
                                <TxHash tx={tx} />
                                <Td>
                                    {ethers.utils
                                        .formatEther(tx.value)
                                        .slice(0, 8)}
                                </Td>
                                <EtherScanCell />
                            </Tr>
                        );
                    }
                    return null;
                })}
                {transactions.length ? null : (
                    <Tr>
                        <Td colSpan={2}>
                            {transactions.length === 0 &&
                                `${t('transaction_list.no_transaction')}`}
                        </Td>
                    </Tr>
                )}
            </Tbody>
        </Table>
    );
};

export default TransactionList;
