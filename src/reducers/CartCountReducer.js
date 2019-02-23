import { 
    CART_COUNT
} from '../actions/types';

const INITIAL_STATE = { totalItem: 0 };
    
export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case CART_COUNT :
            return { totalItem: action.payload };
        default :
            return state;
    }
}