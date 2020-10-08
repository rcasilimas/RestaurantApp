import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { View, ActivityIndicator, ScrollView, KeyboardAvoidingView, StyleSheet, Platform, Alert, Button } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import * as productActions from '../../store/actions/products';
import HeaderButton from '../../components/UI/HeaderButton';
import Input from '../../components/UI/input';
import Colors from '../../constants/Colors';
import ImgPicker from '../../components/UI/imagePicker';

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

const EditProductScreen = props => {
    const categoryId = props.navigation.getParam('categoryId');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const prodId = props.navigation.getParam('productId');
    const editedProduct = useSelector(state => 
        state.products.allProducts.find(prod => prod.id === prodId))
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            categoryId: categoryId,
            title: editedProduct ? editedProduct.title : '',
            imageUrl: editedProduct ? editedProduct.imageUrl : '',
            description: editedProduct ? editedProduct.description : '',
            price: editedProduct ? editedProduct.price : ''
        }, 
        inputValidities: {
            categoryId: true,
            title: editedProduct ? true : false,
            imageUrl: editedProduct ? true : false,
            description: editedProduct ? true : false,
            price: editedProduct ? true : false,
        }, 
        formIsValid: editedProduct ? true : false
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
        setError(null);
        setIsLoading(true);
        try {
            if (editedProduct) {
                await dispatch(
                    productActions.updateProduct(
                        prodId, 
                        formState.inputValues.categoryId, 
                        formState.inputValues.title, 
                        formState.inputValues.description, 
                        formState.inputValues.imageUrl, 
                        +formState.inputValues.price))
            } else {
                await dispatch(
                    productActions.createProduct(
                        formState.inputValues.categoryId, 
                        formState.inputValues.title, 
                        formState.inputValues.description, 
                        formState.inputValues.imageUrl, 
                        +formState.inputValues.price))
            }
            props.navigation.goBack();
        }   catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, prodId, formState]);

    /* useEffect(() => {
        props.navigation.setParams({ submit: submitHandler })
    }, [submitHandler]); */

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState])

    const imageTakenHandler = imageUrl => {
        inputChangeHandler('imageUrl', imageUrl, true)
    }

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    return (
        <KeyboardAvoidingView 
            style={{flex: 1}} 
            behavior="padding" 
            keyboardVerticalOffset={100} >
            <ScrollView>
                <View style={styles.form}>
                <Input 
                        id='categoryId'
                        label="Category"
                        errorText='Please enter a valid Category'
                        keyboardType='default'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        locked={true}
                        initialValue={categoryId}
                        required
                        />
                    <Input 
                        id='title'
                        label="Title"
                        errorText='Please enter a valid title!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.title : ''}
                        initiallyValid={!!editedProduct}
                        required
                        />
                    <Input
                        id='price'
                        label="Price"
                        errorText='Please enter a valid price!'
                        keyboardType='decimal-pad'
                        returnKeyType='next' 
                        onInputChange={inputChangeHandler}
                        initialValue={editedProduct ? editedProduct.price : ''}
                        initiallyValid={!!editedProduct}
                        required
                        />
                    <Input
                        id='description' 
                        label="Description"
                        errorText='Please enter a valid description!'
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler} 
                        initialValue={editedProduct ? editedProduct.description : ''}
                        initiallyValid={!!editedProduct}
                        required
                        minLength={5}
                        />
                        <Input 
                        id='imageUrl'
                        label="Image Url"
                        errorText='Please enter a valid Image Url!'
                        keyboardType='default'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler} 
                        initialValue={editedProduct ? editedProduct.imageUrl : ''}
                        initiallyValid={!!editedProduct}
                        required
                        />
                       {/*  <ImgPicker  initialValue={editedProduct ? editedProduct.imageUrl : null}  onImageTaken={imageTakenHandler} /> */}
                    <View style={styles.buttonContainer}>
                        <Button title={'Submit'} color={Colors.accent} onPress={submitHandler} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

EditProductScreen.navigationOptions = navData => {
    /* const submitFn = navData.navigation.getParam('submit'); */

    return {
        headerTitle: navData.navigation.getParam(
            'productId') ? 'Edit Product' : 'Add Product',
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
    form: {
        margin: 20
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

export default EditProductScreen;