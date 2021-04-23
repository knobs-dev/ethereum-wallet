import {
    FunctionComponent,
    useState,
    useRef,
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
    Input,
    FormControl,
    FormLabel,
    FormHelperText,
} from '@chakra-ui/react';
import { downloadJSON, usePlatformDetector } from '../../imports/utils';
import { useTranslation } from 'react-i18next';

type ExportWalletDialogProps = {
    wallet: any;
    onConfirm: () => void;
    onDiscard: () => void;
};

type PasswordStrength = 'weak' | 'medium' | 'strong';

const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
);
const mediumRegex = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})',
);

const PasswordStrengthColors = {
    weak: 'red',
    medium: 'yellow',
    strong: 'green',
};

const getPasswordStrength = (password: string): PasswordStrength =>
    strongRegex.test(password)
        ? 'strong'
        : mediumRegex.test(password)
        ? 'medium'
        : 'weak';

const ExportWalletDialog: FunctionComponent<ExportWalletDialogProps> = ({
    /* colorScheme, */
    children,
    wallet,
}) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [encrypting, setEncrypting] = useState(false);
    const platform = usePlatformDetector();
    const variableWidth = platform === 'isDesktop' ? '20%' : '50%';

    const onClose = () => {
        setPassword('');
        setIsOpen(false);
    };
    const cancelRef = useRef(null);

    const PasswordStrengthTranslations = {
        weak: `${t('modals.export.weak')}`,
        medium: `${t('modals.export.medium')}`,
        strong: `${t('modals.export.strong')}`,
    };

    const handleConfirm = useCallback(async () => {
        setEncrypting(true);
        const encryptedJSON = await wallet.encrypt(password);
        downloadJSON(encryptedJSON, 'bishub_encrypted_wallet.json');
        setEncrypting(false);
        onClose();
    }, [password, wallet]);

    const handlePasswordChange = useCallback(
        e => setPassword(e.target.value),
        [],
    );

    const passwordStrength = getPasswordStrength(password);
    
    return (
        <>
            <Button
                width={variableWidth}
                background='brand.900'
                textColor='white'
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
                            {t('modals.export.heading')}
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Center>
                                <FormControl id='password'>
                                    <FormLabel>
                                        {t('modals.export.password_label')}
                                    </FormLabel>
                                    <Input
                                        type='password'
                                        onChange={handlePasswordChange}
                                        value={password}
                                    ></Input>
                                    <FormHelperText
                                        color={
                                            password
                                                ? PasswordStrengthColors[
                                                      passwordStrength
                                                  ]
                                                : 'red'
                                        }
                                    >
                                        {!password &&
                                            `${t(
                                                'modals.export.password_alert',
                                            )}`}
                                        {password &&
                                            `${t('modals.export.strength')}: ${
                                                PasswordStrengthTranslations[
                                                    passwordStrength
                                                ]
                                            }`}
                                    </FormHelperText>
                                </FormControl>
                            </Center>
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                {t("modals.export.go_back_btn")}
                            </Button>
                            <Button
                                colorScheme='red'
                                onClick={handleConfirm}
                                ml={3}
                                isLoading={encrypting}
                                loadingText={t("modals.export.loading_text")}
                            >
                                {t("modals.export.export_btn")}
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default ExportWalletDialog;
