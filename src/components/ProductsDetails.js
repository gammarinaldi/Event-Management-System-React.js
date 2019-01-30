import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { select_products, convertToRupiah } from '../actions';
import queryString from 'query-string';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faMapMarkerAlt, faBriefcase, faCalculator } from '@fortawesome/free-solid-svg-icons';
import {
    FacebookShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    LineShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    WhatsappIcon,
    GooglePlusIcon,
    LinkedinIcon,
    LineIcon,
    EmailIcon
  } from 'react-share';
import moment from 'moment';
import { 
    PRODUCTS_GET, 
    CATEGORY_GET, 
    LOCATION_GET, 
    CATEGORY_GETLIST, 
    WISHLIST_ADD, 
    WISHLIST_DELETE, 
    WISHLIST_GETLIST, 
    WISHLIST_GET
} from '../supports/api-url/apisuburl';

class ProductsDetails extends Component {

    state = { totalQty: 0, category: '', location: [], days: [] ,isWishlist: [], listCategory: [] }

    componentDidMount() {
        this.getWishlist();
        this.showCategory();

        window.scrollTo(0, 0);

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

    onBtnAddToCart = (idProduct, category, item, price, img) => {

        if(this.props.username === "") {
            alert("Please Login First!");
            window.location = "/login"
        } else {

            var qty = parseInt(document.getElementById('addQty').value);
            if(!qty || qty === 0 || qty < 0) {
                alert("Please input qty!");
            } else {
                var username = this.props.username;
                axios.post(API_URL_1 + '/cart/addcart', {
                    idProduct, category, item, price, qty, img, username
                }).then((res) => {
                    alert(`Success add to cart: ${qty} item(s)`);
                    window.location = "/cart";
                }).catch((err) => {
                    console.log(err);
                    alert(`Failed add to cart`);
                })
            }
            
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
        
        var { id, item, price, img, startDate, endDate, startTime, endTime } = this.props.products;
        startDate = moment(startDate).format('DD MMMM YYYY');
        endDate = moment(endDate).format('DD MMMM YYYY');
        
        return(
                <div className="card shadow p-3 mb-5 bg-white rounded col-lg-12">
                    <center>
                        <img className="img-responsive" alt={item} width="250px" height="250px"
                            src={img} style={{ marginRight: "20px" }}/>
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
                        <br/>

                        <div className="row">
                            <div className="col-lg-6 mx-auto" align="justify" style={{ fontSize: "13px" }}>
                                <hr/>
                                {this.MyComponent()}
                                <hr/>
                                <table align="center">
                                    <tr>
                                        <td>
                                        <FacebookShareButton
                                            url={`${API_URL_1}/producteditdetails?id=${id}`}
                                            quote={item}
                                            className=""
                                            style={{ marginTop: "10px" }}>
                                            <FacebookIcon
                                                size={32}
                                                round />
                                        </FacebookShareButton>
                                        </td>&nbsp;
                                        <td>
                                        <WhatsappShareButton
                                            url={`${API_URL_1}/producteditdetails?id=${id}`}
                                            quote={item}
                                            className=""
                                            style={{ marginTop: "10px" }}>
                                            <WhatsappIcon
                                                size={32}
                                                round />
                                        </WhatsappShareButton>
                                        </td>&nbsp;
                                        <td>
                                        <LinkedinShareButton
                                            url={`${API_URL_1}/producteditdetails?id=${id}`}
                                            quote={item}
                                            className=""
                                            style={{ marginTop: "10px" }}>
                                            <LinkedinIcon
                                                size={32}
                                                round />
                                        </LinkedinShareButton>
                                        </td>&nbsp;
                                        <td>
                                        <LineShareButton
                                            url={`${API_URL_1}/producteditdetails?id=${id}`}
                                            quote={item}
                                            className=""
                                            style={{ marginTop: "10px" }}>
                                            <LineIcon
                                                size={32}
                                                round />
                                        </LineShareButton>
                                        </td>&nbsp;
                                        <td>
                                        <GooglePlusShareButton
                                            url={`${API_URL_1}/producteditdetails?id=${id}`}
                                            quote={item}
                                            className=""
                                            style={{ marginTop: "10px" }}>
                                            <GooglePlusIcon
                                                size={32}
                                                round />
                                        </GooglePlusShareButton>
                                        </td>&nbsp;
                                        <td>
                                        <EmailShareButton
                                            url={`${API_URL_1}/producteditdetails?id=${id}`}
                                            quote={item}
                                            className=""
                                            style={{ marginTop: "10px" }}>
                                            <EmailIcon
                                                size={32}
                                                round />
                                        </EmailShareButton>
                                        </td>&nbsp;
                                        <td>
                                        <TwitterShareButton
                                            url={`${API_URL_1}/producteditdetails?id=${id}`}
                                            quote={item}
                                            className=""
                                            style={{ marginTop: "10px" }}>
                                            <TwitterIcon
                                                size={32}
                                                round />
                                        </TwitterShareButton>
                                        </td>&nbsp;
                                        <td>
                                        <TelegramShareButton
                                            url={`${API_URL_1}/producteditdetails?id=${id}`}
                                            quote={item}
                                            className=""
                                            style={{ marginTop: "10px" }}>
                                            <TelegramIcon
                                                size={32}
                                                round />
                                        </TelegramShareButton>
                                        </td>&nbsp;
                                    </tr>
                                </table>
                                
                            </div>
                        </div>
                        <br/>
                        {this.renderWishlist(id)}
                        <br/>
                        <br/>
                        
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
                                            <input type="number" placeholder="Input Qty" ref="addQty" id="addQty" 
                                                style={{ fontSize: "13px" }} className="form-control" />
                                        </td>
                                        <td>&nbsp;</td>
                                        <td>
                                            <button className="btn btn-success" style={{ fontSize: "14px" }}
                                                onClick={ () => this.onBtnAddToCart(id, this.state.category, item, price, img) }>
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

export default connect(mapStateToProps, { select_products, convertToRupiah })(ProductsDetails);