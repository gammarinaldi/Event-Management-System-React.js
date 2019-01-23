import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import SelectedProductsReducer from './SelectedProductsReducer';

export default combineReducers (
    {
        auth: AuthReducer,
        selectedProducts: SelectedProductsReducer
    }
);