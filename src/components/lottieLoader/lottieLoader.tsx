import { FunctionComponent } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import {
    Box,
    BoxProps,
    Heading,
    Center,
} from '@chakra-ui/react';

// import { walletGeneration } from '../../animations';
import { txWaiting, calculations } from '../../animations';

interface ILoaderAnimations {
    [key: string]: any;
}

const LoaderAnimations: ILoaderAnimations = {
    // 'wallet-generation': walletGeneration,
    'tx-waiting': txWaiting,
    calculations: calculations,
};

interface LottieLoaderProps extends BoxProps {
    animation: 'calculations' | 'tx-waiting';
    loadingText?: string;
    playerStyle?: any;
}

const LottieLoader: FunctionComponent<LottieLoaderProps> = ({
    animation,
    loadingText,
    playerStyle,
    ...boxProps
}) => {
    return (
        <Box {...boxProps}>
            <Player
                autoplay
                loop
                src={LoaderAnimations[animation]}
                style={playerStyle}
            />
            <Center pt={5}>
                <Heading size='md' textAlign='center'>
                    {loadingText}
                </Heading>
            </Center>
        </Box>
    );
};

export default LottieLoader;
