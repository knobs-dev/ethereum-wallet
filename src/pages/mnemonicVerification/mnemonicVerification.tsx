import { Center, Flex, Text, Spinner } from '@chakra-ui/react';
import Mnemonic, { Mnemonic12Words } from '../../components/mnemonic/mnemonic';
import BottomActions from '../../components/bottomActions/bottomActions';
import { useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as wActions from '../../redux/wallet/actionCreators';
import PageBody from '../../components/pageBody/pageBody';

import { useTranslation } from 'react-i18next';

type MnemonicVerificationProps = {
    wallet?: any;
    loading: boolean;
    walletActions?: any;
};

const shuffleArray = (data: any) =>
    data
        .map((a: any) => ({ sort: Math.random(), value: a }))
        .sort((a: any, b: any) => a.sort - b.sort)
        .map((a: any) => a.value);

const hasRightOrder = (
    sourceArray: Mnemonic12Words | null,
    reorderedArray: Array<string>,
) =>
    sourceArray?.length === reorderedArray.length &&
    sourceArray?.reduce(
        (acc: boolean, next: string, index: number) =>
            acc && reorderedArray[index] === next,
        true,
    );

const MnemonicVerification = (props: MnemonicVerificationProps) => {
    const { t } = useTranslation();
    const history = useHistory();
    const wallet = props.wallet;
    const loading = props.loading;
    const [reordered, setReordered] = useState<Array<string>>([]);
    const [randomized, setRandomized] = useState<Mnemonic12Words | null>(null);

    const originalMnemonicArray = useMemo(() => {
        return wallet?.mnemonic?.phrase.split(' ') || [];
    }, [wallet]);

    useEffect(() => {
        if (!wallet) {
            history.replace('/wallet/create');
        }

        if (wallet?.mnemonic?.phrase) {
            setRandomized(shuffleArray(wallet.mnemonic.phrase.split(' ')));
        }
    }, [history, wallet]);

    if (loading) {
        return (
            <Flex
                direction='column'
                height='100%'
                justifyContent='center'
                p={4}
            >
                <Center>
                    <Spinner color='brand.700' size='xl' />
                </Center>
            </Flex>
        );
    }

    return (
        <>
            <PageBody>
                <Center height='100%'>
                    {randomized && (
                        <Mnemonic
                            phrase={randomized}
                            showNumbers={false}
                            onChange={setReordered}
                        />
                    )}
                </Center>
                <Flex direction='row' justifyContent='space-around' wrap='wrap'>
                    {reordered?.map((el: string) => (
                        <Text key={el}>{el}</Text>
                    ))}
                </Flex>
            </PageBody>
            <BottomActions
                handleNext={
                    hasRightOrder(originalMnemonicArray, reordered) || true
                        ? () => history.replace('/wallet')
                        : undefined
                }
                labels={{
                    next: `${t('guide_screen.next_button')}`,
                    prev: `${t('guide_screen.previous_button')}`,
                }}
            />
        </>
    );
};

const mapStateToProps = ({ wallet }: any) => {
    return {
        wallet: wallet.wallet,
        loading: wallet.loading,
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    walletActions: bindActionCreators(wActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(MnemonicVerification);
