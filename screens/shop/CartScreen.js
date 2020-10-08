import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Text, FlatList, StyleSheet, Button, ActivityIndicator, TextInput, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useSelector, useDispatch } from 'react-redux';

import * as couponActions from '../../store/actions/coupons';
import CouponCartItem from '../../components/shop/CouponCartItem';
import * as addressActions from '../../store/actions/address';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import CartItem from '../../components/shop/CartItem';
import * as cartActions from '../../store/actions/cart';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isComments, setIsComments] = useState('');
    const [isLocation, setIsLocation] = useState('null');
    const [isMethod, setIsMethod] = useState('null');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const coupon = useSelector(state => state.coupons.selectedCoupon)
    const couponValue = useSelector(state => state.cart.couponCurrentValue)

    let selectedCoupon = null;
    if (coupon) {
        selectedCoupon = coupon[0];
    } 
    
    const loadCart = useCallback(async () => {
        try {
            await dispatch(cartActions.updateCart())   
        } catch (err) {
            console.log(err.message, 'error')
            setError(err.message)
        }
    }, [dispatch]);

     useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadCart);
        return () => {
            willFocusSub.remove();
        }
    }, [loadCart]); 

    useEffect(() => {
        loadCart()
    }, [dispatch, loadCart])

    if (error) {
        return <View style={styles.centered}>
           <Text>An Error Occured!</Text>
           <Button title="Try Again!" onPress={loadCart} color={Colors.primary} />
        </View>
    }

    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }


    const locationHandler = (value) => {
        if (value === 'port') {
            setIsLocation('Port-au-Prince');
        } else if (value === 'petion') {
            setIsLocation('Petion-Ville');
        } else {
            setIsLocation('null');
        }
    }

    const deliveryHandler = (value) => {
        if (value === 'delivery') {
            setIsMethod('Delivery');
        } else if (value === 'carryout') {
            setIsMethod('Carryout');
        } else {
            setIsMethod('null');
        }
    }

    const cartTotalAmount = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (const key in state.cart.items) {
           /*  const options = state.cart.items[key].option2.title + state.cart.items[key].option1.title
            const optionsNoSpace = options.replace(/\s+/g, '');
            const optionsArray = optionsNoSpace.match(/[A-Z][a-z]+/g)
            console.log(optionsArray) */
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



   /*  const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount))
        setIsLoading(false);
    }  */

    const checkoutOrderHandler = async () => {
        const updatedComments = isComments;
        const updatedLocation = isLocation;
        const updatedMethod = isMethod;

        if (updatedLocation === 'null') {
            Alert.alert('Missing Location', 'Please select a location', [
                { text: 'Okay' }
            ])
        } else if (updatedMethod === 'null') {
            Alert.alert('Missing Order Method', 'Please select how you want your order', [
                { text: 'Okay' }
            ])
        } else if (updatedMethod === 'Delivery') {
            await dispatch(cartActions.addComments(updatedComments, updatedLocation, updatedMethod))
            await dispatch(addressActions.fetchAddress())
            props.navigation.navigate('Address', {
                location: updatedLocation
            })
        } else {
            await dispatch(cartActions.addComments(updatedComments, updatedLocation, updatedMethod))
            props.navigation.navigate('Checkout') 
        }
    }





    return (
    <ScrollView style={styles.screen}>
        <Card style={styles.summary}> 
            <Text style={styles.summaryText}>Total:{'\u00A0'}   
                <Text style={styles.amount}>${cartTotalAmount.toFixed(2) * 100 / 100}</Text> 
            </Text>
            {isLoading ? <ActivityIndicator size='small' color={Colors.primary} /> : ( <Button 
                color={Colors.accent} 
                title="Checkout" 
                disabled={cartItems.length === 0} 
                onPress={checkoutOrderHandler}
                /> 
            )}
        </Card>
        <View style={styles.form}>
            <Text style={styles.label}>
                    Select Location:
             </Text>
                <RNPickerSelect
            onValueChange={(value) => {
                locationHandler(value)
            }}
            items={[
                { label: 'Port-au-Prince', value: 'port' },
                { label: 'Petion-Ville', value: 'petion' },
            ]}
        />
        </View>
        <View style={styles.form}>
            <Text style={styles.label}>
                    Delivery or Carryout?
             </Text>
                <RNPickerSelect
            onValueChange={(value) => {
                deliveryHandler(value)
            }}
            items={[
                { label: 'Delivery', value: 'delivery' },
                { label: 'Carry Out', value: 'carryout' },
            ]}
        />
            </View>
        <View style={styles.lastForm}>
            <Text style={styles.label}>Comments or Requests</Text>
            <TextInput
                style={styles.input} 
                keyboardType='default'
                autoCorrect
                returnKeyType='next'
                placeholder='Seperate bags, napkins, etc...'
                maxlength={30}
                onChangeText={(value) => {
                    setIsComments(value);
                }}
            />
        </View>
        <FlatList 
        onRefresh={loadCart}
        refreshing={isRefreshing} 
        data={cartItems} 
        keyExtractor={item => item.cartId} 
        renderItem={itemData => (
        <CartItem 
        options={itemData.item.options}
        quantity={itemData.item.quantity} 
        title={itemData.item.productTitle} 
        image={itemData.item.productImage} 
        amount={itemData.item.sum}
        deletable
        onRemove={() => {
            dispatch(cartActions.removeFromCart(itemData.item.cartId));
            loadCart();
             }} 
        />
        )}
        />
        <CouponCartItem
        deletable
        title={selectedCoupon ? selectedCoupon.title : null}
        value={selectedCoupon ? couponValue : null}
        onRemove={() => {
            console.log('remove Coupon')
            dispatch(couponActions.removeCoupon());
            loadCart();
        }}
        />
    </ScrollView>
    )
};

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
};

const styles = StyleSheet.create({
    screen: {
        margin: 20,
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 5,
        fontSize: 18
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginBottom: 20,
        padding: 10,
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
    },
    amount: {
        color: Colors.primary
    },
    form: {
        width: '100%',
        marginBottom: 20
    },
    lastForm: {
        width: '100%',
        paddingBottom: 10,
        marginBottom: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    }
});

export default CartScreen;