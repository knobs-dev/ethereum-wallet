import { useCallback, useState, FunctionComponent, useEffect } from 'react';

import { Center, Heading, Text, Button, Code } from '@chakra-ui/react';
import SwipeableViews from 'react-swipeable-views';
import Mnemonic from '../../components/mnemonic/mnemonic';
import PageBody from '../../components/pageBody/pageBody';
import BottomActions from '../../components/bottomActions/bottomActions';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

type GuideScreenProps = {};

const GuideScreen = (props: GuideScreenProps) => {
    const { t } = useTranslation();

    const history = useHistory();
    const [step, setStep] = useState(0);

    const handleStepChange = useCallback((index: number) => setStep(index), []);

    const handleNext = useCallback(() => {
        setStep(step + 1);
    }, [step]);

    const handlePrev = useCallback(() => {
        setStep(step - 1);
    }, [step]);

    // BYPASS GUIDE
    useEffect(() => {
        history.replace('/wallet/create');
    }, [history]);

    const steps = [
        <BasicSlide
            imageSource='images/blockchain_logos.jpg'
            title={t('guide_screen.title.blockchain')}
            description={t('guide_screen.description.blockchain')}
        />,
        <BasicSlide
            imageSource='images/wallet.svg'
            title={t('guide_screen.title.wallet')}
            description={t('guide_screen.description.wallet')}
        >
            {/* <Player autoplay src={walletAnimation} /> */}
        </BasicSlide>,
        <BasicSlide
            title={t('guide_screen.title.the_mnemonic_phrase')}
            description={t('guide_screen.description.the_mnemonic_phrase')}
        >
            <Mnemonic
                phrase={[
                    'one',
                    'two',
                    'three',
                    'four',
                    'five',
                    'six',
                    'seven',
                    'eight',
                    'nine',
                    'ten',
                    'eleven',
                    'twelve',
                ]}
            />
        </BasicSlide>,
        <BasicSlide
            title={t('guide_screen.title.address')}
            description={t('guide_screen.description.address')}
        >
            <Code p={2} borderRadius={5} fontSize='18px'>
                0xa46984723...7d341d38E6
            </Code>
        </BasicSlide>,
        <Center height='100%'>
            <Button>{t("guide_screen.start")}</Button>
        </Center>,
    ];

    return (
        <>
            <PageBody>
                <SwipeableViews
                    axis={'x'}
                    index={step}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                >
                    {steps}
                </SwipeableViews>
            </PageBody>
            <BottomActions
                handlePrev={step > 0 ? handlePrev : undefined}
                handleNext={step > steps.length - 1 ? handleNext : undefined}
                labels={{
                    next: `${t("guide_screen.next_button")}`,
                    prev: `${t("guide_screen.previous_button")}`,
                }}
            />
        </>
    );
};

export default GuideScreen;

type BasicSlideProps = {
    imageSource?: string;
    title: string;
    description: string;
};

const BasicSlide: FunctionComponent<BasicSlideProps> = ({
    imageSource,
    description,
    title,
    children,
}) => (
    <>
        <Center overflow='hidden'>
            {imageSource && (
                <div className='image-wrapper'>
                    <img src={imageSource} className='App-logo' alt='logo' />
                </div>
            )}
            {!imageSource && children}
        </Center>
        <Center>
            <Heading>{title}</Heading>
        </Center>
        <Center>
            <Text align='center'>{description}</Text>
        </Center>
    </>
);
