import React, { FunctionComponent } from 'react';
import { Flex, Center, Heading, Text, Image, Button } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { usePlatformDetector } from '../../imports/utils';
import ImportWallet from '../modals/importWallet';

type BasicSlideProps = {
    imageSource?: string;
    title: string;
    description: string;
    buttonText?: string;
    onClick?: () => void;
    isImport?: boolean;
    importWallet?: any;
    layoutType: 'normal' | 'inverted';
};

function HeadingKey(props: any) {
    const { t } = useTranslation();

    if (props.title === t('wallet_creation.basic_slide_key.title')) {
        return (
            <Flex direction='column' textAlign='center'>
                <Heading size='md'>
                    {t('wallet_creation.basic_slide_key.heading')}
                </Heading>
                <Text align='center' pt='8'>
                    {props.description}
                </Text>
            </Flex>
        );
    }
    return <Text align='center'>{props.description}</Text>;
}

const BasicSlide: FunctionComponent<BasicSlideProps> = ({
    imageSource,
    description,
    title,
    children,
    buttonText,
    onClick,
    isImport,
    importWallet,
    layoutType,
}) => {
    const platform = usePlatformDetector();
    const { t } = useTranslation();

    const image = imageSource && (
        <Image boxSize='200px' objectFit='cover' src={imageSource} alt='' />
    );

    return (
        <Flex direction='column' w={platform === 'isMobile' ? '90%' : 'auto'}>
            <Center pt={2}>
                {layoutType === 'normal' && image}
                {layoutType === 'normal' && !imageSource && children}
                {layoutType === 'inverted' && (
                    <Heading textAlign='center'>{title}</Heading>
                )}
            </Center>
            <Center pt={8}>
                {layoutType === 'normal' && (
                    <Heading textAlign='center'>{title}</Heading>
                )}

                {layoutType === 'inverted' && image}
                {layoutType === 'inverted' && !imageSource && children}
            </Center>
            <Center pt={8}>
                <HeadingKey title={title} description={description} />
            </Center>
            {buttonText && onClick && (
                <Center pt={10}>
                    <Button
                        onClick={onClick}
                        bg='brand.900'
                        textColor='brand.800'
                    >
                        {buttonText}
                    </Button>
                </Center>
            )}
            {isImport && (
                <>
                    <Center pt={5}>{t('basicSlide.otherwise')}</Center>
                    <Center pt={5}>
                        <ImportWallet handleImport={importWallet}>
                            {t('wallet_creation.button_import')}
                        </ImportWallet>
                    </Center>
                </>
            )}
        </Flex>
    );
};

export default BasicSlide;
