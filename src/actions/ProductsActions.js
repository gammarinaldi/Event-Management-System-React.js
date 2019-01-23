//===================ACTION CREATOR=====================//
import { 
    SELECTED_PRODUCTS
} from './types';

export const select_products = (selectedProducts) => {
    return {
        type: SELECTED_PRODUCTS,
        payload: selectedProducts
    }
}