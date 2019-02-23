import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { sortingJSON } from '../../actions';
import { LOG_GETLIST } from '../../supports/api-url/apisuburl';
import SideBar from './SideBar';

class ViewActivityLog extends Component {

    state = { 
        listActivity: [],
        searchListActivity: [],
        activePage: 1,
        itemPerPage: 10
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
                listActivity: res.data,
                searchListActivity: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    onKeyUpSearch = () => {
        var query = this.refs.query.value;
        var arrSearch;
        console.log(this.state.listActivity)

        arrSearch = this.state.listActivity.filter((e) => {
            return e.username.toLowerCase().includes(query.toLowerCase())
        })

        if(arrSearch.length === 0) {
            arrSearch = this.state.listActivity.filter((e) => {
                return e.role.toLowerCase().includes(query.toLowerCase())
            })
        }

        if(arrSearch.length === 0) {
            arrSearch = this.state.listActivity.filter((e) => {
                return e.desc.toLowerCase().includes(query.toLowerCase())  
            })
        }
        
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
                    <td>{item.datetime}</td>
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
                        <SideBar active='View Activity Log' />
                        </div>

                        <div className="col-10 card bg-light" style={{ padding: "20px" }}>
                            
                        <div className="row">
                            <div className="col-lg-12">
                            <h2>Activity Log</h2>
                            <hr/>
                            </div>
                        </div>
                        <div className="row">
                            
                        <div style={{ fontSize: "13px", marginLeft: "20px", marginTop: "10px" }} 
                            className="col-lg-8 card shadow p-3 mb-5 bg-white rounded">
                            <br/>
                            <form id="searchForm">
                            <input type="text" className="form-control form-control-lg" style={{ fontSize: "12px", width: "370px" }} 
                                    placeholder="Search"
                                    ref="query" onKeyUp={() => {this.onKeyUpSearch()}} />
                            </form>
                            <br/>
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th><center>LID</center></th>
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