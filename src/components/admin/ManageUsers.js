import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import UsersList from './UsersList';

class ManageUsers extends Component {

    render() {
    
        if(this.props.myRole === "ADMIN" && this.props.username !== "") {
          return (
            <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                <div className="row">
                    <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                        <div className="list-group">
                            <a href="/" className="list-group-item">Dashboard</a>
                            <a href="/admin/manageproducts" className="list-group-item">Manage Products</a>
                            <a href="/admin/manageusers" className="list-group-item active">Manage Users</a>
                            <a href="/admin/managetrx" className="list-group-item">Manage Transactions</a>
                            <a href="/admin/managecategory" className="list-group-item">Manage Category</a>
                            <a href="/admin/managelocation" className="list-group-item">Manage Location</a>
                            <a href="/admin/viewactivitylog" className="list-group-item">View Activity Log</a>
                        </div>
                    </div>
                    <div className="col-lg-10 card bg-light" style={{ padding: "20px" }}>
                    <h2>Manage Users</h2>
                    <hr/>
                    <UsersList />
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

export default connect(mapStateToProps)(ManageUsers);