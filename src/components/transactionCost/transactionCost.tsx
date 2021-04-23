import { FunctionComponent } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
    Heading,
} from '@chakra-ui/react';
import { gweiToEth } from '../../imports/utils';
import { useTranslation } from 'react-i18next';

export type TransactionCostProps = {
    platform: string;
    gasPrice: number;
    gasLimit: number;
};

const TransactionCost: FunctionComponent<TransactionCostProps> = ({
    platform,
    gasPrice,
    gasLimit,
}) => {
    const { t } = useTranslation();
    return (
        <Table variant='simple'>
            <TableCaption pl={0} pb={4} placement='top'>
                <Heading textAlign='left' size='sm'>
                    {t('send_transaction.form.fees_cost')}
                </Heading>
            </TableCaption>
            <Thead>
                <Tr>
                    <Th p={platform === 'isMobile' ? '0' : 'auto'}>
                        {t('send_transaction.form.gas_price')} (Gwei)
                    </Th>
                    <Th p={platform === 'isMobile' ? '0' : 'auto'}>
                        {t('send_transaction.form.gas_required')}
                    </Th>
                    <Th p={platform === 'isMobile' ? '0' : 'auto'} isNumeric>
                        {t('send_transaction.form.total_amount')} (Eth)
                    </Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td p={platform === 'isMobile' ? '8 2 2 2' : 'auto'}>{gasPrice}</Td>
                    <Td p={platform === 'isMobile' ? '8 2 2 2' : 'auto'}>{gasLimit}</Td>
                    <Td p={platform === 'isMobile' ? '8 2 2 2' : 'auto'} isNumeric>
                        {gweiToEth(gasPrice * gasLimit)}
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    );
};

export default TransactionCost;
