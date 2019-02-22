//===================ACTION CREATOR=====================//
import axios from 'axios';
import { SELECTED_PRODUCTS, GET_ALL_PRODUCTS_SUCCESS, REFRESH_SELECT_PRODUCT } from './types';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { PRODUCTS_GETLIST } from '../supports/api-url/apisuburl';

export const select_products = (selectedProducts) => {
    return {
        type: SELECTED_PRODUCTS,
        payload: selectedProducts
    };
};

export const getAllProducts = () => {
    return(dispatch) => {
        axios.get(API_URL_1 + PRODUCTS_GETLIST)
        .then((res) => {
            dispatch({
                type: GET_ALL_PRODUCTS_SUCCESS,
                payload: res.data
            })
        })
        .catch((err) => {
            console.log(err);
        })
    };
};

export const refreshSelectProduct = () => {
    return {
        type: REFRESH_SELECT_PRODUCT
    };
};