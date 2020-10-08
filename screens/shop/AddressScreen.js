import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Text, TextInput, StyleSheet, Button, View, ActivityIndicator, Alert } from 'react-native';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import * as addressActions from '../../store/actions/address';
import Colors from '../../constants/Colors';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/input';
import { ScrollView } from 'react-native-gesture-handler';

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

const AddressScreen = props => {
    Location.setApiKey('yourAPIKey Here')
    const orderLocation = props.navigation.getParam('location');
    let originCoordinates = null;
    if (orderLocation === 'Port-au-Prince') {
        originCoordinates = {
            lat: 18.549710,
            lng: -72.307001
        }
    } else if (orderLocation === 'Petion-Ville') {
        originCoordinates = {
            lat: 18.513895,
            lng: -72.290072
        }
    }
    let destinationCoordinates = null;
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const selectedAddress = useSelector(state => state.address.address)
    
    

    useEffect(() => {
       getPermissions()
    }, [])

    const getPermissions = async () => {
        let response = await Permissions.askAsync(Permissions.LOCATION);
        if (response.status !== 'granted') {
            Alert.alert('Permission to access location was denied.', 'We need permission to calculate distance for delivery. Please grant permission if you want a delivery order', 
            [{text: 'Ok', onPress: () => {
                getPermissions()
            }}, {text: 'No, I do not want delivery', onPress: () => {
                props.navigation.goBack();
            }}]
        )}
    }
    
    const locationFinder = async (street, city, zip) => {
        try {
        const destResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${street}+${city}+Haiti+${zip}&key=AIzaSyD1v5RFBAWBSox3clCvkuC1SF7uRC2lG-c`)
        if (!destResponse.ok) {
            throw new Error("Error", 'Your Address is not valid. Please try again.')
        }
        const coordinates = await destResponse.json();
        destinationCoordinates = coordinates.results[0].geometry.location;
        } catch(err) {
            console.log(err.message)
            throw new Error("Error", 'Your Address is not valid. Please try again.')
        }
    }


    
    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            street: selectedAddress.street,
            city: selectedAddress.city,
            zip: selectedAddress.zip,
        }, 
        inputValidities: {
            street: (selectedAddress.street !== '') ? true : false,
            city: (selectedAddress.city !== '') ? true : false,
            zip: (selectedAddress.zip !== '') ? true : false,
        }, 
        formIsValid: (selectedAddress.street !== '' && selectedAddress.city !== '' && selectedAddress.zip !== '') ? true : false
    })

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occured', error, [{text: 'Okay'}]);
        }
    }, [error])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue, 
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState])

      const loadAddress = useCallback(async () => {
        try {
            await dispatch(addressActions.fetchAddress())
        } catch (err) {
            setError(err.message)
        }
    }, [dispatch, setIsLoading, setError])

    useEffect(() => {
        setIsLoading(true);
        loadAddress().then(() => {
            setIsLoading(false);
        })
    }, [dispatch, loadAddress]); 

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
            await locationFinder(formState.inputValues.street, formState.inputValues.city, formState.inputValues.zip);
            const distResponse = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${originCoordinates.lat},${originCoordinates.lng}&destinations=${destinationCoordinates.lat},${destinationCoordinates.lng}&key=AIzaSyD1v5RFBAWBSox3clCvkuC1SF7uRC2lG-c`)
            if (!distResponse.ok) {
                throw new Error("Error", 'Your Address is not valid or Our Location Tracker Is Down. Please try again.')
            }
            const distResData = await distResponse.json();
            const distance = Number(distResData.rows[0].elements[0].distance.value)
            if (distance > 10000) {
                setIsLoading(false)
                Alert.alert("Sorry", "You are out of our delivery zone. We only deliver within 10km", [{text: 'Go Back', onPress: () => {
                    props.navigation.goBack();
                }}])
            } else {
                await dispatch(addressActions.addAddress(
                    formState.inputValues.street, 
                    formState.inputValues.city, 
                    formState.inputValues.zip))
                    setIsLoading(false);
                    props.navigation.navigate('Checkout') 
            }
        }  catch (err) {
            setError(err.message);
        }
    }, [dispatch, formState]);

    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    return (
        <View style={styles.screen}>
            <ScrollView style={styles.ScrollView}>
            <Card style={styles.summary}> 
                <Text style={styles.title}>Please Enter Your Address Below</Text>
            </Card>
            <View style={styles.form}>
            <Input 
                        id='street'
                        label="Street"
                        errorText='Please enter a street address'
                        keyboardType='default'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={selectedAddress.street}
                        initiallyValid={selectedAddress.street !== ''}
                        required
                        />
            </View>
            <View style={styles.form}>
            <Input 
                        id='city'
                        label="City"
                        errorText='Please enter your city'
                        keyboardType='default'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={selectedAddress.city}
                        initiallyValid={selectedAddress.city !== ''}
                        required
                        />
            </View>
            <View style={styles.form}>
            <Input 
                        id='zip'
                        label="Zip Code"
                        errorText='Please enter your zip code'
                        keyboardType='default'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={selectedAddress.zip}
                        initiallyValid={selectedAddress.zip !== ''}
                        required
                        />
            </View>
            <View style={styles.buttonContainer}>
                <Button title={'Submit'} color={Colors.accent} onPress={submitHandler} />
            </View>
            </ScrollView>
        </View>
    )
}

AddressScreen.navigationOptions = {
    headerTitle: 'Delivery'
};

const styles = StyleSheet.create({
    screen: {
        margin: 20,
        flex: 1
    },
    ScrollView: {
        width: '100%'
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 24,
        textAlign: 'center',
    },
    form: {
        width: '100%',
        marginBottom: 20
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 5,
        fontSize: 18
    },
    buttonContainer: {
        marginTop: 20,
        width: '25%'
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 5,
        padding: 30,
    },

})

export default AddressScreen;