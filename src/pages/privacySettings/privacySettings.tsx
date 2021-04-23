import {
    Center,
    Flex,
    Spinner,
    Heading,
    Text,
    Stack,
    Divider,
    Container,
} from '@chakra-ui/react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as wActions from '../../redux/wallet/actionCreators';
import * as cActions from '../../redux/common/actionCreators';
import PageBody from '../../components/pageBody/pageBody';
import CustomBox from '../../components/customBox/customBox';
import ClearDataDialog from '../../components/modals/clearData';
import ExportWalletDialog from '../../components/modals/exportWallet';
import Footer from '../../components/footer/footer';
import { usePlatformDetector } from '../../imports/utils';
import { useTranslation } from 'react-i18next';

type PrivacySettingsProps = {
    wallet?: any;
    loading: boolean;
    walletActions?: any;
    commonActions?: any;
};

const PrivacySettings = (props: PrivacySettingsProps) => {
    const { t } = useTranslation();
    const platform = usePlatformDetector();
    const wallet = props.wallet;
    const loading = props.loading;

    const mobileFooter = () => {
        if (platform === 'isDesktop') {
            return <Footer />;
        }
    };

    if (loading) {
        return (
            <Flex
                direction='column'
                height='100%'
                justifyContent='center'
                p={4}
            >
                <Center>
                    <Spinner color='brand.800' size='xl' />
                </Center>
            </Flex>
        );
    }

    const variablePT = platform === 'isDesktop' ? '100px' : '40px';

    return (
        <>
            <PageBody justifyContent='flex-start'>
                <Container maxW='6xl' pt={variablePT}>
                    <Heading>{t('privacy_settings.privacy_keys')}</Heading>
                    <Divider mt={2} />
                    <Stack spacing={8} mt={4}>
                        <CustomBox title={t('privacy_settings.title_key')}>
                            {(isVisible: boolean) => (
                                <Text
                                    filter={isVisible ? 'unset' : 'blur(5px)'}
                                >
                                    {wallet?.privateKey}
                                </Text>
                            )}
                        </CustomBox>
                        <CustomBox
                            title={t('privacy_settings.title_mnemonica')}
                        >
                            {(isVisible: boolean) => (
                                <Text
                                    filter={isVisible ? 'unset' : 'blur(5px)'}
                                >
                                    {wallet?.mnemonic?.phrase}
                                </Text>
                            )}
                        </CustomBox>
                    </Stack>
                    <Stack
                        direction='column'
                        alignItems='center'
                        mt={10}
                        spacing={6}
                    >
                        <ClearDataDialog
                            colorScheme='red'
                            onConfirm={() => props.commonActions?.clearData()}
                            onDiscard={() => {}}
                        >
                            {t('privacy_settings.delete_wallet')}
                        </ClearDataDialog>
                        <ExportWalletDialog
                            onConfirm={() => {}}
                            onDiscard={() => {}}
                            wallet={wallet}
                        >
                            {t('privacy_settings.export_wallet')}
                        </ExportWalletDialog>
                    </Stack>
                </Container>
            </PageBody>
            <Container maxW='6xl'>{mobileFooter()}</Container>
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
    commonActions: bindActionCreators(cActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivacySettings);
