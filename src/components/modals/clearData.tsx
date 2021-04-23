import {
    FunctionComponent,
    useState,
    useRef,
    useMemo,
    useCallback,
} from 'react';
import {
    Button,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Center,
    Badge,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { PinInput, PinInputField } from '@chakra-ui/react';
import { usePlatformDetector } from '../../imports/utils';

type ClearDataDialogProps = {
    colorScheme: string;
    onConfirm: () => void;
    onDiscard: () => void;
};

function generateRandomPin(length: number) {
    return Array.from({ length: length })
        .map(() => Math.floor(Math.random() * 9))
        .join('');
}

const ClearDataDialog: FunctionComponent<ClearDataDialogProps> = ({
    colorScheme,
    children,
    onConfirm,
    onDiscard,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef(null);
    const [pinOk, setPinOk] = useState(false);
    const { t } = useTranslation();
    const randomPin: string = useMemo(() => generateRandomPin(4), []);
    const platform = usePlatformDetector();
    const variableWidth = platform === 'isDesktop' ? '20%' : '50%';

    const handlePinChange = useCallback(pin => setPinOk(pin === randomPin), [randomPin]);

    const handleConfirm = useCallback(() => {
        onConfirm && onConfirm();
        onClose();
    }, [onConfirm]);

    return (
        <>
            <Button
                width={variableWidth}
                colorScheme={colorScheme}
                onClick={() => setIsOpen(true)}
            >
                {children}
            </Button>

            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            {t('modals.clear_data.heading')}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Center>
                                {t('modals.clear_data.dialog_body_one')}
                            </Center>
                            <Center>
                                {t('modals.clear_data.dialog_body_two')}
                            </Center>
                            <Center>
                                {randomPin.split('').map((char, i) => (
                                    <Badge m={3} p={1} key={i}>
                                        {char}
                                    </Badge>
                                ))}
                            </Center>
                            <Center>
                                <PinInput
                                    type='number'
                                    onChange={handlePinChange}
                                    autoFocus
                                >
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                    <PinInputField />
                                </PinInput>
                            </Center>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                {t('modals.clear_data.go_back_btn')}
                            </Button>
                            <Button
                                colorScheme='red'
                                onClick={handleConfirm}
                                ml={3}
                                disabled={!pinOk}
                            >
                                {t('modals.clear_data.delete_btn')}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default ClearDataDialog;
