import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TextCheckoutItem = props => {

    return (
    <View style={[styles.cartContainer, props.styles]}>
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>{props.text}</Text>
                
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

export default TextCheckoutItem;