import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { onUserRegister, onActivityLog } from '../actions';
import { Button } from 'reactstrap';
import Spinner from './Spinner';

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
            this.props.onActivityLog({username, role: 'MEMBER', desc: 'Register'});
        }
    }

    autoFill = () => {
        var arrName = [
            'arrum',
            'citra',
            'raisa',
            'elma',
            'zelda'
        ];
        var arrFullName = [
            'Arrum Husna Pandayin',
            'Citra Nabila Melani',
            'Raisa Anggraini',
            'Elma Ulya Nurdiyanti',
            'Zelda Melani'
        ];
        var arrPhone = [
            '02197624765',
            '08226313614',
            '02103901874',
            '03818440884',
            '02359913100'
        ];
        var num = Math.floor(Math.random() * 5);
        document.getElementById('username').value = arrName[num];
        document.getElementById('fullname').value = arrFullName[num];
        document.getElementById('email').value = 'gammarinaldi@gmail.com';
        document.getElementById('phone').value = arrPhone[num];
        document.getElementById('password').value = '123456';
        document.getElementById('confirmPassword').value = '123456';
    }

    render () {
        if(this.props.status === "") {
            
            var load;
            if(this.props.loading) {
                load = <center><Spinner /></center>;
            } else {
                load =  <center>
                            <Button color="primary" style={{ fontSize: "14px" }} 
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
                    <div className="card bg-light" style={{ paddingLeft: "40px", paddingRight: "40px", paddingTop: "20px" }}>
                    
                        <div className="row justify-content-center">

                        <div className="col-lg-3 card-body mx-auto shadow p-3 mb-5 bg-white rounded"
                            style={{ marginLeft: "20px", marginRight: "20px" }}>
                            <br/>
                            <center>
                                <Button color="info" style={{ fontSize: "12px" }} 
                                    onClick={() => this.autoFill()}><b>Generate Autofill</b></Button>
                                <br/>
                                <div id="error" style={{ fontSize: "13px" }}></div>
                            </center>
                            <h5 className="card-title mt-3 text-center" style={{ fontSize: "20px", paddingTop: "20px" }}>
                            Create an Account
                            </h5><br/>
                            
                            <form style={{ paddingBottom: "50px", paddingRight: "50px", paddingLeft: "50px" }}>
                                <div className="form-group">
                                    <input type="text" id="username" ref="username" className="form-control form-control-lg" 
                                    placeholder="Username" style={{ fontSize: "14px", marginBottom: "15px" }}/>
                                </div>
                                <div className="form-group">
                                    <input type="text" id="fullname" ref="fullname" className="form-control form-control-lg" 
                                    placeholder="Fullname" style={{ fontSize: "14px", marginBottom: "15px" }}/>
                                </div>
                                <div className="form-group">
                                    <input type="email" id="email" ref="email" className="form-control form-control-lg" 
                                    placeholder="Email address" style={{ fontSize: "14px", marginBottom: "15px"  }} />
                                </div>
                                <div className="form-group">
                                    <input type="text" id="phone" ref="phone" className="form-control form-control-lg" 
                                    placeholder="Phone number" style={{ fontSize: "14px", marginBottom: "15px"  }} />
                                </div>
                                <div className="form-group">
                                    <input ref="password" id="password" className="form-control form-control-lg" 
                                    placeholder="Create password" type="password" style={{ fontSize: "14px", marginBottom: "15px"  }} />
                                </div>
                                <div className="form-group">
                                    <input ref="confirmPassword" id="confirmPassword" className="form-control form-control-lg" 
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

                        </div>
                    </div>

                    </div>
                </div>
            )

        } 
        
        return <Redirect to="/waitverification" />

    }
    
}

const mapStateToProps = (state) => {
    return { 
        status: state.auth.status,
        loading: state.auth.loading, 
        errorRegister: state.auth.errorRegister 
    };
}
    
export default connect(mapStateToProps, { onUserRegister, onActivityLog })(RegisterPage);