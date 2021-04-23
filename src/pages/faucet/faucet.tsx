import { Center, Button, Spinner } from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as fActions from '../../redux/faucet/actionCreators';
import PageBody from '../../components/pageBody/pageBody';

import { useTranslation } from 'react-i18next';

type FaucetProps = {
    wallet?: any;
    loading: boolean;
    faucetActions: any;
};

const Faucet = (props: FaucetProps) => {
    const { t } = useTranslation();
    const history = useHistory();
    const wallet = props.wallet;
    const loading = props.loading;
    const faucetActions: typeof fActions = props.faucetActions;

    useEffect(() => {
        if (!wallet) {
            history.push('/wallet/create');
        }
    }, [history, wallet]);

    const requestEth = useCallback(() => {
        if (wallet?.address) {
            faucetActions.faucet(wallet.address);
        }
    }, [faucetActions, wallet.address]);

    if (loading) {
        return (
            <PageBody>
                <Center>
                    <Spinner color='brand.700' size='xl' />
                </Center>
            </PageBody>
        );
    }

    return (
        <>
            <PageBody>
                <Center height='100%'>
                    <Button onClick={requestEth}>
                        {t('wallet_transaction.eth_request')}
                    </Button>
                </Center>
            </PageBody>
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
    faucetActions: bindActionCreators(fActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Faucet);
