import React, { useState, useEffect, useCallback }  from 'react';
import { View, Text, FlatList, Platform, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import UserProductItem from '../../components/shop/UserProductItem';
import Colors from '../../constants/Colors';
import * as productsActions from '../../store/actions/products';

const UserProductsScreen = props => {
    const categoryId = props.navigation.getParam('categoryId');
    const products = useSelector(state => state.products.allProducts)
    const dispatch = useDispatch();
    const categoryProducts = products.filter(prod => prod.categoryId == categoryId);
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();

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


    const editProductHandler = (id, categoryId) => {
        props.navigation.navigate('EditProduct', {
            productId: id,
            categoryId: categoryId
        });
    }

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(productsActions.deleteProduct(id));
            }}
        ])
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
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No products found, maybe start creating some?</Text>
        </View>
    } 

    const toggleHandled = (productId, available) => {
        Alert.alert('Are you sure?', 'Do you really want to disable/enable this item?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(productsActions.toggleProduct(productId, !available))
                loadProducts()
            }}
        ])
        
    }

    return (
    <FlatList 
    onRefresh={loadProducts}
    refreshing={isRefreshing}
    data={categoryProducts}  
    keyExtractor={item => item.id} 
    renderItem={itemData => (
        <UserProductItem 
        productId={itemData.item.id}
        enabled={itemData.item.available}
        toggleHandler={toggleHandled}
        image={itemData.item.imageUrl} 
        title={itemData.item.title} 
        price={itemData.item.price} 
        onSelect={() => {
            editProductHandler(itemData.item.id, categoryId);
        }}>
            <Button 
            color={Colors.primary} 
            title="Delete" 
            onPress={deleteHandler.bind(this, itemData.item.id)} 
            />
            
        </UserProductItem>
        )} 
    />)
}

UserProductsScreen.navigationOptions = navData => {
    const categoryId = navData.navigation.getParam('categoryId');
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
            title='Add' 
            iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create' } 
            onPress={() => {
                navData.navigation.navigate('EditProduct', {
                    categoryId: categoryId
                });
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
    }
})

export default UserProductsScreen;