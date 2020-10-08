import React, { useEffect, useState } from 'react';
import { FlatList, Text, Platform, ActivityIndicator, View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import OrderItem from '../../components/shop/OrderItem';
import * as ordersActions from '../../store/actions/orders';
import Colors from '../../constants/Colors';

const AdminOrderScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.allOrders);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        dispatch(ordersActions.fetchAllOrders()).then(() => {
            setIsLoading(false);
        });
    }, [dispatch])

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    if (orders.length === 0) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No Customer Orders Found.</Text>
        </View>
    }

    return (
    <FlatList 
    data={orders} 
    keyExtractor={item => item.id} 
    renderItem={itemData => 
    <OrderItem
        userId={itemData.item.userId}
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

AdminOrderScreen.navigationOptions = navData => {
    return {
    headerTitle: 'All Orders',
    /* headerLeft: (
        <HeaderButtons HeaderButtonComponent={HeaderButton} >
            <Item 
            title='Menu' 
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu' } 
            onPress={() => {
                navData.navigation.toggleDrawer();
            }} />
        </HeaderButtons>
    ), */
    };
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AdminOrderScreen;