// Import external libraries
import React, { useEffect, FunctionComponent } from "react";
import { Flex } from "@chakra-ui/react";
import { Router } from "react-router-dom";
import { ColorModeScript } from "@chakra-ui/react";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as wActions from "./redux/walletconnect/actionCreators";

// i18n
import "./i18n";

// Import styles
import "./App.css";

// Import components
import CustomRouter, { customHistory } from "./router";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import theme from "./theme";
import { usePlatformDetector } from "./imports/utils";

type AppProps = {
  walletconnect?: any;
  walletconnectActions?: any;
};

const App: FunctionComponent<AppProps> = ({ ...props }) => {
  const {
    walletconnect: { connector, initialized },
  } = props;
  const platform = usePlatformDetector();
  const walletconnectActions: typeof wActions = props.walletconnectActions;

  const MobileFooter = () => {
    return platform === "isMobile" || platform === "isTablet" ? (
      <Footer />
    ) : null;
  };

  useEffect(() => {
    walletconnectActions.walletconnectInitialize();
  }, []);

  useEffect(() => {
    if (initialized) {
      connector.on("session_update", async (error: any, payload: any) => {
        if (error) {
          throw error;
        }

        const { chainId, accounts } = payload.params[0];
        const address = accounts[0];

        walletconnectActions.walletconnectUpdateSession(
          chainId,
          accounts,
          address
        );
      });

      connector.on("connect", (error: any, payload: any) => {
        if (error) {
          throw error;
        }

        const { chainId, accounts } = payload.params[0];
        const address = accounts[0];

        walletconnectActions.walletconnectConnected(chainId, accounts, address);
      });

      connector.on("disconnect", (error: any, payload: any) => {
        if (error) {
          throw error;
        }

        walletconnectActions.walletconnectReset();
      });

      if (connector.connected) {
        const { chainId, accounts } = connector;
        const address = accounts[0];

        walletconnectActions.walletconnectConnected(chainId, accounts, address);
      }
    }
  }, [initialized]);

  return (
    <Router history={customHistory}>
      <Flex direction="column" height="100%">
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <title id="site-title">{process.env["REACT_APP_TITLE"]} - Wallet</title>
        <Header />
        <CustomRouter />
        <MobileFooter />
      </Flex>
    </Router>
  );
};

const mapStateToProps = ({ walletconnect }: any) => {
  return {
    walletconnect: walletconnect,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  walletconnectActions: bindActionCreators(wActions, dispatch),
});

export default connect((state) => mapStateToProps, mapDispatchToProps)(App);
