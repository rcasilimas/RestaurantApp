export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const ADD_COMMENTS = 'ADD_COMMENTS';
export const UPDATE_CART = 'UPDATE_CART'

export const addComments = (comments, location, method) => {
    return { type: ADD_COMMENTS, comments: comments, location: location, method: method };
}

export const addToCart = product => {
    return { type: ADD_TO_CART, product: product }
}

export const updateCart = () => {
    return async (dispatch, getState) => {
        const selectedCoupon = getState().coupons.selectedCoupon
        let coupon;

        if (selectedCoupon) {
            coupon = selectedCoupon[0];
        } else {
            coupon = null;
        }

        dispatch({
            type: UPDATE_CART,
            coupon: coupon
        })
    }
}

export const removeFromCart = cartId => {
    return { type: REMOVE_FROM_CART, cid: cartId };
}