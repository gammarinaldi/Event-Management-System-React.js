import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { TOTAL_QTY_CART } from '../supports/api-url/apisuburl';
import { 
    CONVERT_TO_RUPIAH,
    SORTING_JSON,
    CONVERT_DATE,
    SIDE_BAR_MENU,
    CART_COUNT
} from './types';

export const sideBarMenu = ({ myRole, active }) => {
    return (dispatch) => {

        var dashboard, manageproducts, manageusers, managetrx, managecategory, managelocation , viewactivitylog;

        if (active === 'Dashboard') dashboard = "list-group-item active"; 
        else dashboard = "list-group-item";
        if (active === 'Manage Products' || active === 'Add Product' || active === 'Edit Product') 
        manageproducts = "list-group-item active"; 
        else manageproducts = "list-group-item";
        if (active === 'Manage Users') manageusers = "list-group-item active"; 
        else manageusers = "list-group-item";
        if (active === 'Manage Transactions' || active === 'Transaction Details') 
        managetrx = "list-group-item active"; 
        else managetrx = "list-group-item";
        if (active === 'Manage Category') managecategory = "list-group-item active"; 
        else managecategory = "list-group-item";
        if (active === 'Manage Location') managelocation = "list-group-item active"; 
        else managelocation = "list-group-item";
        if (active === 'View Activity Log') viewactivitylog = "list-group-item active"; 
        else viewactivitylog = "list-group-item";

        if(myRole === "ADMIN") {
            dispatch({type: SIDE_BAR_MENU});
            return <div className="list-group">
                        <Link to="/" className={dashboard}>Dashboard</Link>
                        <Link to="/admin/manageproducts" className={manageproducts}>Manage Products</Link>
                        <Link to="/admin/manageusers" className={manageusers}>Manage Users</Link>
                        <Link to="/history" className={managetrx}>Manage Transactions</Link>
                        <Link to="/admin/managecategory" className={managecategory}>Manage Category</Link>
                        <Link to="/admin/managelocation" className={managelocation}>Manage Location</Link>  
                        <Link to="/admin/viewactivitylog" className={viewactivitylog}>View Activity Log</Link>
                    </div>;
        } else if(myRole === "PRODUCER") {
            dispatch({type: SIDE_BAR_MENU});
            return <div className="list-group">
                        <Link to="/admin/manageproducts" className={manageproducts}>Manage Products</Link>
                        <Link to="/admin/managecategory" className={managecategory}>Manage Category</Link>
                        <Link to="/admin/managelocation" className={managelocation}>Manage Location</Link>
                    </div>;
        }
    }
    
};

export const convertDate = (date) => {
    return (dispatch) => {
        var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();
        
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            dispatch({type: CONVERT_DATE});
            return [year, month, day].join('-');
    }
};

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

export const cartCount = (username) => {
    return (dispatch) => {
        axios.post(API_URL_1 + TOTAL_QTY_CART, {
            username
        }).then((res) => {
            // var totalQty = 0;
            // res.data.forEach(item => {
            //     totalQty += item.qty;
            // });
            console.log('Total qty: '+res.data.totalQty);
            dispatch({
                type: CART_COUNT,
                payload: res.data.totalQty
            })
        })
    }
};