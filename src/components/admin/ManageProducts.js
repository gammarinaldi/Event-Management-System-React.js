import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import ProductsListView from '../ProductsListView';

class ManageProducts extends Component {

    sideBarMenu () {
        if(this.props.myRole === "ADMIN") {
            return <div className="list-group">
                        <a href="/" className="list-group-item">Dashboard</a>
                        <a href="/admin/manageproducts" className="list-group-item active">Manage Products</a>
                        <a href="/admin/manageusers" className="list-group-item">Manage Users</a>
                        <a href="/admin/managetrx" className="list-group-item">Manage Transactions</a>
                        <a href="/admin/managecategory" className="list-group-item">Manage Category</a>
                        <a href="/admin/managelocation" className="list-group-item">Manage Location</a>
                    </div>;
        } else if(this.props.myRole === "PRODUCER") {
            return <div className="list-group">
                        <a href="/admin/manageproducts" className="list-group-item active">Manage Products</a>
                    </div>;
        }
    }

    render() {
    
        if((this.props.myRole === "ADMIN" || this.props.myRole === "PRODUCER") && this.props.username !== "") {
          return (
              <div style={{ fontSize: "13px" }}>
                <div className="card bg-light" style={{ padding: "20px" }}>
                    <div className="row">
                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                            {this.sideBarMenu()}
                        </div>
                        <div className="col-lg-10 card bg-light" style={{ padding: "20px" }}>
                        <h2>Manage Products &nbsp;&nbsp;&nbsp;
                            <a href="/admin/addproduct" class="btn btn-success" 
                            style={{ fontSize: "12px" }}><i className="fa fa-plus"></i> Add product</a>
                        </h2>
                        <hr/>
                        <ProductsListView />
                        </div>
                    </div>
                </div>
            </div>
          )
        } else {
          return <Redirect to='/login' />
        }

    }
}

const mapStateToProps = (state) => {
  return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps)(ManageProducts);