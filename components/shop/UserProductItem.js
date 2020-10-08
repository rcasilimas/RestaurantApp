import React from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';

import Card from '../UI/Card';
import Colors from '../../constants/Colors';

const UserProductItem = props => {
    let toggleComponent = null;

    let TouchableCmp = TouchableOpacity;

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    
    if (props.enabled) {
        toggleComponent = (
            <View style={styles.toggleButton}>
                <Button 
                color={Colors.primary} 
                title="Disable" 
                onPress={() => {
                    props.toggleHandler(props.productId, props.enabled)
                }} 
                />
            </View>
        )
        return (
            <Card style={styles.product}>
                <View style ={styles.touchable}>
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
                            </View>
                            <View style={styles.button}>
                                {toggleComponent}
                                {props.children}
                            </View>
                            </View>
                        </View>
                    </TouchableCmp>
                </View>
            </Card>
        )
    } else {
        toggleComponent = (
            <View style={styles.toggleButton}>
                <Button 
                color={Colors.primary} 
                title="Enable" 
                onPress={() => {
                    props.toggleHandler(props.productId, props.enabled)
                }} 
                />
            </View>
        )
        return (
            <Card style={styles.productDisabled}>
                <View style ={styles.touchable}>
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
                            </View>
                            <View style={styles.button}>
                                {toggleComponent}
                                {props.children}
                            </View>
                            </View>
                        </View>
                    </TouchableCmp>
                </View>
            </Card>
        )
    }

   /*  return (
        <Card style={styles.product}>
            <View style ={styles.touchable}>
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
                        </View>
                        <View style={styles.button}>
                            {toggleComponent}
                            {props.children}
                        </View>
                        </View>
                    </View>
                </TouchableCmp>
            </View>
        </Card>
    ) */
}

const styles = StyleSheet.create({
    product: {
        overflow: 'hidden',
        height: 150,
        marginHorizontal: 20,
        marginVertical: 10
    },
    productDisabled: {
        overflow: 'hidden',
        height: 150,
        margin: 20,
        backgroundColor: 'dimgray',
        opacity: 0.5
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
    toggleButton: {
        marginVertical: 10
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

export default UserProductItem;