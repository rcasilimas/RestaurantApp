import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, StyleSheet, Platform, Alert, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
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

const CategoryCouponScreen = props => {
    const [error, setError] = useState();
    const dispatch = useDispatch();

     const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            type: 'category',
            title: '',
            imageUrl: '',
            value: '',
            reusable: false,
            category: '',
            threshold: null
        }, 
        inputValidities: {
            type: true,
            title: false,
            imageUrl: false,
            value: false,
            reusable: true,
            category: false,
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

/*      useEffect(() => {
        props.navigation.setParams({ submit: submitHandler })
    }, [submitHandler]);   */

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
                    label="$ Value Of Coupon"
                    errorText='Please enter a valid value!'
                    keyboardType='decimal-pad'
                    returnKeyType='next' 
                    onInputChange={inputChangeHandler}
                    required
                    min={1}
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
                <View style={styles.pickerContainer}>
                    <Text style={styles.label}>
                        Category Of Coupon
                    </Text>
                    <RNPickerSelect
                            onValueChange={(value) => {
                                inputChangeHandler('category', value, true)
                            }}
                            items={[
                                { label: 'Appetizers', value: 'Appetizers' },
                                { label: 'Sandwiches', value: 'Sandwiches' },
                                { label: 'Crepes', value: 'Crepes' },
                                { label: 'Salads', value: 'Salads' },
                                { label: 'Pastas', value: 'Pastas' },
                                { label: 'Wings', value: 'Wings' },
                                { label: 'Burgers', value: 'Burgers' },
                                { label: 'Seafood', value: 'Seafood' },
                                { label: 'Meat', value: 'Meat' },
                                { label: 'Create Your Own Pizza', value: 'CYOP' },
                                { label: 'Specialty Pizzas', value: 'Specialty Pizzas' },
                                { label: 'Sides', value: 'Sides' },
                                { label: 'Kids Meals', value: 'Kids' },
                                { label: 'Desserts', value: 'Desserts' },
                                { label: 'Drinks', value: 'Drinks' },
                            ]}
                        />
                </View>
                <SelectReusable 
                        title='Reusable?'
                        onSelectItem={() => {
                            inputChangeHandler('reusable', true, true)
                        }}
                        onUnSelectItem={() => {
                            inputChangeHandler('reusable', false, true)
                        }}
                    />
                {/* <ImgPicker  initialValue={null}  onImageTaken={imageTakenHandler} /> */}
                <View style={styles.buttonContainer}>
                    <Button title={'Submit'} color={Colors.accent} onPress={submitHandler} />
                </View>
            </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

CategoryCouponScreen.navigationOptions = navData => {
    /* const submitFn = navData.navigation.getParam('submit'); */

    return {
        headerTitle: 'Create A Coupon',
        /* headerRight: (
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
    },
    form: {
        margin: 20,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8,
        fontSize: 18
    },
    buttonContainer: {
        marginTop: 20,
        width: '25%'
    },
})

export default CategoryCouponScreen;