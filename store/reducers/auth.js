import { AUTHENTICATE, LOGOUT } from '../actions/auth';

const initialState = {
    token: null,
    userId: null,
    email: null,
    name: null,
    phone: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
                email: action.email,
                name: action.name,
                phone: action.phone
            }
        case LOGOUT:
            return initialState;
/*         case SIGNUP:
            return {
                token: action.token,
                userId: action.userId
            } */
        default:
            return state;
    }
}