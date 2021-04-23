import { FunctionComponent, useCallback, useState } from 'react';
import { Box, Flex, Heading, Center } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

type CustomBoxProps = {
    title?: string;
};

const CustomBox: FunctionComponent<CustomBoxProps> = ({ children, title }) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const toggleVisibility = useCallback(() => setIsVisible(!isVisible), [
        isVisible,
    ]);

    return (
        <Flex
            borderRadius={8}
            boxShadow='1px 2px 4px lightgray'
            overflow='hidden'
            position='relative'
        >
            <Box bg='brand.900' w='4px' h='100%' position='absolute' left='0' />

            <Flex direction='column' p={4} flex='1' w='100%'>
                {title && (
                    <Flex>
                        <Box w='100%'>
                            <Heading fontSize='lg'>{title}</Heading>
                        </Box>

                        <Center w='30px'>
                            {isVisible ? (
                                <ViewIcon onClick={toggleVisibility} />
                            ) : (
                                <ViewOffIcon onClick={toggleVisibility} />
                            )}
                        </Center>
                    </Flex>
                )}
                <Box>
                    {typeof children === 'function'
                        ? children(isVisible)
                        : children}
                </Box>
            </Flex>
        </Flex>
    );
};

export default CustomBox;
