import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import Pagination from 'react-js-pagination';
import { onActivityLog, sortingJSON } from '../../actions';
import { 
    USERS_GETLIST,
    USERS_EDIT, 
    USERS_DELETE 
} from '../../supports/api-url/apisuburl';

class UsersList extends Component {

    state = {   
                listUsers: [], 
                selectedIdEdit: 0, 
                searchListUsers: [],
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
        this.showUsers();
    }

    showUsers = () => {
    axios.get(API_URL_1 + USERS_GETLIST)
            .then((res) => {
                this.setState({ 
                    listUsers: res.data, 
                    searchListUsers: res.data, 
                    selectedIdEdit: 0 
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    onBtnSaveClick = (id) => {
        const username = this.refs.updateUserName.value;
        const fullname = this.refs.updateFullName.value;
        const role = this.refs.updateRole.value;
        const email = this.refs.updateEmail.value;
        const phone = this.refs.updatePhone.value;

        axios.put(API_URL_1 + USERS_EDIT + id, {
            username, role, fullname, email, phone
        }).then((res) => {
            //=======> Activity Log
            this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Edit user: '+username});
            this.showUsers();
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (id, username, role) => {
        if(window.confirm('Are you sure want to delete User: ' + username + ', Role: ' + role + ' ?')) {
            axios.delete(API_URL_1 + USERS_DELETE + id)
                .then((res) => {
                    //=======> Activity Log
                    this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Delete user: '+username});
                    this.showUsers();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    onKeyUpSearch = () => {

        var role = this.refs.qRole.value;
        var query = this.refs.qQuery.value;
        var arrSearch;

        arrSearch = this.state.listUsers.filter((e) => {

            return e.role.toLowerCase().includes(role.toLowerCase()) 
                    && e.username.toLowerCase().includes(query.toLowerCase())
            
        })

        if(arrSearch.length === 0) {
            arrSearch = this.state.listUsers.filter((e) => {

                return e.role.toLowerCase().includes(role.toLowerCase()) 
                && e.fullname.toLowerCase().includes(query.toLowerCase())
                
            })
        }

        if(arrSearch.length === 0) {
            arrSearch = this.state.listUsers.filter((e) => {

                return e.role.toLowerCase().includes(role.toLowerCase()) 
                && e.email.toLowerCase().includes(query.toLowerCase())
                
            })
        }

        if(arrSearch.length === 0) {
            arrSearch = this.state.listUsers.filter((e) => {

                return e.role.toLowerCase().includes(role.toLowerCase()) 
                && e.phone.toLowerCase().includes(query.toLowerCase())
                
            })
        }

        this.setState({ searchListUsers: arrSearch })

    }
  
    renderListUsers = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var sortedListUsers = this.state.searchListUsers.sort(this.props.sortingJSON('id', 'desc'));
        var renderedProjects = sortedListUsers.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXUsers = renderedProjects.map((item, index) => {

        //====================START >> EDIT ITEM PRODUK=========================//
        if(item.id === this.state.selectedIdEdit) {
            return (
                <tr key={index}>
                    <td><center>{item.id}</center></td>
                    <td><input type="text" defaultValue={item.username} size="4" style={{ fontSize: "12px" }}
                    ref="updateUserName" className="form-control form-control-lg" /></td>
                    <td><input type="text" defaultValue={item.fullname} size="4" style={{ fontSize: "12px" }}
                    ref="updateFullName" className="form-control form-control-lg" /></td>
                    <td><input type="email" defaultValue={item.email} size="4" style={{ fontSize: "12px" }}
                    ref="updateEmail" className="form-control form-control-lg" /></td>
                    <td><input type="number" defaultValue={item.phone} style={{ fontSize: "12px" }} 
                    ref="updatePhone" className="form-control form-control-lg" /></td>
                    <td>
                        <select ref="updateRole" className="form-control form-control-lg" style={{ fontSize: "12px" }}>
                                <option>{item.role}</option>
                                <option>ADMIN</option>
                                <option>PRODUCER</option>
                                <option>MEMBER</option>
                        </select>
                    </td>
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
                    <td>{item.username}</td>
                    <td>{item.fullname}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.role}</td>
                    <td>
                        <center>
                        <button className="btn btn-info" 
                            onClick={ () => this.setState({ selectedIdEdit: item.id }) }>
                            <i className="fa fa-edit fa-sm"></i>
                        </button>
                        &nbsp;
                        <button className="btn btn-danger"
                            onClick={ () => this.onBtnDeleteClick(item.id, item.username, item.role) }>
                            <i className="fa fa-trash fa-sm"></i>
                        </button>
                        </center>
                    </td>
                </tr>
            )
        } 

        return true;

        })
        
        return listJSXUsers;
    }
        
    render() {
        
        if(this.props.username !== "" && this.props.myRole === "ADMIN") {
            
            return(
                <div style={{ fontSize: "13px" }} className="card shadow p-3 mb-5 bg-white rounded">
                    <form id="searchForm">
                    <Row>
                        <Col lg="2">
                            <select ref="qRole" className="form-control form-control-lg" style={{ fontSize: "12px" }} 
                            onChange={() => {this.onKeyUpSearch()}}>
                                <option value="">All Roles</option>
                                <option>ADMIN</option>
                                <option>PRODUCER</option>
                                <option>MEMBER</option>
                            </select>
                        </Col>
                        <Col lg="6">
                            <input type="text" className="form-control form-control-lg" style={{ fontSize: "12px" }} 
                            placeholder="Search"
                            ref="qQuery" onKeyUp={() => {this.onKeyUpSearch()}} />
                        </Col>
                    </Row>
                    </form>
                    <br/>
                    <div class="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th><center>UID</center></th>
                                    <th><center>Username</center></th>
                                    <th><center>Fullname</center></th>
                                    <th><center>Email</center></th>
                                    <th><center>Phone</center></th>
                                    <th><center>Role</center></th>
                                    <th colSpan="1"><center>Action</center></th>
                                </tr>
                            </thead>
                            <tbody>
                                    {this.renderListUsers()}
                            </tbody>
                        </table>
                        <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.itemPerPage}
                            totalItemsCount={this.state.searchListUsers.length}
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

export default connect(mapStateToProps, { onActivityLog, sortingJSON })(UsersList);