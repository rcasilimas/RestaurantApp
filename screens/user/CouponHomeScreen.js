import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Button, Platform, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import UserCouponItem from '../../components/shop/UserCouponItem';
import * as couponActions from '../../store/actions/coupons';
import HeaderButton from '../../components/UI/HeaderButton';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

const CouponHomeScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const coupons = useSelector(state => state.coupons.allCoupons);
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
        return <View style={styles.screen}>
        <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient2} >
                <Card style={styles.couponContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Create A New Coupon</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button 
                        title={'Discount After Minimum Spending'}
                        color={Colors.accent} 
                        onPress={() => {
                            props.navigation.navigate('DiscountCoupon')
                        }}  
                        />
                            </View>
                    <View style={styles.buttonContainer}>
                        <Button 
                        title={'% Percentage Discount'}
                        color={Colors.accent} 
                        onPress={() => {
                            props.navigation.navigate('PercentCoupon')
                        }}  
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button 
                        title={'Category Coupons'}
                        color={Colors.accent} 
                        onPress={() => {
                            props.navigation.navigate('CategoryCoupon')
                        }}  
                        />
                    </View>
                </Card>
        </LinearGradient>
    </View>
    } 

    const deleteCouponHandler = (couponId) => {
        Alert.alert(
            'Delete Coupon!',
            'Are you sure you want to delete this coupon?',
            [{text: 'Cancel', onPress: () => {
                console.log('no')
            }}, 
            {text: 'Yes', onPress: () => {
                dispatch(couponActions.deleteCoupon(couponId))
            }}]
        )
    }

    return (
    <View style={styles.screen}>
        <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient} >
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>
                <View style={styles.listContainer}>
                    <FlatList 
                    onRefresh={loadCoupons}
                    refreshing={isRefreshing}
                    data={coupons} 
                    keyExtractor={coupon => coupon.id}
                    renderItem={itemData => ( 
                    <UserCouponItem 
                        image={itemData.item.imageUrl} 
                        title={itemData.item.title} 
                        date={itemData.item.date}
                        onSelect={() => {
                            console.log(itemData.item.title)
                        }}
                        > 
                           <Button 
                            color={Colors.primary} 
                            title="Delete" 
                            onPress={() => {
                                deleteCouponHandler(itemData.item.id)
                                } 
                             }/>
                    </UserCouponItem>
                    )}
                    />
                </View>
                <Card style={styles.couponContainer}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Create A New Coupon</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button 
                        title={'Discount After Minimum Spending'}
                        color={Colors.accent} 
                        onPress={() => {
                            props.navigation.navigate('DiscountCoupon')
                        }}  
                        />
                            </View>
                    <View style={styles.buttonContainer}>
                        <Button 
                        title={'% Percentage Discount'}
                        color={Colors.accent} 
                        onPress={() => {
                            props.navigation.navigate('PercentCoupon')
                        }}  
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button 
                        title={'Category Coupons'}
                        color={Colors.accent} 
                        onPress={() => {
                            props.navigation.navigate('CategoryCoupon')
                        }}  
                        />
                    </View>
                </Card>
                </View>
                </ScrollView>
        </LinearGradient>
    </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    /* scrollView: {
        width: '100%',
    }, */
    gradient: {
        flex: 1,
    },
    gradient2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listContainer: {
        width: '100%'
    },
    couponContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20,
        margin: 10
    },
    buttonContainer: {
        marginTop: 25
    },
    titleContainer: {
        width: '100%'
    },
    title: {
        textAlign: 'center',
        fontFamily: 'open-sans-bold',
        fontSize: 24
    }

})

CouponHomeScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Coupons',
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
    }
}


export default CouponHomeScreen;