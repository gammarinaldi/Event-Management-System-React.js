import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { convertToRupiah, sortingJSON } from '../actions';
import { TRX_GET, TRX_GETLIST } from '../supports/api-url/apisuburl';
import moment from 'moment';

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
            console.log(err)
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
  
    renderListOrders = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var sortedListOrders = this.state.listOrders.sort(this.props.sortingJSON('id', 'desc'));
        var renderedProjects = sortedListOrders.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXOrders = renderedProjects.map((item, x) => {

            return (
                <tr key={x}>   
                    <td><center>{item.id}</center></td>
                    <td><center><a href={'/historydetails?idTrx=' + item.id + '&invoice=' + item.invoice}>{item.invoice}</a></center></td>
                    <td><center>{item.username}</center></td>
                    <td>{item.bankName}</td>
                    <td>{item.accNumber}</td>
                    <td>
                        <a href={`${API_URL_1}${item.receipt}`} target="_blank" rel="noopener noreferrer">
                        <img src={`${API_URL_1}${item.receipt}`} alt={item.invoice} width={100} /></a>
                    </td>
                    <td>{moment(item.trxDateTime).format('DD/MMM/YYYY H:mm:ss')}</td>
                    <td><center>{item.totalQty}</center></td>
                    <td>{this.props.convertToRupiah(item.totalPrice)}</td>
                    <td><center>{item.status}</center></td>
                </tr>
            )

        })
        
        return listJSXOrders;
    }
        
    render() {
        
        if(this.props.username !== "") {
            
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
                                        <th scope="col"><center>Trx Id</center></th>
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
        } else {
            return (
                <Redirect to="/login" />
            )
        }
    }

}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps, { convertToRupiah, sortingJSON })(History);