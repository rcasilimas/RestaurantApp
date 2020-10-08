import { ADD_TO_CART, REMOVE_FROM_CART, ADD_COMMENTS, UPDATE_CART } from '../actions/cart';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_PRODUCT } from '../actions/products';
import CartItem from '../../models/cart-item';

const initialState = {
    items: {},
    totalAmount: 0,
    comments: '',
    method: 'null',
    location: 'null',
    couponCurrentValue: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: 
            const addedProduct = action.product.selectedProduct;
            const prodTitle = addedProduct.title;
            const prodImage = addedProduct.imageUrl;
            const prodCategoryId = addedProduct.categoryId
            const option1 = action.product.option1;
            const option2 = action.product.option2;
            let option1Price = 0;
            let option2Price = 0;
            let option1Title = '';
            let option2Title = '';

            
            if (option1[0]) {
                option1.forEach(topping => {
                    option1Price = option1Price + topping.price;
                    option1Title = option1Title + topping.title;
                })
            }

            if (option2[0]) {
                option2.forEach(item => {
                    option2Price = option2Price + item.price;
                    option2Title = option2Title + item.title;
                })
            }

            const cartId = prodTitle + option1Title + option2Title;
            const prodPrice = addedProduct.price + option1Price + option2Price;


            let updatedOrNewCartItem;
            if(state.items[cartId]) {
                //already have the item in the cart

                updatedOrNewCartItem = new CartItem(
                    cartId,
                    prodCategoryId,
                    state.items[cartId].quantity + 1,
                    prodPrice,
                    prodTitle,
                    prodImage,
                    state.items[cartId].sum + prodPrice,
                    option1,
                    option2
                );
            } else {
                updatedOrNewCartItem = new CartItem(cartId, prodCategoryId, 1, prodPrice, prodTitle, prodImage, prodPrice, option1, option2);
            }
            return {
                ...state,
                items: { ...state.items, [cartId]: updatedOrNewCartItem },
                totalAmount: state.totalAmount + prodPrice
            }
        case UPDATE_CART:
            const coupon = action.coupon;
            let currentTotal = 0;
            const currentItems = state.items;
            let threshold = 0;
            let value = 0;
            let updatedTotal;

            for (const key in currentItems) {
                currentTotal = currentTotal + currentItems[key].sum
            }
            if (coupon === null || !coupon) {
                updatedTotal = currentTotal
            } else if (coupon.type === 'discount') {
                threshold = coupon.threshold;
                value = coupon.value;

                if (currentTotal >= threshold) {
                    updatedTotal = currentTotal - value
                } else {
                    updatedTotal = currentTotal
                }
            } else if (coupon.type === 'percent') {
                value = (coupon.value / 100) * currentTotal
                updatedTotal = currentTotal - value
            } else if (coupon.type === 'category') {
                const category = coupon.category;
                let categoryInCart = false;
                for (const key in currentItems) {
                    if (currentItems[key].categoryId === category) {
                        categoryInCart = true;
                    } 
                }
                if (categoryInCart === true) {
                    value = coupon.value;
                    updatedTotal = currentTotal - value
                } else {
                    updatedTotal = currentTotal
                }
            } else {
                updatedTotal = currentTotal
            }

            const updatedCouponValue = currentTotal - updatedTotal

            return {
                ...state,
                totalAmount: updatedTotal,
                couponCurrentValue: updatedCouponValue
            }


        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.cid]
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;

            if (currentQty > 1) {
                // reduce not erase
                const updatedCartItem = new CartItem(
                    selectedCartItem.cartId,
                    selectedCartItem.categoryId,
                    selectedCartItem.quantity - 1, 
                    selectedCartItem.productPrice, 
                    selectedCartItem.productTitle, 
                    selectedCartItem.productImage, 
                    selectedCartItem.sum - selectedCartItem.productPrice, 
                    selectedCartItem.option1, 
                    selectedCartItem.option2 
                    );
                    updatedCartItems = { ...state.items, [action.cid]: updatedCartItem }
            } else {
                updatedCartItems = { ...state.items };
                delete updatedCartItems[action.cid];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            };
        case ADD_COMMENTS:
            const updatedComments = action.comments;
            const updatedLocation = action.location;
            const updatedMethod = action.method;

            return {
                ...state,
                comments: updatedComments,
                location: updatedLocation,
                method: updatedMethod
            };
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if (!state.items[action.pid]) {
                return state;
            }
            const updatedItems = {...state.items};
            const itemTotal = state.items[action.pid].sum;
            delete updatedItems[action.pid];

            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            }
        }     
    return state;
}