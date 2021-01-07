import React, { useCallback, useRef } from 'react';
import { 
    Image, 
    View, 
    ScrollView, 
    KeyboardAvoidingView, 
    Platform,
    TextInput,
    Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { 
    Container, 
    Title, 
    Esqueci, 
    EsqueciText, 
    CriarContaButton, 
    CriarContaButtonText,
} from './styles';

import logoImg from '../../assets/logo.png';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

// Como existem 3 imagens com o mesmo nome, @2x e @3x,
// o React Native decide qual o melhor tamanho para o tamanho da tela.
// o KeyboardAvoidingView é opcional. Ele faz com que, no momento em que
// o teclado aparece, toda a tela suba.
// no iOS, coloque o <Title> dentro de uma View, para subir também
// useRef é usado para manipular elementos do DOM de forma direta

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const navigation = useNavigation();
    const formRef = useRef<FormHandles>(null);
    const passwordRef = useRef<TextInput>(null);

    const handleSignIn = async (data: SignInFormData) => {
        // define o  formato da validação
        const schema = Yup.object().shape({
            email: Yup.string()
                .required('E-mail obrigatório')
                .email('Digite um e-mail válido'),
            password: Yup.string()
                .required('Senha não informada'),
        });

        formRef.current?.setErrors({}); //limpa os erros
        try {
            //await schema.validate(data); // pára no primeiro erro
            await schema.validate(data, {
                abortEarly: false,  // faz todas as validações; não pára no primeiro erro
            });
        }
        catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err);

                formRef.current?.setErrors(errors);

                Alert.alert( 'Erro na validação', 
                    JSON.stringify(Object.values(errors))
                );
                return;
            }
            
            Alert.alert( 
                'Erro na autenticação', 
                'Erro ao fazer login, verifique as credenciais'
            );
        }
    };

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

                <Title>Faça seu logon</Title>

                <Form ref={formRef} onSubmit={handleSignIn}>
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
                        returnKeyType="send"  //ao clicar no return, chama o onSubmitEditting
                        onSubmitEditing={() => {
                            formRef.current?.submitForm();
                        }}
                    />
                </Form>

                <Button onPress={() => {
                    formRef.current?.submitForm();
                }}>
                    Entrar
                </Button>                    

                <Esqueci onPress={() => {}}>
                    <EsqueciText>Esqueci minha senha</EsqueciText>
                </Esqueci>
            </Container>
            </ScrollView>
        </KeyboardAvoidingView>
        
        <CriarContaButton onPress={() => navigation.navigate('SignUp')}>
            <Icon name="log-in" size={20} color="#ff9000" />
            <CriarContaButtonText>
                Criar uma conta
            </CriarContaButtonText>
        </CriarContaButton>
    </>
    );
};

export default SignIn;
