import React, { FunctionComponent, useState } from 'react';
import { ethers, BigNumber } from 'ethers';
import {
    NumberInput,
    NumberInputField,
} from '@chakra-ui/react';

export type EtherInputProps = {
    value: string;
    onChange: (amount: string) => void;
    max: BigNumber | undefined;
    platform: string;
};

export const formatEther = (val: BigNumber): string =>
    ethers.utils.formatEther(val).toString();
export const parseEther = (val: string): BigNumber =>
    ethers.utils.parseEther(val ? val : '0');

const EtherInput: FunctionComponent<EtherInputProps> = ({
    value,
    onChange,
    max,
    platform,
}) => {
    const [ isValid, setIsValid ] = useState(false);

    const handleIsValid = () => {
        setIsValid(max ? parseEther(value).gt(max) : true)
    }

    return (
        <NumberInput
            w={platform === 'isMobile' ? '80%' : '95%'}
            focusBorderColor='brand.900'
            onChange={value => {
                handleIsValid();
                onChange(value);
            }}
            value={value}
            step={1}
            min={0}
            precision={2}
            isInvalid={isValid}
        >
            <NumberInputField />
        </NumberInput>
    );
};

export default EtherInput;