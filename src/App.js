import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { keepLogin, cookieChecked } from './actions';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Header from './components/Header';
import ProductsListView from './components/ProductsListView';
import ProductsGridView from './components/ProductsGridView';
import ProductsDetails from './components/ProductsDetails';
import Cart from './components/Cart';
import PropTypes from "prop-types"; //Return location for breadcrumbs
import CheckOut from './components/CheckOut';
import _History from './components/History';
import Wishlist from './components/Wishlist';
import HistoryDetails from './components/HistoryDetails';
import ManageUsers from './components/admin/ManageUsers';
import ManageProducts from './components/admin/ManageProducts';
import ManageTrx from './components/admin/ManageTrx';
import ManageCategory from './components/admin/ManageCategory';
import ManageLocation from './components/admin/ManageLocation';
import ProductEditDetails from './components/admin/ProductEditDetails';
import Spinner from './components/Spinner';
import AddProduct from './components/admin/AddProduct';
import ViewActivityLog from './components/admin/ViewActivityLog';
import Test from './components/Test';

const cookies = new Cookies();

class App extends Component {

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    const newCookie = cookies.get('usernameCookie');
    if(newCookie) {
        this.props.keepLogin(newCookie);
    } else {
        this.props.cookieChecked();
    }
  }

  roleStat = () => {
      if(this.props.myRole === 'ADMIN') {
        return '(Admin Mode)';
      } else if(this.props.myRole === 'PRODUCER') {
        return '(Producer Mode)';
      }else {
        return '';
      }
  }

  render() {

    const { location } = this.props;

    if(this.props.cookie) {

      //================= START > BREADCRUMB =================//
      var currentPage, previousPage, previousPage1;
      if(location.pathname === '/') currentPage = '';
      else if(location.pathname === '/productslistview') currentPage = 'Products List View';
      else if(location.pathname === '/productsgridview') currentPage = 'Products Grid View';
      else if(location.pathname === '/productsdetails') {
        previousPage = <li className="breadcrumb-item"><a href="/productsgridview">Products</a></li>;
        currentPage = 'Product Details';
      }
      else if(location.pathname === '/cart') currentPage = 'Cart';
      else if(location.pathname === '/checkout') currentPage = 'Checkout';
      else if(location.pathname === '/history') currentPage = 'History';
      else if(location.pathname === '/wishlist') currentPage = 'Wishlist';
      else if(location.pathname === '/historydetails') {
        if(this.props.myRole === "ADMIN") {
          previousPage = <li className="breadcrumb-item"><a href="/">Admin</a></li>;
          previousPage1 = <li className="breadcrumb-item"><a href="/admin/managetrx">Manage Transactions</a></li>;
          currentPage = 'History Details';
        } else {
          previousPage = <li className="breadcrumb-item"><a href="/history">History</a></li>;
          currentPage = 'History Details';
        }       
      }
      else if(location.pathname === '/admin/manageusers') {
        previousPage = <li className="breadcrumb-item"><a href="/">Admin</a></li>;
        currentPage = 'Manage Users';
      }
      else if(location.pathname === '/admin/manageproducts')  {
        previousPage = <li className="breadcrumb-item"><a href="/">Admin</a></li>;
        currentPage = 'Manage Products';
      }
      else if(location.pathname === '/admin/managetrx')  {
        previousPage = <li className="breadcrumb-item"><a href="/">Admin</a></li>;
        currentPage = 'Manage Transactions';
      }
      else if(location.pathname === '/admin/managecategory')  {
        previousPage = <li className="breadcrumb-item"><a href="/">Admin</a></li>;
        currentPage = 'Manage Category';
      }
      else if(location.pathname === '/admin/managelocation')  {
        previousPage = <li className="breadcrumb-item"><a href="/">Admin</a></li>;
        currentPage = 'Manage Location';
      }
      else if(location.pathname === '/admin/producteditdetails')  {
        previousPage = <li className="breadcrumb-item"><a href="/">Admin</a></li>;
        previousPage1 = <li className="breadcrumb-item"><a href="/admin/manageproducts">Manage Products</a></li>;
        currentPage = 'Edit Product Details';
      }
      else if(location.pathname === '/admin/addproduct')  {
        previousPage = <li className="breadcrumb-item"><a href="/">Admin</a></li>;
        previousPage1 = <li className="breadcrumb-item"><a href="/admin/manageproducts">Manage Products</a></li>;
        currentPage = 'Add Product';
      }
      else if(location.pathname === '/admin/viewactivitylog')  {
        previousPage = <li className="breadcrumb-item"><a href="/">Admin</a></li>;
        currentPage = 'View Activity Log';
      }
      else currentPage = location.pathname;
      
      var breadCrumb;
      if(location.pathname !== '/login' && location.pathname !== '/register' ) {
        breadCrumb = 
        <div style={{ fontSize: "13px" }}>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                {previousPage}
                {previousPage1}
                <li className="breadcrumb-item active" aria-current="page">{currentPage}</li>
              </ol>
            </nav>
          </div>;
      } 
      //================= END > BREADCRUMB =================//

      return (
        <div className="container-fluid">

        {/* <Header NavBrand={`emsy ${this.roleStat()}`} /> */}
        <Header NavBrand={`emsy`} />

        {breadCrumb}
        
        <Route exact path="/" component={HomePage}/>
        <Route path="/login" component={LoginPage}/>
        <Route path="/register" component={RegisterPage}/>
        <Route path="/productslistview" component={ProductsListView}/>
        <Route path="/productsgridview" component={ProductsGridView}/>
        <Route path="/productsdetails" component={ProductsDetails}/>
        <Route path="/cart" component={Cart}/>
        <Route path="/history" component={_History}/>
        <Route path="/wishlist" component={Wishlist}/>
        <Route path="/historydetails" component={HistoryDetails}/>
        <Route path="/checkout" component={CheckOut}/>
        <Route path="/admin/manageusers" component={ManageUsers}/>
        <Route path="/admin/manageproducts" component={ManageProducts}/>
        <Route path="/admin/managetrx" component={ManageTrx}/>
        <Route path="/admin/managecategory" component={ManageCategory}/>
        <Route path="/admin/managelocation" component={ManageLocation}/>
        <Route path="/admin/producteditdetails" component={ProductEditDetails}/>
        <Route path="/admin/addproduct" component={AddProduct}/>
        <Route path="/admin/viewactivitylog" component={ViewActivityLog}/>
        <Route path="/test" component={Test}/>

      </div>
      )
    }

    return (
      <div style={{ marginTop: "200px" ,fontSize: "20px" }}>
        <center><Spinner /></center>
      </div> 
    )
  }
}

const mapStateToProps = (state) => {
  return { 
           cookie: state.auth.cookie,
           path: state.auth.path,
           myRole: state.auth.role
          }
}
export default withRouter(connect(mapStateToProps, { keepLogin, cookieChecked })(App));
