import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import { convertToRupiah } from '../../actions'; 
import { 
    USERS_GETLIST, 
    PRODUCTS_GETLIST, 
    TRXDETAILS_GETLIST, 
    TRX_GETLIST
} from '../../supports/api-url/apisuburl';

class Dashboard extends Component {

    state = { listUsers: [], listProducts: [], totalSales: 0, totalTrx: [] }

    componentDidMount() {
        this.totalUsers();
        this.totalProducts();
        this.totalSales();
        this.totalTrx();
    }

    totalUsers = () => {
        axios.get(API_URL_1 + USERS_GETLIST)
            .then((res) => {
                this.setState({ 
                    listUsers: res.data
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    totalProducts = () => {
        axios.get(API_URL_1 + PRODUCTS_GETLIST)
            .then((res) => {
                console.log(res);
                this.setState({ listProducts: res.data });
            }).catch((err) => {
                console.log(err);
            })
    }

    totalTrx = () => {
        axios.get(API_URL_1 + TRXDETAILS_GETLIST)
            .then((res) => {
                this.setState({ totalTrx: res.data });
            }).catch((err) => {
                console.log(err);
            })
    }

    totalSales = () => {
        axios.get(API_URL_1 + TRX_GETLIST)
            .then((res) => {
                var price = 0;
                res.data.forEach(element => {
                    price += element.totalPrice;
                });
                this.setState({ 
                    totalSales: price
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    render() {
    
        if(this.props.myRole === "ADMIN" && this.props.username !== "") {
          return (
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                    <div className="row">
                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                            <div className="list-group">
                                <a href="/" className="list-group-item active">
                                Dashboard
                                </a>
                                <a href="/admin/manageproducts" className="list-group-item">Manage Products</a>
                                <a href="/admin/manageusers" className="list-group-item">Manage Users</a>
                                <a href="/admin/managetrx" className="list-group-item">Manage Transactions</a>
                                <a href="/admin/managecategory" className="list-group-item">Manage Category</a>
                                <a href="/admin/managelocation" className="list-group-item">Manage Location</a>
                                <a href="/admin/viewactivitylog" className="list-group-item">View Activity Log</a>
                            </div>
                        </div>
                        <div className="card bg-light" style={{ padding: "20px" }}>
                        <h2>Admin Dashboard</h2>
                        <hr/>
                        <div className="row shadow p-3 mb-5 bg-white rounded">
                        <div className="table-responsive col-lg-12">
                            <table className="table">
                                <thead>
                                <tr>
                                    <th>Total Users:</th>
                                    <th>Total Products:</th>
                                    <th>Total Transactions:</th>
                                    <th>Total Sales:</th>
                                </tr>
                                </thead>
                                <tbody>     
                                <tr className="table-warning">
                                    <td align="center"><h1>{this.state.listUsers.length}</h1></td>
                                    <td align="center"><h1>{this.state.listProducts.length}</h1></td>
                                    <td align="center"><h1>{this.state.totalTrx.length}</h1></td>
                                    <td align="center"><h1>{this.props.convertToRupiah(this.state.totalSales)}</h1></td>
                                </tr>
                                </tbody>
                            </table>
                            </div>
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

export default connect(mapStateToProps, { convertToRupiah })(Dashboard);