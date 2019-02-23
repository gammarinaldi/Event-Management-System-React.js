import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { onUserVerified } from '../actions';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { AUTH_VERIFIED } from '../supports/api-url/apisuburl';

class Verified extends Component {
    state = { verified: false, loading: true }

    componentDidMount() {
        var params = queryString.parse(this.props.location.search)
        var username = params.username;
        var password = params.password;

        axios.post(API_URL_1 + AUTH_VERIFIED, {
            username,
            password
        }).then((res) => {
            this.props.onUserVerified(res.data);
            this.setState({
                loading: false, 
                verified: true
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    renderContent = () =>{
        if(this.state.verified && !this.state.loading){
            return(
                <div class="d-flex justify-content-center">
                    <div class="p-5 alert alert-success">
                        <h3 align="center">Congratulations! Your account now verified!
                        </h3>
                    </div>
                </div>
            )
        }
        
        return (
            <div className="alert alert-warning">
                <h2>Sorry, error occured.</h2>
            </div>
        );
    }
    render(){
        return(
            <div className="alert">
                {this.renderContent()}
            </div>
        );
    }
}

export default connect(null, {onUserVerified})(Verified);