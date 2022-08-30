import React, { FunctionComponent, useState, useRef } from "react";
import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Divider,
  Flex,
} from "@chakra-ui/react";

import { PaperPlane } from "../../components/icons/icons";

import { toast } from "../../imports/utils";

import { useTranslation } from "react-i18next";

type ConfirmDataProps = {
  address: string;
  amount: string;
  speed: any;
  fees: any;
  onConfirm: () => void;
  isValidAddress?: boolean;
  isValidAmount?: boolean | undefined;
  isZeroAmount?: boolean;
  isValidHash?: boolean;
  isNotarize?: boolean;
  platform: string;
};

const ConfirmData: FunctionComponent<ConfirmDataProps> = ({
  children,
  address,
  amount,
  speed,
  fees,
  onConfirm,
  isValidAddress,
  isValidAmount,
  isZeroAmount,
  isValidHash,
  isNotarize,
  platform,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);
  const { t } = useTranslation();
  const paddingTop = platform === "isMobile" ? "20px" : "0px";
  const total = Number(amount) - fees;

  function checkData() {
    if (isNotarize) {
      if (!isValidHash) {
        toast({
          title: `${t("notarize.invalid_hash_title")}`,
          description: `${t("notarize.invalid_hash_description")}`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      if (total <= 0) {
        toast({
          title: `${t(
            "send_transaction.handle_send.valid_amount.title_address"
          )}`,
          description: `${t(
            "send_transaction.handle_send.valid_amount.description_funds"
          )}`,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      return setIsOpen(true);
    }

    if (!isValidAddress) {
      toast({
        title: `${t(
          "send_transaction.handle_send.valid_address.title_address"
        )}`,
        description: `${t(
          "send_transaction.handle_send.valid_address.description"
        )}`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (isZeroAmount) {
      toast({
        title: `${t(
          "send_transaction.handle_send.valid_amount.title_address"
        )}`,
        description: `${t(
          "send_transaction.handle_send.valid_amount.description_no_funds"
        )}`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!isValidAmount) {
      toast({
        title: `${t(
          "send_transaction.handle_send.valid_amount.title_address"
        )}`,
        description: `${t(
          "send_transaction.handle_send.valid_amount.description_funds"
        )}`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    return setIsOpen(true);
  }

  const totalAmount = Number(amount) + Number(fees);

  if (speed === "slow") speed = `${t("send_transaction.form.slow")}`;
  if (speed === "medium") speed = `${t("send_transaction.form.medium")}`;
  if (speed === "fast") speed = `${t("send_transaction.form.fast")}`;

  return (
    <Flex
      flex={platform === "isMobile" ? "1" : "0"}
      justify="center"
      pt={paddingTop}
    >
      <Button
        onClick={checkData}
        bgColor="brand.900"
        textColor="white"
        width={platform === "isMobile" ? "60%" : "100%"}
        fontWeight="bold"
        rightIcon={<PaperPlane fill="white" />}
      >
        {children}
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered={true}
        size="2xl"
        blockScrollOnMount={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent padding={5}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {isNotarize
                ? t("notarize.hash")
                : t("send_transaction.form.send_to")}
            </AlertDialogHeader>
            <AlertDialogBody>{address}</AlertDialogBody>
            <Divider />

            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("send_transaction.form.speed_selection_check")}
            </AlertDialogHeader>
            <AlertDialogBody>{speed}</AlertDialogBody>
            <Divider />

            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {t("send_transaction.form.fees")}
            </AlertDialogHeader>
            <AlertDialogBody>{fees} ETH</AlertDialogBody>
            <Divider />

            {!isNotarize && (
              <AlertDialogHeader
              //align="center"
              >
                {t("send_transaction.form.total_amount")}: {totalAmount} ETH
              </AlertDialogHeader>
            )}

            <AlertDialogFooter display="flex" flexDirection="column">
              <Button
                width="50%"
                bg="brand.900"
                textColor="brand.800"
                onClick={onConfirm}
                mb={4}
                rightIcon={<PaperPlane fill="black" />}
              >
                {isNotarize
                  ? t("notarize.send_notarize")
                  : t("send_transaction.send_button_text")}
              </Button>
              <Button
                width="50%"
                colorScheme="red"
                ref={cancelRef}
                onClick={onClose}
              >
                {t("send_transaction.delete_button_text")}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default ConfirmData;
