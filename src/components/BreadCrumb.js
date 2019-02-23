import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'; //Return location for breadcrumbs
import { refreshSelectProduct } from '../actions';

class BreadCrumb extends Component {

    static propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
    }

    render() {
        const { location } = this.props;

        //================= START > BREADCRUMB =================//
        var currentPage, previousPage, previousPage1;
        if(location.pathname === '/') currentPage = '';
        else if(location.pathname === '/productslistview') currentPage = 'Products List View';
        else if(location.pathname === '/productsgridview') currentPage = 'Products Grid View';
        else if(location.pathname === '/productsdetails') {
            previousPage = <li className="breadcrumb-item"><Link to="/productsgridview"
                            onClick={() => this.props.refreshSelectProduct()}>Products</Link></li>;
            currentPage = 'Product Details';
        }
        else if(location.pathname === '/cart') currentPage = 'Cart';
        else if(location.pathname === '/checkout') currentPage = 'Checkout';
        else if(location.pathname === '/history') currentPage = 'History';
        else if(location.pathname === '/wishlist') currentPage = 'Wishlist';
        else if(location.pathname === '/historydetails') {
            if(this.props.myRole === "ADMIN") {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            previousPage1 = <li className="breadcrumb-item"><Link to="/admin/managetrx">Manage Transactions</Link></li>;
            currentPage = 'History Details';
            } else {
            previousPage = <li className="breadcrumb-item"><Link to="/history">History</Link></li>;
            currentPage = 'History Details';
            }       
        }
        else if(location.pathname === '/admin/manageusers') {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            currentPage = 'Manage Users';
        }
        else if(location.pathname === '/admin/manageproducts')  {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            currentPage = 'Manage Products';
        }
        else if(location.pathname === '/admin/managetrx')  {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            currentPage = 'Manage Transactions';
        }
        else if(location.pathname === '/admin/managecategory')  {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            currentPage = 'Manage Category';
        }
        else if(location.pathname === '/admin/managelocation')  {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            currentPage = 'Manage Location';
        }
        else if(location.pathname === '/admin/producteditdetails')  {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            previousPage1 = <li className="breadcrumb-item"><Link to="/admin/manageproducts">Manage Products</Link></li>;
            currentPage = 'Edit Product Details';
        }
        else if(location.pathname === '/admin/addproduct')  {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            previousPage1 = <li className="breadcrumb-item"><Link to="/admin/manageproducts">Manage Products</Link></li>;
            currentPage = 'Add Product';
        }
        else if(location.pathname === '/admin/viewactivitylog')  {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            currentPage = 'View Activity Log';
        }
        else if(location.pathname === '/admin/dashboard')  {
            previousPage = <li className="breadcrumb-item"><Link to="/">Admin</Link></li>;
            currentPage = 'Dashboard';
        }
        else currentPage = location.pathname;
        
        var breadCrumb;
        if(location.pathname !== '/login' 
            && location.pathname !== '/register' 
            && location.pathname !== '/waitverification'
            && location.pathname !== '/verified' ) {
            breadCrumb = 
            <div style={{ fontSize: "13px" }}>
                <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    {previousPage}
                    {previousPage1}
                    <li className="breadcrumb-item active" aria-current="page">{currentPage}</li>
                </ol>
                </nav>
            </div>;
            return breadCrumb;
        } 
        else return null;
        //================= END > BREADCRUMB =================//
    }
}

export default withRouter(connect(null, { refreshSelectProduct})(BreadCrumb));
