import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { convertToRupiah, sideBarMenu } from '../actions';
import { TRXDETAILS_GET } from '../supports/api-url/apisuburl';
import moment from 'moment';
import Modal from "react-responsive-modal";
import Barcode from 'react-barcode';
import SideBar from './admin/SideBar';

const styles = {
    fontFamily: "sans-serif",
    textAlign: "center"
  };

class HistoryDetails extends Component {

    state = { listOrderDetails: [], open: false }

    componentDidMount() {
        this.showOrderDetails();
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    id = () => {
        var params = queryString.parse(this.props.location.search);
        return params.idTrx;
    }

    invoice = () => {
        var params = queryString.parse(this.props.location.search);
        return params.invoice;
    }

    showOrderDetails = () => {
        axios.post(API_URL_1 + TRXDETAILS_GET, {
            idTrx: this.id()
        }).then((res) => {
            this.setState({
                listOrderDetails: res.data
            })
        }).catch((err) => {
            console.log(err)
        })
    }
  
    renderListOrderDetails = () => {
        const { open } = this.state;
        var listJSXOrderDetails = this.state.listOrderDetails.map((item) => {

            if(item.barcode === '0') {
                return (
                    <tr>   
                        <td><center>{item.idProduct}</center></td>
                        <td><left>{item.item}</left></td>
                        <td><left>{item.category}</left></td>
                        <td><left>{item.address}</left></td>
                        <td><center>Start: {moment(item.startDate).format('DD/MMM/Y')}<br/>
                        End: {moment(item.endDate).format('DD/MMM/Y')}</center></td>
                        <td><center>Start: {item.startTime}<br/>End: {item.endTime}</center></td>
                        <td><right>{this.props.convertToRupiah(item.price)}</right></td>
                        <td><center>{item.qty}</center></td>
                        <td>
                            <center>
                                <div style={styles}>
                                    Your purchase not confirmed yet.
                                </div>
                            </center>
                        </td>
                    </tr>
                )
            } else {
                return (
                    <tr>   
                        <td><center>{item.idProduct}</center></td>
                        <td><left>{item.item}</left></td>
                        <td><left>{item.category}</left></td>
                        <td><left>{item.address}</left></td>
                        <td><center>Start: {moment(item.startDate).format('DD/MMM/Y')}<br/>
                        End: {moment(item.endDate).format('DD/MMM/Y')}</center></td>
                        <td><center>Start: {item.startTime}<br/>End: {item.endTime}</center></td>
                        <td><right>{this.props.convertToRupiah(item.price)}</right></td>
                        <td><center>{item.qty}</center></td>
                        <td>
                            <center>
                                <div style={styles}>
                                <button onClick={this.onOpenModal}>Show Barcode</button>
                                <Modal open={open} onClose={this.onCloseModal} center>
                                <br/><br/><br/>
                                <h2>Show this barcode when you check in</h2>
                                <br/>
                                <p align="center" style={{ fontSize: "16px" }}>
                                    <Barcode value={item.barcode} />
                                </p>
                                </Modal>
                                </div>
                            </center>
                        </td>
                    </tr>
                )
            }

        })
        
        return listJSXOrderDetails;
    }
        
    render() {

        if(this.props.username !== "") {

            if(this.props.myRole === "ADMIN") {
                return(
                    <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                        <div className="row">
                            <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                            <SideBar myRole={this.props.myRole} />
                            </div>
                            <div className="col-lg-10 bg-light" style={{ padding: "20px" }}>
                            <h2>Manage Transactions</h2>
                            <hr/>
                            
                            <div className="card bg-light" style={{ fontSize: "13px", paddingLeft: "20px" }}>
                                <div className="col-lg-12 align-self-center">
                                    <div className="col-lg-12 text-center" style={{ paddingTop: "20px" }}>
                                        <h3 className="section-heading">Transaction Details</h3>
                                        <h4 className="section-subheading text-muted">{this.invoice()}</h4>
                                    </div>
                                    <br/>
                                    <div className="table-responsive col-lg-12 shadow p-3 mb-5 bg-white rounded">
                                        <table className="table table-bordered table-hover">
                                            <thead className="thead-dark">
                                                <tr>
                                                    <th scope="col"><center>PID</center></th>
                                                    <th scope="col"><center>Item</center></th>
                                                    <th scope="col"><center>Category</center></th>
                                                    <th scope="col"><center>Location</center></th>
                                                    <th scope="col"><center>Date</center></th>
                                                    <th scope="col"><center>Time</center></th>
                                                    <th scope="col"><center>Price</center></th>
                                                    <th scope="col"><center>Qty</center></th>
                                                    <th scope="col"><center>Barcode</center></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.renderListOrderDetails()}
                                            </tbody>
                                        </table>
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
                            <h2 className="section-heading text-uppercase">Transaction Details</h2>
                            <h3 className="section-subheading text-muted">{this.invoice()}</h3>
                        </div>
                        <br/>
                        <div className="table-responsive col-lg-12 shadow p-3 mb-5 bg-white rounded">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col"><center>PID</center></th>
                                        <th scope="col"><center>Item</center></th>
                                        <th scope="col"><center>Category</center></th>
                                        <th scope="col"><center>Location</center></th>
                                        <th scope="col"><center>Date</center></th>
                                        <th scope="col"><center>Time</center></th>
                                        <th scope="col"><center>Price</center></th>
                                        <th scope="col"><center>Qty</center></th>
                                        <th scope="col"><center>Barcode</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.renderListOrderDetails()}
                                </tbody>
                            </table>
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
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps, { convertToRupiah, sideBarMenu })(HistoryDetails);