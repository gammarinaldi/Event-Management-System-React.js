import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { select_products, convertToRupiah, cartCount } from '../actions';
import queryString from 'query-string';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faMapMarkerAlt, faBriefcase, faCalculator } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { 
    PRODUCTS_GET, 
    CATEGORY_GET, 
    LOCATION_GET, 
    CATEGORY_GETLIST, 
    WISHLIST_ADD, 
    WISHLIST_DELETE, 
    WISHLIST_GETLIST, 
    WISHLIST_GET,
    CART_ADD
} from '../supports/api-url/apisuburl';
import ShareButton from './ShareButton';
import Modal from 'react-responsive-modal';

class ProductsDetails extends Component {

    state = { 
        totalQty: 0, 
        category: '', 
        location: [], 
        days: [],
        isWishlist: [], 
        listCategory: [], 
        goToCart: 0,
        open: false 
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    componentDidMount() {
        this.getWishlist();
        this.showCategory();
        this.showProduct();

        window.scrollTo(0, 0);
    }

    showProduct = () => {
        var params = queryString.parse(this.props.location.search);
        var productsId = params.id;

        axios.post(API_URL_1 + PRODUCTS_GET, {
            id: productsId
        }).then((res) => {
            this.props.select_products(res.data[0]);
            this.setState({
                days: res.data[0].days
            });

            axios.post(API_URL_1 + CATEGORY_GET, {
                id: res.data[0].idCategory
            })
            .then((res) => {
                console.log('Category: '+res.data[0].name);
                this.setState({ 
                    category: res.data[0].name
                });
            }).catch((err) => {
                console.log(err);
            })

            axios.post(API_URL_1 + LOCATION_GET, {
                id: res.data[0].idLocation
            })
            .then((res) => {
                this.setState({ 
                    location: res.data[0]
                });
            }).catch((err) => {
                console.log(err);
            })

        })
        .catch((err) => {
            console.log(err);
        })
    }

    showCategory = () => {
        axios.get(API_URL_1 + CATEGORY_GETLIST)
        .then((res) => {
            this.setState({ 
                listCategory: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    renderCategory = (idCategory) => {
        var listJSXCategory = this.state.listCategory.map((item) => {
           if(idCategory === item.id) {
               return item.name;
           } else return false;
        })
        return listJSXCategory;
    }

    getWishlist = () => {
        axios.post(API_URL_1 + WISHLIST_GETLIST, {
            username: this.props.username
        }).then((res) => {
            console.log('Wishlist: '+res.data);
            this.setState({
                isWishlist: res.data
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    renderWishlist = (idProduct) => {
        var wishlistBtn;
        if(this.props.username === '') {
            wishlistBtn = '';
        } else {
            if(this.state.isWishlist.filter((item) => item.idProduct === idProduct).length > 0) {
                wishlistBtn =   <button className="btn btn-danger btn-sm" style={{ fontSize: "12px" }}
                                    onClick={ () => 
                                        this.onWishlistDelete(idProduct) }>
                                <i className="fa fa-check fa-sm"></i> Saved
                                </button>;
            } else {
                wishlistBtn =   <button className="btn btn-outline-primary btn-sm" style={{ fontSize: "12px" }}
                                    onClick={ () => 
                                    this.onWishlistClick(
                                        this.props.products.id, 
                                        this.props.products.idCategory
                                        ) }>
                                <i className="fa fa-heart fa-sm"></i> Wishlist
                                </button>;
            }
        }

        return wishlistBtn;
    }

    onWishlistClick = (idProduct, idCategory) => {
        axios.post(API_URL_1 + WISHLIST_ADD, {
            username: this.props.username, idProduct, idCategory
        }).then((res) => {
            this.getWishlist();
        }).catch((err) => {
            console.log(err);
        })
    }

    onWishlistDelete = (idProduct) => {
        axios.post(API_URL_1 + WISHLIST_GET, {
            idProduct
        }).then((res) => {
            console.log(res.data[0].id)
            axios.delete(API_URL_1 + WISHLIST_DELETE + res.data[0].id)
            .then((res) => {
                this.getWishlist();
            }).catch((err) => {
                console.log(err);
            })
        })
    }

    onBtnAddToCart = (idProduct, idCategory) => {
        if(this.props.username === "") {
            alert("Please Login First!");
            window.location = '/login';
        } else {
            var qty = parseInt(document.getElementById('addQty').value);
            if(!qty || qty === 0 || qty < 0) {
                alert("Please input qty!");
            } else {
                axios.post(API_URL_1 + CART_ADD, {
                    idProduct, idCategory, username: this.props.username, qty
                }).then((res) => {
                    this.props.cartCount(this.props.username);
                    alert(`Success add to cart: ${qty} item(s)`);
                }).catch((err) => {
                    console.log(err);
                    alert(`Failed add to cart`);
                })
            }
            setTimeout(() => { 
                this.setState({ goToCart: 1 });
                this.showProduct();
            }, 100);
        }
    }

    createMarkup() {
        return {__html: this.props.products.desc};
    }

    MyComponent() {
        return <div dangerouslySetInnerHTML={this.createMarkup()} />;
    }

    listDays() {
        // var temp = [];
        // for(let i = 0; i < this.state.days.length; i++) {
        //     temp.push(this.state.days[i]);
        //     temp.push(', ');
        // }

        // temp.splice(-1,1); //=====> Remove last item of array
        
        // return temp;
        return this.state.days;
    }

    render() {
        if(this.state.goToCart === 1) return <Redirect to='/cart' />
        const { open } = this.state;
        var { id, idCategory, item, price, img, startDate, endDate, startTime, endTime } = this.props.products;
        startDate = moment(startDate).format('DD MMMM YYYY');
        endDate = moment(endDate).format('DD MMMM YYYY');
        
        return(
            <div className="col-lg-12 card shadow p-3 mb-5 bg-white rounded">
                <br/><br/>
                <div className="row">
                    <div className="col-lg-2"></div>
                    <div className="col-lg-4 text-right" style={{ marginBottom: '20px' }}>
                        <Link to='#'><img src={`${API_URL_1}${img}`} alt={item} width={340} onClick={this.onOpenModal}/></Link>
                        <Modal open={open} onClose={this.onCloseModal} center>
                            <br/><br/>
                            <h2 align="center">{item}</h2>
                            <br/>
                            <p align="center" style={{ fontSize: "16px" }}>
                            <img src={`${API_URL_1}${img}`} alt={item} title={item} width='100%' />
                            </p>
                        </Modal>
                    </div>
                    <div className="col-lg-3">
                        <h2>{item}</h2>
                        <h4 className="section-subheading" style={{ color: "LIMEGREEN" }}>
                            <FontAwesomeIcon icon={faBriefcase} size="md" />&nbsp;
                            {this.state.category}
                        </h4>
                        <br/>
                        <h5 className="section-subheading text-muted">Product ID: {id}</h5>
                        <br/>
                        <h4 className="section-subheading text-muted">
                            <FontAwesomeIcon icon={faMapMarkerAlt} size="md" />&nbsp;
                            {this.state.location.city}
                        </h4>
                        <h5 className="section-subheading text-muted">{this.state.location.address}</h5>
                        <br/>
                        <h4 className="section-subheading text-muted">
                            <FontAwesomeIcon icon={faCalendarCheck} size="md" />&nbsp;Schedule:
                        </h4>
                        <h5 className="section-subheading text-muted">Start Date: {startDate}</h5>
                        <h5 className="section-subheading text-muted">End Date: {endDate}</h5>
                        <br/>
                        <h5 className="section-subheading text-muted">Day(s):&nbsp;
                            {this.listDays()}
                        </h5>
                        <br/>
                        <h5 className="section-subheading text-muted">Start Time: {startTime}</h5>
                        <h5 className="section-subheading text-muted">End Time: {endTime}</h5>
                    </div>
                    <div className="col-lg-3"></div>
                </div>
                <div className="row">
                    <div className="col-lg-6 mx-auto" align="justify" style={{ fontSize: "14px" }}>
                        <hr/>
                        {this.MyComponent()}
                        <hr/>
                        <ShareButton id={id} item={item} />
                    </div>
                </div>
                <br/>
                <center>{this.renderWishlist(id)}</center>
                <br/>
                <br/>
                
                <center>
                <div className="row">
                    <div className="col-lg-12">
                        <h4 style={{ color: '#ea7f1c', fontSize: "16px" }}>
                            <FontAwesomeIcon icon={faCalculator} size="md" />&nbsp;
                            {this.props.convertToRupiah(price)}
                        </h4>
                        <br/>
                        <table>
                            <tr>
                                <td>
                                    <input type="number" placeholder="Input Qty" ref="addQty" id="addQty" defaultValue="1"
                                        style={{ fontSize: "13px" }} className="form-control form-control-lg" />
                                </td>
                                <td>&nbsp;</td>
                                <td>
                                    <button className="btn btn-success" style={{ fontSize: "14px" }}
                                        onClick={ () => this.onBtnAddToCart(id, idCategory) }>
                                    <i className="fa fa-shopping-cart fa-sm"></i>
                                    &nbsp;&nbsp; Add to Cart
                                    </button>
                                </td>
                            </tr>
                        </table>
                        <br/><br/>
                    </div>
                </div>
                </center>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { username: state.auth.username, products: state.selectedProducts }
}

export default connect(mapStateToProps, { select_products, convertToRupiah, cartCount })(ProductsDetails);