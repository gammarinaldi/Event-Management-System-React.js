import { 
    GET_ALL_PRODUCTS_SUCCESS
} from '../actions/types';

const INITIAL_STATE = [];
    
export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case GET_ALL_PRODUCTS_SUCCESS :
            return action.payload;
        default :
            return state;
    }
}