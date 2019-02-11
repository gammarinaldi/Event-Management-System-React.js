import React from 'react';
import { 
    CONVERT_TO_RUPIAH,
    SORTING_JSON,
    CONVERT_DATE,
    SIDE_BAR_MENU
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
        if (active === 'Manage Transactions') managetrx = "list-group-item active"; 
        else managetrx = "list-group-item";
        if (active === 'Manage Category') managecategory = "list-group-item active"; 
        else managecategory = "list-group-item";
        if (active === 'Manage Location') managelocation = "list-group-item active"; 
        else managelocation = "list-group-item";
        if (active === 'View Activity Log') viewactivitylog = "list-group-item active"; 
        else viewactivitylog = "list-group-item";
        if (active === 'Transaction Details') managetrx = "list-group-item active"; 
        else viewactivitylog = "list-group-item";

        if(myRole === "ADMIN") {
            dispatch({type: SIDE_BAR_MENU});
            return <div className="list-group">
                        <a href="/" className={dashboard}>Dashboard</a>
                        <a href="/admin/manageproducts" className={manageproducts}>Manage Products</a>
                        <a href="/admin/manageusers" className={manageusers}>Manage Users</a>
                        <a href="/admin/managetrx" className={managetrx}>Manage Transactions</a>
                        <a href="/admin/managecategory" className={managecategory}>Manage Category</a>
                        <a href="/admin/managelocation" className={managelocation}>Manage Location</a>
                        <a href="/admin/viewactivitylog" className={viewactivitylog}>View Activity Log</a>
                    </div>;
        } else if(myRole === "PRODUCER") {
            dispatch({type: SIDE_BAR_MENU});
            return <div className="list-group">
                        <a href="/admin/manageproducts" className={manageproducts}>Manage Products</a>
                        <a href="/admin/managecategory" className={managecategory}>Manage Category</a>
                        <a href="/admin/managelocation" className={managelocation}>Manage Location</a>
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