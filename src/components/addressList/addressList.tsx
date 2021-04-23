import { FunctionComponent } from 'react';

import {
    Table,
    Tbody,
    Td,
    Tr,
    Skeleton,
} from '@chakra-ui/react';
import { AvailableNetworks } from '../../redux/common/types';
import { EtherscanIcon } from '../icons/icons';
import {
    viewOnEtherscan,
    mobileTruncString,
    usePlatformDetector,
} from '../../imports/utils';

import orderBy from 'lodash/orderBy';

type AddressListProps = {
    addresses: Array<any>;
    onAddressClick: (address: string) => void;
    network: AvailableNetworks;
    myAddress?: string;
};

const AddressList: FunctionComponent<AddressListProps> = ({
    addresses,
    onAddressClick,
    network,
    myAddress,
}) => {
    const platform = usePlatformDetector();

    return (
        <Table>
            <Tbody>
                {addresses.length
                    ? orderBy(addresses, ['createdAt'], ['desc']).map(
                          (address, i) => (
                              <Tr
                                  key={`${address.address}${i}`}
                                  borderBottomWidth='1px'
                                  style={{
                                      fontWeight:
                                          address.address === myAddress
                                              ? 'bold'
                                              : 'normal',
                                  }}
                              >
                                  <Td
                                      onClick={() =>
                                          onAddressClick(address.address)
                                      }
                                      cursor='pointer'
                                  >
                                      {mobileTruncString(
                                          platform,
                                          address.address,
                                          5,
                                          25,
                                      )}
                                  </Td>
                                  <Td w='50px'>
                                      <a
                                          href={viewOnEtherscan(
                                              network,
                                              'address',
                                              address.address,
                                          )}
                                          target='_blank'
                                          rel='noreferrer'
                                      >
                                          <EtherscanIcon />
                                      </a>
                                  </Td>
                              </Tr>
                          ),
                      )
                    : Array.from({
                          length: 5,
                      }).map((el, i) => (
                          <Tr key={i}>
                              <Td colSpan={2}>
                                  <Skeleton height='30px' key={i} />
                              </Td>
                          </Tr>
                      ))}
            </Tbody>
        </Table>
    );
};

export default AddressList;
