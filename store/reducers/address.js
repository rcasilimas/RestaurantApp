import { ADD_ADDRESS, SET_ADDRESS } from '../actions/address';

const initialState = {
    address: {
        street: '',
        city: '',
        zip: ''
    }
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_ADDRESS:
            return {
                address: {
                    street: action.address.street,
                    city: action.address.city,
                    zip: action.address.zip
                }
            }
        case ADD_ADDRESS:
            return {
                address: {
                    street: action.address.street,
                    city: action.address.city,
                    zip: action.address.zip
                }
            }
    }
    return state;
}