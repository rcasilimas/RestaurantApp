import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, StyleSheet, Platform, Alert, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import ImgPicker from '../../components/UI/imagePicker';

import * as couponActions from '../../store/actions/coupons'
import SelectReusable from '../../components/shop/selectReusable';
import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/input';
import Colors from '../../constants/Colors';

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

const PercentCouponScreen = props => {
    const [error, setError] = useState();
    const dispatch = useDispatch();

     const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            type: 'percent',
            title: '',
            imageUrl: '',
            value: '',
            reusable: false,
            category: null,
            threshold: null
        }, 
        inputValidities: {
            type: true,
            title: false,
            imageUrl: false,
            value: false,
            reusable: true,
            category: true,
            threshold: true
        }, 
        formIsValid: false
    }) 

     useEffect(() => {
        if (error) {
            Alert.alert('An Error Occured', error, [{text: 'Okay'}]);
        }
    }, [error]) 

      const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Wrong Input!', 'Please check the errors in your form.', [
                { text: 'Okay' }
            ])
            return;
        }
        setError(null)
        try {
            await dispatch(
                couponActions.createCoupon(
                    formState.inputValues.type,
                    formState.inputValues.title,
                    formState.inputValues.imageUrl,
                    formState.inputValues.value,
                    formState.inputValues.reusable,
                    formState.inputValues.category,
                    formState.inputValues.threshold
                )
            )
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
    }, [dispatch, formState]); 

    /*  useEffect(() => {
        props.navigation.setParams({ submit: submitHandler })
    }, [submitHandler]);  */ 

    const imageTakenHandler = imageUrl => {
        inputChangeHandler('imageUrl', imageUrl, true)
    }

     const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState])
 
    return (
        <KeyboardAvoidingView 
            style={{flex: 1}} 
            behavior="padding" 
            keyboardVerticalOffset={100} >
            <ScrollView>
                <View style={styles.form}>
                <Input 
                    id='title'
                    label="Title Of Coupon"
                    errorText='Please enter a valid title!'
                    keyboardType='default'
                    autoCapitalize='sentences'
                    autoCorrect
                    returnKeyType='next'
                    onInputChange={inputChangeHandler}
                    required
                />
                <Input
                    id='value'
                    label="% Percentage Value Of Coupon"
                    errorText='Please enter a valid value!'
                    keyboardType='decimal-pad'
                    returnKeyType='next' 
                    onInputChange={inputChangeHandler}
                    required
                    min={5}
                />
                <Input 
                        id='imageUrl'
                        label="Image Url"
                        errorText='Please enter a valid Image Url!'
                        keyboardType='default'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler} 
                        required
                />
                <SelectReusable 
                    title='Reusable?'
                    onSelectItem={() => {
                        inputChangeHandler('reusable', true, true)
                    }}
                    onUnSelectItem={() => {
                        inputChangeHandler('reusable', false, true)
                    }}
                />
                <View style={styles.buttonContainer}>
                    <Button title={'Submit'} color={Colors.accent} onPress={submitHandler} />
                </View>
                {/* <ImgPicker  initialValue={null}  onImageTaken={imageTakenHandler} /> */}
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

PercentCouponScreen.navigationOptions = navData => {/* 
    const submitFn = navData.navigation.getParam('submit'); */

    return {
        headerTitle: 'Create A Coupon',
       /*  headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item 
                title='Save' 
                iconName={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark' } 
                onPress={submitFn} />
            </HeaderButtons>
        ) */
    }
}

const styles = StyleSheet.create({
    mainTitleContainer: {
        marginVertical: 40,
        marginLeft: 10,
        width: '100%'
    },
    mainTitle: {
        textAlign: 'left',
        fontFamily: 'open-sans-bold',
        fontSize: 20
    },
    pickerContainer: {
        width: '60%',
        marginBottom: 40,
        marginLeft: 10
    },
    form: {
        margin: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 20,
        width: '25%'
    },
})

export default PercentCouponScreen;