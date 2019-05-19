import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { sortingJSON } from '../../actions';
import { USERS_PARTICIPANT, MATCHES_ADD, MATCHES_SHOW } from '../../supports/api-url/apisuburl';
import SideBar from './SideBar';
import queryString from 'query-string';

class ParticipantList extends Component {

    state = { 
        listParticipant: [],
        searchListParticipant: [],
        activePage: 1,
        itemPerPage: 10,
        eventName: '',
        totalParticipant: 0,
        matches: [],
        searchMatches: [],
        userID_1: 0,
        userID_2: 0
     }

    handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
        this.setState({activePage: pageNumber});
    }

    componentDidMount() {
        if(this.props.myRole === "ADMIN" || this.props.myRole === "PRODUCER") {
            this.showParticipant();
        }
    }

    showParticipant = () => {
        var params = queryString.parse(this.props.location.search);
        this.setState({
            eventName: params.item
        });
        
        this.setState({
            totalParticipant: params.totalParticipant
        });

        axios.post(API_URL_1 + USERS_PARTICIPANT, {
            id: params.id
        })
        .then((res) => {
            console.log(res)
            this.setState({ 
                listParticipant: res.data,
                searchListParticipant: res.data
            });

            axios.post(API_URL_1 + MATCHES_SHOW, {
                productID: params.id
            })
            .then((res2) => {
                this.setState({
                    matches: res2.data,
                    searchMatches: res2.data
                });
            })

            if(res.data.length === 0) {
                axios.post(API_URL_1 + MATCHES_ADD, {
                    productID: res.data[0].productID,
                    userID_1: res.data[0].id,
                    username_1: res.data[0].username
                })
            } else if(res.data.length === 1) {
                axios.post(API_URL_1 + MATCHES_ADD, {
                    productID: res.data[0].productID,
                    userID_2: res.data[0].id,
                    username_2: res.data[0].username
                })
            } else if(res.data.length % 2 !== 0) {
                axios.post(API_URL_1 + MATCHES_ADD, {
                    productID: res.data[0].productID,
                    userID_1: res.data[0].id,
                    username_1: res.data[0].username
                })
            } else if(res.data.length % 2 === 0) {
                axios.post(API_URL_1 + MATCHES_ADD, {
                    productID: res.data[0].productID,
                    userID_2: res.data[0].id,
                    username_2: res.data[0].username
                })
            }

        }).catch((err) => {
            console.log(err);
        })
    }

    onKeyUpSearch = () => {
        var query = this.refs.query.value;
        var arrSearch;

        arrSearch = this.state.listParticipant.filter((e) => {
            return e.username.toLowerCase().includes(query.toLowerCase())
        })

        if(arrSearch.length === 0) {
            arrSearch = this.state.listParticipant.filter((e) => {
                return e.fullname.toLowerCase().includes(query.toLowerCase())
            })
        }

        if(arrSearch.length === 0) {
            arrSearch = this.state.listParticipant.filter((e) => {
                return e.email.toLowerCase().includes(query.toLowerCase())  
            })
        }

        if(arrSearch.length === 0) {
            arrSearch = this.state.listParticipant.filter((e) => {
                return e.phone.toLowerCase().includes(query.toLowerCase())  
            })
        }
        
        this.setState({ searchListParticipant: arrSearch })
    }
  
    renderListParticipant = () => {
        var indexOfLastTodo = this.state.activePage * this.state.itemPerPage;
        var indexOfFirstTodo = indexOfLastTodo - this.state.itemPerPage;
        var sortedListMatches = this.state.searchMatches.sort(this.props.sortingJSON('id', 'asc'));
        var renderedMatches = sortedListMatches.slice(indexOfFirstTodo, indexOfLastTodo);

        var listJSXActivity = renderedMatches.map((item, index) => {

            return (
                <tr key={index}>   
                    <td align="center">{index}</td>
                    <td align="center">{item.userID_1}</td>
                    <td align="center">{item.username_1}</td>
                    <td align="center"><strong>VS</strong></td>
                    <td align="center">{item.userID_2}</td>
                    <td align="center">{item.username_2}</td>
                    <td align="center">
                        <select>
                        <option value="">--Choose Winner--</option>
                        <option value={item.userID_1}>{item.userID_1}</option>
                        <option value={item.userID_2}>{item.userID_2}</option>
                        </select>
                        <br/><br/>
                        <button type="submit" className="btn btn-primary" 
                        style={{ fontSize: "12px" }}
                        onClick={() => this.onSubmitWinner(item.id)}>Submit</button>
                    </td>
                </tr>
            )

        });
        
        return listJSXActivity;
    }
        
    render() {
        
        if(this.props.username !== "") {
            
            return(
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>

                    <div className="row">

                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                        <SideBar active='Manage Events' />
                        </div>

                        <div className="col-10 card bg-light" style={{ padding: "20px" }}>
                            
                        <div className="row">
                            <div className="col-lg-12">
                            <h2>Manage Bracket of <strong>{this.state.eventName}</strong></h2>
                            <hr/>
                            </div>
                        </div>
                        <div className="row">
                            
                        <div style={{ fontSize: "13px", marginLeft: "20px", marginTop: "10px" }} 
                            className="col-lg-8 card shadow p-3 mb-5 bg-white rounded">
                            <br/>
                            <div style={{ fontSize: "16px" }}>Total Participant: {this.state.totalParticipant} pax</div>
                            <br/><br/>
                            <form id="searchForm">
                            <input type="text" className="form-control form-control-lg" style={{ fontSize: "12px" }} 
                                    placeholder="Search"
                                    ref="query" onKeyUp={() => {this.onKeyUpSearch()}} />
                            </form>
                            <br/>
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th><center>Match ID</center></th>
                                            <th><center>UID #1</center></th>
                                            <th><center>Username #1</center></th>
                                            <th><center>Versus</center></th>
                                            <th><center>UID #2</center></th>
                                            <th><center>Username #2</center></th>
                                            <th><center>Winner</center></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {this.renderListParticipant()}
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

export default connect(mapStateToProps, { sortingJSON })(ParticipantList);