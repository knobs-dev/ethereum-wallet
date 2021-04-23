import {
    Center,
    Spinner,
    Flex,
    Heading,
    Container,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as wActions from '../../redux/wallet/actionCreators';
import * as abActions from '../../redux/addressbook/actionCreators';
import * as txActions from '../../redux/transaction/actionCreators';
import { guideCompleted } from '../../redux/common/actionCreators';
import PageBody from '../../components/pageBody/pageBody';
import TransactionList from '../../components/transactionList/transactionList';
import Footer from '../../components/footer/footer';
import { useTranslation } from 'react-i18next';
import { usePlatformDetector } from '../../imports/utils';

type TransactionProps = {
    wallet?: any;
    loading: boolean;
    walletActions?: any;
    addressBookActions?: any;
    addresses: Array<string>;
    commonActions?: any;
    tourCompleted: boolean;
    transactions: Array<any>;
    pendingTransactions: Array<any>;
    transactionsActions?: any;
    transactionHistory: Array<any>;
};

const Transaction = (props: TransactionProps) => {
    const { t } = useTranslation();
    const history = useHistory();
    const wallet = props.wallet;
    const loading = props.loading;
    const platform = usePlatformDetector();

    useEffect(() => {
        if (!wallet) {
            history.replace('/wallet/create');
        } else {
            props.transactionsActions.txEtherscanReq(wallet.address);
        }
    }, [history, props.transactionsActions, wallet]);

    /* const handleTxSelect = useCallback(tx => {
        history.push(`/tx/${tx.hash}`);
    }, []); */

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
                    <Heading>{t('transaction.heading')}</Heading>
                </Flex>
                <Flex flex='3' direction='column'>
                    <Tabs
                        isFitted
                        variant='enclosed'
                        overflow='scroll'
                        padding={2}
                    >
                        <TabList mb='1em'>
                            <Tab>{t('transaction_list.inbound')}</Tab>
                            <Tab>{t('transaction_list.outbound')}</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                {props.transactionHistory?.length > 0 ? (
                                    <TransactionList
                                        th='from'
                                        wallet={wallet}
                                        transactions={props.transactionHistory?.filter(
                                            (tx: any) =>
                                                tx.to.toLowerCase() ===
                                                wallet.address.toLowerCase(),
                                        )}
                                    />
                                ) : (
                                    <p style={{ textAlign: 'center' }}>
                                        {t('transaction_list.no_inbound')}
                                    </p>
                                )}
                            </TabPanel>
                            <TabPanel>
                                {props.transactionHistory?.length > 0 ? (
                                    <TransactionList
                                        th='to'
                                        wallet={wallet}
                                        transactions={props.transactionHistory?.filter(
                                            (tx: any) =>
                                                tx.from.toLowerCase() ===
                                                wallet.address.toLowerCase(),
                                        )}
                                    />
                                ) : (
                                    <p style={{ textAlign: 'center' }}>
                                        {t('transaction_list.no_outbound')}
                                    </p>
                                )}
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
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
        transactions: Object.values(transaction.transactions),
        pendingTransactions: Object.values(transaction.pendingTransactions),
        transactionHistory: transaction.transactionHistory,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    walletActions: bindActionCreators(wActions, dispatch),
    addressBookActions: bindActionCreators(abActions, dispatch),
    commonActions: {
        guideCompleted: (guideName: string) =>
            dispatch(guideCompleted(guideName)),
    },
    transactionsActions: bindActionCreators(txActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
