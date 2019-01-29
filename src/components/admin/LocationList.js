import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import Pagination from 'react-js-pagination';
import { onActivityLog } from '../../actions';
import { 
    LOCATION_GETLIST, 
    LOCATION_ADD, 
    LOCATION_EDIT, 
    LOCATION_DELETE 
} from '../../supports/api-url/apisuburl';

class LocationList extends Component {

    state = {   
                listLocation: [], 
                selectedIdEdit: 0, 
                searchListLocation: [], 
                filterForm: '', 
                value: '',
                uploading: false,
                images: [],
                activePage: 1,
                itemPerPage: 5
            }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    componentDidMount() {
        this.showLocation();
    }

    showLocation = () => {
    axios.get(API_URL_1 + LOCATION_GETLIST)
            .then((res) => {
                this.setState({ 
                    listLocation: res.data[0], 
                    searchListLocation: res.data[0], 
                    selectedIdEdit: 0 
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    onBtnAddClick = () => {

        const city = this.refs.addCity.value;
        const address = this.refs.addAddress.value;
        const coordinate = this.refs.addCoor.value;

        if(city) {
            axios.post(API_URL_1 + LOCATION_ADD, {
                city, address, coordinate
            }).then((res) => {
                //=======> Activity Log
                this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Add location: '+city});
                this.showLocation();
            }).catch((err) => {
                console.log(err);
            })
        } else alert('Please fill all input box.')

        this.refs.addCity.focus();

    }

    onBtnSaveClick = (id) => {
        const city = this.refs.updateCity.value;
        const address = this.refs.updateAddress.value;
        const coordinate = this.refs.updateCoordinate.value;

        axios.put(API_URL_1 + LOCATION_EDIT + id, {
            city, address, coordinate
        }).then((res) => {
            //=======> Activity Log
            this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Edit location: '+city});
            this.showLocation();
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (id, city) => {
        if(window.confirm('Are you sure want to delete: ' + city + ' ?')) {
            axios.delete(API_URL_1 + LOCATION_DELETE + id)
                .then((res) => {
                    //=======> Activity Log
                    this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Delete location: '+city});
                    this.showLocation();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    onKeyUpSearch = () => {

        var city = this.refs.qCity.value;
        var arrSearch;

        arrSearch = this.state.listLocation.filter((e) => {

            return e.city.toLowerCase().includes(city.toLowerCase()) 
            
        })

        this.setState({ searchListLocation: arrSearch })

    }

    filterLocation = () => {
        var filterList;

        filterList = this.state.listLocation.filter((item) => {
            return (
                item.city.toLowerCase().includes(this.state.filterForm.toLowerCase())
            )
        })

        if(filterList.length === 0) {
            filterList = this.state.listLocation.filter((item) => {
                return (
                    item.city.toLowerCase().includes(this.state.filterForm.toLowerCase())
                )
            })
        }

        return filterList;
    }

    adminAddAction = () => {
        if(this.props.myRole === 'ADMIN') {
            return(
                <tfoot>
                    <tr>
                        <td>&nbsp;</td>
                        <td>
                            <input type="text" size="8" placeholder="Add city" 
                                ref="addCity" style={{ fontSize: "13px" }} 
                                className="form-control" />
                        </td>
                        <td>
                            <input type="text" size="8" placeholder="Add address" 
                                ref="addAddress" style={{ fontSize: "13px" }} 
                                className="form-control" />
                        </td>
                        <td>
                            <input type="text" size="8" placeholder="Add coordinate" 
                                ref="addCoor" style={{ fontSize: "13px" }} 
                                className="form-control" />
                        </td>
                        <td><center><button className="btn btn-success" style={{ fontSize: "12px" }}
                        onClick={() => this.onBtnAddClick()}>
                        <i className="fa fa-plus"></i> Add</button></center></td>
                    </tr>
                </tfoot>
            )
        }
    }
  
    renderListLocation = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var renderedProjects = this.state.searchListLocation.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXLocation = renderedProjects.map((item) => {

        //====================START >> EDIT ITEM PRODUK=========================//
        if(item.id === this.state.selectedIdEdit) {
            return (
                <tr>
                    <td><center>{item.id}</center></td>
                    <td><input type="text" defaultValue={item.city} size="4" style={{ fontSize: "13px" }}
                    ref="updateCity" className="form-control" /></td>
                    <td><input type="text" defaultValue={item.address} size="4" style={{ fontSize: "13px" }}
                    ref="updateAddress" className="form-control" /></td>
                    <td><input type="text" defaultValue={item.coordinate} size="4" style={{ fontSize: "13px" }}
                    ref="updateCoordinate" className="form-control" /></td>
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

        if(this.props.myRole === "ADMIN") {
            return (
                <tr>
                    <td><center>{item.id}</center></td>
                    <td>{item.city}</td>
                    <td>{item.address}</td>
                    <td>{item.coordinate}</td>
                    <td>
                        <center>
                        <button className="btn btn-info" 
                            onClick={ () => this.setState({ selectedIdEdit: item.id }) }>
                            <i className="fa fa-edit fa-sm"></i>
                        </button>
                        &nbsp;
                        <button className="btn btn-danger"
                            onClick={ () => this.onBtnDeleteClick(
                                item.id, 
                                item.city) }>
                            <i className="fa fa-trash fa-sm"></i>
                        </button>
                        </center>
                    </td>
                </tr>
            )
        } 

        return true;

        })
        
        return listJSXLocation;
    }
        
    render() {
        
        if(this.props.username !== "" && this.props.myRole === "ADMIN") {
            
            return(
                <div style={{ fontSize: "13px" }} className="card shadow p-3 mb-5 bg-white rounded">
                    <br/>
                    <div className="col-lg-4">
                    <form id="searchForm">
                    <input type="text" className="form-control" style={{ fontSize: "12px" }} 
                            placeholder="Search by city"
                            ref="qCity" onKeyUp={() => {this.onKeyUpSearch()}} />
                    </form>
                    </div>
                    <br/>
                    <div className="table-responsive col-lg-10">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th><center>ID</center></th>
                                    <th><center>City</center></th>
                                    <th><center>Address</center></th>
                                    <th><center>Coordinate</center></th>
                                    <th colSpan="2"><center>Action</center></th>
                                </tr>
                            </thead>
                            <tbody>
                                    {this.renderListLocation()}
                            </tbody>
                                    {this.adminAddAction()}
                        </table>
                        <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.itemPerPage}
                            totalItemsCount={this.state.searchListLocation.length}
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

export default connect(mapStateToProps, { onActivityLog })(LocationList);