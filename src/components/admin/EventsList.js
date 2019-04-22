import React, { Component } from 'react';
import axios from 'axios';
import { InputGroup, Row, Col } from 'reactstrap';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import Pagination from 'react-js-pagination';
import { select_products, onActivityLog, convertToRupiah, sortingJSON } from '../../actions';
import { 
    CATEGORY_GETLIST,
    LOCATION_GETLIST ,
    PRODUCTS_PARTICIPANT
} from '../../supports/api-url/apisuburl';

class EventsList extends Component {

    state = { 
                filterForm: '', 
                value: '', 
                activePage: 1,
                itemPerPage: 5,
                listLocation: [],
                locationDetails: [],
                listCategory: [],
                listAllCategory: [],
                city: '',
                category: '',
                listParticipant: [],
                searchListParticipant: []
            }

    componentDidMount() {
        this.showLocation();
        this.showCity();
        this.showCategory();
        this.showParticipant();
    }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    showParticipant = () => {
        axios.get(API_URL_1 + PRODUCTS_PARTICIPANT)
        .then((res) => {
            console.log(res);
            this.setState({
                listParticipant: res.data,
                searchListParticipant: res.data
            })
        }).catch((err) => {
            console.log(err);
        })
    }

    getParticipant = (idProduct) => {
        var listJSXParticipant = this.state.listParticipant.map((item) => {
            var participant = item.participant;
            if(idProduct === item.idProduct) {
                return participant;
            } else return false;
        })
        return listJSXParticipant;
    }

    sales = (idProduct) => {
        var listJSXParticipant = this.state.listParticipant.map((item) => {
            if(idProduct === item.idProduct) {
                return this.props.convertToRupiah(item.sales);
            } else return false;
         })
         return listJSXParticipant;
    }

    showCategory = () => {
        axios.get(API_URL_1 + CATEGORY_GETLIST)
        .then((res) => {
            console.log(res);
            this.setState({ 
                listCategory: res.data,
                listAllCategory: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    getCategory = (idCategory) => {
        var listJSXCategory = this.state.listCategory.map((item) => {
           if(idCategory === item.id) {
               return item.name;
           } else return false;
        })
        return listJSXCategory;
    }

    renderAllCategory = () => {
        var listJSXAllCategory = this.state.listAllCategory.map((item) => {
            return (
                <option value={item.name}>{item.name}</option>
            )
        })
        return listJSXAllCategory;
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

    getCity = (idLocation) => {
        var listJSXCity = this.state.locationDetails.map((item) => {
           if(idLocation === item.id) {
               return item.city;
           } else return false;
        })
        return listJSXCity;
    }

    showLocation = () => {
        axios.get(API_URL_1 + LOCATION_GETLIST)
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
                <option value={item.city}>{item.city}</option>
            )
        })
        return listJSXLocation;
    }

    onKeyUpSearch = () => {
        var category = this.refs.qCategory.value;
        var location = this.refs.qLocation.value;
        var item = this.refs.qItem.value;
        var hargaMin = parseInt(this.refs.qHargaMin.value);
        var hargaMax = parseInt(this.refs.qHargaMax.value);
        var arrSearch = [];

        if(location !== "" && category === "") {
            console.log(location);
            arrSearch = this.state.listParticipant.filter((e) => {
                return      e.sales >= hargaMin
                        &&  e.sales <= hargaMax
                        &&  e.item.toLowerCase().includes(item.toLowerCase())
                        &&  e.city === location
            });

            this.setState({ searchListParticipant: arrSearch });
        } else if(category !== "" && location === "") {
            arrSearch = this.state.listParticipant.filter((e) => {
                return      e.sales >= hargaMin
                        &&  e.sales <= hargaMax
                        &&  e.item.toLowerCase().includes(item.toLowerCase())
                        &&  e.category === category
            })
    
            this.setState({ searchListParticipant: arrSearch });
        } else if(location !== "" && category !== "") {
            arrSearch = this.state.listParticipant.filter((e) => {
                return      e.sales >= hargaMin
                        &&  e.sales <= hargaMax
                        &&  e.item.toLowerCase().includes(item.toLowerCase())
                        &&  e.category === category
                        &&  e.city === location
            })
    
            this.setState({ searchListParticipant: arrSearch });
        } else if (category === "" && location === "") {
            arrSearch = this.state.listParticipant.filter((e) => {
                return      e.sales >= hargaMin
                        &&  e.sales <= hargaMax
                        &&  e.item.toLowerCase().includes(item.toLowerCase())
            })
    
            this.setState({ searchListParticipant: arrSearch });
        }
    }

    onItemClick = () => {
        this.props.select_products(this.props.products);
    }

    renderListProducts = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var sortedListProducts = this.state.searchListParticipant.sort(this.props.sortingJSON('participant', 'desc'));
        var renderedProjects = sortedListProducts.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXProducts = renderedProjects.map((item, index) => {
            if(this.props.myRole === "ADMIN" || this.props.myRole === "PRODUCER") {
                return (
                    <tr>
                        <td><center>{item.idProduct}</center></td>
                        <td>
                            <strong>
                                <Link to={`/admin/participantlist?id=${item.idProduct}&item=${item.item}&totalParticipant=${item.participant}`} alt={item.item} 
                                    title="Click to edit this item">{item.item}
                                </Link>
                            </strong>
                        </td>
                        <td>{item.category}</td>
                        <td>{item.city}</td>
                        <td align="right">{item.participant} pax</td>
                        <td align="right">{this.props.convertToRupiah(item.sales)}</td>
                    </tr>
                )
            } else return false;

        })
        
        return listJSXProducts;
    }
        
    render() {
        console.log('List participant:');
        console.log(this.state.listParticipant);
        console.log('List search list: ');
        console.log(this.state.searchListParticipant);
        console.log(this.state.city);
        if(this.props.username !== "" && (this.props.myRole === "ADMIN" || this.props.myRole === "PRODUCER")) {
            
            return(
                <div style={{ fontSize: "13px" }} className="card shadow p-3 mb-5 bg-white rounded">
                    <form id="searchForm">
                    <Row>
                        <Col lg="2">
                            <select ref="qCategory" className="form-control form-control-lg" style={{ fontSize: "12px" }}
                            onChange={() => {this.onKeyUpSearch()}}>
                                <option value="">All Category</option>
                                {this.renderAllCategory()}
                            </select>
                        </Col>
                        <Col lg="2">
                            <select ref="qLocation" className="form-control form-control-lg" style={{ fontSize: "12px" }}
                            onChange={() => {this.onKeyUpSearch()}}>
                                <option value="">All Location</option>
                                {this.renderListLocation()}
                            </select>
                        </Col>
                        <Col lg="2">
                            <input type="text" className="form-control form-control-lg" 
                            placeholder="Search by item" style={{ fontSize: "12px" }}
                            ref="qItem" onKeyUp={() => {this.onKeyUpSearch()}} />
                        </Col>
                        <Col lg="3">
                        <InputGroup>
                            <div class="input-group-prepend">
                                <div class="input-group-text">Rp</div>
                            </div>
                            <input type="number" className="form-control form-control-lg" 
                            ref="qHargaMin" defaultValue="0" style={{ fontSize: "12px" }}
                            onKeyUp={() => {this.onKeyUpSearch()}} />
                        </InputGroup>
                        </Col>
                        <Col lg="3">
                        <InputGroup>
                            <div class="input-group-prepend">
                                <div class="input-group-text">Rp</div>
                            </div>
                            <input type="number" className="form-control form-control-lg" 
                            ref="qHargaMax" defaultValue="99999999" style={{ fontSize: "12px" }} 
                            onKeyUp={() => {this.onKeyUpSearch()}} />
                        </InputGroup>
                        </Col>
                    </Row>
                    </form>
                    <br/>
                    <div className="table-responsive-lg">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th><center>PID</center></th>
                                    <th><center>Item</center></th>
                                    <th><center>Category</center></th>
                                    <th><center>Location</center></th>
                                    <th><center>Participant</center></th>
                                    <th><center>Sales</center></th>
                                </tr>
                            </thead>
                            <tbody>
                                    {this.renderListProducts()}
                            </tbody>
                        </table>
                        <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.itemPerPage}
                            totalItemsCount={this.state.searchListParticipant.length}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange.bind(this)}
                        />
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

export default connect(mapStateToProps, { select_products, onActivityLog, convertToRupiah, sortingJSON })(EventsList);