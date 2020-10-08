import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const SelectTopping = props => {
    const [isSelected, setIsSelected] = useState(false);   
    let TouchableCmp = TouchableOpacity;
    let priceText = null;
    let checkbox;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }


    if (props.topping.price) {
        priceText = (
            <Text style={styles.price} >
                +${props.topping.price}
            </Text>
        )
    }

    if (isSelected === true) {
        checkbox = (
            <Ionicons 
                            name={Platform.OS === 'android' ? 'md-radio-button-on' : 'ios-radio-button-on'}
                            size={30}
                            color='black'
                        />
        )
      }

      if (isSelected === false) {
        checkbox = (
            <Ionicons 
                                name={Platform.OS === 'android' ? 'md-radio-button-off' : 'ios-radio-button-off'}
                                size={30}
                                color='black'
                            />
        )
      }

      const selection = () => {
        setIsSelected(!isSelected)
        if (!isSelected) {
            props.onSelect(props.topping)
        } else {
            props.onUnselect(props.topping)
        }
        
      }


    return (

        <TouchableCmp onPress={selection} useForeground>
        <View style={styles.selectContainer}>
            <View style={styles.touchable}>
                {checkbox}
            </View>
            <View style={styles.selectText}>
                <Text style={styles.title} >
                    {props.topping.title}      
                </Text>
                {priceText}
            </View>
        </View>
      </TouchableCmp>
      
    )
}

const styles = StyleSheet.create({
    selectContainer: {
        width: '33%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 10
    },
    touchable: {
        marginRight: 10,
    },
    title: {
        marginRight: 5,
        fontFamily: 'open-sans',
    },
    price: {
        color: '#888',
        fontFamily: 'open-sans-bold',
    },
    selectText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 20,
    }
});

export default SelectTopping;