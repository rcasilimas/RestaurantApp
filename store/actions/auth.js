import { AsyncStorage } from 'react-native';
import Coupon from '../../models/coupon';

/* export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN'; */
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_COUPONS = 'SET_COUPON';

let timer;

export const authenticate = (userId, token, email, name, phone) => {
    return dispatch => {
        /* dispatch(setLogoutTimer(expiryTime)); */
        dispatch({ type: AUTHENTICATE, userId: userId, token: token, email: email, name: name, phone: phone })
    }
}

export const signup = (email, password, name, phone) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBH_wHzZGg9XypV0bpfR3l_mdBL8JS5pI4'
        ,   {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

            if (!response.ok) {
                const errorResData = await response.json();
                const errorId = errorResData.error.message;
                let message = 'response1 Something Went Wrong!'
                if (errorId === 'EMAIL_EXISTS') {
                    message = 'This email exists already!';
                }
                throw new Error(errorId, message);
            }

        const resData = await response.json();
        const userToken = resData.idToken;
        const id = resData.localId;
        const refreshToken = resData.refreshToken
        
        const response2 = await fetch(`https://shop-9368a.firebaseio.com/users.json?auth=${userToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                email,
                name,
                phone
            })
        })

        if (!response2.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'response2 Something Went Wrong!'
            throw new Error(errorId, message);
        }

        const resData2 = await response2.json();
        const userId = resData2.name
        const userEmail = resData2.email;


        const coupons = await fetch `https://shop-9368a.firebaseio.com/coupons.json`
        const resDataCoupons = await coupons.json();
        const allCoupons = []
        
        for (const key in resDataCoupons) {
            await fetch(`https://shop-9368a.firebaseio.com/users/${userId}/coupons/${key}.json?auth=${userToken}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: key,
                type: resDataCoupons[key].type,
                title: resDataCoupons[key].title, 
                imageURL: resDataCoupons[key].imageUrl,
                value: resDataCoupons[key].value,
                reusable: resDataCoupons[key].reusable,
                category: resDataCoupons[key].category,
                threshold: resDataCoupons[key].threshold,
                date: resDataCoupons[key].date,
                available: resDataCoupons[key].available
            })
        })
            allCoupons.push(new Coupon(
                resDataCoupons[key].id, 
                resDataCoupons[key].type,
                resDataCoupons[key].title, 
                resDataCoupons[key].imageUrl,
                resDataCoupons[key].value,
                resDataCoupons[key].reusable,
                resDataCoupons[key].category,
                resDataCoupons[key].threshold,
                resDataCoupons[key].date,
                resDataCoupons[key].available
                )
            );
        }

        


        dispatch({
            type: SET_COUPONS,
            allCoupons: allCoupons,
            availableCoupons: allCoupons
        })
        dispatch(authenticate(userId, userToken, userEmail, name, phone))
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(userToken, userId, expirationDate, userEmail, refreshToken, name, phone);
    };
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBH_wHzZGg9XypV0bpfR3l_mdBL8JS5pI4'
        ,   {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    returnSecureToken: true
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something Went Wrong!'
            if (errorId === 'EMAIL_NOT_FOUND') {
                message = 'This email could not be found!';
            }
            if (errorId === 'INVALID_PASSWORD') {
                message = 'This password is not valid';
            }
            throw new Error(message);
        }
        const resData = await response.json();
        const userToken = resData.idToken;
        const id = resData.localId;
        const refreshToken = resData.refreshToken;

        const response2 = await fetch('https://shop-9368a.firebaseio.com/users.json')
        const resData2 = await response2.json();
        let userId;
        let userEmail;
        let userName;
        let userPhone;
        

        for (const key in resData2) {
            if (resData2[key].id === id) {
                userId = key
                userEmail = resData2[key].email
                userName = resData2[key].name
                userPhone = resData2[key].phone
            }
        }

        
        dispatch(authenticate(userId, userToken, userEmail, userName, userPhone))
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(userToken, userId, expirationDate, userEmail, refreshToken, userName, userPhone);
    };
}

export const logout = () => {
    /* clearLogoutTimer(); */
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
}

/* const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }    
} */

/* const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    }
}
 */
const saveDataToStorage = (token, userId, expirationDate, userEmail, refreshToken, userName, userPhone) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString(),
        email: userEmail,
        refreshToken: refreshToken,
        name: userName,
        phone: userPhone
    }));
}

export const refreshData = (refreshToken) => {
    return async (dispatch) => {
        try {
                const response = await fetch('https://securetoken.googleapis.com/v1/token?key=AIzaSyBH_wHzZGg9XypV0bpfR3l_mdBL8JS5pI4', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=refresh_token&refresh_token=' + refreshToken
            });
 
            if (!response.ok) {
                throw new Error(
                    'refreshdata error'
                );
            }
            const resData = await response.json();
            const userToken = resData.id_token;
            const id = resData.user_id;
            const newRefreshToken = resData.refresh_token

            const response2 = await fetch('https://shop-9368a.firebaseio.com/users.json')
            const resData2 = await response2.json();
            let userId;
            let userEmail;
            let userName;
            let userPhone;
            
            for (const key in resData2) {
                if (resData2[key].id === id) {
                    userId = key
                    userEmail = resData2[key].email
                    userName = resData2[key].name
                    userPhone = resData2[key].phone
                }
            }
            dispatch(authenticate(userId, userToken, userEmail, userName, userPhone))

 
            const expirationDate = new Date(new Date().getTime() + parseInt(resData.expires_in) * 1000);
            saveDataToStorage(userToken, userId, expirationDate, userEmail, newRefreshToken, userName, userPhone);
        } catch (error) {
            console.log(error, 'refreshdata')
            throw error;
        }
    };
};

export const forgotPassword = (email) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBH_wHzZGg9XypV0bpfR3l_mdBL8JS5pI4'
        ,   {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requestType: 'PASSWORD_RESET',
                    email: email,
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            if (errorId === "MISSING_EMAIL") {
                throw new Error("User's Email Not Found, Please Try Again")
            }
            throw new Error(errorId)
        }
    }
}