import {
    Code,
    Text,
    Center,
    Grid,
} from '@chakra-ui/react';
import { useCallback, useState, } from 'react';

export type Mnemonic12Words = [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
];

type MnemonicProps = {
    phrase: Mnemonic12Words;
    showNumbers?: boolean;
    onChange?: (items: Array<string>) => void;
};

const Mnemonic = ({ phrase, showNumbers = true, onChange }: MnemonicProps) => {
    const [selected, setSelected] = useState<Array<string>>([]);

    const onItemTap = useCallback(
        (item: string) => {
            const itemIndex = selected.findIndex(
                selectedItem => selectedItem === item,
            );

            const newSelected =
                itemIndex !== -1
                    ? selected.filter(selectedItem => selectedItem !== item)
                    : [...selected, item];

            setSelected(newSelected);

            onChange && onChange(newSelected);
        },
        [onChange, selected],
    );

    return (
        <Grid templateColumns='repeat(3, 1fr)' gap={1}>
            {phrase.map((word, i) => (
                <Code
                    variant={
                        onChange &&
                        selected.find(selectedItem => selectedItem === word)
                            ? 'mnemonic-word-selected'
                            : 'mnemonic-word'
                    }
                    key={word}
                    onClick={onChange ? () => onItemTap(word) : undefined}
                >
                    <Center>
                        {showNumbers && (
                            <Text color='brand.700' paddingRight={1}>
                                {i + 1}.
                            </Text>
                        )}
                        <Text>{word}</Text>
                    </Center>
                </Code>
            ))}
        </Grid>
    );
};

export default Mnemonic;
