import {
  Center,
  Spinner,
  Flex,
  Heading,
  Container,
  Divider,
  Button,
} from "@chakra-ui/react";

import { PaperPlane, NotarizeIcon } from "../../components/icons/icons";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Tour from "reactour";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as wActions from "../../redux/wallet/actionCreators";
import * as abActions from "../../redux/addressbook/actionCreators";
import { guideCompleted } from "../../redux/common/actionCreators";
import PageBody from "../../components/pageBody/pageBody";
import LiveBalance from "../../components/liveBalance/liveBalance";
import WalletAddress from "../../components/walletAddress/walletAddress";
import { getProviderByNetwork, usePlatformDetector } from "../../imports/utils";
import Footer from "../../components/footer/footer";
import AddressList from "../../components/addressList/addressList";

import { useTranslation } from "react-i18next";
import { AvailableNetworks } from "../../imports/config";

type WalletProps = {
  wallet?: any;
  loading: boolean;
  walletActions?: any;
  addressBookActions?: any;
  addresses: Array<string>;
  commonActions?: any;
  tourCompleted: boolean;
  network: AvailableNetworks;
  txActions: any;
};

const Wallet = (props: WalletProps) => {
  const { t } = useTranslation();
  const platform = usePlatformDetector();
  const history = useHistory();
  const wallet = props.wallet;
  const loading = props.loading;
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const accentColor = "teal";

  const steps = [
    {
      selector: "#balance",
      content: `${t("wallet.steps.balance")}`,
      style: {
        backgroundColor: "gray",
        color: "white",
      },
    },
    {
      selector: "#address",
      content: `${t("wallet.steps.address")}`,
      style: {
        backgroundColor: "gray",
        color: "white",
      },
    },
    {
      selector: "#registered-addresses",
      content: `${t("wallet.steps.registered_addresses")} ${
        process.env["REACT_APP_TITLE"]
      }`,
      style: {
        backgroundColor: "gray",
        color: "white",
      },
    },
    {
      selector: "#send",
      content: `${t("wallet.steps.send")}`,
      style: {
        backgroundColor: "gray",
        color: "white",
      },
    },
    {
      selector: "#twitter",
      content: `${t("wallet.steps.twitter")}`,
      style: {
        backgroundColor: "gray",
        color: "white",
      },
    },
    {
      selector: "#etherscan",
      content: `${t("wallet.steps.etherscan")}`,
      style: {
        backgroundColor: "gray",
        color: "white",
      },
    },
    {
      selector: "#menu-button-network",
      content: `${t("wallet.steps.menu_button_network")}`,
      style: {
        backgroundColor: "gray",
        color: "white",
      },
    },
  ];

  useEffect(() => {
    if (!wallet) {
      history.replace("/wallet/create");
    }
  }, [history, wallet]);

  useEffect(() => {
    if (!props.tourCompleted) {
      setTimeout(() => setIsTourOpen(true), 1000);
    }

    // props?.addressBookActions?.addressBookFetch();
    props?.addressBookActions?.addressBookSubscribe();
  }, [props?.addressBookActions, props.tourCompleted]);

  const handleTourClose = useCallback(() => {
    setIsTourOpen(false);
    props.commonActions?.guideCompleted("wallet");
  }, [props.commonActions]);

  if (loading) {
    return (
      <PageBody>
        <Center>
          <Spinner color="brand.900" size="xl" />
        </Center>
      </PageBody>
    );
  }

  const pt = platform === "isMobile" ? "18px" : "30px";
  const direction = platform === "isMobile" ? "column" : "row";
  const fontSize = platform === "isMobile" ? "50px" : "70px";
  const size = platform === "isMobile" ? "lg" : "xl";
  const height =
    platform === "isMobile"
      ? "calc(100vh - 130px)"
      : platform === "isTablet"
      ? "calc(100vh - 130px)"
      : "calc(100vh - 80px)";

  const mobileFooter = () => {
    if (platform === "isDesktop") {
      return <Footer />;
    }
  };

  return (
    <Container maxW="6xl" h={height} pt={pt}>
      <Flex direction="column" h="100%">
        <Flex flex="1" justifyContent="center" direction="column">
          <Flex
            flex="1"
            justifyContent="center"
            alignItems="center"
            direction={direction}
            pb={10}
          >
            {wallet && (
              <>
                <Heading fontSize={fontSize} id="balance">
                  <LiveBalance
                    walletAddress={wallet.address}
                    provider={getProviderByNetwork(props.network)}
                  />
                </Heading>
                <Heading size={size} pl={4}>
                  ETH
                </Heading>
              </>
            )}
          </Flex>
          <Flex flex="0.4">
            <WalletAddress address={wallet?.address} network={props.network} />
          </Flex>
          <Flex flex="1.4" justifyContent="center" alignItems="center">
            <Button
              bg="brand.900"
              textColor="brand.800"
              id="send"
              size="lg"
              fontSize="22px"
              letterSpacing="1px"
              marginRight="10px"
              rightIcon={<PaperPlane fill="black" />}
              onClick={() => history.push("/wallet/send")}
            >
              {t("wallet.send_button")}
            </Button>
            <Button
              bg="brand.900"
              textColor="brand.800"
              id="send"
              size="lg"
              fontSize="22px"
              letterSpacing="1px"
              marginLeft="10px"
              rightIcon={<NotarizeIcon fill="black" />}
              onClick={() => history.push("/wallet/notarize")}
            >
              {t("wallet.notarize")}
            </Button>
          </Flex>
        </Flex>
        <Flex
          height="50px"
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading size="sm" id="registered-addresses">
            {[t("wallet.heading"), process.env[`REACT_APP_TITLE`]]}
          </Heading>
        </Flex>
        <Divider orientation="horizontal" colorScheme="blackAlpha" size="2" />
        <Flex flex=".8" direction="column" overflow="scroll">
          <AddressList
            addresses={props.addresses}
            onAddressClick={(addr) => history.push(`/wallet/send/${addr}`)}
            network={props.network}
            myAddress={wallet?.address}
          />
        </Flex>
        {mobileFooter()}
      </Flex>
      <Tour
        lastStepNextButton={
          <Button size="sm" colorScheme="teal">
            {t("wallet.tour_button")}
          </Button>
        }
        badgeContent={(curr, tot) => `${curr} di ${tot}`}
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={handleTourClose}
        accentColor={accentColor}
      />
    </Container>
  );
};

const mapStateToProps = ({ wallet, addressbook, common }: any) => {
  return {
    wallet: wallet.wallet,
    loading: wallet.loading,
    addresses: addressbook.addresses,
    tourCompleted: common.guide.wallet,
    network: common.selectedNetwork,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  walletActions: bindActionCreators(wActions, dispatch),
  addressBookActions: bindActionCreators(abActions, dispatch),
  commonActions: {
    guideCompleted: (guideName: string) => dispatch(guideCompleted(guideName)),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
