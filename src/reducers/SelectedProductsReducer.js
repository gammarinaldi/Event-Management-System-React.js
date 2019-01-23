import { 
    SELECTED_PRODUCTS
} from '../actions/types';

//=================GLOBAL STATE IS HERE====================//
const INITIAL_STATE = { 
                        id: 0, 
                        idCategory: 0, 
                        idLocation: 0,
                        item: '', 
                        price: 0, 
                        img: '', 
                        desc: '', 
                        startDate: '', 
                        endDate: '' ,
                        days: ''
                    };

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SELECTED_PRODUCTS:
            return action.payload;
        default :
            return state;
    }
}