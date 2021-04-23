import React, { FunctionComponent } from 'react';

import { Flex, Text, Image, Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { usePlatformDetector } from '../../imports/utils';

// versioning
import { VERSION } from '../../imports/config';

type FooterProps = {};

const Footer: FunctionComponent<FooterProps> = ({ children }) => {
    const { t } = useTranslation();
    const platform = usePlatformDetector();
    const borderRadiusPx = platform === 'isDesktop' ? '25px' : '0';
    const justifyMobile = platform === 'isDesktop' ? 'space-between' : 'center';

    const footerStyle: React.CSSProperties = {
        paddingRight: 30,
        paddingLeft: 30,
        borderTopLeftRadius: borderRadiusPx,
        borderTopRightRadius: borderRadiusPx,
    };

    const boxStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
    };

    const BoxVersion = () => {
        return platform === 'isDesktop' ? (
            <Box style={boxStyle}>
                <Text
                    color='brand.900'
                    style={{ fontSize: 13, marginRight: 5 }}
                >
                    {t('footer_version')}
                </Text>
                <Text color='brand.900' style={{ fontSize: 16 }}>
                    {VERSION}
                </Text>
            </Box>
        ) : null;
    };

    return (
        <Flex
            h='80px'
            position='relative'
            style={footerStyle}
            bg='brand.800'
            alignItems='center'
            justifyContent={justifyMobile}
        >
            <BoxVersion />
            <Box>
                <a
                    href={process.env['REACT_APP_WEB_LINK']}
                    target='_blank'
                    rel='noreferrer'
                >
                    <Box style={boxStyle}>
                        <Text color='brand.900'>Powered by </Text>
                        <Image
                            h='40px'
                            marginLeft='10px'
                            src='/images/logo-bcode-bianco.png'
                        />
                    </Box>
                </a>
            </Box>
        </Flex>
    );
};

export default Footer;
