import React from 'react';
import { View, Text, FlatList, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import HeaderButton from '../../components/UI/HeaderButton';
import CategoryItem from '../../components/shop/CategoryItem';

const UserCategoryScreen = props => {
    const categories = useSelector(state => state.categories.availableCategories)
    const products = useSelector(state => state.products.availableProducts);

    if (categories.length === 0) {
        return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>No products found, maybe start creating some?</Text>
        </View>
    }

    const selectCategoryHandler = (id, title) => {
        props.navigation.navigate('UserProducts', 
            { 
                categoryId: id,
                categoryTitle: title
            });
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
            selectCategoryHandler(itemData.item.categoryId, itemData.item.title);
        }}>
        </CategoryItem>
        )} 
    />)
}

UserCategoryScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Choose A Category',
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
        /* headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item 
                title='Add' 
                iconName={Platform.OS === 'android' ? 'md-create' : 'ios-create' } 
                onPress={() => {
                    navData.navigation.navigate('EditProduct');
                }} />
            </HeaderButtons>
        )      */
    }
}

export default UserCategoryScreen;