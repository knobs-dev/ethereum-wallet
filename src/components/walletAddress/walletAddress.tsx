import {
  FunctionComponent,
  useEffect,
  useState,
  useRef,
  RefObject,
  useCallback,
} from "react";
import {
  Box,
  useClipboard,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import {
  usePlatformDetector,
  truncStringPortion,
  viewOnEtherscan,
} from "../../imports/utils";
import { EtherscanIcon, ETHIcon } from "../icons/icons";
import { AvailableNetworks } from "../../imports/config";
import { TwitterShareButton, TwitterIcon } from "react-share";

import { useTranslation } from "react-i18next";

type WalletAddressProps = {
  address: string;
  network: AvailableNetworks;
};

function useTruncatedAddress(
  ref: RefObject<HTMLInputElement>,
  address: string,
  charWidth = 20
) {
  const [truncatedAddress, setTruncatedAddress] = useState<string>("");

  useEffect(() => {
    if (ref.current && address) {
      const width = ref.current.offsetWidth - 120;
      const maxChar = Math.floor(width / charWidth);
      const addressMiddle = Math.floor(address.length / 2);
      const toRemove = address.length - maxChar;
      const halfToRemove = Math.floor(toRemove / 2);

      setTruncatedAddress(
        toRemove > 0
          ? truncStringPortion(
              address,
              addressMiddle - halfToRemove,
              addressMiddle + halfToRemove
            )
          : address
      );
    }
  }, [address, charWidth, ref]);

  return truncatedAddress;
}

const WalletAddress: FunctionComponent<WalletAddressProps> = ({
  address,
  network,
}) => {
  const platform = usePlatformDetector();
  const { hasCopied, onCopy } = useClipboard(address);
  const toast = useToast();
  const { t } = useTranslation();
  const textColor = useColorModeValue("#1A202C", "#ffffff");
  const bgColor = useColorModeValue("#EDF2F7", "#2D3748");
  const borderColor = useColorModeValue("brand.900", "transparent");

  useEffect(() => {
    if (hasCopied) {
      toast({
        title: `${t("wallet_address.title")}`,
        description: `${t("wallet_address.description")}`,
        status: "success",
        duration: 3000,
        position: "top",
      });
    }
  }, [hasCopied, t, toast]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEtherscan = useCallback(
    () => window.open(viewOnEtherscan(network, "address", address)),
    [address, network]
  );

  const handleFaucet = () => {
    window.open("https://faucet.ropsten.be/");
  };

  const truncatedAddress = useTruncatedAddress(inputRef, address, 10);

  const mobileAddress =
    platform === "isDesktop" ? (
      <Box
        borderRadius="6px"
        height="40px"
        paddingTop="4px"
        textAlign="center"
        fontWeight="bold"
        fontSize="18px"
        justifyContent="center"
        letterSpacing="1px"
        border="2px"
        borderColor={borderColor}
        textColor={textColor}
        bg={bgColor}
        id="address"
        ref={inputRef}
        position="relative"
      >
        {truncatedAddress}
      </Box>
    ) : platform === "isMobile" ? (
      <Box
        borderRadius="6px"
        height="40px"
        paddingTop="7px"
        onClick={onCopy}
        textAlign="center"
        fontWeight="bold"
        fontSize="14px"
        justifyContent="center"
        letterSpacing="1px"
        border="2px"
        borderColor={borderColor}
        textColor={textColor}
        bg={bgColor}
        id="address"
        ref={inputRef}
        position="relative"
      >
        {truncatedAddress}
      </Box>
    ) : (
      <Box
        width="75%"
        borderRadius="6px"
        height="40px"
        paddingTop="7px"
        onClick={onCopy}
        textAlign="center"
        fontWeight="bold"
        fontSize="14px"
        justifyContent="center"
        letterSpacing="1px"
        border="2px"
        borderColor={borderColor}
        textColor={textColor}
        bg={bgColor}
        id="address"
        ref={inputRef}
        position="relative"
      >
        {truncatedAddress}
      </Box>
    );

  return (
    <Box
      h="70px"
      w="100%"
      position="relative"
      //align="center"
    >
      {mobileAddress}
      {platform === "isDesktop" && (
        <>
          {network === "polygon-mumbai" ? (
            <ETHIcon
              id="eth"
              onClick={handleFaucet}
              position="absolute"
              right="84px"
              top="12px"
              cursor="pointer"
            />
          ) : null}
          <Box position="absolute" right="60px" top="11px">
            <TwitterShareButton
              id="twitter"
              url={""}
              title={`${t("wallet.steps.twitter")} ${address}`}
              hashtags={["blockchain", "IoV21"]}
            >
              <TwitterIcon round size={18} />
            </TwitterShareButton>
          </Box>

          <EtherscanIcon
            id="etherscan"
            onClick={handleEtherscan}
            position="absolute"
            right="36px"
            top="12px"
            cursor="pointer"
          />

          <CopyIcon
            onClick={onCopy}
            position="absolute"
            right="12px"
            top="12px"
            cursor="pointer"
          />
        </>
      )}
    </Box>
  );
};

export default WalletAddress;
