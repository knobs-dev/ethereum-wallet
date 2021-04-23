import { Box, Container, Flex, Button } from '@chakra-ui/react';

type BottomActionsProps = {
    handlePrev?: () => void;
    handleNext?: () => void;
    labels?: { prev: string; next: string };
};

const BottomActions = ({
    handlePrev,
    handleNext,
    labels,
}: BottomActionsProps) => (
    <Box p={4}>
        <Container maxW='6xl'>
            <Flex direction='row' justifyContent='space-between'>
                <Box>
                    {handlePrev && (
                        <Button onClick={handlePrev}>
                            {labels?.prev || 'Back'}
                        </Button>
                    )}
                </Box>
                <Box>
                    {handleNext && (
                        <Button onClick={handleNext}>
                            {labels?.next || 'Next'}
                        </Button>
                    )}
                </Box>
            </Flex>
        </Container>
    </Box>
);

export default BottomActions;
