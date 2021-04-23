import { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';
import { IconProps, Button } from '@chakra-ui/react';

type DrawerMenuItemProps = {
    to: string;
    drawerOnClose: () => void;
    text: string;
    icon?: FunctionComponent<IconProps>;
};

const DrawerMenuItem: FunctionComponent<DrawerMenuItemProps> = ({
    to,
    drawerOnClose,
    text,
    icon: Icon,
}: DrawerMenuItemProps) => (
    <NavLink to={to} onClick={drawerOnClose}>
        <Button
            w='100%'
            leftIcon={Icon && <Icon color='currentcolor' marginRight='5px' />}
            justifyContent='flex-start'
            bg='brand.900'
        >
            {text}
        </Button>
    </NavLink>
);

export default DrawerMenuItem;
