import React, { Component } from 'react';
import { connect } from 'react-redux';
import { onUserLogin, onActivityLog } from '../actions';
import { Button } from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import Spinner from './Spinner';
import axios from 'axios';
import { API_URL_1 } from '../supports/api-url/apiurl';
import { AUTH_LOGIN } from '../supports/api-url/apisuburl';

const cookies = new Cookies();

class LoginPage extends Component {

    state = { role: '' };

    onBtnSubmit = () => {
      var username = this.refs.username.value;
      var password = this.refs.password.value;
      this.props.onUserLogin({username, password})

      axios.post(API_URL_1 + AUTH_LOGIN, { 
        username, password
     })
      .then((res) => {
          //=======> Activity Log
          this.props.onActivityLog({username: username, role: res.data[0].role, desc: 'Login'});
      })
      .catch((err) => {
          console.log(err);
      })
      
    }

    componentWillReceiveProps(newProps) {
      if(newProps.username !== '') {
        cookies.set('usernameCookie', newProps.username, { path: '/' });
        cookies.set('roleCookie', newProps.role, { path: '/' });
      }
    }

    renderOnKeyPress = (event) => {
      if (event.key === 'Enter'){
          // alert('Enter has been pressed')
          this.onBtnSubmit()
      }
    }

    render() {

      if(this.props.username === "") {

        var alertLogin = this.props.errorLogin;
        if(alertLogin) {
          var alertLog = <p align='left' style={{ fontSize: '13px' }} 
                        className="alert alert-danger">
                        &nbsp;{this.props.errorLogin}</p>;
        }

        var load;
        if(this.props.loading) {
            load = <center><Spinner /></center>;

        } else {
            load = <center><Button color="primary" style={{ fontSize: "14px" }} 
            onClick={this.onBtnSubmit}><b>Sign in</b></Button></center>;
        }

        return (
          <div className="card bg-light" style={{ paddingLeft: "40px", paddingRight: "40px", paddingTop: "20px" }}>

            <div className="row justify-content-center">
          
              <div className="col-lg-3 card-body mx-auto shadow p-3 mb-5 bg-white rounded">
                <br/>
                <form style={{ paddingRight: "50px",paddingLeft: "50px" }}>
                <h5 style={{ textAlign: 'center',fontSize: "20px",paddingTop: "20px" }}>Sign In</h5><br/>
                <div className="alert alert-warning" style={{ fontSize: "12px" }}>
                  <center><h4>Demo Account</h4>
                  <br/><b>Admin</b> <br/>Username: admin<br/>Password: admin
                  <br/><br/><b>Member</b> <br/>Username: member<br/>Password: member
                  <br/><br/><b>Producer</b> <br/>Username: angel<br/>Password: angel
                  </center>
                </div>
                <br/>
                <div className="form-group">
                  <input ref="username" className="form-control form-control-lg" style={{ fontSize: "14px" }} 
                  placeholder="Username" type="text" />
                </div>
                <div className="form-group">
                  <input ref="password" className="form-control form-control-lg" style={{ fontSize: "14px" }} 
                  placeholder="Password" type="password" onKeyPress={this.renderOnKeyPress}/>
                </div>
                <br/>
                {alertLog}
                {load}
                </form>
                <br/><br/>
                <p className="text-center" style={{ fontSize: "14px" }}>Don't have an account? &nbsp;
                        <Link to="/register">Create one</Link> </p>
              <br/>
              </div>

            </div>

          </div>
        )

      }

      return <Redirect to="/" />

    }
}

const mapStateToProps = (state) => { //===========> NGAMBIL DATA KE GLOBAL STATE
    return { 
      username: state.auth.username, 
      role: state.auth.role,
      email: state.auth.email, 
      errorLogin: state.auth.errorLogin,
      loading: state.auth.loading
     };
}
    
export default connect(mapStateToProps, { onUserLogin, onActivityLog })(LoginPage);