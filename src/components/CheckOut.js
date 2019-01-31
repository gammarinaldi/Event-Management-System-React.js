import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { convertToRupiah } from '../actions';
import { CART_GETLIST, TRX_ADD, TRXDETAILS_ADD, CART_DELETE } from '../supports/api-url/apisuburl';

class CheckOut extends Component {

    state = { cartList: [], selectedIdEdit: 0, totalPrice: 0, totalQty: 0 }

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
        const payment = parseInt(this.refs.payment.value);

        if(!payment) {
            alert('Please input amount of payment');
        } else {
            const change = payment - this.state.totalPrice;
            if(change < 0 ) {
                return alert('Insuffucient payment');
            } else {
                var currentdate = new Date();
                var datetime = currentdate.getDate() + "/" +
                    (currentdate.getMonth() + 1) + "/" +
                    currentdate.getFullYear() + " @ " +
                    currentdate.getHours() + ":" +
                    currentdate.getMinutes() + ":" +
                    currentdate.getSeconds();

                var invoice = 
                `INV/${this.props.username}/${currentdate.getFullYear()}/${currentdate.getMonth()}/${currentdate.getDate()}/${currentdate.getHours()}${currentdate.getMinutes()}${currentdate.getSeconds()}`;

                axios.post(API_URL_1 + TRX_ADD, {
                    username: this.props.username,
                    invoice: invoice,
                    trxDate: datetime,
                    totalPrice: this.state.totalPrice,
                    totalQty: this.state.totalQty
                }).then((res) => {
                    axios.post(API_URL_1 + TRXDETAILS_ADD, {
                        invoice: invoice,
                        username: this.props.username,
                        itemDetails: this.state.cartList
                    }).then((res) => {
                        this.state.cartList.forEach((item) => {
                            axios.delete(API_URL_1 + CART_DELETE + item.id)
                            .then((res) => {
                                console.log(res);
                            }).catch((err) => {
                                console.log(err);
                            })
                        })
                        document.getElementById("change").innerHTML = 
                        '<div className="alert alert-primary"><h3>Your change: ' + this.props.convertToRupiah(change) + ' , Thank you!</h3></div>';
                    }).catch((err) => {
                        console.log(err);
                    })
                        
                }).catch((err) => {
                    console.log(err);
                })

            }

        }
    }
  
    renderListCart = () => {
        
        var listJSXCart = this.state.cartList.map((item) => {

            return (
                <tr>
                    <td><center>{item.idProduct}</center></td>
                    <td>{item.categoryName}</td>
                    <td>{item.item}</td>
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
                <div className="card bg-light" style={{ fontSize: "13px" }}>
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
                                        <th scope="col"><center>Product ID</center></th>
                                        <th scope="col"><center>Category</center></th>
                                        <th scope="col"><center>Item</center></th>
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
                                                <h5>
                                                    TOTAL PRICE : {this.props.convertToRupiah(this.state.totalPrice)}
                                                    &nbsp;
                                                    ( {this.state.totalQty} item(s) )
                                                </h5>
                                            </div>
                                        </td>
                                    </tr>
                                    <br/>
                                    <tr>
                                        <td colSpan="8">
                                            <div class="alert alert-warning" role="alert">
                                            <center>
                                                <h4>Please pay to:<br/><br/>
                                                    BCA a/n PT. PURWADHIKA KIRANA NUSANTARA<br/>
                                                    KCU Alam Sutera<br/>
                                                    Acc No. 604-168-8880
                                                </h4></center>
                                            </div>
                                        </td>
                                    </tr>
                                    <br/>
                                    <tr>
                                        <td colSpan="8">
                                            <div align="center">
                                                <h3>Payment Confirmation</h3>
                                                Please upload proof of payment
                                                <hr/>
                                                <br/>
                                                
                                                <div className="row">
                                                    <div className="col-lg-3">&nbsp;</div>
                                                    <div className="col-lg-6 align-self-center">
                                                        <input type="file" id="input" ref="payment" 
                                                        style={{ fontSize: "12px" }} className="form-control-file"/>
                                                    </div>
                                                    <div className="col-lg-3">&nbsp;</div>
                                                </div>
                                                <br/><br/>
                                                
                                                <button className="btn btn-success" style={{ fontSize: "12px" }}
                                                    onClick={ () => this.onBtnConfirm() }>
                                                <i className="fa fa-check fa-sm"></i>
                                                &nbsp; Submit
                                                </button>
                                                <br/><br/>

                                                <div id="change"></div>
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

export default connect(mapStateToProps, { convertToRupiah })(CheckOut);