import Coupon from '../../models/coupon';
import * as FileSystem from 'expo-file-system';

export const DELETE_COUPON = 'DELETE_COUPON';
export const CREATE_COUPON = 'CREATE_COUPON';
export const USE_COUPON = 'USE_COUPON';
export const SET_COUPONS = 'SET_COUPON';
export const SELECT_COUPON = 'SELECT_COUPON';
export const REMOVE_COUPON = 'REMOVE_COUPON';


export const fetchCoupons = () => {
    return async (dispatch, getState) => {
        // any async code you want!
        const userId = getState().auth.userId;
        try {
        const response1 = await fetch `https://shop-9368a.firebaseio.com/coupons.json`
        const response2 = await fetch(`https://shop-9368a.firebaseio.com/users/${userId}/coupons.json`)
        
        if (!response1.ok || !response2.ok) {
            throw new Error('Something went wrong!')
        }

        const resData = await response1.json();
        const resData2 = await response2.json();
        const allCoupons = [];
        const userCoupons = [];


         for (const key in resData) {
                allCoupons.push(new Coupon(
                    key, 
                    resData[key].type,
                    resData[key].title, 
                    resData[key].imageUrl,
                    resData[key].value,
                    resData[key].reusable,
                    resData[key].category,
                    resData[key].threshold,
                    resData[key].date,
                    resData[key].available
                    )
                );
            }

            for (const key in resData2) {
                userCoupons.push(new Coupon(
                    resData2[key].id, 
                    resData2[key].type,
                    resData2[key].title, 
                    resData2[key].imageUrl,
                    resData2[key].value,
                    resData2[key].reusable,
                    resData2[key].category,
                    resData2[key].threshold,
                    resData2[key].date,
                    resData2[key].available
                    )
                );
            } 



        dispatch({
            type: SET_COUPONS,
            allCoupons: allCoupons,
            availableCoupons: userCoupons.filter(coupon => coupon.available === true)
        })
        } catch (err) {
            // send to analytics
            throw err;
        }
    }
}



export const createCoupon = (type, title, imageUrl, value, reusable, category, threshold) => {
    return async (dispatch, getState) => {
       /*  const fileName = imageUrl.split('/').pop();
        const newPath = FileSystem.documentDirectory + fileName; */
        const date = new Date()
        const dateString = date.toLocaleDateString()


        /* try {
            await FileSystem.moveAsync({
                from: imageUrl,
                to: newPath
            });
        } catch (err) {
            console.log(err);
            throw err;
        } */
        

        const token = getState().auth.token;
        const response = await fetch(`https://shop-9368a.firebaseio.com/coupons.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                title,
                imageUrl,
                value,
                reusable,
                category,
                threshold,
                date: dateString,
                available: true
            })
        })
        const resData = await response.json();

        const response2 = await fetch('https://shop-9368a.firebaseio.com/users.json')
        if (!response2.ok) {
            throw new Error('Something went wrong!', 'users')
        }

        const users = await response2.json();
        console.log(users)

        for (const key in users) {
            await fetch(`https://shop-9368a.firebaseio.com/users/${key}/coupons/.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: resData.name,
                    type,
                    title,
                    imageUrl,
                    value,
                    reusable,
                    category,
                    threshold,
                    date: dateString,
                    available: true
                })
            })
        }
        

        dispatch({
            type:CREATE_COUPON, 
            productData: {
                id: resData.name,
                type,
                title,
                imageUrl,
                value,
                reusable,
                category,
                threshold,
                date: dateString,
                available: true
            }
        })
    }  
}

export const deleteCoupon = couponId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch(`https://shop-9368a.firebaseio.com/coupons/${couponId}.json?auth=${token}`, {
            method: 'DELETE',
        }
    )

        if (!response.ok) {
            throw new Error('Something Went Wrong!, response1')
        }

        const response2 = await fetch('https://shop-9368a.firebaseio.com/users.json')

        if (!response2.ok) {
            throw new Error('Something went wrong!, users')
        }

        const users = await response2.json()

        for (const key in users) {
            const response3 = await fetch(`https://shop-9368a.firebaseio.com/users/${key}/coupons.json?auth=${token}`)
        
            if (!response3.ok) {
                throw new Error('Something went wrong, response2')
            }
            const resData = await response3.json()
            for (const key2 in resData) {
                if (resData[key2].id === couponId) {
                    await fetch(`https://shop-9368a.firebaseio.com/users/${key}/coupons/${key2}.json?auth=${token}`, {
                        method: 'DELETE',
                    })
                }
            }
        }

       dispatch({
        type: DELETE_COUPON, 
        cid: couponId
       }) 
    }
}

export const useCoupon = couponId => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const userId = getState().auth.userId;
        const response = await fetch(`https://shop-9368a.firebaseio.com/users/${userId}/coupons/.json`)

        const resData = await response.json();

        for (const key in resData) {
            if (resData[key].id === couponId) {
                await fetch(`https://shop-9368a.firebaseio.com/users/${userId}/coupons/${key}.json?auth=${token}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        available: false
                    })
                })
            }
        }

        dispatch({
            type: USE_COUPON, 
            cid: couponId
           }) 
    }
}

export const selectCoupon = couponId => {
    return { type: SELECT_COUPON, cid: couponId };
}

export const removeCoupon = () => {
    return { type: REMOVE_COUPON }
}