import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../supports/api-url/apiurl';
import ProductsItems from './ProductsItems';
import { InputGroup, Row } from 'reactstrap';
import Carousel from './Carousel';
import Jumbotron from './Jumbotron';
import { sortingJSON } from '../actions';

class ProductsGridView extends Component {
    
    state = {   listProducts: [], 
                searchListProducts: [], 
                totalQty: 0, 
                listAllCategory: [], 
                listLocation: [],
                idLocation: 0,
                idCategory: 0 
            }

    componentDidMount() {
        this.showProducts();
        this.showCategory();
        this.showLocation();
    }

    showCategory = () => {
        axios.get(API_URL_1 + '/category/getlistcategory')
        .then((res) => {
            this.setState({ 
                listCategory: res.data,
                listAllCategory: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    renderAllCategory = () => {
        var listJSXAllCategory = this.state.listAllCategory.map((item) => {
            return (
                <option>{item.name}</option>
            )
        })
        return listJSXAllCategory;
    }

    showLocation = () => {
        axios.get(API_URL_1 + '/location/getlistlocation')
        .then((res) => {
            this.setState({ 
                listLocation: res.data 
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    renderListLocation = () => {
        var listJSXLocation = this.state.listLocation.map((item) => {
            return (
                <option>{item.city}</option>
            )
        })
        return listJSXLocation;
    }

    showProducts = () => {
        axios.get(API_URL_1 + '/products/getlistproducts')
        .then((res) => {
            this.setState({ 
                listProducts: res.data, 
                searchListProducts: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnSearchClick = () => {
        var category = this.refs.qCategory.value;
        var location = this.refs.qLocation.value;
        var item = this.refs.qItem.value;
        var hargaMin = parseInt(this.refs.qHargaMin.value);
        var hargaMax = parseInt(this.refs.qHargaMax.value);

        if(location !== "" && category === "") {
            axios.get(API_URL_1 + '/location/getlistlocation', {
                params: {
                    city: location
                }
            }).then((res) => {
                this.setState({ 
                    idLocation: res.data[0].id 
                });

                var arrSearch = this.state.listProducts.filter((e) => {
                    return      e.price >= hargaMin
                            &&  e.price <= hargaMax
                            &&  e.item.toLowerCase().includes(item.toLowerCase())
                            &&  e.idLocation === this.state.idLocation
                })
        
                this.setState({ searchListProducts: arrSearch })

            }).catch((err) => {
                console.log(err);
            })
        } else if(category !== "" && location === "") {
            axios.get(API_URL_1 + '/category/getlistcategory', {
                params: {
                    name: category
                }
            }).then((res) => {
                this.setState({ 
                    idCategory: res.data[0].id
                });
    
                var arrSearch = this.state.listProducts.filter((e) => {
                    return      e.price >= hargaMin
                            &&  e.price <= hargaMax
                            &&  e.item.toLowerCase().includes(item.toLowerCase())
                            &&  e.idCategory === this.state.idCategory
                })
        
                this.setState({ searchListProducts: arrSearch })
    
            }).catch((err) => {
                console.log(err);
            })
        } else if(location !== "" && category !== "") {
            axios.get(API_URL_1 + '/location/getlistlocation', {
                params: {
                    city: location
                }
            }).then((res) => {
                this.setState({ 
                    idLocation: res.data[0].id 
                });

                axios.get(API_URL_1 + '/category/getlistcategory', {
                    params: {
                        name: category
                    }
                }).then((res) => {
                    this.setState({ 
                        idCategory: res.data[0].id
                    });
        
                    var arrSearch = this.state.listProducts.filter((e) => {
                        return      e.price >= hargaMin
                                &&  e.price <= hargaMax
                                &&  e.item.toLowerCase().includes(item.toLowerCase())
                                &&  e.idCategory === this.state.idCategory
                                &&  e.idLocation === this.state.idLocation
                    })
            
                    this.setState({ searchListProducts: arrSearch })
        
                }).catch((err) => {
                    console.log(err);
                })
            }).catch((err) => {
                console.log(err);
            })
        } else if (category === "" && location === "") {
            var arrSearch = this.state.listProducts.filter((e) => {
                return      e.price >= hargaMin
                        &&  e.price <= hargaMax
                        &&  e.item.toLowerCase().includes(item.toLowerCase())
            })
    
            this.setState({ searchListProducts: arrSearch })
        }
        
    }

    renderListProducts = () => {
        var sortedListProducts = this.state.searchListProducts.sort(this.props.sortingJSON('id', 'desc'));
        var listJSXProducts = sortedListProducts.map((e) => {
            return (
                <ProductsItems products={e}  />
            )
        })
        return listJSXProducts;

    }

    onClickListView = () => {
        return window.location = "/admin/manageproducts";
    }

    render() {
            if(this.props.products.id !== 0) {
                return <Redirect to={`/productsdetails?id=${this.props.products.id}`} />
            }

            var changeToListView;
            if(this.props.myRole === "ADMIN") {
                changeToListView = <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" style={{ fontSize: "13px" }} 
                                    onClick={() => {this.onClickListView()}}
                                    className="btn btn-info">Manage Products</button>
                                    </div>
                                    ;
            } else {
                changeToListView = '';
            }
            
            return (
                <div>

                    <div className="card bg-light" style={{ fontSize: "13px", padding: "30px" }}>
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                <Carousel />
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div className="card bg-light" style={{ fontSize: "13px", padding: "30px" }}>
                        <div className="row justify-content-center">
                        <h1>One platform for IT workshop, training, & course.</h1></div>
                    </div>
                    <br/>
                    <div className="card bg-light" style={{ fontSize: "13px", padding: "30px" }}>
                        <div className="row justify-content-center"><Jumbotron /></div>
                    </div>
                    <br/>

                    <div className="card bg-light" style={{ fontSize: "13px" }}>

                            <div className="row justify-content-center" style={{ marginTop: "30px" }}>
                                    {changeToListView}
                            </div>

                            <br/><br/>

                            <div className="row justify-content-center">
                                <div className="card h-100 bg-light" style={{ padding: "20px", marginBottom: "20px" }}>
                                    <div className="card-body col-md-lg-2">
                                    
                                    <form ref="searchForm">
                                        <Row style={{ marginBottom: "20px" }}>
                                            <select ref="qCategory" className="custom-select" 
                                            style={{ fontSize: "12px" }}>
                                                <option value="">All Category</option>
                                                {this.renderAllCategory()}
                                            </select>
                                        </Row>
                                        <Row style={{ marginBottom: "20px" }}>
                                            <select ref="qLocation" className="custom-select" 
                                            style={{ fontSize: "12px" }}>
                                                <option value="">All Location</option>
                                                {this.renderListLocation()}
                                            </select>
                                        </Row>
                                        <Row style={{ marginBottom: "20px" }}>
                                            <input type="text" className="form-control" ref="qItem" 
                                            placeholder="Products" style={{ fontSize: "12px" }}/>
                                        </Row>
                                        <Row style={{ marginBottom: "20px" }}>
                                            <InputGroup>
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">Min Rp</div>
                                            </div>
                                            <input type="number" className="form-control" 
                                            ref="qHargaMin" defaultValue="0" style={{ fontSize: "12px" }}/>
                                            </InputGroup>
                                        </Row>
                                        <Row style={{ marginBottom: "20px" }}>
                                            <InputGroup>
                                            <div className="input-group-prepend">
                                                <div className="input-group-text">Max Rp</div>
                                            </div>
                                            <input type="number" className="form-control" 
                                            ref="qHargaMax" defaultValue="99999999" style={{ fontSize: "12px" }}/>
                                            </InputGroup>
                                        </Row>
                                        <Row style={{ marginBottom: "20px" }}>
                                            <button type="button" className="btn btn-default btn-sm btn-success"
                                            onClick={this.onBtnSearchClick}
                                            style={{ fontSize: "12px" }}>
                                            <span className="glyphicon glyphicon-search"></span> Search 
                                            </button>
                                        </Row>
                                    </form>

                                    </div>

                                </div>

                                <div className="col-lg-8">
                                        {this.renderListProducts()}
                                </div>
                            
                            </div>
                    </div>
                </div>
            
            );
    }
}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role, products: state.selectedProducts }
}

export default connect(mapStateToProps, { sortingJSON })(ProductsGridView);