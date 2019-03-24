import { 
    UNCONFIRMED_TRX
} from '../actions/types';

const INITIAL_STATE = { totalUnconfirmedTrx: 0 };
    
export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case UNCONFIRMED_TRX :
            return { totalUnconfirmedTrx: action.payload };
        default :
            return state;
    }
}