import { 
    CONVERT_TO_RUPIAH,
    SORTING_JSON
} from './types';

export const convertToRupiah = (angka) => {
    return (dispatch) => {
        var rupiah = '';		
        var angkarev = angka.toString().split('').reverse().join('');
        for (var i = 0; i < angkarev.length; i++) {
            if (i%3 === 0) {
                rupiah += angkarev.substr(i,3)+'.';
            }
        }
        dispatch({type: CONVERT_TO_RUPIAH});
        return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
    }
};

export const sortingJSON = (key, order='asc') => {
    //=======> Function for sorting json / array of objects (Dynamic Sorting Function)
    //=======> Credit to: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
    return (dispatch) => {
        return (a, b) => {
            if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                return 0; 
            }
            
            const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
            
            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            dispatch({type: SORTING_JSON});
            return (
                (order === 'desc') ? (comparison * -1) : comparison
            );
        };
    }
};