import { 
    AUTH_LOGIN_SUCCESS,
    AUTH_REGISTER_SUCCESS,
    AUTH_SYSTEM_ERROR, 
    AUTH_LOGIN_ERROR,
    AUTH_REGISTER_ERROR,
    AUTH_LOADING, 
    LOGOUT,
    COOKIE_CHECKED
} from '../actions/types';

//=================GLOBAL STATE IS HERE====================//
const INITIAL_STATE = { 
                        id: '',
                        username: '', 
                        fullname: '',
                        role: '',
                        email: '', 
                        phone: '',
                        errorSystem: '', 
                        errorRegister: '',
                        errorLogin: '',
                        loading: false, 
                        cookie: false,
                        status: ''
                    };

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {

        case AUTH_LOGIN_SUCCESS:
            return { ...INITIAL_STATE, 
                    id: action.payload.id,
                    username: action.payload.username, 
                    fullname: action.payload.fullname,
                    role: action.payload.role,
                    email: action.payload.email, 
                    phone: action.payload.phone, 
                    status: action.payload.status,
                    cookie: true };

        // case AUTH_REGISTER_SUCCESS:
        //     return { ...INITIAL_STATE, 
        //             id: action.payload.id,
        //             username: action.payload.username, 
        //             fullname: action.payload.fullname,
        //             role: action.payload.role,
        //             email: action.payload.email, 
        //             phone: action.payload.phone, 
        //             status: action.payload.status,
        //             cookie: true };

        case AUTH_REGISTER_SUCCESS:
            return { ...INITIAL_STATE, status: action.payload, cookie: true };

        case AUTH_SYSTEM_ERROR:
            return { ...INITIAL_STATE, errorSystem: action.payload, cookie: true };

        case AUTH_REGISTER_ERROR:
            return { ...INITIAL_STATE, errorRegister: action.payload, cookie: true };

        case AUTH_LOGIN_ERROR:
            return { ...INITIAL_STATE, errorLogin: action.payload, cookie: true };

        case LOGOUT:
            return { ...INITIAL_STATE, cookie: true };

        case AUTH_LOADING:
            return { ...INITIAL_STATE, loading: true, cookie: true };

        case COOKIE_CHECKED:
            return { ...INITIAL_STATE, cookie: true };
            
        default :
            return state;
    }
}