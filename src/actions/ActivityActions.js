import axios from 'axios';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { 
    ACTIVITY_LOG_SUCCESS,
    ACTIVITY_LOG_ERROR
} from './types';

export const onActivityLog = ({ username, role, desc }) => {

    return (dispatch) => {
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/" +
            (currentdate.getMonth() + 1) + "/" +
            currentdate.getFullYear() + " @ " +
            currentdate.getHours() + ":" +
            currentdate.getMinutes() + ":" +
            currentdate.getSeconds();
        axios.post(API_URL_1 + '/activitylog', {
            username: username, role: role, desc: desc, date: datetime
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