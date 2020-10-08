import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import SpecialCheckoutItem from './SpecialCheckoutItem';
import TextCheckoutItem from './TextCheckoutItem';
import CouponCartItem from './CouponCartItem';
import CheckoutItem from './CheckoutItem';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const OrderItem = props => {
    const [showDetails, setShowDetails] = useState(false);
    const methodText = props.method
    const locationText = props.location
    const comments = props.comments
    const address = props.address
    let methodComponent = null;
    let commentsComponent = null;
    let userIdComponent = null;

    if (props.userId) {
        userIdComponent = (
            <Text style={styles.totalAmount}>{props.userId}</Text>
        )
    }

    if (methodText === 'Carryout') {
        methodComponent = (
            <View>
            <TextCheckoutItem 
                styles={{paddingBottom: 2}}
                title='Your Order Was:'
                text='Carryout'
            />
            </View>
        )
    } else if (methodText === 'Delivery') {
        methodComponent = (
            <View>
            <TextCheckoutItem 
                title='Your Order Was:'
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

    let subtotal = 0;
    for (const key in props.items) {
        subtotal = subtotal + props.items[key].sum
    }
    let tax = props.amount - subtotal
    const newDate = new Date(props.date);
    console.log(newDate);

    return (
    <Card style={styles.orderItem} >
        <View style={styles.summary} >
            <Text style={styles.totalAmount}>${props.amount.toFixed(2)}</Text>
            {userIdComponent}
            <Text style={styles.date}>{props.date}</Text>
        </View>
        <Button 
        color={Colors.primary} 
        title={showDetails ? 'Hide Details' : "Show Details"} 
        onPress={() => {
            setShowDetails(prevState => !prevState)
        }} />
        {showDetails && <View style={styles.detailItems}>
            <TextCheckoutItem 
                title='Your Order Was From:'
                text={locationText}
            />
            {methodComponent}
            {commentsComponent}
             {props.items.map(cartItem => 
             <CheckoutItem 
             key={cartItem.cartId}
             options={cartItem.options}
             quantity={cartItem.quantity} 
             title={cartItem.productTitle}
             value={cartItem.sum}
             />)}
             <CouponCartItem 
                title={props.coupon ? props.coupon.title : null}
            />
            <View style={styles.topBorder}>
                <SpecialCheckoutItem 
                    title='Subtotal:'
                    value={subtotal}
                />
                <SpecialCheckoutItem 
                    title='Tax:'
                    value={tax}
                />
                <SpecialCheckoutItem 
                    title='Final Total:'
                    value={props.amount}
                />
            </View>
         </View>}
    </Card>
    )
};

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        fontFamily: 'open-sans',
        color: '#888'
    },
    detailItems: {
        width: '100%'
    },
    bottomBorder: {
        width: '100%',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },
    topBorder: {
        width: '100%',
        paddingTop: 10,
        marginTop: 10,
        borderTopColor: 'black',
        borderTopWidth: 2,
    },
})

export default OrderItem;