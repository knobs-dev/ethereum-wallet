import {
  Center,
  Heading,
  Box,
  Container,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState, useCallback, FunctionComponent } from "react";
import { useHistory } from "react-router-dom";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as wActions from "../../redux/wallet/actionCreators";
import PageBody from "../../components/pageBody/pageBody";
import BasicSlide from "../../components/basicSlide/basicSlide";

import LottieLoader from "../../components/lottieLoader/lottieLoader";
import { CreationSteps } from "../../redux/wallet/types";
import Footer from "../../components/footer/footer";
import { useTranslation } from "react-i18next";
import { usePlatformDetector } from "../../imports/utils";

type WalletCreationProps = {
  wallet?: any;
  loading: boolean;
  walletActions?: any;
  error?: any;
  creationStep: CreationSteps;
  walletconnect: any;
};

const WalletCreation: FunctionComponent<WalletCreationProps> = ({
  wallet,
  loading,
  error,
  creationStep,
  walletconnect,
  ...props
}) => {
  const [isImport, setIsImport] = useState(true);
  const { t } = useTranslation();
  const bgColor = useColorModeValue("gray.100", "brand.900");
  const history = useHistory();
  const platform = usePlatformDetector();
  const toast = useToast();
  const walletActions: typeof wActions = props.walletActions;

  // Import wallet instance
  const handleImport = useCallback(
    (key: any) => {
      walletActions.importWallet({ key });
    },
    [walletActions]
  );

  // Generates a new wallet instance
  const generateWallet = useCallback(() => {
    walletActions.generateWallet();
  }, [walletActions]);

  const handleNextStep = useCallback(() => {
    walletActions.walletStepsNext();
  }, [walletActions]);

  const mobileFooter = () => {
    if (platform === "isDesktop") {
      return <Footer />;
    }
  };

  if (loading) {
    return (
      <>
        <PageBody>
          <Center>
            <LottieLoader
              animation="calculations"
              w="200px"
              h="200px"
              loadingText={t("wallet_creation.loading_text")}
            />
          </Center>
        </PageBody>
        <Container
          pl={platform === "isMobile" ? "0" : "1rem"}
          pr={platform === "isMobile" ? "0" : "1rem"}
          maxW="6xl"
        >
          {mobileFooter()}
        </Container>
      </>
    );
  }

  if (isImport) {
    if (error?.code) {
      toast({
        title: `${t("import.title_error")}`,
        description: `${t("import.description_error")}`,
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
        onCloseComplete: () => walletActions.resetError(),
      });
    }

    if (wallet?.address && isImport === true) {
      history.push("/wallet");
    }
  }

  return (
    <>
      <PageBody>
        <Container>
          <Center height="100%">
            {creationStep === CreationSteps.INITIAL && (
              <BasicSlide
                title={t("wallet_creation.wallet_address")}
                //imageSource="/images/wallet.svg"
                description={t("wallet_creation.description_address")}
                buttonText={t("wallet_creation.button_address")}
                onClick={() => {
                  setIsImport((prev) => !prev);
                  handleNextStep();
                }}
                isImport
                importWallet={(key: any) => {
                  handleImport(key);
                }}
                qrCode={walletconnect.connector && walletconnect.connector.uri}
                layoutType="normal"
              />
            )}

            {creationStep === CreationSteps.PRIVATE_KEY && !wallet && (
              <BasicSlide
                title={t("wallet_creation.wallet_key")}
                imageSource="/images/private-key.svg"
                description={t("wallet_creation.description_key")}
                buttonText={t("wallet_creation.button_key")}
                onClick={generateWallet}
                layoutType="normal"
              />
            )}

            {creationStep === CreationSteps.PRIVATE_KEY && wallet && (
              <BasicSlide
                title={t("wallet_creation.basic_slide_key.title")}
                description={t("wallet_creation.basic_slide_key.description")}
                buttonText={t("wallet_creation.basic_slide_key.button_text")}
                onClick={handleNextStep}
                layoutType="inverted"
              >
                <Box p={4} borderRadius={8} bg={bgColor}>
                  <Heading
                    isTruncated
                    size={platform === "isTablet" ? "ms" : "md"}
                    w={platform === "isMobile" ? "80vw" : "auto"}
                  >
                    {wallet.privateKey}
                  </Heading>
                </Box>
              </BasicSlide>
            )}

            {creationStep === CreationSteps.PUBLIC_KEY && wallet && (
              <BasicSlide
                title={t("wallet_creation.basic_slide_address.title")}
                description={t(
                  "wallet_creation.basic_slide_address.description"
                )}
                buttonText={t(
                  "wallet_creation.basic_slide_address.button_text"
                )}
                onClick={() => {
                  history.replace("/wallet");
                }}
                layoutType="inverted"
              >
                <Box p={4} borderRadius={8} bg={bgColor} textAlign="center">
                  <Heading
                    size="md"
                    w={
                      platform === "isMobile" || platform === "isTablet"
                        ? "80vw"
                        : "auto"
                    }
                  >
                    {wallet.address}
                  </Heading>
                </Box>
              </BasicSlide>
            )}
          </Center>
        </Container>
      </PageBody>
      <Container maxW="6xl">{mobileFooter()}</Container>
    </>
  );
};

const mapStateToProps = ({ wallet, walletconnect }: any) => {
  return {
    wallet: wallet.wallet,
    loading: wallet.loading,
    error: wallet.error,
    creationStep: wallet.creationStep,
    walletconnect: walletconnect,
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  walletActions: bindActionCreators(wActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletCreation);
