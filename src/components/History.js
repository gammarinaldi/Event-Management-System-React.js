import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { Redirect, Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { convertToRupiah, sortingJSON, onActivityLog } from '../actions';
import { TRX_GET, TRX_GETLIST, TRX_STATUS_UPDATE, TRXDETAILS_QRCODE } from '../supports/api-url/apisuburl';
import SideBar from './admin/SideBar';

class History extends Component {

    state = { 
        listOrders: [],
        activePage: 1,
        itemPerPage: 5
     }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    componentDidMount() {
        if(this.props.myRole === "ADMIN") {
            this.showOrdersAdmin();
        } else {
            this.showOrders();
        }
    }

    showOrders = () => {
        axios.post(API_URL_1 + TRX_GET, {
            username: this.props.username
        }).then((res) => {
            this.setState({ 
                listOrders: res.data
            })
        }).catch((err) => {
            console.log(err);
        })
    }

    showOrdersAdmin = () => {
        axios.get(API_URL_1 + TRX_GETLIST)
        .then((res) => {
            this.setState({ 
                listOrders: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    onConfirm = (id, invoice) => {
        if(window.confirm('Are you sure want to confirm this invoice?')) {
            axios.put(API_URL_1 + TRX_STATUS_UPDATE + id, {
                status: 'Confirmed'
            }).then((res) => {
                //Generate check in QR code
                axios.put(API_URL_1 + TRXDETAILS_QRCODE + res.data[0].id, {
                    invoice,
                    email: this.props.email,
                    fullname: this.props.fullname
                }).then((res) => {
                    //=======> Activity Log
                    this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Purchase Confirmation'});
                }).catch((err) => {
                    console.log(err);
                })

                if(this.props.myRole === "ADMIN") {
                    this.showOrdersAdmin();
                } else {
                    this.showOrders();
                }

            }).catch((err) => {
                console.log(err);
            })
        }
    }
  
    renderListOrders = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var sortedListOrders = this.state.listOrders.sort(this.props.sortingJSON('id', 'desc'));
        var renderedProjects = sortedListOrders.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXOrders = renderedProjects.map((item, x) => {

            if(item.status === 'Confirmed') {
                return (
                    <tr key={x}>   
                        <td><center>{item.id}</center></td>
                        <td><center>
                            <Link to={'/historydetails?idTrx=' + item.id + '&invoice=' + item.invoice}>{item.invoice}</Link>
                            </center></td>
                        <td><center>{item.username}</center></td>
                        <td>{item.bankName}</td>
                        <td>{item.accNumber}</td>
                        <td>
                            <a href={`${API_URL_1}${item.receipt}`} target="_blank" rel="noopener noreferrer">
                            <img src={`${API_URL_1}${item.receipt}`} alt={item.invoice} width={100} /></a>
                        </td>
                        <td>{item.trxDateTime}</td>
                        <td><center>{item.totalQty}</center></td>
                        <td>{this.props.convertToRupiah(item.totalPrice)}</td>
                        <td>
                            <center>
                            <strong style={{ color: 'LIMEGREEN' }}>{item.status}</strong>
                            </center>
                        </td>
                    </tr>
                )
            } else if(this.props.myRole === 'ADMIN' && item.status === 'Unconfirmed') {
                return (
                    <tr key={x}>   
                        <td><center>{item.id}</center></td>
                        <td><center><Link to={'/historydetails?idTrx=' + item.id + '&invoice=' + item.invoice}>{item.invoice}</Link></center></td>
                        <td><center>{item.username}</center></td>
                        <td>{item.bankName}</td>
                        <td>{item.accNumber}</td>
                        <td>
                            <a href={`${API_URL_1}${item.receipt}`} target="_blank" rel="noopener noreferrer">
                            <img src={`${API_URL_1}${item.receipt}`} alt={item.invoice} width={100} /></a>
                        </td>
                        <td>{item.trxDateTime}</td>
                        <td><center>{item.totalQty}</center></td>
                        <td>{this.props.convertToRupiah(item.totalPrice)}</td>
                        <td>
                            <center>
                                <select ref="updateStatus" className="form-control form-control-lg" 
                                style={{ fontSize: "12px" }} >
                                    <option value={item.id}>{item.status}</option>
                                    <option value={item.id}>Confirm</option>
                                </select>
                                <br/>
                                <button type="submit" class="btn btn-primary" 
                                    style={{ fontSize: "12px" }}
                                    onClick={() => this.onConfirm(item.id, item.invoice)}>Update</button>
                            </center>
                        </td>
                    </tr>
                )
            } else if(item.status === 'Unconfirmed') {
                return (
                    <tr key={x}>   
                        <td><center>{item.id}</center></td>
                        <td><center><Link to={'/historydetails?idTrx=' + item.id + '&invoice=' + item.invoice}>{item.invoice}</Link></center></td>
                        <td><center>{item.username}</center></td>
                        <td>{item.bankName}</td>
                        <td>{item.accNumber}</td>
                        <td>
                            <a href={`${API_URL_1}${item.receipt}`} target="_blank" rel="noopener noreferrer">
                            <img src={`${API_URL_1}${item.receipt}`} alt={item.invoice} width={100} /></a>
                        </td>
                        <td>{item.trxDateTime}</td>
                        <td><center>{item.totalQty}</center></td>
                        <td>{this.props.convertToRupiah(item.totalPrice)}</td>
                        <td>
                            <center>
                            <strong>{item.status}</strong>
                            </center>
                        </td>
                    </tr>
                )
            } else return false;
            
        })
        
        return listJSXOrders;
    }
        
    render() {
        
        if(this.props.username !== "") {

            if(this.props.myRole === "ADMIN") {
                return(
                    <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                        <div className="row">
                            <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                            <SideBar active='Transaction Details' />
                            </div>
                            <div className="col-lg-10 bg-light" style={{ padding: "20px" }}>
                            <h2>Manage Transactions</h2>
                            <hr/>
                            
                            <div className="card bg-light" style={{ fontSize: "13px", paddingLeft: "20px" }}>
                                <div className="col-lg-12 align-self-center">
                                    <div className="col-lg-12 text-center" style={{ paddingTop: "20px" }}>
                                        <h2 className="section-heading">Transaction History</h2>
                                    </div>
                                    <br/>
                                    <div className="table-responsive col-lg-12 shadow p-3 mb-5 bg-white rounded">
                                        <table className="table table-bordered table-hover">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th scope="col"><center>TID</center></th>
                                                    <th scope="col"><center>Invoice</center></th>
                                                    <th scope="col"><center>Username</center></th>
                                                    <th scope="col"><center>Bank Name</center></th>
                                                    <th scope="col"><center>Account Number</center></th>
                                                    <th scope="col"><center>Receipt</center></th>
                                                    <th scope="col"><center>Trx Date Time</center></th>
                                                    <th scope="col"><center>Total Qty</center></th>
                                                    <th scope="col"><center>Total Price</center></th>
                                                    <th scope="col" colSpan="2"><center>Status</center></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                    {this.renderListOrders()}
                                            </tbody>
                                        </table>
                                        <Pagination
                                            activePage={this.state.activePage}
                                            itemsCountPerPage={this.state.itemPerPage}
                                            totalItemsCount={this.state.listOrders.length}
                                            pageRangeDisplayed={5}
                                            onChange={this.handlePageChange.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>

                            </div>
                        </div>
                    </div>
                )
            } else {
                return(
                    <div className="card bg-light" style={{ fontSize: "13px", paddingLeft: "20px" }}>
                        <div className="col-lg-12 align-self-center">
                            <div className="col-lg-12 text-center" style={{ paddingTop: "20px" }}>
                                <h2 className="section-heading">Transaction History</h2>
                            </div>
                            <br/>
                            <div className="table-responsive col-lg-12 shadow p-3 mb-5 bg-white rounded">
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th scope="col"><center>TID</center></th>
                                            <th scope="col"><center>Invoice</center></th>
                                            <th scope="col"><center>Username</center></th>
                                            <th scope="col"><center>Bank Name</center></th>
                                            <th scope="col"><center>Account Number</center></th>
                                            <th scope="col"><center>Receipt</center></th>
                                            <th scope="col"><center>Trx Date Time</center></th>
                                            <th scope="col"><center>Total Qty</center></th>
                                            <th scope="col"><center>Total Price</center></th>
                                            <th scope="col" colSpan="2"><center>Status</center></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {this.renderListOrders()}
                                    </tbody>
                                </table>
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={this.state.itemPerPage}
                                    totalItemsCount={this.state.listOrders.length}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <Redirect to="/login" />
            )
        }
    }

}

const mapStateToProps = (state) => {
    return { 
        idUser: state.auth.id,
        username: state.auth.username, 
        myRole: state.auth.role, 
        email: state.auth.email, 
        fullname: state.auth.fullname 
    }
}

export default connect(mapStateToProps, { convertToRupiah, sortingJSON, onActivityLog })(History);