import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Alert, ActivityIndicator, Text, StyleSheet, Button } from 'react-native';
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

const ForgotPasswordScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
           email: '',
        }, 
        inputValidities: {
            email: false,
        }, 
        formIsValid: false
    })

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occured!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const submitHandler = async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input!', 'Please check the errors in your form.', [
                { text: 'Okay' }
            ])
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(authActions.forgotPassword(formState.inputValues.email));
            Alert.alert('Password Reset Initiated', 'Check Your Email', [{ text: 'Okay' }]);
            props.navigation.navigate('Auth');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
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
        <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient} >
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Reset Your Password</Text>
            </View>
            <Card style={styles.authContainer}>
                <ScrollView>
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
                    <View style={styles.buttonContainer}>
                       {isLoading ? (
                       <ActivityIndicator size='small' color={Colors.primary} /> 
                        )  :  (
                        <Button 
                        title='Submit'
                        color={Colors.primary} 
                        onPress={submitHandler} 
                        />
                        )}
                    </View>
                </ScrollView>
            </Card>
        </LinearGradient>
    </KeyboardAvoidingView>
}

ForgotPasswordScreen.navigationOptions = {
    headerTitle: 'Forgot Your Password?'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
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
    titleContainer: {
        marginBottom: 40
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 32,
    },
})

export default ForgotPasswordScreen;