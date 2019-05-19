import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { convertToRupiah, cartCount, refreshSelectProduct } from '../actions';
import { CART_GETLIST, CART_EDIT, CART_DELETE } from '../supports/api-url/apisuburl';

class Cart extends Component {

    state = { listCart: [], selectedIdEdit: 0, open: false }
    
    componentDidMount() {
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

    onBtnSaveClick = (id) => {
        const qty = parseInt(this.refs.updateQty.value);
        axios.put(API_URL_1 + CART_EDIT + id, {
            qty
        }).then((res) => {
            console.log(res);
            this.props.cartCount(this.props.username);
            this.showCart();
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (id, item) => {
        if(window.confirm('Are you sure want to delete: ' + item + ' ?')) {
            axios.delete(API_URL_1 + CART_DELETE + id)
                .then((res) => {
                    console.log(res);
                    this.props.cartCount(this.props.username);
                    this.showCart();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    btnCustom = () => {
        var btnCustom;
        if(!this.state.listCart.length) {
            btnCustom = <h5>
                        <Link to="/productsgridview" className="btn btn-info" style={{ fontSize: "13px" }}
                        onClick={() => this.props.refreshSelectProduct()}>
                        <i className="fa fa-shopping-cart fa-sm"></i>
                        &nbsp; Continue Shopping
                        </Link>
                        </h5>;
        } else {
            btnCustom = <h5>
                        <Link to="/productsgridview" className="btn btn-info" style={{ fontSize: "13px" }}
                        onClick={() => this.props.refreshSelectProduct()}>
                        <i className="fa fa-shopping-cart fa-sm"></i>
                        &nbsp; Continue Shopping
                        </Link>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Link to="/checkout" className="btn btn-success" style={{ fontSize: "13px" }}>
                        <i className="fa fa-shopping-cart fa-sm"></i>
                        &nbsp; Checkout
                        </Link>
                        </h5>;
        }
        return btnCustom;
    }
  
    renderListCart = () => {
        
        var listJSXCart = this.state.listCart.map((item) => {

            //====================START >> EDIT ITEM PRODUK=========================//
            if(item.idCart === this.state.selectedIdEdit) {
                console.log(item.id)
                return (
                    <tr>
                        <td><center>{item.idProduct}</center></td>
                        <td>{item.item}</td>
                        <td>{item.categoryName}</td>
                        <td>{this.props.convertToRupiah(item.price)}</td>
                        <td><center>
                            <Link to={`${API_URL_1}${item.img}`} target="_blank" rel="noopener noreferrer">
                            <img src={`${API_URL_1}${item.img}`} alt={item.item} width={100} />
                            </Link>
                            </center></td>
                        <td><input type="number" size="4" ref="updateQty" defaultValue={item.qty} className="form-control" style={{ fontSize: "13px" }}/></td>
                        <td>{this.props.convertToRupiah(item.price*item.qty)}</td>
                        <td>
                            <center>
                            <button className="btn btn-success"
                                onClick={() => this.onBtnSaveClick(item.idCart)}>
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
                    <td><Link to={`/productsdetails?id=${item.idProduct}`}>{item.item}</Link></td>
                    <td>{item.categoryName}</td>
                    <td>{this.props.convertToRupiah(item.price)}</td>
                    <td><center><a href={`${API_URL_1}${item.img}`} target="_blank" rel="noopener noreferrer">
                        <img src={`${API_URL_1}${item.img}`} alt={item.item} width={100} /></a></center></td>
                    <td><center>{item.qty}</center></td>
                    <td>{this.props.convertToRupiah(item.price*item.qty)}</td>
                    <td>
                        <center>
                        {/* <button className="btn btn-info" 
                            onClick={ () => this.setState({ selectedIdEdit: item.idCart }) }>
                            <i className="fa fa-edit fa-sm"></i>
                        </button>
                        &nbsp; */}
                        <button className="btn btn-danger"
                            onClick={ () => this.onBtnDeleteClick(item.idCart, item.item) }>
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
                                        <th scope="col"><center>Item</center></th>
                                        <th scope="col"><center>Category</center></th>
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
                                            <div align="right"><h2>GRAND TOTAL : {this.props.convertToRupiah(this.totalPrice())}</h2></div>
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

export default connect(mapStateToProps, { convertToRupiah, cartCount, refreshSelectProduct })(Cart);