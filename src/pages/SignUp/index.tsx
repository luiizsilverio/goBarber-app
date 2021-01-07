import React, { useRef , useCallback } from 'react';
import { Image, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { 
    Container, 
    Title, 
    BackToSignIn,
    BackToSignInText
} from './styles';

import api from '../../services/api';
import logoImg from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

interface SignUpData {
    name: string;
    email: string;
    password: string;
}

// Como existem 3 imagens com o mesmo nome, @2x e @3x,
// o React Native decide qual o melhor tamanho para o tamanho da tela.
// o KeyboardAvoidingView é opcional. Ele faz com que, no momento em que
// o teclado aparece, toda a tela suba.
// no iOS, coloque o <Title> dentro de uma View, para subir também

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const navigation = useNavigation();
    
    const handleSignUp = useCallback(async (data: SignUpData) => {
        // define o  formato da validação
        const schema = Yup.object().shape({
            name: Yup.string()
                .required('Nome obrigatório'),
            email: Yup.string()
                .required('E-mail obrigatório')
                .email('Digite um e-mail válido'),
            password: Yup.string()
                .min(6, 'Informe no mínimo 6 dígitos'),
        });

        formRef.current?.setErrors({}); //limpa os erros
        try {
            await schema.validate(data); // pára no primeiro erro
            /*
            await schema.validate(data, {
                abortEarly: false,  // faz todas as validações; não pára no primeiro erro
            });
            */
            console.log(data);
            await api.post('/users', data);
           
            Alert.alert( 'Cadastro realizado com sucesso',
                'Você já pode fazer seu login no GoBarber!'
            );

            //navigation.goBack(); //navigation.navigate('SignIn');
        }
        catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);

                formRef.current?.setErrors(errors);
                
                Alert.alert( 'Erro no cadastro', 
                    JSON.stringify(Object.values(errors))
                );
                return;
            }
            console.log(err);
            Alert.alert( 
                'Erro no cadastro', 
                'Ocorreu um erro ao fazer o cadastro',
            );
        }
    }, []);

    return (
    <>
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            enabled
        >
            <ScrollView 
                contentContainerStyle={{ flex: 1 }}
                //keyboardShouldPersistTaps="handled"
            >
            <Container>
                <Image source={logoImg} />

                <View>
                    <Title>Crie sua conta</Title>
                </View>

                <Form ref={formRef} onSubmit={handleSignUp}>
                    <Input name="name" 
                        icon="user" 
                        placeholder="Nome" 
                        autoCapitalize="words" //1a.letra de cada palavra em maiúsculo
                        returnKeyType="next" 
                    />

                    <Input name="email" 
                        icon="mail" 
                        placeholder="E-mail"
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        returnKeyType="next" 
                    />

                    <Input name="password" 
                        icon="lock" 
                        placeholder="Senha" 
                        secureTextEntry
                        textContentType="newPassword"
                        returnKeyType="send"  //ao clicar no return, chama o onSubmitEditting
                        onSubmitEditing={() => {
                            formRef.current?.submitForm();
                        }}
                    />
                </Form>

                <Button onPress={() => formRef.current?.submitForm()}>
                    Cadastrar
                </Button>
            </Container>
            </ScrollView>
        </KeyboardAvoidingView>

        <BackToSignIn onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#ff9000" />
            <BackToSignInText>
                Voltar para logon
            </BackToSignInText>
        </BackToSignIn>
    </>
    );
};

export default SignUp;
