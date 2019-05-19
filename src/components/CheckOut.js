import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { convertToRupiah, cartCount } from '../actions';
import { CART_GETLIST, TRX_ADD, TRXDETAILS_ADD, CART_DELETE } from '../supports/api-url/apisuburl';
import moment from 'moment';

class CheckOut extends Component {

    state = { 
        cartList: [], 
        addReceipt: 'Choose receipt',
        selectedIdEdit: 0, 
        totalPrice: 0, 
        totalQty: 0
    }

    componentDidMount() {
        this.getCartList();
    }

    getCartList = () => {
        axios.post(API_URL_1 + CART_GETLIST, {
            username: this.props.username
        }).then((res) => {
            var price = 0;
            var qty = 0;
            res.data.forEach(element => {
                price += (element.qty * element.price);
                qty += element.qty;
            });
            this.setState({ 
                cartList: res.data, 
                selectedIdEdit: 0, 
                totalPrice: price, 
                totalQty: qty 
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    onBtnConfirm = () => {

        if (!this.refs.bankName.value && !this.refs.accNo.value) {
            alert('Please input all required data!');
        } 
        else if (document.getElementById("addReceipt").files[0] === undefined) {
            alert('Please input all required data!');
        }
        else {
            var formData = new FormData();
            var headers = {
                headers: 
                {'Content-Type': 'multipart/form-data'}
            }

            var currentdate = new Date();

            var invoice = 
            `INV/${this.props.username}/${currentdate.getFullYear()}/${currentdate.getMonth()}/${currentdate.getDate()}/${currentdate.getHours()}${currentdate.getMinutes()}${currentdate.getSeconds()}`;

            var data = {
                username: this.props.username,
                bankName: this.refs.bankName.value,
                accNumber: this.refs.accNo.value,
                invoice,
                totalPrice: this.state.totalPrice,
                totalQty: this.state.totalQty,
                trxDateTime: moment(new Date()).format('DD/MMM/YYYY HH:MM:SS'),
                status: 'Unconfirmed'
            }

            if(document.getElementById('addReceipt')){
                formData.append('receipt', document.getElementById('addReceipt').files[0]);
            }

            formData.append('data', JSON.stringify(data)); //Convert object javascript menjadi JSON

            axios.post(API_URL_1 + TRX_ADD, formData, headers)
            .then((res) => {
                console.log(res.status);
                console.log(this.state.cartList);

                for(let i = 0; i < this.state.cartList.length; i++) {
                    axios.post(API_URL_1 + TRXDETAILS_ADD, {
                        idTrx: res.data[0].id,
                        idProduct: this.state.cartList[i].idProduct,
                        qty: this.state.cartList[i].qty
                    }).then((res) => {
                        console.log(res);
                        axios.delete(API_URL_1 + CART_DELETE + this.state.cartList[i].idCart)
                        .then((res) => {
                            console.log(res);
                            this.props.cartCount(this.props.username);
                        }).catch((err) => {
                            console.log(err);
                        })
                    }).catch((err) => {
                        console.log(err);
                    })
                }

                document.getElementById("change").innerHTML = 
                '<div align="center"><br/><h3><strong>Payment success, your order will be proceed, Thank you!</strong></h3><br/></div>';
            })
            .catch((err) =>{
                console.log(err);
                document.getElementById("change").innerHTML = '<strong>Upload failed, file format is not supported.</strong>';
            })
        }
    }
  
    renderListCart = () => {
        
        var listJSXCart = this.state.cartList.map((item, index) => {

            return (
                <tr key={index}>
                    <td><center>{item.idProduct}</center></td>
                    <td>{item.item}</td>
                    <td>{item.categoryName}</td>
                    <td>{this.props.convertToRupiah(item.price)}</td>
                    <td><center>{item.qty}</center></td>
                    <td>{this.props.convertToRupiah(item.price*item.qty)}</td>
                </tr>
            )

        })
        
        return listJSXCart;
    }
        
    render() {
        
        if(this.props.username !== "") {
            
            return(
                <div className="card bg-light" style={{ fontSize: "13px" }} id="change">
                    <div className="col-lg-6 align-self-center">
                        <div className="col-lg-12 text-center" style={{ paddingTop: "20px" }}>
                            <h2 className="section-heading text-uppercase">Checkout</h2>
                            <h4 className="section-subheading text-muted">Summary and Payment</h4>
                            <br/>
                        </div>
                        <br/>
                        <div class="table-responsive card shadow p-3 mb-5 bg-white rounded">
                            <table className="table table-bordered">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col"><center>PID</center></th>
                                        <th scope="col"><center>Item</center></th>
                                        <th scope="col"><center>Category</center></th>
                                        <th scope="col"><center>Price</center></th>
                                        <th scope="col"><center>Qty</center></th>
                                        <th scope="col"><center>Sub-Total</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.renderListCart()}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="8">
                                            <div align="center">
                                                <h2>
                                                    GRAND TOTAL : {this.props.convertToRupiah(this.state.totalPrice)}
                                                    &nbsp;
                                                    ( {this.state.totalQty} item(s) )
                                                </h2>
                                            </div>
                                        </td>
                                    </tr>
                                    <br/>
                                    <tr>
                                        <td colSpan="8">
                                            <div class="alert alert-warning" role="alert">
                                            <center>
                                                <h4>Please pay<br/>
                                                    <h2>
                                                        <strong>{this.props.convertToRupiah(this.state.totalPrice+Math.floor(Math.random() * 999))}</strong>
                                                    </h2>
                                                    to:<br/>
                                                    BCA a/n PT. SATU NUSANTARA<br/>
                                                    KCU The Breeze<br/>
                                                    Acc No. 123-456-78910
                                                </h4></center>
                                            </div>
                                        </td>
                                    </tr>
                                    <br/>
                                    <tr>
                                        <td colSpan="8">
                                            <div align="center">
                                                <h3>Payment Confirmation</h3>
                                                Please input your bank name, account number, and proof of payment
                                                <hr/>
                                                <br/>
                                                <div className="row">
                                                    <div className="col-lg-3">&nbsp;</div>
                                                    <div className="col-lg-6 align-self-center">
                                                        Your Bank Name: <input ref="bankName" className="form-control form-control-lg" 
                                                        style={{ fontSize: "14px" }} 
                                                        placeholder="Your Bank Name" type="text" /><br/>
                                                        Your Account No: <input ref="accNo" className="form-control form-control-lg" 
                                                        style={{ fontSize: "14px" }} 
                                                        placeholder="Your Account Number" type="text" /><br/>
                                                    </div>
                                                    <div className="col-lg-3">&nbsp;</div>
                                                </div>
                                                <br/>
                                                <div className="row">
                                                    <div className="col-lg-3">&nbsp;</div>
                                                    <div className="col-lg-6 align-self-center">
                                                        Upload proof of payment:<br/>
                                                        (jpg, jpeg, png)
                                                        <br/><br/>
                                                        <input type="file" id="addReceipt" name="addReceipt" 
                                                        label={this.state.addReceipt} onChange={this.addReceiptChange} />
                                                    </div>
                                                    <div className="col-lg-3">&nbsp;</div>
                                                </div>
                                                <br/><br/>

                                                <div id="confirm">
                                                    <button className="btn btn-success" style={{ fontSize: "12px" }}
                                                        onClick={ () => this.onBtnConfirm() }>
                                                    <i className="fa fa-check fa-sm"></i>
                                                    &nbsp; Submit
                                                    </button>
                                                </div>
                                                
                                            </div>
                                        </td>
                                    </tr>

                                </tfoot>
                            </table>
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

export default connect(mapStateToProps, { convertToRupiah, cartCount })(CheckOut);