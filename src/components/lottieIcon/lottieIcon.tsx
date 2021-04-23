import { FunctionComponent } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { Box, BoxProps, } from '@chakra-ui/react';

import { wallet } from '../../animations';

interface IAnimatedIcons {
    [key: string]: any;
}

const AnimatedIcons: IAnimatedIcons = {
    wallet: wallet,
};

interface LottieIconProps extends BoxProps {
    animation: 'wallet';
    loadingText?: string;
}

const LottieIcon: FunctionComponent<LottieIconProps> = ({
    animation,
    loadingText,
    ...boxProps
}) => {
    return (
        <Box {...boxProps}>
            <Player autoplay src={AnimatedIcons[animation]} />
        </Box>
    );
};

export default LottieIcon;
