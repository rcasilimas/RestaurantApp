import React, { useState, useEffect, useCallback } from 'react';
import {  View, Text, Button, Platform, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import HeaderButton from '../../components/UI/HeaderButton';
import UserCouponItem from '../../components/shop/UserCouponItem';
import * as couponActions from '../../store/actions/coupons';
import Colors from '../../constants/Colors';

const CouponScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const coupons = useSelector(state => state.coupons.userCoupons);
    const dispatch = useDispatch();
    


    const loadCoupons = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(couponActions.fetchCoupons())
        } catch (err) {
            setError(err.message)
            console.log(err.message)
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadCoupons);
        return () => {
            willFocusSub.remove();
        }
    }, [loadCoupons]);

    useEffect(() => {
        setIsLoading(true);
        loadCoupons().then(() => {
            setIsLoading(false);
        })
    }, [dispatch, loadCoupons])

    if (error) {
        return <View style={styles.centered}>
           <Text>An Error Occured!</Text>
           <Button title="Try Again!" onPress={loadCoupons} color={Colors.primary} />
        </View>
    }

    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

     if (!isLoading && coupons.length === 0) {
        return <View style={styles.emptyContainer}>
                    <Ionicons 
                        name={Platform.OS === 'android' ? 'md-sad' : 'ios-sad'}
                        size={72}
                        color='black'
                        />
                    <Text style={styles.titleText}>No Coupons Available At The Moment.</Text>
                    <Text style={styles.titleText}>Try Again Later!</Text>
                </View>
    } 

   const selectCouponHandler = (couponId, title) => {
    Alert.alert(
        'Your Coupon Is Selected',
        title,
        [ {text: 'Ok', onPress: async () => {
            await dispatch(couponActions.selectCoupon(couponId))
            props.navigation.navigate('Categories')
        }}]
    )
   }
    
    return (
        <View style={styles.screen}>
            <View style={styles.titleContainer}>
                <Ionicons 
                    name={Platform.OS === 'android' ? 'md-gift' : 'ios-gift'}
                    size={48}
                    color='black'
                    />
                <Text style={styles.titleText}>Coupons!</Text>
                <Ionicons 
                    name={Platform.OS === 'android' ? 'md-gift' : 'ios-gift'}
                    size={48}
                    color='black'
                    />
            </View>
            <FlatList 
                    onRefresh={loadCoupons}
                    refreshing={isRefreshing}
                    data={coupons} 
                    keyExtractor={coupon => coupon.id}
                    renderItem={itemData => ( 
                    <UserCouponItem 
                        image={itemData.item.imageUrl} 
                        title={itemData.item.title} 
                        onSelect={() => {
                            console.log(itemData.item.title)
                        }}
                        > 
                           <Button 
                            color={Colors.primary} 
                            title="Select" 
                            onPress={() => {
                                selectCouponHandler(itemData.item.id, itemData.item.title)
                            }} 
                            />
                    </UserCouponItem>
                    )}
                    />
        </View>
    )
}


CouponScreen.navigationOptions = navData => {
    return {
    headerTitle: 'Coupons',
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
    screen: {
        flex: 1
    },
    titleContainer: {
        flexDirection: 'row',
        height: '20%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    titleText: {
        fontSize: 32,
        textAlign: 'center',
        fontFamily: 'open-sans-bold',
    },
    emptyContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    }
})

export default CouponScreen;