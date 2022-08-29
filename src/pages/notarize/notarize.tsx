import {
  Center,
  Spinner,
  Flex,
  Container,
  Input,
  FormControl,
  FormLabel,
  Button,
  Box,
  HStack,
  Stack,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";

import { ethers } from "ethers";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Tour from "reactour";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as wActions from "../../redux/wallet/actionCreators";
import * as abActions from "../../redux/addressbook/actionCreators";
import * as txActions from "../../redux/transaction/actionCreators";
import PageBody from "../../components/pageBody/pageBody";

import SpeedSelection, {
  TransactionSpeed,
} from "../../components/speedSelection/speedSelection";
import GasPriceInput from "../../components/gasPriceInput/gasPriceInput";
import TransactionCost from "../../components/transactionCost/transactionCost";
import {
  gweiToEth,
  usePlatformDetector,
  getProviderByNetwork,
  getSymbolByNetwork,
} from "../../imports/utils";
import { AvailableNetworks } from "../../imports/config";
import Footer from "../../components/footer/footer";
import ConfirmData from "../../components/modals/confirmData";

import { useTranslation } from "react-i18next";

type NotarizeProps = {
  wallet?: any;
  loading: boolean;
  walletActions?: any;
  addressBookActions?: any;
  txActions?: any;
  addresses: Array<string>;
  network: AvailableNetworks;
};
const steps: any = [];

const GasPriceMap: { [key: string]: number } = {
  slow: 75,
  medium: 90,
  fast: 120,
};

interface NotarizeParams {
  documentHash: string;
}

const Notarize = (props: NotarizeProps) => {
  const platform = usePlatformDetector();
  const { t } = useTranslation();
  const history = useHistory();
  const { documentHash } = useParams<NotarizeParams>();
  const wallet = props.wallet;
  const loading = props.loading;
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);
  const [hash, setHash] = useState<string>(documentHash || "");
  const [transactionSpeed, setTransactionSpeed] =
    useState<TransactionSpeed>("slow");
  const [gasPrice, setGasPrice] = useState<number>(GasPriceMap.slow);

  const inputRef = useRef<HTMLInputElement>(null);
  const isValidHash = /^[A-Fa-f0-9]{64}$/g.test(hash);
  const provider = getProviderByNetwork(props.network);
  const [balance, setBalance] = useState("");

  const getBalance = async () => {
    const balance = await provider.getBalance(wallet?.address);
    setBalance(ethers.utils.formatEther(balance._hex));

    return balance;
  };
  getBalance();

  useEffect(() => {
    if (!wallet) {
      history.replace("/wallet/create");
    }
  }, [history, wallet]);

  useEffect(() => {
    if (!isTourOpen) {
      // setShowFaucetModal(true);
      // show faucet modal
    }
  }, [isTourOpen]);

  const handlePaste = useCallback(() => {
    navigator.clipboard.readText().then((text) => setHash(text));
  }, []);

  // const handleReset = useCallback(() => setDestinationAddress(''), []);

  const handleInputChange = useCallback((e) => setHash(e.target.value), []);

  const handleTransactionSpeed = useCallback((txSpeed) => {
    setTransactionSpeed(txSpeed);
    setGasPrice(GasPriceMap[txSpeed]);
  }, []);

  const handleGasPriceChange = useCallback(async (gasPrice) => {
    if (gasPrice > 0) {
      setGasPrice(gasPrice);
      setTransactionSpeed("custom");
    }
  }, []);

  const handleSend = useCallback(() => {
    props.txActions.txSend(
      wallet.address,
      0,
      ethers.utils.parseUnits(gasPrice.toString(), "gwei"),
      `0x${hash}`
    );
  }, [props.txActions, wallet, gasPrice, hash]);

  if (loading) {
    return (
      <PageBody>
        <Center>
          <Spinner color="brand.700" size="xl" />
        </Center>
      </PageBody>
    );
  }

  const mobileFooter = () => {
    if (platform === "isDesktop") {
      return <Footer />;
    }
  };

  const copyIcon = () => {
    if (platform === "isDesktop" || platform === "isTablet") {
      return (
        <CopyIcon
          onClick={handlePaste}
          position="absolute"
          right="12px"
          top="12px"
          cursor="pointer"
        />
      );
    }
  };
  const height =
    platform === "isMobile"
      ? "calc(100vh - 130px)"
      : platform === "isTablet"
      ? "calc(100vh - 130px)"
      : "calc(100vh - 80px)";

  return (
    <Container
      maxW="6xl"
      h={height}
      pt={platform === "isMobile" ? "0" : "100px"}
      w={
        platform === "isMobile"
          ? "85%"
          : platform === "isTablet"
          ? "80%"
          : "100%"
      }
    >
      <Flex direction="column" h="100%">
        <Flex flex="1" justifyContent="center" direction="column">
          <Flex
            flex="1"
            justifyContent="center"
            alignItems="center"
            id="to"
            pt={4}
          >
            <FormControl id="password">
              <FormLabel>{t("notarize.notarize")}</FormLabel>
              <Box w="100%" position="relative">
                <Input
                  focusBorderColor="brand.900"
                  ref={inputRef}
                  type="text"
                  value={hash}
                  onChange={handleInputChange}
                  placeholder={t("notarize.placeholder")}
                />
                {copyIcon()}
              </Box>
            </FormControl>
          </Flex>
          <Flex flex="1">
            <Stack
              width="100%"
              direction={
                platform === "isMobile"
                  ? "column"
                  : platform === "isTablet"
                  ? "column"
                  : "row"
              }
              align="center"
            >
              <Box
                pt="10px"
                id="gasprice"
                width={
                  platform === "isMobile"
                    ? "100%"
                    : platform === "isTablet"
                    ? "100%"
                    : "50%"
                }
              >
                <FormControl id="gasprice">
                  <FormLabel>{t("send_transaction.form.gas_price")}</FormLabel>
                  <GasPriceInput
                    onChange={handleGasPriceChange}
                    value={gasPrice}
                  />
                </FormControl>
              </Box>
              <Box
                width={
                  platform === "isMobile"
                    ? "100%"
                    : platform === "isTablet"
                    ? "100%"
                    : "50%"
                }
                pt={
                  platform === "isMobile"
                    ? "24px"
                    : platform === "isTablet"
                    ? "24px"
                    : "10px"
                }
              >
                <FormControl id="address password">
                  <FormLabel>
                    {t("send_transaction.form.speed_selection")}
                  </FormLabel>
                  <SpeedSelection
                    onChange={handleTransactionSpeed}
                    value={transactionSpeed}
                  />
                </FormControl>
              </Box>
            </Stack>
          </Flex>
        </Flex>
        <Flex flex="0.5" id="address" pt={4}>
          <TransactionCost
            platform={platform}
            gasPrice={gasPrice}
            gasLimit={21000}
            symbol={getSymbolByNetwork(props.network)}
          />
        </Flex>
        <Flex
          flex="0.5"
          w="100%"
          alignItems="flex-start"
          justifyContent="center"
        >
          <HStack
            width="100%"
            justifyContent="space-around"
            align="center"
            pt={4}
          >
            {(platform === "isDesktop" || platform === "isTablet") && (
              <Button
                variant="outline"
                border="2px"
                width="20%"
                fontWeight="bold"
                onClick={() => history.goBack()}
              >
                {t("send_transaction.delete_button_text")}
              </Button>
            )}
            <ConfirmData
              address={hash}
              amount={balance}
              speed={transactionSpeed}
              fees={gweiToEth(gasPrice * 21000)}
              platform={platform}
              isValidHash={isValidHash}
              isNotarize
              onConfirm={handleSend}
            >
              {t("notarize.notarize_check")}
            </ConfirmData>
          </HStack>
        </Flex>
        {mobileFooter()}
      </Flex>
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </Container>
  );
};

const mapStateToProps = ({ wallet, addressbook, transaction, common }: any) => {
  return {
    wallet: wallet.wallet,
    loading: transaction.loading,
    addresses: addressbook.addresses,
    network: common.selectedNetwork,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  walletActions: bindActionCreators(wActions, dispatch),
  addressBookActions: bindActionCreators(abActions, dispatch),
  txActions: bindActionCreators(txActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Notarize);
