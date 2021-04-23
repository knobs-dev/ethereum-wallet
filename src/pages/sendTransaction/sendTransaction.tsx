import {
    Center,
    Spinner,
    Flex,
    Container,
    Input,
    FormControl,
    FormLabel,
    Button,
    InputRightAddon,
    Box,
    HStack,
    Stack,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

import { BigNumber, ethers } from 'ethers';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Tour from 'reactour';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as wActions from '../../redux/wallet/actionCreators';
import * as abActions from '../../redux/addressbook/actionCreators';
import * as txActions from '../../redux/transaction/actionCreators';
import PageBody from '../../components/pageBody/pageBody';

import SpeedSelection, {
    TransactionSpeed,
} from '../../components/speedSelection/speedSelection';
import GasPriceInput from '../../components/gasPriceInput/gasPriceInput';
import TransactionCost from '../../components/transactionCost/transactionCost';
import {
    gweiToEth,
    infuraProviderByNetwork,
    usePlatformDetector,
} from '../../imports/utils';
import EtherInput from '../../components/etherInput/etherInput';
import { AvailableNetworks } from '../../redux/common/types';
import Footer from '../../components/footer/footer';
import ConfirmData from '../../components/modals/confirmData';

import { useTranslation } from 'react-i18next';

type SendTransactionProps = {
    wallet?: any;
    loading: boolean;
    walletActions?: any;
    addressBookActions?: any;
    txActions?: any;
    addresses: Array<string>;
    network: AvailableNetworks;
};
const steps: any = [];

const GasPriceMap: { [key: string]: number } = {
    slow: 75,
    medium: 90,
    fast: 120,
};

const format = (val: BigNumber): string => {
    return ethers.utils.formatEther(val).toString();
};
interface SendTransactionParams {
    address: string;
}

const calcMax = async (
    address: string,
    gasPrice: number,
    network: AvailableNetworks,
) => {
    const provider = infuraProviderByNetwork(network);
    const balance = await provider.getBalance(address);
    const txCost = ethers.utils
        .parseUnits(gasPrice.toString(), 'gwei')
        .mul(21000);

    return balance.sub(txCost);
};

const SendTransaction = (props: SendTransactionProps) => {
    const platform = usePlatformDetector();
    const { t } = useTranslation();
    const history = useHistory();
    const { address } = useParams<SendTransactionParams>();
    const wallet = props.wallet;
    const loading = props.loading;
    const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
    const [destinationAddress, setDestinationAddress] = useState<string>(
        address || '',
    );
    const [transactionSpeed, setTransactionSpeed] = useState<TransactionSpeed>(
        'slow',
    );
    const [gasPrice, setGasPrice] = useState<number>(GasPriceMap.slow);
    const [amount, setAmount] = useState<BigNumber>(BigNumber.from(0));
    const [max, setMax] = useState<BigNumber>();

    const isValidAddress = ethers.utils.isAddress(destinationAddress);
    const isValidAmount = max?.gte(amount) && amount.gt(0);

    const isZeroAmount = amount?.eq(0);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!wallet) {
            history.replace('/wallet/create');
        }
    }, [history, wallet]);

    useEffect(() => {
        if (!isTourOpen) {
            // setShowFaucetModal(true);
            // show faucet modal
        }
    }, [isTourOpen]);

    useEffect(() => {
        calcMax(wallet.address, gasPrice, props.network).then(setMax);
    }, [gasPrice, props.network, wallet.address]);

    const handlePaste = useCallback(() => {
        navigator.clipboard
            .readText()
            .then(text => setDestinationAddress(text));
    }, []);

    // const handleReset = useCallback(() => setDestinationAddress(''), []);

    const handleInputChange = useCallback(
        e => setDestinationAddress(e.target.value),
        [],
    );

    const handleTransactionSpeed = useCallback(txSpeed => {
        setTransactionSpeed(txSpeed);
        setGasPrice(GasPriceMap[txSpeed]);
    }, []);

    const handleGasPriceChange = useCallback(gasPrice => {
        if (gasPrice > 0) {
            setGasPrice(gasPrice);
            setTransactionSpeed('custom');
        }
    }, []);

    const handleMax = useCallback(async () => {
        const max = await calcMax(wallet.address, gasPrice, props.network);
        max <= BigNumber.from(0)
            ? setAmount(BigNumber.from(0))
            : setAmount(max);
    }, [gasPrice, props.network, wallet.address]);

    const handleSend = useCallback(() => {
        props.txActions.txSend(
            destinationAddress,
            amount,
            ethers.utils.parseUnits(gasPrice.toString(), 'gwei'),
        );
    }, [props.txActions, destinationAddress, amount, gasPrice]);

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

    const copyIcon = () => {
        if (platform === 'isDesktop' || platform === 'isTablet') {
            return (
                <CopyIcon
                    onClick={handlePaste}
                    position='absolute'
                    right='12px'
                    top='12px'
                    cursor='pointer'
                />
            );
        }
    };
    const height =
        platform === 'isMobile'
            ? 'calc(100vh - 130px)'
            : platform === 'isTablet'
            ? 'calc(100vh - 130px)'
            : 'calc(100vh - 80px)';

    return (
        <Container
            maxW='6xl'
            h={height}
            pt={platform === 'isMobile' ? '0' : '100px'}
            w={
                platform === 'isMobile'
                    ? '85%'
                    : platform === 'isTablet'
                    ? '80%'
                    : '100%'
            }
        >
            <Flex direction='column' h='100%'>
                <Flex flex='1' justifyContent='center' direction='column'>
                    <Flex
                        flex='1'
                        justifyContent='center'
                        alignItems='center'
                        id='to'
                        pt={4}
                    >
                        <FormControl id='password'>
                            <FormLabel>
                                {t('send_transaction.form.send_to')}
                            </FormLabel>
                            <Box w='100%' position='relative'>
                                <Input
                                    focusBorderColor='brand.900'
                                    ref={inputRef}
                                    type='text'
                                    value={destinationAddress}
                                    onChange={handleInputChange}
                                    placeholder='Address Wallet'
                                />
                                {copyIcon()}
                            </Box>
                        </FormControl>
                    </Flex>
                    <Flex
                        flex='1'
                        justifyContent='center'
                        alignItems='center'
                        id='amount'
                        pt={4}
                    >
                        <FormControl id='amount'>
                            <FormLabel>
                                {t('send_transaction.form.amount')}
                            </FormLabel>
                            <Box w='100%' position='relative'>
                                <HStack>
                                    <EtherInput
                                        onChange={val => setAmount(val)}
                                        value={amount}
                                        max={max}
                                        platform={platform}
                                    />
                                    <InputRightAddon>
                                        <Button w='100%' onClick={handleMax}>
                                            max
                                        </Button>
                                    </InputRightAddon>
                                </HStack>
                            </Box>
                        </FormControl>
                    </Flex>
                    <Flex flex='1'>
                        <Stack
                            width='100%'
                            direction={
                                platform === 'isMobile'
                                    ? 'column'
                                    : platform === 'isTablet'
                                    ? 'column'
                                    : 'row'
                            }
                            align='center'
                        >
                            <Box
                                pt='10px'
                                id='gasprice'
                                width={
                                    platform === 'isMobile'
                                        ? '100%'
                                        : platform === 'isTablet'
                                        ? '100%'
                                        : '50%'
                                }
                            >
                                <FormControl id='gasprice'>
                                    <FormLabel>
                                        {t('send_transaction.form.gas_price')}
                                    </FormLabel>
                                    <GasPriceInput
                                        onChange={handleGasPriceChange}
                                        value={gasPrice}
                                    />
                                </FormControl>
                            </Box>
                            <Box
                                width={
                                    platform === 'isMobile'
                                        ? '100%'
                                        : platform === 'isTablet'
                                        ? '100%'
                                        : '50%'
                                }
                                pt={
                                    platform === 'isMobile'
                                        ? '24px'
                                        : platform === 'isTablet'
                                        ? '24px'
                                        : '10px'
                                }
                            >
                                <FormControl id='address password'>
                                    <FormLabel>
                                        {t(
                                            'send_transaction.form.speed_selection',
                                        )}
                                    </FormLabel>
                                    <SpeedSelection
                                        onChange={handleTransactionSpeed}
                                        value={transactionSpeed}
                                    />
                                </FormControl>
                            </Box>
                        </Stack>
                    </Flex>
                </Flex>
                <Flex flex='0.5' id='address' pt={4}>
                    <TransactionCost
                        platform={platform}
                        gasPrice={gasPrice}
                        gasLimit={21000}
                    />
                </Flex>
                <Flex
                    flex='0.5'
                    w='100%'
                    alignItems='flex-start'
                    justifyContent='center'
                >
                    <HStack
                        width='100%'
                        justifyContent='space-around'
                        align='center'
                        pt={4}
                    >
                        {(platform === 'isDesktop' ||
                            platform === 'isTablet') && (
                            <Button
                                variant='outline'
                                border='2px'
                                width='20%'
                                fontWeight='bold'
                                onClick={() => history.goBack()}
                            >
                                {t('send_transaction.delete_button_text')}
                            </Button>
                        )}
                        <ConfirmData
                            address={destinationAddress}
                            amount={format(amount)}
                            speed={transactionSpeed}
                            fees={gweiToEth(gasPrice * 21000)}
                            isValidAddress={isValidAddress}
                            isValidAmount={isValidAmount}
                            isZeroAmount={isZeroAmount}
                            platform={platform}
                            onConfirm={handleSend}
                        >
                            {t('send_transaction.check_data')}
                        </ConfirmData>
                    </HStack>
                </Flex>
                {mobileFooter()}
            </Flex>
            <Tour
                steps={steps}
                isOpen={isTourOpen}
                onRequestClose={() => setIsTourOpen(false)}
            />
        </Container>
    );
};

const mapStateToProps = ({ wallet, addressbook, transaction, common }: any) => {
    return {
        wallet: wallet.wallet,
        loading: transaction.loading,
        addresses: addressbook.addresses,
        network: common.selectedNetwork,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    walletActions: bindActionCreators(wActions, dispatch),
    addressBookActions: bindActionCreators(abActions, dispatch),
    txActions: bindActionCreators(txActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SendTransaction);
