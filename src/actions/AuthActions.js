//===================ACTION CREATOR=====================//
import axios from 'axios';
import { 
    AUTH_LOGIN_SUCCESS,
    AUTH_REGISTER_SUCCESS,
    AUTH_LOADING,
    AUTH_SYSTEM_ERROR,
    AUTH_REGISTER_ERROR,
    AUTH_LOGIN_ERROR,
    LOGOUT,
    COOKIE_CHECKED
} from './types';
import { API_URL_1 } from '../supports/api-url/apiurl';

export const onUserLogin = ({ username, password }) => {

    return ( dispatch ) => {

        dispatch({ type: AUTH_LOADING });
        
        axios.post(API_URL_1 + '/auth/login', { 
            username, password
         })
        .then((res) => {
            if(res.data.length > 0) {
                dispatch({ type: AUTH_LOGIN_SUCCESS, 
                            payload: { 
                                username: res.data[0].username,
                                role: res.data[0].role, 
                                email: res.data[0].email,
                                phone: res.data[0].phone } });
            } else {
                dispatch({ type: AUTH_LOGIN_ERROR, payload: 'Username or password invalid.' });
            }
        })
        .catch((err) => {
            console.log(err);
            dispatch({ type: AUTH_SYSTEM_ERROR, payload: 'System error.' });
        })

    }

};

export const onUserRegister = ({ username, fullname, email, phone, password }) => {

    return ( dispatch ) => {
        
        dispatch({ type: AUTH_LOADING });

        if(username === '' || fullname === '' || email === '' || phone === '' || password === '') {
            dispatch({ type: AUTH_REGISTER_ERROR, payload: 'Semua form wajib diisi' });
        } else {
            axios.post(API_URL_1 + '/auth/register', { 
                username, fullname, email, phone, password
            })
            .then((res) => {
                if(res.data.status === 'error') {
                    console.log(res.data)
                    dispatch({ type: AUTH_REGISTER_ERROR, payload: res.data.message })
                }
                else {
                    console.log(res.data)
                    dispatch({ type : AUTH_REGISTER_SUCCESS, payload: res.data })
                }
            })
            .catch((err) => {
                console.log(err);
                dispatch({ type: AUTH_SYSTEM_ERROR, payload: 'System error.' });
            })
        }
        
    }

};

export const keepLogin = (username) => {

    return (dispatch) => {

        axios.get(API_URL_1 + '/users', {
            params: {
                username
            }
        }).then((res) => {
            if(res.data.length > 0) {
                dispatch({
                    type: AUTH_LOGIN_SUCCESS,
                    payload: {  
                        username: res.data[0].username,
                        role: res.data[0].role,
                        email: res.data[0].email,
                        phone: res.data[0].phone
                     }
                })
            }
        })

    }

};

export const onUserLogout = () => {
    return { type: LOGOUT }
};

export const cookieChecked = () => {
    return { type: COOKIE_CHECKED }
};