import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from '../components/HomePage';
import LoginPage from '../components/LoginPage';
import RegisterPage from '../components/RegisterPage';
import ProductsListView from '../components/admin/ProductsListView';
import ProductsGridView from '../components/ProductsGridView';
import ProductsDetails from '../components/ProductsDetails';
import Cart from '../components/Cart';
import CheckOut from '../components/CheckOut';
import Wishlist from '../components/Wishlist';
import HistoryDetails from '../components/HistoryDetails';
import ManageUsers from '../components/admin/ManageUsers';
import ManageProducts from '../components/admin/ManageProducts';
import ManageTrx from '../components/admin/ManageTrx';
import ManageCategory from '../components/admin/ManageCategory';
import ManageLocation from '../components/admin/ManageLocation';
import ProductEditDetails from '../components/admin/ProductEditDetails';
import AddProduct from '../components/admin/AddProduct';
import ViewActivityLog from '../components/admin/ViewActivityLog';
import WaitVerification from '../components/WaitVerification';
import Verified from '../components/Verified';
import Dashboard from '../components/admin/Dashboard';
import _History from '../components/History';
import ModalExample from '../components/Modal';
import TableSort from '../components/TableSort';
import ManageEvents from '../components/admin/ManageEvents';

class Routing extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" component={HomePage}/>
                <Route path="/login" component={LoginPage}/>
                <Route path="/register" component={RegisterPage}/>
                <Route path="/admin/productslistview" component={ProductsListView}/>
                <Route path="/productsgridview" component={ProductsGridView}/>
                <Route path="/productsdetails" component={ProductsDetails}/>
                <Route path="/cart" component={Cart}/>
                <Route path="/tablesort" component={TableSort}/>
                <Route path="/history" component={_History}/>
                <Route path="/wishlist" component={Wishlist}/>
                <Route path="/historydetails" component={HistoryDetails}/>
                <Route path="/checkout" component={CheckOut}/>
                <Route path="/admin/dashboard" component={Dashboard}/>
                <Route path="/admin/manageusers" component={ManageUsers}/>
                <Route path="/admin/manageproducts" component={ManageProducts}/>
                <Route path="/admin/manageevents" component={ManageEvents}/>
                <Route path="/admin/managetrx" component={ManageTrx}/>
                <Route path="/admin/managecategory" component={ManageCategory}/>
                <Route path="/admin/managelocation" component={ManageLocation}/>
                <Route path="/admin/producteditdetails" component={ProductEditDetails}/>
                <Route path="/admin/addproduct" component={AddProduct}/>
                <Route path="/admin/viewactivitylog" component={ViewActivityLog}/>
                <Route path="/waitverification" component={WaitVerification}/>
                <Route path="/verified" component={Verified}/>
                <Route path="/modal" component={ModalExample}/>
            </Switch>
        )
    }
}

export default Routing;