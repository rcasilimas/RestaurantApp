import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Text, FlatList, StyleSheet, Button, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as orderActions from '../../store/actions/orders';
import * as couponActions from '../../store/actions/coupons';
import CheckoutItem from '../../components/shop/CheckoutItem';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import SpecialCheckoutItem  from '../../components/shop/SpecialCheckoutItem';
import CouponCartItem from '../../components/shop/CouponCartItem';
import TextCheckoutItem from '../../components/shop/TextCheckoutItem';

const CheckoutScreen = props => {
    const dispatch = useDispatch();
    const coupon = useSelector(state => state.coupons.selectedCoupon)
    const couponValue = useSelector(state => state.cart.couponCurrentValue)
    const locationText = useSelector(state => state.cart.location)
    const methodText = useSelector(state => state.cart.method)
    const address = useSelector(state => state.address.address);
    const comments = useSelector(state => state.cart.comments);
    let methodComponent = null;
    let commentsComponent = null;
    const userEmail = useSelector(state => state.auth.email);
    


    if (methodText === 'Carryout') {
        methodComponent = (
            <View>
            <TextCheckoutItem 
                title='Your Order Is:'
                text='Carryout'
            />
            </View>
        )
    } else if (methodText === 'Delivery') {
        methodComponent = (
            <View>
            <TextCheckoutItem 
                title='Your Order Is:'
                text='Delivery'
                />
            <TextCheckoutItem 
                styles={{paddingBottom: 2}}
                title='To This Address:'
                text={address.street}
            />
            <TextCheckoutItem 
                styles={{paddingVertical: 2}}
                title=''
                text={address.city + ' ' + address.zip}
            />
            </View>
        )
    }
    if (comments) {
        commentsComponent = (
            <View style={styles.bottomBorder}>
                <TextCheckoutItem 
                    styles={{paddingBottom: 2}}
                    title='Comments:'
                    text=''
                />
                <TextCheckoutItem 
                    styles={{paddingTop: 2}}
                    title={comments}
                    text=''
                />
            </View>
        )
    } else {
        commentsComponent = (
            <View style={styles.bottomBorder}>
            </View>
        )
    }

    let selectedCoupon = null;
    if (coupon) {
        selectedCoupon = coupon[0];
    }

    const submitHandler = async () => {
        console.log('submitted payment')
        try {
            if(selectedCoupon) {
                if (selectedCoupon.reusable !== true) {
                    await dispatch(couponActions.useCoupon(selectedCoupon.id))
                    dispatch(orderActions.addOrder(cartItems, finalAmount, locationText, methodText, address, comments, selectedCoupon))
                }
                else {
                    console.log('reusable coupon')
                    dispatch(orderActions.addOrder(cartItems, finalAmount, locationText, methodText, address, comments, selectedCoupon))
                }
            }
            else {
                console.log('no coupon')
                dispatch(orderActions.addOrder(cartItems, finalAmount, locationText, methodText, address, comments, selectedCoupon))
            }
        } catch (err) {
            console.log(err.message, 'errorpayment')
            setError(err.message)
        }
        props.navigation.navigate('Categories') 
    }


    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items) {
/*             const options = state.cart.items[key].option2 + state.cart.items[key].option1
            const optionsArray = options.match(/[A-Z][a-z]+/g) */
            const optionsArray = state.cart.items[key].option2.concat(state.cart.items[key].option1)

            transformedCartItems.push({
                cartId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                productImage: state.cart.items[key].productImage,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum,
                options: optionsArray
            });
        }
        return transformedCartItems.sort((a, b) => 
        a.productId > b.productId ? 1 : -1
        );
    });

    const tax = 0.07;
    const taxAmount = Number(cartTotalAmount * tax)
    const finalAmount = Number(taxAmount + cartTotalAmount)

    return (
    <ScrollView style={styles.screen}>
        <Card style={styles.summary}> 
            <TextCheckoutItem 
                title='You Are Ordering From:'
                text={locationText}
            />
            {methodComponent}
            {commentsComponent}
            <FlatList 
                data={cartItems}
                keyExtractor={item => item.cartId} 
                renderItem={itemData => (
                    <CheckoutItem 
                    options={itemData.item.options}
                    quantity={itemData.item.quantity} 
                    title={itemData.item.productTitle}
                    value={itemData.item.sum}
                    />
                )}
            />
            <CouponCartItem 
                title={selectedCoupon ? selectedCoupon.title : null}
                value={selectedCoupon ? couponValue : null}
            />
            <View style={styles.topBorder}>
                <SpecialCheckoutItem 
                    title='Subtotal:'
                    value={cartTotalAmount}
                />
                <SpecialCheckoutItem 
                    title='Tax:'
                    value={taxAmount}
                />
                <SpecialCheckoutItem 
                    title='Final Total:'
                    value={finalAmount}
                />
            </View>
        </Card>
        <View style={styles.paymentContainer}>
            <Button title={'Submit Payment'} color={Colors.accent} onPress={submitHandler} />
        </View>
    </ScrollView>
    )
};

CheckoutScreen.navigationOptions = {
    headerTitle: 'Checkout'
};

const styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    summary: {
        marginBottom: 20,
        padding: 10,
    },
    topBorder: {
        width: '100%',
        paddingTop: 10,
        marginTop: 10,
        borderTopColor: 'black',
        borderTopWidth: 2,
    },
    bottomBorder: {
        width: '100%',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
    paymentContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default CheckoutScreen;