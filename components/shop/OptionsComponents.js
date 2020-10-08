import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import * as allToppings from '../../data/Toppings';
import * as allItems from '../../data/Items';
import SelectItem from '../shop/SelectItem'
import SelectTopping from '../shop/SelectTopping';

export const pizzaComponent = () => {
    return (
    <View>
                <View style={styles.titleContainer} >
                    <Text style={styles.title} >Choose A Size</Text>
                </View>
                <FlatList 
                    numColumns={3}
                    data={allItems.pizzaSizes} 
                    keyExtractor={item => item.id}
                    renderItem={itemData => ( 
                            <SelectItem
                                selectedItem={selectedItem}
                                onSelectItem={selectItem}
                                onUnselectItem={unselectItem}
                                item={itemData.item}
                                >
                            </SelectItem>
                )}
                />
                <View style={styles.titleContainer} >
                    <Text style={styles.title} >Any Toppings?</Text>
                </View>
                <FlatList 
                    numColumns={3}
                    data={allToppings.pizzaToppings} 
                    keyExtractor={item => item.id}
                    renderItem={itemData => ( 
                            <SelectTopping
                                onSelect={selectTopping}
                                onUnselect={unselectTopping}
                                topping={itemData.item}
                                >
                            </SelectTopping>
                )}
                /> 
            </View>
)
}

const styles = StyleSheet.create({
    titleContainer: {
        marginVertical: 15
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        textAlign: 'left',
        marginLeft: 10
    }
})