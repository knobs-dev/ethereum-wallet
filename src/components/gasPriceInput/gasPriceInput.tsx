import { FunctionComponent } from 'react';
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';

export type GasPriceInputProps = {
    value: number;
    onChange: (value: number) => void;
};

const format = (val: number): string => `${val} Gwei`;
const parse = (val: string): number => parseFloat(val.replace(/$ Gwei/, ''));

const GasPriceInput: FunctionComponent<GasPriceInputProps> = ({
    value,
    onChange,
}) => {
    return (
        <NumberInput
            width='100%'
            onChange={valueString => onChange(parse(valueString))}
            value={format(value)}
            step={1}
            min={0}
            focusBorderColor='brand.900'
        >
            <NumberInputField />
            <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
            </NumberInputStepper>
        </NumberInput>
    );
};

export default GasPriceInput;
