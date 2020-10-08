import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator, Alert, TextInput} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useSelector, useDispatch } from 'react-redux';

import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';


const DeliveryScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isDelivery, setIsDelivery] = useState(false);
    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const comments = useSelector(state => state.cart);
    console.log(comments);
    const state = {
        address: false,
        location: false,
        carryout: false,
        delivery: false
    }
    
    const locationHandler = (value) => {
        if (value === 'port') {
            state.location = true;
        } else if (value === 'petion') {
            state.location = true;
        } else {
            state.location = false;
        }
        return state.location;
    }

    const deliveryHandler = (value) => {
        if (value === 'delivery') {
            state.delivery = true
            state.carryout = false;
        } else if (value === 'carryout') {
            state.delivery = false;
            state.carryout = true;
        } else {
            state.delivery = false;
            state.carryout = false;
        }
        return (state.delivery, state.carryout)
    }

    checkoutHandler = () => {
        if (!state.location) {
            Alert.alert('Missing Location', 'Please select a location', [
                { text: 'Okay' }
            ])
        } else if (state.delivery && !state.address) {
            Alert.alert('Missing Address', 'Please enter an address for delivery', [
                { text: 'Okay' }
            ])
        } else if (!state.delivery && !state.carryout) {
            Alert.alert('Missing Order Method', 'Please select how you want your order', [
                { text: 'Okay' }
            ])
        } else {
            Alert.alert('Something went right', 'You have won this game!', [
                { text: 'Okay' }
            ])
        }
    }

    /* if (isDelivery) {
        return (
            <View style={styles.screen}>
            <Card style={styles.summary}> 
           <Text style={styles.title}>Total:    
               <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100 / 100)}</Text> 
           </Text>
           {isLoading ? <ActivityIndicator size='small' color={Colors.primary} /> :  <Button 
               color={Colors.accent}
               title="Checkout" 
               onPress={checkoutHandler}
               /> 
           }
           </Card>
           <View style={styles.form}>
               <Text style={styles.title}>
                   Select Location:
               </Text>
               <RNPickerSelect
           onValueChange={(value) => {
               locationHandler(value)
           }}
           items={[
               { label: 'Port-au-Prince', value: 'port' },
               { label: 'Petion-Ville', value: 'petion' },
           ]}
       />
           </View>
           <View style={styles.form}>
               <Text style={styles.title}>
                   Delivery or Carryout?
               </Text>
               <RNPickerSelect
           onValueChange={(value) => {
               deliveryHandler(value)
           }}
           items={[
               { label: 'Delivery', value: 'delivery' },
               { label: 'Carry Out', value: 'carryout' },
           ]}
       />
           </View>
           <View style={styles.inputContainer}>
               <Text style={styles.title}>Please Enter Your Address for Delivery</Text>
               <Text style={styles.label}>Street Address</Text>
               <TextInput
                   style={styles.input} 
                   keyboardType='default'
                   autoCorrect
                   returnKeyType='next'
                   placeholder='Street Address'
                   maxlength={30}
                   onChangeText={(value) => {
                       
                   }}
               />
               <Text style={styles.label}>City</Text>
               <TextInput
                   style={styles.input} 
                   keyboardType='default'
                   autoCorrect
                   returnKeyType='next'
                   placeholder='City'
                   maxlength={30}
                   onChangeText={(value) => {
                       
                   }}
               />
               <Text style={styles.label}>Zip Code</Text>
               <TextInput
                   style={styles.input} 
                   keyboardType='default'
                   autoCorrect
                   returnKeyType='next'
                   placeholder='Zip Code'
                   maxlength={30}
                   onChangeText={(value) => {
                       
                   }}
               />
           </View>
       </View>
        )
    }
 */

    return (
        <View style={styles.screen}>
             <Card style={styles.summary}> 
            <Text style={styles.title}>Total:    
                <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2) * 100 / 100)}</Text> 
            </Text>
            {isLoading ? <ActivityIndicator size='small' color={Colors.primary} /> :  <Button 
                color={Colors.accent}
                title="Checkout" 
                onPress={checkoutHandler}
                /> 
            }
            </Card>
            <View style={styles.form}>
                <Text style={styles.title}>
                    Select Location:
                </Text>
                <RNPickerSelect
            onValueChange={(value) => {
                locationHandler(value)
            }}
            items={[
                { label: 'Port-au-Prince', value: 'port' },
                { label: 'Petion-Ville', value: 'petion' },
            ]}
        />
            </View>
            <View style={styles.form}>
                <Text style={styles.title}>
                    Delivery or Carryout?
                </Text>
                <RNPickerSelect
            onValueChange={(value) => {
                deliveryHandler(value)
            }}
            items={[
                { label: 'Delivery', value: 'delivery' },
                { label: 'Carry Out', value: 'carryout' },
            ]}
        />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginBottom: 5
    },
    form: {
        marginTop: 40
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 20,
        padding: 10,
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    inputContainer: {
        marginTop: 60,
        width: '100%'
    }
})

DeliveryScreen.navigationOptions = {
    headerTitle: 'Checkout'
};

export default DeliveryScreen;