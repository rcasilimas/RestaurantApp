import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const SelectItem = props => { 
    let TouchableCmp = TouchableOpacity;
    let priceText = null;
    let checkbox;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    if (props.item.price) {
        priceText = (
            <Text style={styles.price} >
                +${props.item.price}
            </Text>
        )
    }

    /* console.log(props.selectedItem.title);
    console.log(props.item.title) */
    if (props.selectedItem) {
        if (props.item.title === props.selectedItem.title) {
            checkbox = (
                <Ionicons 
                                name={Platform.OS === 'android' ? 'md-radio-button-on' : 'ios-radio-button-on'}
                                size={30}
                                color='black'
                            />
            )
          }
    
          if (props.item.title !== props.selectedItem.title) {
            checkbox = (
                <Ionicons 
                                    name={Platform.OS === 'android' ? 'md-radio-button-off' : 'ios-radio-button-off'}
                                    size={30}
                                    color='black'
                                />
            )
          }
    } else {
        checkbox = (
            <Ionicons 
                                name={Platform.OS === 'android' ? 'md-radio-button-off' : 'ios-radio-button-off'}
                                size={30}
                                color='black'
                            />
        )
    }
    

      const selection = () => {
          if(props.selectedItem) {
            if (props.item.title === props.selectedItem.title) {
                props.onUnselectItem()
            } else if (props.item.title !== props.selectedItem.title) {
                props.onSelectItem(props.item)
            }
        } else {
            props.onSelectItem(props.item)
        }


       /*  setIsSelected(!isSelected)
        if (!isSelected) {
            props.onSelectItem(props.item)
        } else {
            props.onUnselectItem()
        }
         */
      }


    return (

        <TouchableCmp onPress={selection} useForeground>
        <View style={styles.selectContainer}>
            <View style={styles.touchable}>
                {checkbox}
            </View>
            <View style={styles.selectText}>
                <Text style={styles.title} >
                    {props.item.title}      
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

export default SelectItem;