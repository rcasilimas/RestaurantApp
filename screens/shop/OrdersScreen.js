import React, { useEffect, useState } from 'react';
import { FlatList, Text, Platform, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        dispatch(ordersActions.fetchOrders()).then(() => {
            setIsLoading(false);
        });
    }, [dispatch])

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    if (orders.length === 0) {
        return <View style={styles.emptyContainer}>
        <Ionicons 
            name={Platform.OS === 'android' ? 'md-thumbs-down' : 'ios-thumbs-down'}
            size={72}
            color='black'
            />
        <Text style={styles.titleText}>No Orders Found.</Text>
        <Text style={styles.titleText}>Maybe You Should Order Something?</Text>
    </View>
    }

    return (
    <FlatList 
    data={orders} 
    keyExtractor={item => item.id} 
    renderItem={itemData => 
    <OrderItem
        comments={itemData.item.comment}
        address={itemData.item.address}
        coupon={itemData.item.coupon}
        location={itemData.item.location}
        method={itemData.item.method}
        amount={itemData.item.totalAmount} 
        date={itemData.item.date}
        items={itemData.item.items} 
    />}
    />
    )
}

OrdersScreen.navigationOptions = navData => {
    return {
    headerTitle: 'Your Orders',
    headerLeft: (
        <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item 
            title='Menu' 
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu' } 
            onPress={() => {
                navData.navigation.toggleDrawer();
            }} />
        </HeaderButtons>
    ),
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyContainer: {
        flex: 1,
        margin: 20,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
            fontSize: 32,
            textAlign: 'center',
            fontFamily: 'open-sans-bold',
    }
})

export default OrdersScreen;