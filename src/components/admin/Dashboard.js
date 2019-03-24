import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import { convertToRupiah } from '../../actions'; 
import SideBar from './SideBar';
import { 
    USERS_GETLIST, 
    PRODUCTS_GETLIST,
    TRX_GETLIST,
    TOTAL_TRX,
    BEST_SELLER,
    WORST_SELLER,
    TOTAL_CONFIRMED,
    LEFT_IN_CART
} from '../../supports/api-url/apisuburl';

class Dashboard extends Component {

    state = { 
        listUsers: 0, 
        listProducts: 0, 
        totalSales: 0, 
        itemsSold: 0, 
        bestSeller: '', 
        totalPriceBestSeller: 0,
        worstSeller: '', 
        totalConfirmed: 0,
        leftInCart: 0,
        salesConversion: ''
     }

    componentDidMount() {
        this.totalUsers();
        this.totalProducts();
        this.totalSales();
        this.itemsSold();
        this.bestSeller();
        this.worstSeller();
        this.totalConfirmed();
        this.leftInCart();
        setTimeout(() => { 
            this.salesConversion();
        }, 100);
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

    itemsSold = () => {
        axios.get(API_URL_1 + TOTAL_TRX)
            .then((res) => {
                this.setState({ 
                    itemsSold: res.data[0].qty 
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    totalConfirmed = () => {
        axios.get(API_URL_1 + TOTAL_CONFIRMED)
            .then((res) => {
                console.log(res)
                this.setState({ 
                    totalConfirmed: res.data[0].confirmed 
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    leftInCart = () => {
        axios.get(API_URL_1 + LEFT_IN_CART)
            .then((res) => {
                console.log(res);
                if(res.data[0].qty > 0) {
                    this.setState({ 
                        leftInCart: res.data[0].qty 
                    });
                } 
            }).catch((err) => {
                console.log(err);
            })
    }

    totalSales = () => {
        axios.get(API_URL_1 + TRX_GETLIST)
            .then((res) => {
                var price = 0;
                res.data.forEach(item => {
                    price += item.totalPrice;
                });
                this.setState({ 
                    totalSales: price
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    bestSeller = () => {
        axios.get(API_URL_1 + BEST_SELLER)
            .then((res) => {
                console.log(res)
                this.setState({ 
                    bestSeller: res.data[0].item,
                    totalPriceBestSeller: res.data[0].totalPrice
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    worstSeller = () => {
        axios.get(API_URL_1 + WORST_SELLER)
            .then((res) => {
                console.log(res)
                this.setState({ 
                    worstSeller: res.data[0].item
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    salesConversion = () => {
        var sc = Math.ceil(100 - ((this.state.leftInCart / this.state.itemsSold) * 100));
        var result = '';
        if(sc <= 50) result = `${sc}% (Low Performance)`;
        else if(sc >= 60 && sc <= 79) result = `${sc}% (Medium Performance)`;
        else if(sc >= 80) result = `${sc}% (Good Performance)`;
        this.setState({ 
            salesConversion: result
        });
    }

    render() {
    
        if(this.props.myRole === "ADMIN" && this.props.username !== "") {
          return (
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                    <div className="row">
                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                            {/* {this.props.sideBarMenu({ myRole: this.props.myRole, active: 'Dashboard' })} */}
                            <SideBar active='Dashboard' />
                        </div>
                        <div className="col-lg-8 card bg-light" style={{ paddingTop: "20px", paddingRight: "40px", paddingLeft: "40px" }}>
                        <h2>Admin Dashboard</h2>
                        <hr/>
                        <div className="row shadow p-3 mb-5 bg-white rounded">
                        <div className="table-responsive col-lg-12">
                            <table className="table">
                                <tr>
                                    <td align="left"><h3>Total Sales</h3></td>
                                    <td align="center"><h3>:</h3></td>
                                    <td><h3>{this.props.convertToRupiah(this.state.totalSales)}</h3></td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="left"><h3>Total Products</h3></td>
                                    <td align="center"><h3>:</h3></td>
                                    <td><h3>{this.state.listProducts}</h3></td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="left"><h3>Total Users</h3></td>
                                    <td align="center"><h3>:</h3></td>
                                    <td><h3>{this.state.listUsers}</h3></td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="left"><h3>Total Items Sold</h3></td>
                                    <td align="center"><h3>:</h3></td>
                                    <td><h3>{this.state.itemsSold}</h3></td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="left"><h3>Items Left in Cart</h3></td>
                                    <td align="center"><h3>:</h3></td>
                                    <td><h3>{this.state.leftInCart}</h3></td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="left"><h3>Sales Conversion</h3></td>
                                    <td align="center"><h3>:</h3></td>
                                    <td><h3>{this.state.salesConversion}</h3></td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="left"><h3>Best Seller</h3></td>
                                    <td align="center"><h3>:</h3></td>
                                    <td><h3>{this.state.bestSeller}</h3></td>
                                    <td>&nbsp;</td>
                                </tr>
                                <tr>
                                    <td align="left"><h3>Worst Seller</h3></td>
                                    <td align="center"><h3>:</h3></td>
                                    <td><h3>{this.state.worstSeller}</h3></td>
                                    <td>&nbsp;</td>
                                </tr>
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