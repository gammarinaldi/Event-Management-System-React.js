import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import SelectedProductsReducer from './SelectedProductsReducer';
import ListProductsReducer from './ListProductsReducer';

export default combineReducers (
    {
        auth: AuthReducer,
        selectedProducts: SelectedProductsReducer,
        listProducts: ListProductsReducer
    }
);