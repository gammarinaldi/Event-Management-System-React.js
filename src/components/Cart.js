import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { convertToRupiah } from '../actions';
import { CART_GETLIST, CART_EDIT, CART_DELETE } from '../supports/api-url/apisuburl';

class Cart extends Component {

    state = { listCart: [], selectedIdEdit: 0 }
    
    componentDidMount() {
        // axios.get(API_URL_1 + '/cart', {
        //     params: {
        //         username: this.props.username
        //     }
        // }).then((res) => {
        //     console.log(res);
        //     for (let i = 0; i < res.data.length; i++) {
        //         axios.get(API_URL_1 + '/products', {
        //             params: {
        //                 id: res.data[i].id
        //             }
        //         }).then((res) => {
        //             console.log(res);
        //             this.setState({
        //                 //listCart: [...this.state.listCart, res.data]
        //                 //listCart: this.state.listCart.concat([res.data])
        //                 listCart: res.data
        //               })
        //         }).catch((err) => {
        //             console.log(err);
        //         })
        //     }
        // }).catch((err) => {
        //     console.log(err);
        // })
        // console.log(this.state.listCart);
        this.showCart();
    }

    showCart = () => {
        axios.post(API_URL_1 + CART_GETLIST, {
            username: this.props.username
        })
        .then((res) => {
            console.log(res);
            this.setState({ 
                listCart: res.data,
                selectedIdEdit: 0 
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    totalPrice = () => {
        var total = 0;
        for(let i = 0; i < this.state.listCart.length; i++) {
            total += this.state.listCart[i].qty * this.state.listCart[i].price;
        }
        return total;
    }

    onBtnCheckout = () => {
        window.location = '/checkout';  
    }

    onBtnSaveClick = (id) => {
        const idProduct = parseInt(this.refs.updateIdProduct.value);
        const username = this.refs.updateUsername.value;
        const category = this.refs.updateCategory.value;
        const item = this.refs.updateItem.value;
        const img = this.refs.updateImg.value;
        const price = parseInt(this.refs.updatePrice.value);
        const qty = parseInt(this.refs.updateQty.value);

        axios.put(API_URL_1 + CART_EDIT + id, {
            idProduct, username, category, item, img, price, qty
        }).then((res) => {
            this.showCart();
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (id, item) => {
        if(window.confirm('Are you sure want to delete: ' + item + ' ?')) {
            axios.delete(API_URL_1 + CART_DELETE + id)
                .then((res) => {
                    this.showCart();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    onBtnCS = () => {
        return window.location = '/productsgridview';
    }

    btnCustom = () => {
        var btnCustom;
        if(!this.state.listCart.length) {
            btnCustom = <h5>
                        <button className="btn btn-success" style={{ fontSize: "13px" }}
                            onClick={ () => this.onBtnCS() }>
                        <i className="fa fa-shopping-cart fa-sm"></i>
                        &nbsp; Continue Shopping
                        </button>
                        </h5>;
        } else {
            btnCustom = <h5>
                        <button className="btn btn-info" style={{ fontSize: "13px" }}
                            onClick={ () => this.onBtnCS() }>
                        <i className="fa fa-shopping-cart fa-sm"></i>
                        &nbsp; Continue Shopping
                        </button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <button className="btn btn-success" style={{ fontSize: "13px" }}
                            onClick={ () => this.onBtnCheckout() }>
                        <i className="fa fa-check fa-sm"></i>
                        &nbsp; CHECKOUT
                        </button>
                        </h5>;
        }
        return btnCustom;
    }
  
    renderListCart = () => {
        
        var listJSXCart = this.state.listCart.map((item) => {

            //====================START >> EDIT ITEM PRODUK=========================//
            if(item.id === this.state.selectedIdEdit) {
                return (
                    <tr>
                        <td><center>{item.idProduct}</center></td>
                        <input type="hidden" ref="updateIdProduct" defaultValue={item.idProduct} />
                        <input type="hidden" ref="updateUsername" defaultValue={item.username} />
                        <td>{item.category}<input type="hidden" ref="updateCategory" defaultValue={item.category} /></td>
                        <td>{item.item}<input type="hidden" ref="updateItem" defaultValue={item.item} /></td>
                        <td>{this.props.convertToRupiah(item.price)}
                        <input type="hidden" ref="updatePrice" defaultValue={item.price} /></td>
                        <td><center><img src={item.img} alt={item.item} width="150px" height="150px" /></center>
                        <input type="hidden" ref="updateImg" defaultValue={item.img} /></td>
                        <td><input type="number" defaultValue={item.qty}  size="4" 
                        ref="updateQty" className="form-control" /></td>
                        <td>{this.props.convertToRupiah(item.price*item.qty)}</td>
                        <td>
                            <center>
                            <button className="btn btn-success"
                                onClick={() => this.onBtnSaveClick(item.id)}>
                                <i className="fa fa-save fa-sm"></i>
                            </button>
                            &nbsp;
                            <button className="btn btn-secondary"
                                onClick={() => this.setState( { selectedIdEdit:0 } )}>
                                <i className="fa fa-times fa-sm"></i>
                            </button>
                            </center>
                        </td>
                    </tr>
                )
            }
            //====================END >> EDIT ITEM PRODUK=========================//

            //====================SHOW >> SHOW ITEM PRODUK=========================//
            return (
                <tr>
                    <td><center>{item.idProduct}</center></td>
                    <td><a href={`/productsdetails?id=${item.idProduct}`}>{item.category}</a></td>
                    <td>{item.item}</td>
                    <td>{this.props.convertToRupiah(item.price)}</td>
                    <td><center><img src={item.img} alt={item.item} width="150px" height="150px" /></center></td>
                    <td><center>{item.qty}</center></td>
                    <td>{this.props.convertToRupiah(item.price*item.qty)}</td>
                    <td>
                        <center>
                        <button className="btn btn-info" 
                            onClick={ () => this.setState({ selectedIdEdit: item.id }) }>
                            <i className="fa fa-edit fa-sm"></i>
                        </button>
                        &nbsp;
                        <button className="btn btn-danger"
                            onClick={ () => this.onBtnDeleteClick(item.id, item.item) }>
                            <i className="fa fa-trash fa-sm"></i>
                        </button>
                        </center>
                    </td>
                </tr>
            )
        //====================END >> SHOW ITEM PRODUK=========================//

        });
        
        return listJSXCart;
    }
        
    render() {
        
        if(this.props.username !== "") {
            
            return(
                <div className="card bg-light" style={{ fontSize: "13px" }}>
                    <div className="col-lg-10 align-self-center">
                        <div className="col-lg-12 text-center" style={{ paddingTop: "20px" }}>
                            <h2 className="section-heading text-uppercase">Cart</h2>
                            <h3 className="section-subheading text-muted">Check again before you checkout</h3>
                            <br/>
                        </div>
                        <br/>
                        <div className="table-responsive col-lg-12 shadow p-3 mb-5 bg-white rounded">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col"><center>Product ID</center></th>
                                        <th scope="col"><center>Category</center></th>
                                        <th scope="col"><center>Item</center></th>
                                        <th scope="col"><center>Price</center></th>
                                        <th scope="col"><center>Image</center></th>
                                        <th scope="col"><center>Qty</center></th>
                                        <th scope="col"><center>Sub-Total</center></th>
                                        <th scope="col"><center>Action</center></th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.renderListCart()}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="8">
                                            <div align="right"><h5>TOTAL : {this.props.convertToRupiah(this.totalPrice())}</h5></div>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td colSpan="8">
                                            <div align="right">
                                                {this.btnCustom()}
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

export default connect(mapStateToProps, { convertToRupiah })(Cart);