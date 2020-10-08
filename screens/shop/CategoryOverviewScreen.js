import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Platform, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CategoryItem from '../../components/shop/CategoryItem';
// import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';
// import Colors from '../../constants/Colors';


const CategoryOverviewScreen = props => { 
    const categories = useSelector(state => state.categories.availableCategories);
    const dispatch = useDispatch();



    const selectItemHandler = async (id, title) => {
        if (id === 'CYOP') {
            await dispatch(productsActions.fetchProducts())
            props.navigation.navigate('ProductDetail', 
                { 
                    productId: '-Lz99OxU4umTDFdMMMIw',
                    productTitle: "Create Your Own Pizza",
                    categoryId: id
                });
        } else {    
        props.navigation.navigate('ProductsOverView', 
            { 
                categoryId: id,
                categoryTitle: title
            }); 
        }
    }
    

    return ( 
        <FlatList 
        data={categories} 
        keyExtractor={item => item.id}
        renderItem={itemData => ( 
        <CategoryItem 
            image={itemData.item.imageUrl} 
            title={itemData.item.title}
            onSelect={() => {
                selectItemHandler(itemData.item.categoryId, itemData.item.title)
            }}
            >
            </CategoryItem>
        )}
        />
    );
};

CategoryOverviewScreen.navigationOptions = navData => {
    return {
    headerTitle: 'Menu',
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
    }
})

export default CategoryOverviewScreen;