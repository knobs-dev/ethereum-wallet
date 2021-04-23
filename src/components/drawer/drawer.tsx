import React, { FunctionComponent, useEffect, useRef, useState } from 'react';

import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Stack,
    Divider,
    Box,
    Text,
    Button,
    useColorModeValue,
    useColorMode,
    Flex,
    Tooltip,
    useClipboard,
    Spacer,
} from '@chakra-ui/react';
import {
    UnlockIcon,
    LinkIcon,
    SunIcon,
    MoonIcon,
    InfoIcon,
    CalendarIcon,
} from '@chakra-ui/icons';

import { QRCode } from 'react-qr-svg';

import { connect } from 'react-redux';

import DrawerMenuItem from '../drawerMenuItem/drawerMenuItem';

import { VERSION } from '../../imports/config';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

import { usePlatformDetector, truncStringPortion } from '../../imports/utils';
import NetworkSelection from '../networkSelection/networkSelection';

type CustomDrawerProps = {
    wallet?: any;
    onClose: () => void;
    isOpen: boolean;
    location: any;
};

function useTruncatedAddress(address: string, charWidth = 20) {
    const [truncatedAddress, setTruncatedAddress] = useState<string>('');

    useEffect(() => {
        if (address) {
            const width = 280 - 120;
            const maxChar = Math.floor(width / charWidth);
            const addressMiddle = Math.floor(address.length / 2);
            const toRemove = address.length - maxChar;
            const halfToRemove = Math.floor(toRemove / 2);

            setTruncatedAddress(
                toRemove > 0
                    ? truncStringPortion(
                          address,
                          addressMiddle - halfToRemove,
                          addressMiddle + halfToRemove,
                      )
                    : address,
            );
        }
    }, [address, charWidth]);

    return truncatedAddress;
}

const CustomDrawer: FunctionComponent<CustomDrawerProps> = props => {
    const platform = usePlatformDetector();
    const { t } = useTranslation();
    const { toggleColorMode } = useColorMode();
    const sunMoonIcon = useColorModeValue(true, false);
    const addressRef = useRef<HTMLInputElement>(null);
    const addressTruncated = useTruncatedAddress(props.wallet?.address, 13);
    const { hasCopied, onCopy } = useClipboard(props.wallet?.address);
    const marginSpace = platform === 'isMobile' ? 12 : 0;

    const changeLanguage = (lng: any) => {
        i18n.changeLanguage(lng);
    };

    const darkMode = useColorModeValue(
        t('dark_mode.light'),
        t('dark_mode.dark'),
    );

    const networkSelectionMobile = (location: any) => {
        if (platform === 'isMobile' || platform === 'isTablet') {
            return (
                <>
                    {location.pathname !== '/wallet/create' && (
                        <NetworkSelection />
                    )}
                </>
            );
        }
    };

    const versionFooter = (platform === 'isMobile' ||
        platform === 'isTablet') && (
        <Box>{[t('footer_version'), ' ', VERSION]}</Box>
    );

    const drawerSize =
        platform === 'isMobile'
            ? 'full'
            : platform === 'isTablet'
            ? 'xs'
            : 'sm';

    return (
        <Drawer
            isOpen={props.isOpen}
            placement='right'
            onClose={props.onClose}
            autoFocus={false}
            isFullHeight={true}
            size={drawerSize}
        >
            <DrawerOverlay>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth='1px'>
                        {process.env[`REACT_APP_TITLE`]} Wallet
                    </DrawerHeader>

                    <DrawerBody>
                        {props.wallet?.address && (
                            <>
                                <Box mb={5}>
                                    <Stack
                                        direction='column'
                                        align='center'
                                        spacing='15px'
                                    >
                                        <QRCode
                                            bgColor='#FFFFFF'
                                            fgColor='brand.700'
                                            level='Q'
                                            style={{ width: '60%' }}
                                            value={props.wallet?.address}
                                        />
                                        <Tooltip
                                            hasArrow
                                            label={
                                                hasCopied
                                                    ? `${t(
                                                          'drawer_copied_address',
                                                      )}`
                                                    : `${t(
                                                          'drawer_copy_address',
                                                      )}`
                                            }
                                            closeOnClick={false}
                                        >
                                            <Box
                                                width='64%'
                                                height='40px'
                                                border='2px'
                                                borderRadius='6px'
                                                onClick={onCopy}
                                                paddingTop='6px'
                                                textAlign='center'
                                                ref={addressRef}
                                                cursor='pointer'
                                            >
                                                {addressTruncated}
                                            </Box>
                                        </Tooltip>
                                        {networkSelectionMobile(props.location)}
                                    </Stack>
                                </Box>
                                <Divider mb={5} />
                            </>
                        )}

                        {props.wallet ? (
                            <Stack
                                textColor='brand.700'
                                ml={marginSpace}
                                mr={marginSpace}
                                spacing='10px'
                            >
                                <DrawerMenuItem
                                    to='/wallet'
                                    drawerOnClose={props.onClose}
                                    text='Wallet'
                                    icon={LinkIcon}
                                />

                                <DrawerMenuItem
                                    to='/tx'
                                    drawerOnClose={props.onClose}
                                    text={t('drawer.transaction')}
                                    icon={CalendarIcon}
                                />

                                <Divider mb={3} paddingTop={2} />

                                <DrawerMenuItem
                                    to='/privacy'
                                    drawerOnClose={props.onClose}
                                    text='Privacy'
                                    icon={UnlockIcon}
                                />

                                <DrawerMenuItem
                                    to='/credits'
                                    drawerOnClose={props.onClose}
                                    text='Credits'
                                    icon={InfoIcon}
                                />
                            </Stack>
                        ) : (
                            <Box>
                                <Text>
                                    {t('wallet_creation.qr_wallet_not_exist')}
                                </Text>
                            </Box>
                        )}
                        <Stack
                            align='center'
                            spacing='6px'
                            position='absolute'
                            bottom='6px'
                            right='25%'
                            left='25%'
                        >
                            <Flex width='200px'>
                                <Button
                                    width='90px'
                                    onClick={() => changeLanguage('en')}
                                >
                                    Eng 🇬🇧
                                </Button>
                                <Spacer />
                                <Button
                                    width='90px'
                                    onClick={() => changeLanguage('it')}
                                >
                                    Ita 🇮🇹
                                </Button>
                            </Flex>
                            <Box>
                                <Button
                                    width='200px'
                                    onClick={toggleColorMode}
                                    rightIcon={
                                        sunMoonIcon ? <SunIcon /> : <MoonIcon />
                                    }
                                >
                                    {t('dark_mode.appearance')} {darkMode}
                                </Button>
                            </Box>
                            <Divider pb={2} />
                            <Box textAlign='center'>
                                <a
                                    href={process.env['REACT_APP_WEB_LINK']}
                                    target='_blank'
                                    rel='noreferrer'
                                >
                                    {process.env[`REACT_APP_TITLE`]}
                                </a>
                                {versionFooter}
                            </Box>
                            <Box></Box>
                        </Stack>
                    </DrawerBody>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    );
};

const mapStateToProps = ({ wallet }: any) => {
    return {
        wallet: wallet.wallet,
        loading: wallet.loading,
    };
};

export default connect(mapStateToProps)(CustomDrawer);
