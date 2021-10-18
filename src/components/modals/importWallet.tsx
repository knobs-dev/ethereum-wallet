import { useState } from "react";
import { QRCode } from "react-qr-svg";

// Chakra-UI
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Link,
} from "@chakra-ui/react";

import { useTranslation } from "react-i18next";

export interface ImportWalletProps {
  handleImport: any;
  qrCode?: string;
}

const ImportWallet: React.FunctionComponent<ImportWalletProps> = ({
  handleImport,
  qrCode,
  children,
  ...props
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [privateKey, setPrivateKey] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const handleChange = (e: any) => setPrivateKey(e.target.value);

  return (
    <>
      <Button background="brand.900" textColor="brand.800" onClick={onOpen}>
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("import.title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs
              isFitted
              align="center"
              colorScheme="brand"
              onChange={(tab) => setSelectedTab(tab)}
            >
              <TabList>
                <Tab>{t("import.tab_qr_code")}</Tab>
                <Tab>{t("import.tab_private_key")}</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Text align="center">
                    {`${t("scan_qr_code.scan_qr_code_with")} `}
                    <Link
                      href="https://registry.walletconnect.org/wallets"
                      isExternal
                    >
                      {t("scan_qr_code.compatible_wallet")}
                    </Link>
                  </Text>
                  <QRCode
                    bgColor="#FFFFFF"
                    fgColor="brand.700"
                    level="Q"
                    style={{ width: "60%", marginTop: "1em" }}
                    value={qrCode || ""}
                  />
                </TabPanel>
                <TabPanel>
                  {t("import.description")}
                  <Input
                    mt={5}
                    focusBorderColor="brand.900"
                    placeholder="0x123f"
                    value={privateKey}
                    onChange={handleChange}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          {selectedTab === 1 && (
            <ModalFooter>
              <Button onClick={onClose}>{t("import.close")}</Button>
              <Button
                background="brand.900"
                ml={5}
                onClick={() => {
                  onClose();
                  handleImport(privateKey);
                }}
              >
                {t("import.import")}
              </Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImportWallet;
