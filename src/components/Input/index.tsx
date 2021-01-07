import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
    name: string; //torna obrigatório
    icon: string; //diferente do React, aqui ícones são passados como string, com o nome do ícone
}

interface InputValueRef {
    value: string;
}

const Input: React.FC<InputProps> = ({ name, icon, ...rest }, ref) => {
    const inputElementRef = useRef<any>(null);
    const  { registerField, defaultValue = '', fieldName, error} = useField(name);  
    const inputValueRef = useRef<InputValueRef>({ value: defaultValue });

    const [isFocused, setIsFocused] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, [isFocused]);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);
        setIsFilled(!!inputValueRef.current.value);
    }, [isFocused, isFilled]);

    useEffect(() => {
        registerField<string>({
            name: fieldName,
            ref: inputValueRef.current,
            path: 'value',
            setValue(ref: any, value) {
                inputValueRef.current.value = value;
                inputElementRef.current.setNativeProps({ text: value });
            },
            clearValue() {
                inputValueRef.current.value = '';
                inputElementRef.current.clear;
            }
        })
    }, [fieldName, registerField]);

    return (
        <Container isFocused={isFocused} temErro={!!error}>
            <Icon name={icon} size={20} 
                color={isFocused || isFilled ? '#ff9000' : '#666360'}
            />
            <TextInput 
                ref={inputElementRef}
                placeholderTextColor="#666360" { ...rest } 
                //keyboardAppearance="dark"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                defaultValue={defaultValue}
                onChangeText={(value) => {
                    inputValueRef.current.value = value;
                }}
            />
        </Container>
    );
};

export default Input;
