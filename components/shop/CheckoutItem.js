import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CheckoutItem = props => {
    let optionsComponent = null;

    if (props.options) {
        optionsComponent = (
            <View style={styles.optionsContainer}>
                <FlatList
                    data={props.options} 
                    renderItem={itemData => (
                        <View style={styles.options}>
                            {(itemData.item.title == 'American') ? null : (itemData.item.title == 'Mozzarella') ? null : (itemData.item.title == 'Original') ? null : (itemData.item.title == 'Both') ? null : <View style={styles.options}><Ionicons name={Platform.OS === 'android' ? 'md-arrow-dropright' : 'ios-arrow-dropright'} size={18} color='black'/><Text style={styles.optionsText}>{itemData.item.title} {(itemData.item.price) ? <Text style={styles.priceText}> {itemData.item.price}</Text> : null}</Text></View>}
                        </View>
                            )}
                />
            </View>
        )
    }

    return (
    <View style={styles.cartContainer}>
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.quantity}>{props.quantity} </Text>
                <Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>${props.value.toFixed(2)}</Text>
            </View>
        </View>
        {optionsComponent}
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
    optionsContainer: {
        width: '100%',
        marginHorizontal: 40
    },
    options: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    optionsText: {
        fontFamily: 'open-sans',
        fontSize: 14,
        marginLeft: 5,
        marginTop: 3
    }
})

export default CheckoutItem;