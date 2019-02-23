import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import ProductsListView from './ProductsListView';
import SideBar from './SideBar';

class ManageProducts extends Component {

    render() {
        if((this.props.myRole === "ADMIN" || this.props.myRole === "PRODUCER") && this.props.username !== "") {
          return (
              <div style={{ fontSize: "13px" }}>
                <div className="card bg-light" style={{ padding: "20px" }}>
                    <div className="row">
                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                        <SideBar active='Manage Products' />
                        </div>
                        <div className="col-lg-10 card bg-light" style={{ padding: "20px" }}>
                        <h2>Manage Products &nbsp;&nbsp;&nbsp;
                            <Link to="/admin/addproduct" className="btn btn-success" style={{ fontSize: "12px" }}>
                            <i className="fa fa-plus"></i> Add product
                            </Link>
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