import { ADD_ORDER, SET_ORDERS, SET_ALLORDERS } from '../actions/orders';
import Order from '../../models/order';

const initialState = {
    allOrders: [],
    orders: []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_ORDERS:
            return {
                ...state,
                orders: action.orders
            }
        case ADD_ORDER:
            const newOrder = new Order(
                action.orderData.id,
                action.orderData.items, 
                action.orderData.amount, 
                action.orderData.date,
                action.orderData.userId,
                action.orderData.location,
                action.orderData.method,
                action.orderData.address,
                action.orderData.comments,
                action.orderData.coupon
                );
            return {
                ...state,
                orders: state.orders.concat(newOrder)
            }
        case SET_ALLORDERS:
            return {
                ...state,
                allOrders: action.orders
            }
    }
    
    return state;
}