import React, { Component } from 'react';
import { connect } from 'react-redux';
import { select_products, convertToRupiah, onActivityLog } from '../actions';
import { Card, Button, CardTitle, CardText } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faMapMarkerAlt, faBriefcase, faCalculator, faClock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { API_URL_1 } from '../supports/api-url/apiurl';
import axios from 'axios';
import moment from 'moment';
import { 
    WISHLIST_GETLIST,
    WISHLIST_DELETE, 
    CATEGORY_GETLIST,
    LOCATION_GETLIST,
    WISHLIST_GET,
    WISHLIST_ADD
} from '../supports/api-url/apisuburl';
import '../../src/App.css';
import Truncate from 'react-truncate';

class ProductsItems extends Component {

    state = {
                listCategory: [],
                locationDetails: [],
                isWishlist: []
            }

    componentDidMount() {
        this.showCategory();
        this.showCity();
        this.getWishlist();
    }

    getWishlist = () => {
        axios.post(API_URL_1 + WISHLIST_GETLIST, {
            username: this.props.username
        }).then((res) => {
            this.setState({
                isWishlist: res.data
            });
        }).catch((err) => {
            console.log(err);
        });
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

    showCity = () => {
        axios.get(API_URL_1 + LOCATION_GETLIST)
        .then((res) => {
            this.setState({ 
                locationDetails: res.data 
            });
            
        }).catch((err) => {
            console.log(err);
        })
    }

    renderCity = (idLocation) => {
        var listJSXCity = this.state.locationDetails.map((item) => {
           if(idLocation === item.id) {
               return item.city;
           } else return false;
        })
        return listJSXCity;
    }

    onItemClick = () => {
        this.props.select_products(this.props.products); //parameternya dari ProductsGridView.js
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

    render() {
        var { id, img, item, price, idCategory, idLocation, startDate, endDate, startTime, endTime } = this.props.products;
        startDate = moment(startDate).format('DD MMM YYYY');
        endDate = moment(endDate).format('DD MMM YYYY');

            return (
                //====================START >> SHOW ITEM PRODUK=========================//
                <div className="col-sm-4">
                    <Card style={{ marginBottom: "20px", paddingTop: "20px" }}>
                    <center>
                        <Link to="#" onClick={this.onItemClick}>
                        <a href={`${API_URL_1}${img}`} target="_blank" rel="noopener noreferrer">
                        <img src={`${API_URL_1}${img}`} alt={item} height={200} /></a>
                        </Link>
                    </center>
                    <br/>
                    <CardTitle id="cardTitle" style={{ padding: '0 0 0 20px', margin: '0 0 10px 0' }}>
                        <Link to="#" onClick={this.onItemClick}>
                        <b style={{ fontSize: 'medium' }}>
                        <Truncate lines={1} width={300} ellipsis={<span>...</span>}>
                            {item}
                        </Truncate>
                        </b></Link>
                    </CardTitle>
                    <CardText id="cardCategory" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: 'LIMEGREEN' }}>
                        <FontAwesomeIcon icon={faBriefcase} size="md" />&nbsp;<strong>{this.renderCategory(idCategory)}</strong>
                    </CardText>
                    <CardText id="eventVenue" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#898989' }}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} size="md" />&nbsp;
                        <strong>{this.renderCity(idLocation)}</strong>
                    </CardText>
                    <CardText id="cardDate" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#898989' }}>
                        <FontAwesomeIcon icon={faCalendarCheck} size="md" />&nbsp;{startDate} to {endDate}
                    </CardText>
                    <CardText id="cardTime" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#898989' }}>
                        <FontAwesomeIcon icon={faClock} size="md" />&nbsp;{startTime} to {endTime}
                    </CardText>
                    <CardText id="id" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#898989' }}>
                        ID Product: {id}
                    </CardText>
                    <CardText id="cardPrice" style={{ padding: '0 0 0 20px', margin: '0 0 5px 0', color: '#ea7f1c' }}>
                    <FontAwesomeIcon icon={faCalculator} size="md" />&nbsp;{this.props.convertToRupiah(price)}
                    </CardText>
                    <br/>
                    <CardText id="eventBookShare" style={{ padding: '0 20px 0 20px', margin: '0 0 10px 0', color: '#898989' }}>
                        <div align="center">
                        {this.renderWishlist(id)}
                        </div>
                    </CardText>
                    <Button style={{ margin: '0 10px 10px 10px', fontSize: "14px" }}
                        onClick={this.onItemClick} 
                        color="success"><strong>View Details</strong>
                    </Button>
                    </Card>
                </div>
                //====================END >> SHOW ITEM PRODUK=========================//
            )
    }
}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps, { select_products, convertToRupiah, onActivityLog })(ProductsItems);