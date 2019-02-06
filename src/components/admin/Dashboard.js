import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import { convertToRupiah, sideBarMenu } from '../../actions'; 
import { 
    USERS_GETLIST, 
    PRODUCTS_GETLIST,
    TRX_GETLIST
} from '../../supports/api-url/apisuburl';

class Dashboard extends Component {

    state = { listUsers: 0, listProducts: 0, totalSales: 0, totalTrx: 0 }

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
                    listUsers: res.data.length
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    totalProducts = () => {
        axios.get(API_URL_1 + PRODUCTS_GETLIST)
            .then((res) => {
                console.log(res);
                this.setState({ 
                    listProducts: res.data.length 
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    totalTrx = () => {
        axios.get(API_URL_1 + TRX_GETLIST)
            .then((res) => {
                this.setState({ 
                    totalTrx: res.data.length 
                });
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
                            {this.props.sideBarMenu({ myRole: this.props.myRole, active: 'Dashboard' })}
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
                                    <td align="center"><h1>{this.state.listUsers}</h1></td>
                                    <td align="center"><h1>{this.state.listProducts}</h1></td>
                                    <td align="center"><h1>{this.state.totalTrx}</h1></td>
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

export default connect(mapStateToProps, { convertToRupiah, sideBarMenu })(Dashboard);