import { Container, Flex, VStack, Heading, Box, Text } from '@chakra-ui/react';
import Footer from '../../components/footer/footer';
import { usePlatformDetector } from '../../imports/utils';
import { useTranslation } from 'react-i18next';

const AnimationCredits = () => {
    const { t } = useTranslation();
    const platform = usePlatformDetector();

    const MobileFooter = () => {
        return platform === 'isDesktop' ? <Footer /> : null;
    };

    const creditsDesktopOne = (
        <Text>
            {t('credits.source_desktop')}
            <a
                href={t('credits.source_link_one')}
                target='_blank'
                rel='noreferrer'
            >
                {t('credits.source_link_one')}
            </a>
        </Text>
    );

    const creditsDesktopTwo = (
        <Text>
            {t('credits.source_desktop')}
            <a
                href={t('credits.source_link_two')}
                target='_blank'
                rel='noreferrer'
            >
                {t('credits.source_link_two')}
            </a>
        </Text>
    );

    const creditsMobileOne = (
        <Text fontWeight='bold' textColor='brand.900'>
            <a
                href={t('credits.source_link_one')}
                target='_blank'
                rel='noreferrer'
            >
                {t('credits.source_mobile')}
            </a>
        </Text>
    );

    const creditsMobileTwo = (
        <Text fontWeight='bold' textColor='brand.900'>
            <a
                href={t('credits.source_link_two')}
                target='_blank'
                rel='noreferrer'
            >
                {t('credits.source_mobile')}
            </a>
        </Text>
    );

    const height =
        platform === 'isMobile'
            ? 'calc(100vh - 130px)'
            : platform === 'isTablet'
            ? 'calc(100vh - 130px)'
            : 'calc(100vh - 80px)';

    const mobileCredits = (
        creditsDesktop: JSX.Element,
        creditsMobile: JSX.Element,
    ) => {
        if (platform === 'isDesktop') {
            return creditsDesktop;
        } else {
            return creditsMobile;
        }
    };

    return (
        <Container maxW='6xl' h={height}>
            <Flex direction='column' h='100%' textAlign='center'>
                <Flex
                    flex='1'
                    justifyContent='center'
                    alignItems='center'
                    direction='column'
                    paddingBottom='280px'
                    letterSpacing='1px'
                >
                    <Box>
                        <VStack spacing='10px'>
                            <Heading>{t('credits.heading')}</Heading>
                            <Text fontWeight='semibold'>
                                {t('credits.sub_heading')}
                            </Text>
                        </VStack>
                    </Box>
                    <Box paddingTop='30px'>
                        <VStack spacing='30px'>
                            <VStack>
                                <Text>
                                    {t('credits.author')}
                                    {t('credits.name_one')}
                                    {mobileCredits(
                                        creditsDesktopOne,
                                        creditsMobileOne,
                                    )}
                                </Text>
                            </VStack>
                            <VStack>
                                <Text>
                                    {t('credits.author')}
                                    {t('credits.name_two')}
                                    {mobileCredits(
                                        creditsDesktopTwo,
                                        creditsMobileTwo,
                                    )}
                                </Text>
                            </VStack>
                        </VStack>
                    </Box>
                </Flex>
                <MobileFooter />
            </Flex>
        </Container>
    );
};

export default AnimationCredits;
