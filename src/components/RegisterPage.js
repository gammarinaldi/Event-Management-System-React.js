import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { onUserRegister, onActivityLog } from '../actions';
import { Button } from 'reactstrap';
import Cookies from 'universal-cookie';
import Spinner from './Spinner';

const cookies = new Cookies();

class RegisterPage extends Component {

    onBtnRegisterClick = () => {
        var username = this.refs.username.value;
        var fullname = this.refs.fullname.value;
        var email = this.refs.email.value;
        var phone = this.refs.phone.value;
        var password = this.refs.password.value;
        var confirmPassword = this.refs.confirmPassword.value;
        if(password !== confirmPassword) {
            document.getElementById("error").innerHTML = "Password do not match.";
        } else {
            this.props.onUserRegister({username, fullname, email, phone, password});
        }
    }

    componentWillReceiveProps(newProps) {
        if(newProps.username !== '') {
            cookies.set('usernameCookie', newProps.username, { path: '/' });
            //=======> Activity Log
            this.props.onActivityLog({username: newProps.username, role: "MEMBER", desc: 'Register'});
        }
    }

    render () {
        if(this.props.username === "") {
            
            var load;
            if(this.props.loading) {
                load = <center><Spinner /></center>;
            } else {
                load =  <center>
                            <Button color="primary" style={{ fontSize: "13px" }} 
                                onClick={this.onBtnRegisterClick}><b>Sign Up</b></Button>
                            <br/>
                            <div id="error" style={{ fontSize: "13px" }}></div>
                        </center>;
            }

            var alertRegister = this.props.errorRegister;

            if(alertRegister) {
                var alertReg = <p align='left' style={{ fontSize: '13px' }} 
                                    className="alert alert-danger">
                                    &nbsp;{this.props.errorRegister}</p>;
              }

            return (
            
                <div>
                    <div className="card bg-light">
                    <br/><br/>
                    <article className="card-body col-3 mx-auto shadow p-3 mb-5 bg-white rounded">
                        <h5 className="card-title mt-3 text-center" 
                        style={{ fontSize: "16px" }}>Create an Account</h5><br/>
                        
                        <form style={{ paddingBottom: "50px", paddingRight: "50px", paddingLeft: "50px" }}>
                            <div className="form-group">
                                <input type="text" ref="username" className="form-control form-control-lg" 
                                placeholder="Username" style={{ fontSize: "14px", marginBottom: "15px" }}/>
                            </div>
                            <div className="form-group">
                                <input type="text" ref="fullname" className="form-control form-control-lg" 
                                placeholder="Fullname" style={{ fontSize: "14px", marginBottom: "15px" }}/>
                            </div>
                            <div className="form-group">
                                <input type="email" ref="email" className="form-control form-control-lg" 
                                placeholder="Email address" style={{ fontSize: "14px", marginBottom: "15px"  }} />
                            </div>
                            <div className="form-group">
                                <input type="text" ref="phone" className="form-control form-control-lg" 
                                placeholder="Phone number" style={{ fontSize: "14px", marginBottom: "15px"  }} />
                            </div>
                            <div className="form-group">
                                <input ref="password" className="form-control form-control-lg" 
                                placeholder="Create password" type="password" style={{ fontSize: "14px", marginBottom: "15px"  }} />
                            </div>
                            <div className="form-group">
                                <input ref="confirmPassword" className="form-control form-control-lg" 
                                placeholder="Confirm password" type="password" style={{ fontSize: "14px", marginBottom: "15px"  }} />
                            </div>
                            <br/>                         
                            <div className="form-group">
                                {alertReg}
                                {load}
                            </div>      
                        </form>

                        <p className="text-center" style={{ fontSize: "14px" }}>Have an account? &nbsp;
                        <Link to="/login">Sign in</Link> </p>

                    </article>
                    </div>
                </div>
    
            )

        } 
        
        return <Redirect to="/" />

    }
    
}

const mapStateToProps = (state) => {
    return { username: state.auth.username,
             loading: state.auth.loading, 
             errorRegister: state.auth.errorRegister 
            };
}
    
export default connect(mapStateToProps, { onUserRegister, onActivityLog })(RegisterPage);