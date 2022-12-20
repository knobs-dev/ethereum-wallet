import { useState, useCallback } from "react";
import { Container, Flex, Image, Box, Spacer } from "@chakra-ui/react";

import { Sling as Hamburger } from "hamburger-react";

// Components
import CustomDrawer from "../drawer/drawer";
import NetworkSelection from "../networkSelection/networkSelection";
import { useLocation } from "react-router-dom";
import { usePlatformDetector } from "../../imports/utils";
type HeaderProps = {};

const Header = (props: HeaderProps) => {
  const platform = usePlatformDetector();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const handleClose = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  const networkSelectionMobile = (location: any) => {
    if (platform === "isDesktop") {
      return (
        <Flex pt={1} pr={4}>
          {location.pathname !== "/wallet/create" && <NetworkSelection />}
        </Flex>
      );
    }
  };

  return (
    <Box bg="brand.800" p={4}>
      <Container maxW="6xl" alignItems="center">
        <Flex direction="row" color="white">
          <Flex direction="row">
            <a
              href={process.env["REACT_APP_WEB_LINK"]}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                h="40px"
                marginLeft="10px"
                src="/images/logo-knobs-bianco.png"
              />
            </a>
          </Flex>
          <Spacer />
          {networkSelectionMobile(location)}
          <Flex color="brand.500">
            <Hamburger size={38} toggled={isOpen} toggle={setIsOpen} />
          </Flex>
        </Flex>
      </Container>
      <CustomDrawer location={location} onClose={handleClose} isOpen={isOpen} />
    </Box>
  );
};

export default Header;
