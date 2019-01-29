import axios from 'axios';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { LOG_ADD } from '../supports/api-url/apisuburl';
import { 
    ACTIVITY_LOG_SUCCESS,
    ACTIVITY_LOG_ERROR
} from './types';

export const onActivityLog = ({ username, role, desc }) => {

    return (dispatch) => {
        axios.post(API_URL_1 + LOG_ADD, {
            username, role, desc, date: new Date()
        }).then((res) => {
            console.log(res);
            if(res.data.length > 0) {
                dispatch({ type: ACTIVITY_LOG_SUCCESS });
            } else {
                dispatch({ type: ACTIVITY_LOG_ERROR });
            }
        }).catch((err) => {
            console.log(err);
        })
    }

};