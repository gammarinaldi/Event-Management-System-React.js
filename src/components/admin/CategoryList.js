import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import Pagination from 'react-js-pagination';
import { onActivityLog } from '../../actions';
import { 
    CATEGORY_GETLIST, 
    CATEGORY_ADD, 
    CATEGORY_EDIT, 
    CATEGORY_DELETE 
} from '../../supports/api-url/apisuburl';

class CategoryList extends Component {

    state = {   
                listCategory: [], 
                selectedIdEdit: 0, 
                searchListCategory: [], 
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
        this.showCategory();
    }

    showCategory = () => {
    axios.get(API_URL_1 + CATEGORY_GETLIST)
            .then((res) => {
                console.log(res);
                this.setState({ 
                    listCategory: res.data, 
                    searchListCategory: res.data, 
                    selectedIdEdit: 0 
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    onBtnAddClick = () => {

        const name = this.refs.addName.value;

        if(name) {
            axios.post(API_URL_1 + CATEGORY_ADD, {
                name
            }).then((res) => {
                //=======> Activity Log
                this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Add category: '+name});
                this.showCategory();
            }).catch((err) => {
                console.log(err);
            })
        } else alert('Please fill input box.')

        this.refs.formAdd.reset();
        this.refs.addName.focus();

    }

    onBtnSaveClick = (id) => {
        const name = this.refs.updateCity.value;

        axios.put(API_URL_1 + CATEGORY_EDIT + id, {
            name
        }).then((res) => {
            //=======> Activity Log
            this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Edit category: '+name});
            this.showCategory();
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (id, name) => {
        if(window.confirm('Are you sure want to delete: ' + name + ' ?')) {
            axios.delete(API_URL_1 + CATEGORY_DELETE + id)
                .then((res) => {
                    //=======> Activity Log
                this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Delete category: '+name});
                this.showCategory();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    onKeyUpSearch = () => {

        var name = this.refs.qName.value;
        var arrSearch;

        arrSearch = this.state.listCategory.filter((e) => {

            return e.name.toLowerCase().includes(name.toLowerCase()) 
            
        })

        this.setState({ searchListCategory: arrSearch })

    }

    filterCategory = () => {
        var filterList;

        filterList = this.state.listCategory.filter((item) => {
            return (
                item.name.toLowerCase().includes(this.state.filterForm.toLowerCase())
            )
        })

        if(filterList.length === 0) {
            filterList = this.state.listCategory.filter((item) => {
                return (
                    item.name.toLowerCase().includes(this.state.filterForm.toLowerCase())
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
                            <form ref="formAdd">
                                <input type="text" size="8" placeholder="Add new category" 
                                ref="addName" style={{ fontSize: "13px" }} 
                                className="form-control" />
                            </form>
                        </td>
                        <td><center><button className="btn btn-success" style={{ fontSize: "12px" }}
                        onClick={() => this.onBtnAddClick()}>
                        <i className="fa fa-plus"></i> Add</button></center></td>
                    </tr>
                    
                </tfoot>
            )
        }
    }
  
    renderListCategory = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var renderedProjects = this.state.searchListCategory.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXCategory = renderedProjects.map((item) => {

        //====================START >> EDIT ITEM PRODUK=========================//
        if(item.id === this.state.selectedIdEdit) {
            return (
                <tr>
                    <td><center>{item.id}</center></td>
                    <td><input type="text" defaultValue={item.name} size="4" style={{ fontSize: "13px" }}
                    ref="updateCity" className="form-control" /></td>
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
                    <td>{item.name}</td>
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
                                item.name) }>
                            <i className="fa fa-trash fa-sm"></i>
                        </button>
                        </center>
                    </td>
                </tr>
            )
        } 

        return true;

        })
        
        return listJSXCategory;
    }
        
    render() {
        
        if(this.props.username !== "" && this.props.myRole === "ADMIN") {
            
            return(
                <div style={{ fontSize: "13px" }} className="card shadow p-3 mb-5 bg-white rounded">
                    <br/>
                    <div className="col-lg-6">
                    <form id="searchForm">
                    <input type="text" className="form-control" style={{ fontSize: "12px" }} 
                            placeholder="Search by name"
                            ref="qName" onKeyUp={() => {this.onKeyUpSearch()}} />
                    </form>
                    </div>
                    <br/>
                    <div className="table-responsive col-lg-6">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th><center>ID</center></th>
                                    <th><center>Name</center></th>
                                    <th colSpan="2"><center>Action</center></th>
                                </tr>
                            </thead>
                            <tbody>
                                    {this.renderListCategory()}
                            </tbody>
                                    {this.adminAddAction()}
                        </table>
                        <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.itemPerPage}
                            totalItemsCount={this.state.searchListCategory.length}
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

export default connect(mapStateToProps, { onActivityLog })(CategoryList);