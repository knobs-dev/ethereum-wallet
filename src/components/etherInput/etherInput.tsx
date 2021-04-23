import React, { FunctionComponent, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import {
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react';

export type EtherInputProps = {
    value: BigNumber;
    onChange: (amount: BigNumber) => void;
    max: BigNumber | undefined;
    platform: string;
};

const format = (val: BigNumber): string =>
    ethers.utils.formatEther(val).toString();
const parse = (val: string): BigNumber =>
    ethers.utils.parseEther(val ? val : '0');

const EtherInput: FunctionComponent<EtherInputProps> = ({
    value,
    onChange,
    max,
    platform,
}) => {
    const [ isValid, setIsValid ] = useState(false);

    const handleIsValid = () => {
        setIsValid(max ? value.gt(max) : true)
    }

    return (
        <NumberInput
            w={platform === 'isMobile' ? '80%' : '95%'}
            focusBorderColor='brand.900'
            onChange={valueString => {
                handleIsValid();
                const value = parse(valueString);
                onChange(value);
            }}
            value={format(value)}
            step={1}
            min={0}
            isInvalid={isValid}
        >
            <NumberInputField />
        </NumberInput>
    );
};

export default EtherInput;
