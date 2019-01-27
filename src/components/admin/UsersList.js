import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import Pagination from 'react-js-pagination';
import { onActivityLog, sortingJSON } from '../../actions';

class UsersList extends Component {

    state = {   
                listUsers: [], 
                selectedIdEdit: 0, 
                searchListUsers: [], 
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
        this.showUsers();
    }

    showUsers = () => {
    axios.get(API_URL_1 + '/users/getlistusers')
            .then((res) => {
                this.setState({ 
                    listUsers: res.data[0], 
                    searchListUsers: res.data[0], 
                    selectedIdEdit: 0 
                });
            }).catch((err) => {
                console.log(err);
            })
    }

    onBtnAddClick = () => {

            const username = this.refs.addUserName.value;
            const password = this.refs.addPassword.value;
            const role = this.refs.addRole.value;
            const fullname = this.refs.addFullName.value;
            const email = this.refs.addEmail.value;
            const phone = this.refs.addPhone.value;
            const img = this.refs.addImg.value;

        if(username && role && fullname && email && phone && img) {
            axios.post(API_URL_1 + '/users/adduser', {
                username, password, role, fullname, email, phone, img
            }).then((res) => {
                //=======> Activity Log
                this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Add user: '+username});
                this.showUsers();
            }).catch((err) => {
                console.log(err);
            })
        } else alert('Please fill all input box.')

    }

    onBtnSaveClick = (id) => {
        const username = this.refs.updateUserName.value;
        const password = this.refs.updatePassword.value;
        const fullname = this.refs.updateFullName.value;
        const role = this.refs.updateRole.value;
        const email = this.refs.updateEmail.value;
        const phone = this.refs.updatePhone.value;
        const img = this.refs.updateImg.value;

        axios.put(API_URL_1 + '/users/edituser/' + id, {
            username, password, role, fullname, email, phone, img
        }).then((res) => {
            //=======> Activity Log
            this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Edit user: '+username});
            this.showUsers();
        }).catch((err) => {
            console.log(err);
        })
    }

    onBtnDeleteClick = (id, username, role) => {
        if(window.confirm('Are you sure want to delete: ' + username + ' ' + role + ' ?')) {
            axios.delete(API_URL_1 + '/users/deleteuser/' + id)
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

    filterUsers = () => {
        var filterList;

        filterList = this.state.listUsers.filter((item) => {
            return (
                item.username.toLowerCase().includes(this.state.filterForm.toLowerCase())
            )
        })

        if(filterList.length === 0) {
            filterList = this.state.listUsers.filter((item) => {
                return (
                    item.fullname.toLowerCase().includes(this.state.filterForm.toLowerCase())
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
                        <td><center><button className="btn btn-success" style={{ fontSize: "12px" }}
                        onClick={() => this.onBtnAddClick()}>
                            <i className="fa fa-plus"></i> Add</button></center></td>
                        <td><input type="text" size="8" placeholder="Username" ref="addUserName" style={{ fontSize: "13px" }} 
                            className="form-control" /></td>
                        <td><input type="password" size="8" placeholder="Password" ref="addPassword" style={{ fontSize: "13px" }} 
                            className="form-control" /></td>
                        <td>
                            <select ref="addRole" className="custom-select" style={{ fontSize: "12px" }}>
                                    <option>ADMIN</option>
                                    <option>PRODUCER</option>
                                    <option>MEMBER</option>
                            </select>
                        </td>
                        <td><input type="text" size="8" placeholder="Fullname" ref="addFullName" style={{ fontSize: "13px" }} 
                            className="form-control" /></td>
                        <td><input type="email" size="8" placeholder="Email" ref="addEmail" style={{ fontSize: "13px" }} 
                            className="form-control" /></td>
                        <td><input type="number" placeholder="Phone" ref="addPhone" style={{ fontSize: "13px" }}
                            className="form-control"/></td>
                        <td><input type="text" size="8" placeholder="Profile pic" ref="addImg" style={{ fontSize: "13px" }}
                            className="form-control"/></td>
                        <td><center><button className="btn btn-success" style={{ fontSize: "12px" }}
                        onClick={() => this.onBtnAddClick()}>
                        <i className="fa fa-plus"></i> Add</button></center></td>
                    </tr>
                </tfoot>
            )
        }
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
                    <td>{item.id}</td>
                    <td><input type="text" defaultValue={item.username} size="4" style={{ fontSize: "12px" }}
                    ref="updateUserName" className="form-control" /></td>
                    <td><input type="password" size="4" defaultValue={item.password} ref="updatePassword" 
                    style={{ fontSize: "12px" }} className="form-control" /></td>
                    <td>
                        <select ref="updateRole" className="custom-select" style={{ fontSize: "12px" }}>
                                <option>{item.role}</option>
                                <option>ADMIN</option>
                                <option>PRODUCER</option>
                                <option>MEMBER</option>
                        </select>
                    </td>
                    <td><input type="text" defaultValue={item.fullname} size="4" style={{ fontSize: "12px" }}
                    ref="updateFullName" className="form-control" /></td>
                    <td><input type="email" defaultValue={item.email} size="4" style={{ fontSize: "12px" }}
                    ref="updateEmail" className="form-control" /></td>
                    <td><input type="number" defaultValue={item.phone} style={{ fontSize: "12px" }} 
                    ref="updatePhone" className="form-control" /></td>
                    <td><input type="text" defaultValue={item.img} size="4" style={{ fontSize: "12px" }}
                    ref="updateImg" className="form-control" /></td>
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
                    <td>******</td>
                    <td>{item.role}</td>
                    <td>{item.fullname}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td><center><img src={item.img} alt={item.fullname} width="100px" height="100px" /></center></td>
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
                                item.username, 
                                item.password,
                                item.role,
                                item.fullname, 
                                item.email,
                                item.img) }>
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
                            <select ref="qRole" className="custom-select" style={{ fontSize: "12px" }} 
                            onChange={() => {this.onKeyUpSearch()}}>
                                <option value="">All Roles</option>
                                <option>ADMIN</option>
                                <option>PRODUCER</option>
                                <option>MEMBER</option>
                            </select>
                        </Col>
                        <Col lg="6">
                            <input type="text" className="form-control" style={{ fontSize: "12px" }} 
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
                                    <th><center>ID</center></th>
                                    <th><center>Username</center></th>
                                    <th><center>Password</center></th>
                                    <th><center>Role</center></th>
                                    <th><center>Fullname</center></th>
                                    <th><center>Email</center></th>
                                    <th><center>Phone</center></th>
                                    <th><center>Image</center></th>
                                    <th colSpan="2"><center>Action</center></th>
                                </tr>
                            </thead>
                            <tbody>
                                    {this.renderListUsers()}
                            </tbody>
                                    {this.adminAddAction()}
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