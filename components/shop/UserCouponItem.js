import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

import Card from '../UI/Card';

const UserCouponItem = props => {
    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    let dateCmp = null;

    if (props.date) {
        dateCmp = (
        <Text style={styles.title} >
            Created: {props.date}      
        </Text>
        )
    }

    return (
        <Card style={styles.product}>
            <View style={styles.touchable}>
                <TouchableCmp onPress={props.onSelect} useForeground>
                    <View style={styles.container}>
                        <View style={styles.imageContainer} >
                            <Image style={styles.image} source={{uri: props.image}} />
                        </View>
                        <View style={styles.containerDetails}>
                        <View style={styles.details}>
                            <Text style={styles.title} >
                                {props.title}      
                            </Text>
                            {dateCmp}
                        </View>
                        <View style={styles.button}>
                            {props.children}
                        </View>
                        </View>
                    </View>
                </TouchableCmp>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    product: {
        overflow: 'hidden',
        height: 150,
        marginHorizontal: 20,
        marginVertical: 10
    },
    touchable: {
        overflow: 'hidden',
        borderRadius: 10,
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageContainer: {
        width: '40%',
        height: '100%',
        borderRadius: 10,
        overflow: "hidden"
    },
    image: {
        width: '100%',
        height: '100%'
    },
    containerDetails: {
        width: '60%',
        height: '100%',
        flexDirection: 'row',
    },
    details: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '100%',
        width: '70%',
        paddingLeft: 15
    },
    button: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        height: '100%',
        width: '30%',
        paddingRight: 10
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '20%',
        paddingHorizontal: 20
    }
});

export default UserCouponItem;