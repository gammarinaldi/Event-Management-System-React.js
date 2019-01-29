import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { sortingJSON } from '../../actions';
import { LOG_GETLIST } from '../../supports/api-url/apisuburl';

class ViewActivityLog extends Component {

    state = { 
        listActivity: [],
        searchListActivity: [],
        activePage: 1,
        itemPerPage: 5
     }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    componentDidMount() {
        if(this.props.myRole === "ADMIN") {
            this.showActivity();
        }
    }

    showActivity = () => {
        axios.get(API_URL_1 + LOG_GETLIST)
                .then((res) => {
                    this.setState({ 
                        listActivity: res.data[0],
                        searchListActivity: res.data[0]
                    });
                }).catch((err) => {
                    console.log(err);
                })
    }

    onKeyUpSearch = () => {

        var username = this.refs.qName.value;
        var arrSearch;

        arrSearch = this.state.listActivity.filter((e) => {

            return e.username.toLowerCase().includes(username.toLowerCase()) 
            
        })

        this.setState({ searchListActivity: arrSearch })

    }
  
    renderListActivity = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var sortedListActivity = this.state.searchListActivity.sort(this.props.sortingJSON('id', 'desc'));
        var renderedProjects = sortedListActivity.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXActivity = renderedProjects.map((item) => {

            return (
                <tr>   
                    <td><center>{item.id}</center></td>
                    <td>{item.username}</td>
                    <td>{item.role}</td>
                    <td>{item.desc}</td>
                    <td>{item.date}</td>
                </tr>
            )

        })
        
        return listJSXActivity;
    }
        
    render() {
        
        if(this.props.username !== "") {
            
            return(
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                    <div className="row">
                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                            <div className="list-group">
                                <a href="/" className="list-group-item">Dashboard</a>
                                <a href="/admin/manageproducts" className="list-group-item">Manage Products</a>
                                <a href="/admin/manageusers" className="list-group-item">Manage Users</a>
                                <a href="/admin/managetrx" className="list-group-item">Manage Transactions</a>
                                <a href="/admin/managecategory" className="list-group-item">Manage Category</a>
                                <a href="/admin/managelocation" className="list-group-item">Manage Location</a>
                                <a href="/admin/viewactivitylog" className="list-group-item active">View Activity Log</a>
                            </div>
                        </div>
                        <div className="col-10 card bg-light" style={{ padding: "20px" }}>
                        <h2>View Activity Log</h2>
                        <hr/>
                        
                        <div style={{ fontSize: "13px" }} className="card shadow p-3 mb-5 bg-white rounded">
                            <br/>
                            <div className="col-6">
                            <form id="searchForm">
                            <input type="text" className="form-control" style={{ fontSize: "12px" }} 
                                    placeholder="Search by name"
                                    ref="qName" onKeyUp={() => {this.onKeyUpSearch()}} />
                            </form>
                            </div>
                            <br/>
                            <div className="table-responsive col-10">
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th><center>ID</center></th>
                                            <th><center>Username</center></th>
                                            <th><center>Role</center></th>
                                            <th><center>Activity</center></th>
                                            <th><center>DateTime</center></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {this.renderListActivity()}
                                    </tbody>
                                </table>
                                <Pagination
                                    activePage={this.state.activePage}
                                    itemsCountPerPage={this.state.itemPerPage}
                                    totalItemsCount={this.state.searchListActivity.length}
                                    pageRangeDisplayed={5}
                                    onChange={this.handlePageChange.bind(this)}
                                />
                            </div>
                        </div>

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

export default connect(mapStateToProps, { sortingJSON })(ViewActivityLog);