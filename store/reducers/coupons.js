import { DELETE_COUPON, CREATE_COUPON, USE_COUPON, SET_COUPONS, SELECT_COUPON, REMOVE_COUPON } from '../actions/coupons';

import Coupon from '../../models/coupon';

const initialState = {
    allCoupons: [],
    userCoupons: [],
    selectedCoupon: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_COUPONS:
            return {
                allCoupons: action.allCoupons,
                userCoupons: action.availableCoupons
            }
        case CREATE_COUPON: 
            const newCoupon = new Coupon(
                action.productData.id, 
                action.productData.type,
                action.productData.title, 
                action.productData.imageUrl, 
                action.productData.value, 
                action.productData.reusable,
                action.productData.category,
                action.productData.threshold,
                action.productData.date,
                action.productData.available);
            return {
                ...state,
                allCoupons: state.allCoupons.concat(newCoupon),
                userCoupons: state.userCoupons.concat(newCoupon)
            }
        case USE_COUPON:
            return {
                ...state,
                selectedCoupon: []
            }
        case SELECT_COUPON:
            return {
                ...state,
                selectedCoupon: state.userCoupons.filter(coupon => coupon.id === action.cid)
            }
        case REMOVE_COUPON:
            return {
                ...state,
                selectedCoupon: []
            }
        case DELETE_COUPON:
            return {
                ...state,
                userCoupons: state.userCoupons.filter(
                    coupon => coupon.id !== action.cid),
                allCoupons: state.allCoupons.filter(
                    coupon => coupon.id !== action.cid)
            }
    }
    return state;
}