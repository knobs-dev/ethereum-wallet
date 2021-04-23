import {
    Center,
    Spinner,
    Flex,
    Heading,
    Container,
    Table,
    Tbody,
    Td,
    Tr,
    Th,
    Badge,
    Text,
    Button,
    Box,
} from '@chakra-ui/react';

import { ethers } from 'ethers';

import { EtherscanIcon } from '../../components/icons/icons';
import { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as wActions from '../../redux/wallet/actionCreators';
import * as abActions from '../../redux/addressbook/actionCreators';
import { guideCompleted } from '../../redux/common/actionCreators';
import PageBody from '../../components/pageBody/pageBody';
import {
    truncateStringByWidth,
    viewOnEtherscan,
    usePlatformDetector,
} from '../../imports/utils';
import LottieLoader from '../../components/lottieLoader/lottieLoader';
import { AvailableNetworks } from '../../redux/common/types';
import Footer from '../../components/footer/footer';

import { useTranslation } from 'react-i18next';

type TransactionDetailProps = {
    wallet?: any;
    loading: boolean;
    walletActions?: any;
    addressBookActions?: any;
    addresses: Array<string>;
    commonActions?: any;
    tourCompleted: boolean;
    transactions: any;
    pendingTransactions: any;
    network: AvailableNetworks;
};

type TransactionDetailParams = {
    hash: string;
};

const TransactionDetail = (props: TransactionDetailProps) => {
    const { t } = useTranslation();
    const history = useHistory();
    const { hash } = useParams<TransactionDetailParams>();
    const wallet = props.wallet;
    const loading = props.loading;
    const platform = usePlatformDetector();
    const tx = props.transactions[hash] || props.pendingTransactions[hash];
    const isNotarization = tx.to === wallet.address;

    const TxStatus: { [key: number]: string } = {
        0: `${t('transactionDetail.failed')}`,
        1: 'Ok',
    };

    const TxStatusScheme: { [key: number]: string } = {
        0: 'red',
        1: 'green',
    };

    const isPendingTx = Boolean(props.pendingTransactions[hash]);

    useEffect(() => {
        if (!wallet) {
            history.replace('/wallet/create');
        }
    }, [history, wallet]);

    const fees =
        tx?.receipt?.gasUsed && tx.gasPrice
            ? ethers.utils.formatEther(tx.receipt.gasUsed.mul(tx.gasPrice))
            : '0';

    if (loading) {
        return (
            <PageBody>
                <Center>
                    <Spinner color='brand.700' size='xl' />
                </Center>
            </PageBody>
        );
    }

    const mobileFooter = () => {
        if (platform === 'isDesktop') {
            return <Footer />;
        }
    };

    return (
        <Container maxW='6xl' h='100%' pt='100px'>
            <Flex direction='column' h='100%'>
                <Flex
                    flex='0.5'
                    justifyContent='center'
                    alignItems='center'
                    direction='column'
                    id='balance'
                >
                    <Heading size='md'>
                        {t('transactionDetail.heading')}
                    </Heading>
                    <Heading size='md'>
                        {platform === 'isDesktop'
                            ? hash
                            : truncateStringByWidth(hash, 200)}
                    </Heading>
                </Flex>
                <Flex
                    flex='3'
                    direction='column'
                    overflow='scroll'
                    fontSize={12}
                >
                    {isPendingTx ? (
                        <Flex direction='column'>
                            <Center>
                                <Box h='300px'>
                                    <LottieLoader
                                        animation='tx-waiting'
                                        playerStyle={{ height: '280px' }}
                                    />
                                </Box>
                            </Center>
                            <Center pt={5}>
                                <Text fontSize='16px'>
                                    {t(
                                        'transactionDetail.transaction_confirmed',
                                    )}
                                </Text>
                            </Center>
                            <Flex
                                alignItems='center'
                                justifyContent='center'
                                pt={3}
                            >
                                <EtherscanIcon mr={2} />
                                <a
                                    href={viewOnEtherscan(
                                        props.network,
                                        'tx',
                                        tx.hash,
                                    )}
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    {t('transactionDetail.view_on_etherscan')}
                                </a>
                            </Flex>
                        </Flex>
                    ) : (
                        <Table>
                            <Tbody>
                                {tx && !isNotarization && (
                                    <Tr>
                                        <Th>{t('transactionDetail.sender')}</Th>
                                        <Td>
                                            {platform === 'isDesktop'
                                                ? tx.from
                                                : truncateStringByWidth(
                                                      tx.from,
                                                      300,
                                                  )}
                                        </Td>
                                    </Tr>
                                )}
                                {tx && !isNotarization && (
                                    <Tr>
                                        <Th>
                                            {t('transactionDetail.dispatch')}
                                        </Th>
                                        <Td>
                                            {platform === 'isDesktop'
                                                ? tx.to
                                                : truncateStringByWidth(
                                                      tx.to,
                                                      300,
                                                  )}
                                        </Td>
                                    </Tr>
                                )}
                                {tx?.value && !isNotarization && (
                                    <Tr>
                                        <Th>{t('transactionDetail.amount')}</Th>
                                        <Td>
                                            {`${ethers.utils.formatEther(
                                                tx.value,
                                            )} ETH`}
                                        </Td>
                                    </Tr>
                                )}
                                {tx && isNotarization && (
                                    <Tr>
                                        <Th>{t('transactionDetail.data')}</Th>
                                        <Td>{tx?.data}</Td>
                                    </Tr>
                                )}
                                {tx?.receipt && (
                                    <Tr>
                                        <Th>{t('transactionDetail.fees')}</Th>
                                        <Td>{`${fees} ETH`}</Td>
                                    </Tr>
                                )}
                                {tx?.receipt && (
                                    <Tr>
                                        <Th>{t('transactionDetail.state')}</Th>
                                        <Td>
                                            <Badge
                                                colorScheme={
                                                    TxStatusScheme[
                                                        tx.receipt.status
                                                    ]
                                                }
                                            >
                                                {TxStatus[tx.receipt.status]}
                                            </Badge>
                                        </Td>
                                    </Tr>
                                )}
                                {tx && (
                                    <Tr>
                                        <Td colSpan={2}>
                                            <Flex
                                                alignItems='center'
                                                justifyContent='center'
                                            >
                                                <EtherscanIcon mr={2} />
                                                <a
                                                    href={viewOnEtherscan(
                                                        props.network,
                                                        'tx',
                                                        tx.hash,
                                                    )}
                                                    target='_blank'
                                                    rel='noreferrer'
                                                >
                                                    {t(
                                                        'transactionDetail.view_on_etherscan',
                                                    )}
                                                </a>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                )}
                            </Tbody>
                        </Table>
                    )}
                    {tx && (
                        <Center pt={6}>
                            <Button onClick={() => history.replace('/wallet')}>
                                {t('transactionDetail.go_back')}
                            </Button>
                        </Center>
                    )}
                </Flex>
                {mobileFooter()}
            </Flex>
        </Container>
    );
};

const mapStateToProps = ({ wallet, addressbook, common, transaction }: any) => {
    return {
        wallet: wallet.wallet,
        loading: wallet.loading,
        addresses: addressbook.addresses,
        tourCompleted: common.guide.wallet,
        transactions: transaction.transactions,
        pendingTransactions: transaction.pendingTransactions,
        network: common.selectedNetwork,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    walletActions: bindActionCreators(wActions, dispatch),
    addressBookActions: bindActionCreators(abActions, dispatch),
    commonActions: {
        guideCompleted: (guideName: string) =>
            dispatch(guideCompleted(guideName)),
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionDetail);
