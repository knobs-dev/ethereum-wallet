import { useState } from 'react';

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
} from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';

export interface ImportWalletProps {
    handleImport: any;
}

const ImportWallet: React.FunctionComponent<ImportWalletProps> = ({
    handleImport,
    children,
    ...props
}) => {
    const [privateKey, setPrivateKey] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { t } = useTranslation();

    const handleChange = (e: any) => setPrivateKey(e.target.value);

    return (
        <>
            <Button
                background='brand.900'
                textColor='brand.800'
                onClick={onOpen}
            >
                {children}
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{t('import.title')}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {t('import.description')}
                        <Input
                            mt={5}
                            focusBorderColor='brand.900'
                            placeholder='0x123f'
                            value={privateKey}
                            onChange={handleChange}
                        />
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={onClose}>{t('import.close')}</Button>
                        <Button
                            background='brand.900'
                            ml={5}
                            onClick={() => {
                                onClose();
                                handleImport(privateKey);
                            }}
                        >
                            {t('import.import')}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ImportWallet;
