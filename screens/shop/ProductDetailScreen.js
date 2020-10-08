import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Button, Platform, FlatList, TouchableOpacity, TouchableNativeFeedback, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import SelectItem from '../../components/shop/SelectItem';
import SelectTopping from '../../components/shop/SelectTopping';
import Colors from '../../constants/Colors';
import HeaderButton from '../../components/UI/HeaderButton';
import * as cartActions from '../../store/actions/cart';

const ProductDetailScreen = props => {
    const saladDressings = [
        {
            id: '1',
            title: 'House Dressing',
            price: 0
        },
        {
            id: '2',
            title: 'Ranch',
            price: 0
        },
        {
            id: '3',
            title: 'Caesar',
            price: 0
        },
        {
            id: '4',
            title: 'Thousand Island',
            price: 0
        },
        {
            id: '5',
            title: 'No Dressing',
            price: 0
        },
    ]

    const wingStyles = [
        {
            id: '1',
            title: 'Baked',
            price: 0
        },
        {
            id: '2',
            title: 'Grilled',
            price: 0
        },
        {
            id: '3',
            title: 'Fried',
            price: 0
        }
    ]

    const burgerToppings = [
        {
            id: '1',
            title: 'Lettuce',
            price: 0
        },
        {
            id: '2',
            title: 'Tomato',
            price: 0
        },
        {
            id: '3',
            title: 'Onion',
            price: 0
        },
        {
            id: '4',
            title: 'Mayonaise',
            price: 0
        },
        {
            id: '5',
            title: 'Mustard',
            price: 0
        },
        {
            id: '6',
            title: 'Ketchup',
            price: 0
        },
        {
            id: '7',
            title: 'Cheese',
            price: 50
        },
        {
            id: '8',
            title: 'Bacon',
            price: 50
        },
        {
            id: '9',
            title: 'Sauteed Mushrooms',
            price: 50
        },
        {
            id: '10',
            title: 'Sauteed Onions',
            price: 50
        },
        {
            id: '11',
            title: 'Jalapenos',
            price: 50
        },
        {
            id: '12',
            title: 'Side Of Fries',
            price: 125
        },
    ]

    const entreeSides = [
        {
            id: '1',
            title: 'Fried Plantains',
            price: 0
        },
        {
            id: '2',
            title: 'French Fries',
            price: 0
        },
        {
            id: '3',
            title: 'Sauteed Potatoes',
            price: 0
        },
        {
            id: '4',
            title: 'Sweet Potato Fries',
            price: 0
        },
        {
            id: '5',
            title: 'House Salad',
            price: 0
        },
        {
            id: '6',
            title: 'White Rice',
            price: 0
        },
        {
            id: '7',
            title: 'Rice And Beans',
            price: 0
        },
        {
            id: '8',
            title: 'Steamed Veggies',
            price: 0
        },
        {
            id: '8',
            title: 'No Side',
            price: 0
        },
    ]


    const pizzaCrust = [
        {
            id: '4',
            title: 'Original',
            price: 0
        },
        {
            id: '5',
            title: 'Thin Crust',
            price: 0
        },
    ]

    const pizzaCheeses = [
        {
            id: '6',
            title: 'American',
            price: 0
        },
        {
            id: '7',
            title: 'Mozzarella',
            price: 0
        },
        {
            id: '8',
            title: 'Both',
            price: 0
        }
    ]

    const pizzaSizes = [
        {
            id: '1',
            title: 'Small',
            price: 0
        },
        {
            id: '2',
            title: 'Medium',
            price: 250
        },
        {
            id: '3',
            title: 'Large',
            price: 425
        }
    ]

    const pizzaToppings = [
        {
            id: '9',
            title: 'Ham',
            price: 50
        },
        {
            id: '10',
            title: 'Green Peppers',
            price: 50
        },
        {
            id: '11',
            title: 'Fried Pork',
            price: 50
        },
        {
            id: '12',
            title: 'Beef',
            price: 50
        },
        {
            id: '13',
            title: 'Mushrooms',
            price: 50
        },
        {
            id: '14',
            title: 'Black Olives',
            price: 50
        },
        {
            id: '15',
            title: 'Tomatoes',
            price: 50
        },
        {
            id: '16',
            title: 'Pepperoni',
            price: 50
        },
        {
            id: '17',
            title: 'Bacon',
            price: 50
        },
        {
            id: '18',
            title: 'Pineapple',
            price: 50
        },
        {
            id: '19',
            title: 'Green Olives',
            price: 50
        },
        {
            id: '20',
            title: 'Chicken',
            price: 50
        },
        {
            id: '21',
            title: 'Onion',
            price: 50
        },
        {
            id: '22',
            title: 'Anchovies',
            price: 200
        },
        {
            id: '23',
            title: 'Shrimp',
            price: 200
        },
        {
            id: '24',
            title: 'Conch',
            price: 200
        },
        {
            id: '25',
            title: 'Lobster',
            price: 200
        },
    ]

    const categoryId = props.navigation.getParam('categoryId');
    const prodTitle = props.navigation.getParam('productTitle');
    const [isOption1, setIsOption1] = useState([]);   
    const [isOption2, setIsOption2] = useState([]);
    const [isValid, setIsValid] = useState(false);
    const [isValidCrust, setIsValidCrust] = useState(false);
    const [isValidCheese, setIsValidCheese] = useState(false);
    const [isCrust, setIsCrust] = useState();
    const [isCheese, setIsCheese] = useState();
    let optionsComponent = null;
    let selectedItem;
    if (isOption2[0]) {
        selectedItem = isOption2[0];
    }  
    let TouchableCmp = TouchableOpacity;
    let cartButton;
    const productId = props.navigation.getParam('productId');
    const selectedProduct = useSelector(state => 
        state.products.availableProducts.find(prod => 
        prod.id === productId));
    const totalProduct = {
        selectedProduct,
        option1: isOption1,
        option2: isOption2
    }
    const dispatch = useDispatch()  

    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }

    const noOptions = useCallback(() => {
        setIsValidCheese(true)
        setIsValidCrust(true)
        setIsValid(true);
    }, [categoryId])

    const notPizzaOptions = useCallback(() => {
        setIsValidCheese(true)
        setIsValidCrust(true)
    }, [categoryId])

    useEffect(() => {
        if (categoryId === 'Salads') {
            notPizzaOptions();
        } else if (categoryId === 'Wings') {
            notPizzaOptions();
        } else if (categoryId === 'Burgers') {
            noOptions();
        } else if (categoryId === 'Seafood') {
            notPizzaOptions();
        } else if (categoryId === 'Meat') {
            notPizzaOptions();
        } else if (categoryId === 'Specialty Pizzas') {
            notPizzaOptions();
        } else if (categoryId === 'CYOP') {
            console.log('cyop')
        } else {
            noOptions();
        } 
    }, []);


        if (categoryId === 'Salads') {
            optionsComponent = (
                <View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Choose A Dressing</Text>
                </View>
                <FlatList 
                    numColumns={3}
                    data={saladDressings} 
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
                </View>
            )
            } else if (categoryId === 'Wings') {
                optionsComponent = (
                    <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>How Do You Want Them Cooked?</Text>
                    </View>
                    <FlatList 
                        numColumns={3}
                        data={wingStyles} 
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
                    </View>
                )
            } else if (categoryId === 'Burgers') {
                optionsComponent = (
                    <View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Any Toppings?</Text>
                        </View>
                        <FlatList 
                            numColumns={3}
                            data={burgerToppings} 
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
            } else if (categoryId === 'Seafood') {
                optionsComponent = (
                    <View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Choose A Side</Text>
                        </View>
                        <FlatList 
                            numColumns={3}
                            data={entreeSides} 
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
                    </View>
                )
            } else if (categoryId === 'Meat') {
                optionsComponent = (
                    <View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Choose A Side</Text>
                        </View>
                        <FlatList 
                            numColumns={3}
                            data={entreeSides} 
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
                    </View>
                )
            } else if (categoryId === 'CYOP') {
                optionsComponent = (
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Choose A Size</Text>
                    </View>
                    <FlatList 
                        numColumns={3}
                        data={pizzaSizes} 
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
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>How Do You Want Your Crust?</Text>
                    </View>
                    <FlatList 
                        numColumns={3}
                        data={pizzaCrust} 
                        keyExtractor={item => item.id}
                        renderItem={itemData => ( 
                                <SelectItem
                                selectedItem={isCrust}
                                onSelectItem={selectCrust}
                                onUnselectItem={unselectCrust}
                                item={itemData.item}
                                >
                                </SelectItem>
                    )}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>What Cheese Would You Like?</Text>
                    </View>
                    <FlatList 
                        numColumns={3}
                        data={pizzaCheeses} 
                        keyExtractor={item => item.id}
                        renderItem={itemData => ( 
                                <SelectItem
                                selectedItem={isCheese}
                                onSelectItem={selectCheese}
                                onUnselectItem={unselectCheese}
                                item={itemData.item}
                                >
                                </SelectItem>
                    )}
                    />
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Any Toppings?</Text>
                    </View>
                    <FlatList 
                        numColumns={3}
                        data={pizzaToppings} 
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
        } else if (categoryId === 'Specialty Pizzas') {
            optionsComponent = (
                <View>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Choose A Size</Text>
                </View>
                <FlatList 
                    numColumns={3}
                    data={pizzaSizes} 
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
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Any Additional Toppings?</Text>
                </View>
                <FlatList 
                    numColumns={3}
                    data={pizzaToppings} 
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
        } else {
            optionsComponent = null;
        } 




    

    if (!isValid || !isValidCheese || !isValidCrust) {
        cartButton = (
        <Button disabled color={Colors.primary} title="Add to Cart" onPress={() => {
            dispatch(cartActions.addToCart(totalProduct))
        }} />
        )
    } else if (isValid && isValidCrust && isValidCheese) {
        cartButton = (
            <Button color={Colors.primary} title="Add to Cart" onPress={async () => {
                await dispatch(cartActions.addToCart(totalProduct))
                Alert.alert(prodTitle, 'Added To Cart', [{text: 'Ok', onPress: async () => {
                    props.navigation.goBack();
                }}])
            }} />
        )
    }

    

    const selectItem = (item) => {
        let newItem;
        newItem = item;
        setIsOption2([newItem])
        setIsValid(true)
    }

    const unselectItem = () => {
        setIsOption2([])
        setIsValid(false)
    }
     
       const selectTopping = (topping) => {
        let newTopping;
        newTopping = topping;
        setIsOption1([...isOption1, newTopping])
      }

      const unselectTopping = (topping) => {
          let removeTopping;
          removeTopping = topping;
          updatedToppings = [...isOption1];
          const finalToppings = updatedToppings.filter(item => item.id !== removeTopping.id);
          setIsOption1(finalToppings)
      }

      const selectCrust = (crust) => {
          let selectedCrust;
          selectedCrust = crust;
          setIsCrust(selectedCrust)
          setIsValidCrust(true)
          const newArray = isOption1.filter(item => item.id !== '4')
          const newArray2 = newArray.filter(item => item.id !== '5')
          newArray2.unshift(selectedCrust)
          setIsOption1(newArray2)
      }
      const unselectCrust = () => {
        setIsValidCrust(false)
        setIsCrust('')
        const newArray = isOption1.filter(item => item.id !== '4')
        const newArray2 = newArray.filter(item => item.id !== '5')
        setIsOption1(newArray2)
    }

    const selectCheese = (cheese) => {
        let selectedCheese;
        selectedCheese = cheese;
        setIsCheese(selectedCheese)
        setIsValidCheese(true)
        const newArray = isOption1.filter(item => item.id !== '6')
        const newArray2 = newArray.filter(item => item.id !== '7')
        const newArray3 = newArray2.filter(item => item.id !== '8')
        newArray3.unshift(selectedCheese)
        setIsOption1(newArray3)
    }
    const unselectCheese = () => {
      setIsValidCheese(false)
      setIsCheese('')
      const newArray = isOption1.filter(item => item.id !== '6')
      const newArray2 = newArray.filter(item => item.id !== '7')
      const newArray3 = newArray2.filter(item => item.id !== '8')
      setIsOption1(newArray3)
  }

 


    return (
        <ScrollView>
            <Image style={styles.image} source={{uri: selectedProduct.imageUrl}} />
            <View style={styles.actions}>
                {cartButton}
            </View>
            <Text style={styles.price} >
                ${selectedProduct.price.toFixed(2)}
            </Text>
            <Text style={styles.description} >
                {selectedProduct.description}
            </Text>
            {optionsComponent}
        </ScrollView>
    )
}

ProductDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: navData.navigation.getParam('productTitle'),
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
    image: {
        width: '100%',
        height: 300
    },
    actions: {
        marginVertical: 10,
        alignItems: 'center'
    },
    price: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20
    },
    description: {
        fontFamily: 'open-sans',
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20
    },
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

export default ProductDetailScreen;