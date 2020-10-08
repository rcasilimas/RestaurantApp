import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { ScrollView, View, Image, Text, KeyboardAvoidingView, TouchableOpacity, TouchableNativeFeedback, Alert, Platform, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux';


import Input from '../../components/UI/input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === 'FORM_INPUT_UPDATE') {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
}

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignUp, setIsSignup] = useState(false);
    const dispatch = useDispatch();

    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
           email: '',
           phone: '',
           name: '',
           password: ''
        }, 
        inputValidities: {
            email: false,
            phone: false,
            name: false,
            password: false
        }, 
        formIsValid: false
    })


    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occured!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const authHandler = async () => {
        let action;
        if (isSignUp) {
            if (!formState.formIsValid) {
                Alert.alert('Wrong Input!', 'Please check the errors in your form.', [
                    { text: 'Okay' }
                ])
                return;
            } else {
                action = 
                authActions.signup(
                    formState.inputValues.email,
                    formState.inputValues.password,
                    formState.inputValues.name,
                    formState.inputValues.phone
                )
            }
        } else {
            action = authActions.login(
                formState.inputValues.email, 
                formState.inputValues.password
                )
        } 
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
            props.navigation.navigate('Shop');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    const forgotPasswordHandler = () => {
        props.navigation.navigate('Password')
    }

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState])

    return <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
        <LinearGradient colors={[Colors.gradient1, Colors.gradient2]} style={styles.gradient} >
            <View style={styles.imageContainer}>
                <Image source={require('../../img/kokoye-logo.png')}/>
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{`${isSignUp ? 'Sign Up' : 'Login'}`}</Text>
            </View>
            <Card style={styles.authContainer}>
                <ScrollView >
                {isSignUp ? (
                        <Input 
                        id='name' 
                        label='Your Name' 
                        keyboardType='default'
                        secureTextEntry
                        required
                        minLength={2}
                        errorText='Please enter a valid name'
                        onInputChange={inputChangeHandler}
                        initialValue=''
                        />
                    ) : (
                        null
                    )
                    }
                    {isSignUp ? (
                        <Input 
                        id='phone' 
                        label='Phone Number' 
                        keyboardType='number-pad'
                        secureTextEntry
                        required
                        minLength={10}
                        autoCapitalize='none'
                        errorText='Please enter a valid phone number'
                        onInputChange={inputChangeHandler}
                        initialValue=''
                        />
                    ) : (
                        null
                    )
                    }
                    <Input 
                    id='email' 
                    label='E-mail' 
                    keyboardType='email-address'
                    required
                    email
                    autoCapitalize='none'
                    errorText='Please enter a valid email address'
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    />
                    <Input 
                    id='password' 
                    label='Password' 
                    keyboardType='default'
                    secureTextEntry
                    required
                    minLength={5}
                    autoCapitalize='none'
                    errorText='Please enter a valid password'
                    onInputChange={inputChangeHandler}
                    initialValue=''
                    />
                    <View style={styles.buttonContainer}>
                       {isLoading ? (
                       <ActivityIndicator size='small' color={Colors.primary} /> 
                        )  :  (
                        <Button 
                        title={isSignUp ? 'Sign Up' : 'Login'}
                        color={Colors.primary} 
                        onPress={authHandler} 
                        />
                        )}
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button 
                        title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
                        color={Colors.accent} 
                        onPress={() => {
                                    setIsSignup(prevState => !prevState);
                           }}  
                        />
                    </View>
                    {!isSignUp ? (
                    <TouchableCmp onPress={forgotPasswordHandler} >
                        <View style={styles.passwordContainer}>
                            <Text style={styles.passwordText}>Forgot Your Password?</Text>
                        </View>
                    </TouchableCmp>
                    ) : (
                        null
                    )
                    }
                </ScrollView>
            </Card>
        </LinearGradient>
    </KeyboardAvoidingView>
}

AuthScreen.navigationOptions = {
    headerTitle: 'Kokoye'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    imageContainer: {
            overflow: 'hidden',
            marginBottom: 40  
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 500,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    },
    passwordContainer: {
        marginTop: 20
    },
    titleContainer: {
        marginBottom: 40
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 32,
    },
    passwordText: {
        textAlign: 'center',
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        color: `${Colors.primary}`
    }
})

export default AuthScreen;