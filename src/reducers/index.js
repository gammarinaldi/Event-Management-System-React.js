import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import SelectedProductsReducer from './SelectedProductsReducer';
import ListProductsReducer from './ListProductsReducer';
import CartCountReducer from './CartCountReducer';

export default combineReducers (
    {
        auth: AuthReducer,
        selectedProducts: SelectedProductsReducer,
        listProducts: ListProductsReducer,
        cartCount: CartCountReducer
    }
);