import { FunctionComponent } from 'react';
import { ButtonGroup, Button } from '@chakra-ui/react';

import { useTranslation } from 'react-i18next';

type SpeedSelectionProps = {
    value: TransactionSpeed;
    onChange: (value: string) => void;
};

export type TransactionSpeed = 'slow' | 'medium' | 'fast' | 'custom';

const SpeedSelection: FunctionComponent<SpeedSelectionProps> = ({
    value,
    onChange,
}) => {
    const { t } = useTranslation();

    return (
        <ButtonGroup width='100%' isAttached variant='outline'>
            <Button
                width='33%'
                isActive={value === 'slow'}
                onClick={onChange ? () => onChange('slow') : undefined}
            >
                {t("send_transaction.form.slow")}
            </Button>
            <Button
                width='33%'
                isActive={value === 'medium'}
                onClick={onChange ? () => onChange('medium') : undefined}
            >
                {t("send_transaction.form.medium")}
            </Button>
            <Button
                width='33%'
                isActive={value === 'fast'}
                onClick={onChange ? () => onChange('fast') : undefined}
            >
                {t("send_transaction.form.fast")}
            </Button>
         </ButtonGroup>
    );
};

export default SpeedSelection;
