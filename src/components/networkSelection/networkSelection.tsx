import { FunctionComponent, useCallback } from 'react';

import {
    Menu,
    MenuButton,
    MenuList,
    MenuItemOption,
    MenuOptionGroup,
} from '@chakra-ui/menu';
import { Button, useColorModeValue } from '@chakra-ui/react';
import { AvailableNetworks } from '../../redux/common/types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as cActions from '../../redux/common/actionCreators';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import { useTranslation } from 'react-i18next';
import { usePlatformDetector } from '../../imports/utils';

type NetworkSelectionProps = {
    network: AvailableNetworks;
    commonActions: any;
    hidden: boolean;
};

const NetworkSelection: FunctionComponent<NetworkSelectionProps> = ({
    network,
    commonActions,
    hidden,
}) => {
    const handleNetworkSelect = useCallback(
        network => {
            commonActions.networkSelect(network);
        },
        [commonActions],
    );

    const itemsTextColor = useColorModeValue('black', 'white');
    const { t } = useTranslation();
    const platform = usePlatformDetector();
    const widthMobileSize = platform === 'isDesktop' ? 'auto' : '65%';
    const placementMobile = platform === 'isDesktop' ? 'bottom' : 'top';
    const iconMobile =
        platform === 'isDesktop' ? <ChevronDownIcon /> : <ChevronUpIcon />;

    return (
        <>
            {!hidden && (
                <Menu
                    closeOnSelect={false}
                    id='network'
                    placement={placementMobile}
                >
                    <MenuButton
                        as={Button}
                        width={widthMobileSize}
                        bg='brand.900'
                        textColor='brand.700'
                        rightIcon={iconMobile}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {network}
                    </MenuButton>
                    <MenuList minWidth='240px' textColor={itemsTextColor}>
                        <MenuOptionGroup
                            value={network}
                            title={t('menu_button.title')}
                            type='radio'
                            onChange={handleNetworkSelect}
                        >
                            <MenuItemOption value='ropsten'>
                                Ropsten
                            </MenuItemOption>
                            <MenuItemOption value='mainnet'>
                                Mainnet
                            </MenuItemOption>
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
            )}
        </>
    );
};

const mapDispatchToProps = (dispatch: any) => ({
    commonActions: bindActionCreators(cActions, dispatch),
});

const mapStateToProps = ({ common, wallet }: any) => {
    return {
        network: common.selectedNetwork,
        hidden: !wallet.wallet,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NetworkSelection);
