export const ADD_ADDRESS = 'ADD_ADDRESS';
export const SET_ADDRESS = 'SET_ADDRESS'

export const fetchAddress = () => {
    return async (dispatch, getState) => {
        // any async code you want!
        const userId = getState().auth.userId;
        try {
        const response = await fetch(`https://shop-9368a.firebaseio.com/address/${userId}.json`)
        
        if (!response.ok) {
            throw new Error('Something went wrong!')
        }

        const resData = await response.json();

        if (resData === null) {
            console.log('resdata = null')
            return;
        } else {
            dispatch({
                type: SET_ADDRESS, 
                address: {
                    street: resData.street,
                    city: resData.city,
                    zip: resData.zip
                }
            })
        }

        } catch (err) {
            // send to analytics
            throw err;
        }
    }
}

export const addAddress = (street, city, zip) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        await fetch(`https://shop-9368a.firebaseio.com/address/${userId}.json?auth=${token}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    street,
                    city,
                    zip
            })
        })

        dispatch({
            type: ADD_ADDRESS, 
            address: {
                street: street,
                city: city,
                zip: zip
            }
        })
    }
}
