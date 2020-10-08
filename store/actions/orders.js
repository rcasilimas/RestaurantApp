import Order from '../../models/order';

export const ADD_ORDER = 'ADD_ORDER';
export const SET_ORDERS = 'SET_ORDERS';
export const SET_ALLORDERS = 'SET_ALLORDERS';

export const fetchOrders = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        try {
            const response = await fetch(`https://shop-9368a.firebaseio.com/orders/${userId}.json`)
            
            if (!response.ok) {
                throw new Error('Something went wrong!')
            }
    
            const resData = await response.json();
            const loadedOrders = [];
    
                for (const key in resData) {
                    const orderDate = resData[key].date
                    loadedOrders.push(new Order(
                        key, 
                        resData[key].cartItems, 
                        resData[key].totalAmount, 
                        orderDate,
                        resData[key].userId,
                        resData[key].location,
                        resData[key].method,
                        resData[key].address,
                        resData[key].comments,
                        resData[key].coupon
                        )
                    );
                }

                loadedOrders.sort(function(a, b) {
                    a = new Date(a.date);
                    b = new Date(b.date);
                    return a>b ? -1 : a<b ? 1 : 0;
                });

        dispatch({ 
            type: SET_ORDERS, 
            orders: loadedOrders
        })
    } catch (err) {
        throw err;
    }
}
}

export const fetchAllOrders = () => {
    return async (dispatch, getState) => {
        try {
            const users = await fetch(`https://shop-9368a.firebaseio.com/users.json`)
            
            if (!users.ok) {
                throw new Error('Something went wrong!, users')
            }

            const loadedOrders = [];
            const usersResData = await users.json();
            for (const key in usersResData) {
                const orders = await fetch(`https://shop-9368a.firebaseio.com/orders/${key}.json`)
                if (!orders.ok) {
                    throw new Error('Something went wrong!, orders')
                }
                const ordersResData = await orders.json();
                for (const key2 in ordersResData) {
                    loadedOrders.push(new Order(
                        key2, 
                        ordersResData[key2].cartItems, 
                        ordersResData[key2].totalAmount, 
                        ordersResData[key2].date,
                        ordersResData[key2].userId,
                        ordersResData[key2].location,
                        ordersResData[key2].method,
                        ordersResData[key2].address,
                        ordersResData[key2].comments,
                        ordersResData[key2].coupon
                        )
                    );
                }
            }

                loadedOrders.sort(function(a, b) {
                a = new Date(a.date);
                b = new Date(b.date);
                return a>b ? -1 : a<b ? 1 : 0;
            });
            
    
                
        dispatch({ 
            type: SET_ALLORDERS, 
            orders: loadedOrders
        }) 
    } catch (err) {
        throw err;
    }
}
}

export const addOrder = (cartItems, totalAmount, location, method, address, comments, coupon) => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const date = new Date();
        const dateString = date.toLocaleDateString();

        const response = await fetch(`https://shop-9368a.firebaseio.com/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cartItems,
                totalAmount,
                date: dateString,
                userId,
                location,
                method,
                address,
                comments,
                coupon
            })
        })

        if(!response.ok) {
            throw new Error('Something Went Wrong!')
        }

        const resData = await response.json();

        dispatch({
            type: ADD_ORDER, orderData: {
                id: resData.name,
                items: cartItems, 
                amount: totalAmount,
                date: dateString,
                userId,
                location,
                method,
                address,
                comments,
                coupon
                }
        })
    }

}