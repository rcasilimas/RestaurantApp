import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Text, Button, Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';

import ProductItem from '../../components/shop/ProductItem';
import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => { 
    const categoryId = props.navigation.getParam('categoryId');
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();
    const categoryProducts = products.filter(prod => prod.categoryId == categoryId);

    
    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productsActions.fetchProducts())
        } catch (err) {
            setError(err.message)
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
        return () => {
            willFocusSub.remove();
        }
    }, [loadProducts]);

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {
            setIsLoading(false);
        })
    }, [dispatch, loadProducts])

    const selectItemHandler = (id, title, categoryId) => {
        props.navigation.navigate('ProductDetail', 
            { 
                productId: id,
                productTitle: title,
                categoryId
            });
    }

    if (error) {
        return <View style={styles.centered}>
           <Text>An Error Occured!</Text>
           <Button title="Try Again!" onPress={loadProducts} color={Color.primary} />
        </View>
    }

    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    if (!isLoading && categoryProducts.length === 0) {
        return <View style={styles.emptyContainer}>
        <Ionicons 
            name={Platform.OS === 'android' ? 'md-sad' : 'ios-sad'}
            size={72}
            color='black'
            />
        <Text style={styles.titleText}>No Products Found.</Text>
        <Text style={styles.titleText}>Maybe You Are Not Connected To The Internet</Text>
    </View>
    }

    
    

    return ( 
        <FlatList 
        onRefresh={loadProducts}
        refreshing={isRefreshing}
        data={categoryProducts} 
        keyExtractor={item => item.id}
        renderItem={itemData => ( 
        <ProductItem 
            image={itemData.item.imageUrl} 
            title={itemData.item.title} 
            price={itemData.item.price} 
            onSelect={() => {
                selectItemHandler(itemData.item.id, itemData.item.title, itemData.item.categoryId)
            }}
            >
                {/* <Button 
                color={Colors.primary} 
                title="View Details" 
                onPress={() => {
                    selectItemHandler(itemData.item.id, itemData.item.title)
                }} /> */}
               {/*  <Button 
                color={Colors.primary} 
                title="To Cart" 
                onPress={() => {
                    dispatch(cartActions.addToCart(itemData.item))
                }} 
                /> */}
            </ProductItem>
        )}
        />
    );
};

ProductsOverviewScreen.navigationOptions = navData => {
    return {
    headerTitle: navData.navigation.getParam('categoryTitle'),
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
    headerRight: ( 
    <HeaderButtons HeaderButtonComponent={HeaderButton} >
        <Item 
        title='Cart' 
        iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart' } 
        onPress={() => {
            navData.navigation.navigate('Cart')
        }} />
    </HeaderButtons>
        )
    }
}

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

export default ProductsOverviewScreen;