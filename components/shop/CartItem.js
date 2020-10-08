import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Image, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = props => {
    return (
    <View style={styles.cartContainer}>
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.quantity}>{props.quantity} </Text>
                <Text style={styles.mainText}>{props.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>${props.amount.toFixed(2)}</Text>
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
        <View style={styles.rowContainer}>
            <View style={styles.imageContainer} >
                <Image style={styles.image} source={{uri: props.image}} />
            </View> 
            <View style={styles.optionsContainer}>
                <FlatList
                    data={props.options} 
                    renderItem={itemData => (
                        <View>
                    {(itemData.item.title == 'American') ? null : (itemData.item.title == 'Mozzarella') ? null : (itemData.item.title == 'Original') ? null : (itemData.item.title == 'Both') ? null : <Text style={styles.optionsText}>{itemData.item.title} {(itemData.item.price) ? <Text style={styles.priceText}> {itemData.item.price}</Text> : null}</Text>}
                        </View>      )}
                />
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
    quantity: {
        fontFamily: 'open-sans',
        color: '#888',
        fontSize: 16,
        marginTop: 1
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
    imageContainer: {
        marginTop: 10,
        width: '40%',
        height: 150,
        borderRadius: 10,
        overflow: "hidden"
    },
    image: {
        width: '100%',
        height: '100%'
    },
    optionsContainer: {
        marginTop: 10,
        width: '60%',
    },
    optionsText: {
        fontFamily: 'open-sans-bold',
        marginVertical: 1,
        fontSize: 16,
        textAlign: 'right'
    },
})

export default CartItem;