import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const SelectReusable = props => {
    const [isSelected, setIsSelected] = useState(false);   
    let TouchableCmp = TouchableOpacity;
    let checkbox;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    if (isSelected) {
        checkbox = (
            <Ionicons 
                            name={Platform.OS === 'android' ? 'md-radio-button-on' : 'ios-radio-button-on'}
                            size={30}
                            color='black'
                        />
        )
      }

      if (!isSelected) {
        checkbox = (
            <Ionicons 
                                name={Platform.OS === 'android' ? 'md-radio-button-off' : 'ios-radio-button-off'}
                                size={30}
                                color='black'
                            />
        )
      }

      const selection = () => {
          setIsSelected(!isSelected);
            if (!isSelected) {
                props.onSelectItem()
            } else {
                props.onUnSelectItem()
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
                    {props.title}      
                </Text>
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
        marginVertical: 10
    },
    touchable: {
        marginRight: 10,
    },
    title: {
        marginRight: 5,
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    selectText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 20,
    }
});

export default SelectReusable;