import { FunctionComponent } from 'react';
import { Flex } from '@chakra-ui/react';

type PageBodyProps = {
    justifyContent?: 'flex-start' | 'center' | 'flex-end';
};

const PageBody: FunctionComponent<PageBodyProps> = ({
    children,
    justifyContent = 'center',
}) => (
    <Flex
        direction='column'
        height='100%'
        justifyContent={justifyContent}
        p={4}
    >
        {children}
    </Flex>
);

export default PageBody;
