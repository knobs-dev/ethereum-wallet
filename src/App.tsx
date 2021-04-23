// Import external libraries
import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Router } from 'react-router-dom';
import { ColorModeScript } from '@chakra-ui/react';
// i18n
import './i18n';

// Import styles
import './App.css';

// Import components
import CustomRouter, { customHistory } from './router';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import theme from './theme';
import { usePlatformDetector } from './imports/utils';

function App() {
    const platform = usePlatformDetector();

    const MobileFooter = () => {
        return platform === 'isMobile' || platform === 'isTablet' ? (
            <Footer />
        ) : null;
    };

    return (
        <Router history={customHistory}>
            <Flex direction='column' height='100%'>
                <ColorModeScript
                    initialColorMode={theme.config.initialColorMode}
                />
                <title id='site-title'>
                    {process.env['REACT_APP_TITLE']} - Wallet
                </title>
                <Header />
                <CustomRouter />
                <MobileFooter />
            </Flex>
        </Router>
    );
}

export default App;
