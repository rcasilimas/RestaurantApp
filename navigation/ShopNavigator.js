import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import MapScreen from '../components/UI/MapScreen';
import CheckoutScreen from '../screens/shop/CheckoutScreen';
import CouponScreen from '../screens/shop/CouponScreen';
import AddressScreen from '../screens/shop/AddressScreen';
import CategoryOverviewScreen from '../screens/shop/CategoryOverviewScreen';
import ProductsOverViewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import AboutScreen from '../screens/shop/AboutScreen';
import Colors from '../constants/Colors';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import * as authActions from '../store/actions/auth';
import ForgotPasswordScreen from '../screens/user/ForgotPasswordScreen';

const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
}


const OrdersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
        <Ionicons name={Platform.OS === 'android' ? 'md-list' : 'ios-list'} 
        size={23}
        color={drawerConfig.tintColor}
        />
        )
    },
    defaultNavigationOptions: defaultNavOptions
}
)

const AboutNavigator = createStackNavigator({
    About: AboutScreen,
    Maps: MapScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
        <Ionicons name={Platform.OS === 'android' ? 'md-globe' : 'ios-globe'} 
        size={23}
        color={drawerConfig.tintColor}
        />
        )
    },
    defaultNavigationOptions: defaultNavOptions
}
)

const CouponNavigator = createStackNavigator({
    Coupons: CouponScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
        <Ionicons name={Platform.OS === 'android' ? 'md-globe' : 'ios-globe'} 
        size={23}
        color={drawerConfig.tintColor}
        />
        )
    },
    defaultNavigationOptions: defaultNavOptions
}
)

/* const AdminNavigator = createStackNavigator({
    UserCategories: UserCategoryScreen,
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
        <Ionicons name={Platform.OS === 'android' ? 'md-create' : 'ios-create'} 
        size={23}
        color={drawerConfig.tintColor}
        />
        )
    },
    defaultNavigationOptions: defaultNavOptions
}
) */

const CategoryNavigator = createStackNavigator({
    Categories: CategoryOverviewScreen,
    ProductsOverView: ProductsOverViewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen,
    Address: AddressScreen,
    Checkout: CheckoutScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
        <Ionicons name={Platform.OS === 'android' ? 'md-globe' : 'ios-globe'} 
        size={23}
        color={drawerConfig.tintColor}
        />
        )
    },
    defaultNavigationOptions: defaultNavOptions
}
)

const ShopNavigator = createDrawerNavigator({
    // Products: ProductsNavigator,
    Menu: CategoryNavigator,
    Orders: OrdersNavigator,
    Coupons: CouponNavigator,
    About: AboutNavigator,
    // Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return <View style={{flex: 1, paddingTop: 20}}>
            <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                <DrawerNavigatorItems {...props} />
                <Button title="Logout" color={Colors.primary} onPress={() => {
                    dispatch(authActions.logout());
                   // props.navigation.navigate('Auth');
                }} />
            </SafeAreaView>
        </View>
    }
}
)

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen,
    Password: ForgotPasswordScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen, 
    Auth: AuthNavigator,
    Shop: ShopNavigator
})

export default createAppContainer(MainNavigator);