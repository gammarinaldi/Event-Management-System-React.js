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
import { AUTH_LOGIN, AUTH_KEEPLOGIN, AUTH_REGISTER } from '../supports/api-url/apisuburl';

export const onUserLogin = ({ username, password }) => {

    return ( dispatch ) => {

        dispatch({ type: AUTH_LOADING });
        
        axios.post(API_URL_1 + AUTH_LOGIN, { 
            username, password
         })
        .then((res) => {
            if(res.data.status === 'error') {
                dispatch({ type: AUTH_LOGIN_ERROR, payload: res.data.message });
            } else {
                if(res.data.length > 0) {
                    dispatch({ type: AUTH_LOGIN_SUCCESS, 
                                payload: { 
                                    id: res.data[0].id,
                                    username: res.data[0].username,
                                    fullname: res.data[0].fullname,
                                    role: res.data[0].role, 
                                    email: res.data[0].email,
                                    phone: res.data[0].phone,
                                    status: res.data[0].status 
                                } 
                            });
                } else {
                    dispatch({ type: AUTH_LOGIN_ERROR, payload: 'Username or password invalid.' });
                }
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
            dispatch({ type: AUTH_REGISTER_ERROR, payload: 'Please input all fields.' });
        } else {
            axios.post(API_URL_1 + AUTH_REGISTER, { 
                username, password, fullname, email, phone
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

        axios.post(API_URL_1 + AUTH_KEEPLOGIN, {
            username
        }).then((res) => {
            if(res.data.length > 0) {
                dispatch({
                    type: AUTH_LOGIN_SUCCESS,
                    payload: {  
                        id: res.data[0].id,
                        username: res.data[0].username,
                        fullname: res.data[0].fullname,
                        role: res.data[0].role,
                        email: res.data[0].email,
                        phone: res.data[0].phone,
                        status: res.data[0].status
                     }
                })
            }
        })

    }

};

export const onUserVerified = (userData) => {
    return {
        type: AUTH_LOGIN_SUCCESS,
        payload: userData
    }
}

export const onUserLogout = () => {
    return { type: LOGOUT }
};

export const cookieChecked = () => {
    return { type: COOKIE_CHECKED }
};