import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProductsGridView from './ProductsGridView';
import Dashboard from './admin/Dashboard';
import ManageProducts from './admin/ManageProducts';

class HomePage extends Component {

    render() {
      if(this.props.myRole === "ADMIN") {
        return <Dashboard />;
      } else if(this.props.myRole === "PRODUCER") {
        return <ManageProducts />;
      } else {
        return <ProductsGridView />;
      }
    }
}

const mapStateToProps = (state) => {
  return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps)(HomePage);