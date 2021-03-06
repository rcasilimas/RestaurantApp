import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SpecialCheckoutItem = props => {
    const value = Number(props.value);
    const valueComponent = value.toFixed(2);

    return (
    <View style={styles.cartContainer}>
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>${valueComponent}</Text>
                {props.deletable && (
                <TouchableOpacity 
                onPress={props.onRemove} 
                style={styles.deleteButton}>
                    <Ionicons 
                    name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
                    size={23}
                    color='red'
                    />
                </TouchableOpacity>
                )}
            </View>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({
    cartContainer: {
        padding: 10,
        backgroundColor: 'white',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mainText: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        marginLeft: 3
    },
    deleteButton: {
        marginLeft: 20
    },
    rowContainer: {
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
})

export default SpecialCheckoutItem;