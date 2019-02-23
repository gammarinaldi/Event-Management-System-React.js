import React, { Component } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
    } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { onUserLogout, onActivityLog, refreshSelectProduct } from '../actions';
import Cookies from 'universal-cookie';
//import logo from '../supports/img/logo.png';
import Style from 'style-it';

const cookies = new Cookies();

class HeaderReact extends Component {

    state = { listCart: [] }

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    onLogoutSelect = () => {
        if(window.confirm('Are you sure want to Logout?')) {
            if(this.props.onUserLogout()) {
                //this.props.refreshSelectProduct();
                //=======> Activity Log
                this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Logout'});
            }
            cookies.remove('usernameCookie', 'emailCookie', 'roleCookie');
        }
    }

    isAdmin() {
        if( this.props.myRole === "ADMIN") {
            return  (
                <div>
                    <NavItem>
                        <Link to="/" className="topMenu"><i className="fa fa-cog fa-lg"></i> Admin Dashboard</Link>
                    </NavItem>
                </div>
            )
        } else if(this.props.myRole === "PRODUCER") {
            return  (
                <div>
                    <NavItem>
                        <Link to="/" className="topMenu"><i className="fa fa-cog fa-lg"></i> Producer Dashboard</Link>
                    </NavItem>
                </div>
            )
        }
    }

    render() {
        if(this.props.username === "") {
            return (
                <div style={{ margin: '0 0 90px 0' }}>
                    <Style>
                        {`
                            .topMenu {
                                color: grey;
                                text-decoration: none;
                            }
                            .topMenu:hover {
                                color: dimgray;
                            }
                        `}
                    <Navbar color="light" light expand="md" fixed="top" className="shadow">
                    <NavbarBrand style={{ fontSize: "35px", marginBottom: "10px" }}>
                    <Link to="/productsgridview" className="topMenu" onClick={() => this.props.refreshSelectProduct()}>
                        <b>{this.props.NavBrand}</b>&nbsp;<span style={{ fontSize: "16px" }}>Event Management System</span>
                    </Link>
                    {/* <img src={logo} alt="logo" height={50} width={250} /> */}
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar style={{ fontSize: "14px", fontWeight: "bold" }}>

                        <NavItem>
                        <Link to="/login" className="topMenu" ><NavLink><i className="fa fa-sign-in"></i> Sign In</NavLink></Link>
                        </NavItem>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <NavItem>
                        <Link to="/register" className="topMenu" ><NavLink><i className="fa fa-user-plus"></i> Sign Up</NavLink></Link>
                        </NavItem>

                        </Nav>
                    </Collapse>
                    </Navbar>
                    </Style>
                </div>
            )
        } else {
            if(this.props.myRole === 'ADMIN' || this.props.myRole === 'PRODUCER') {
                return (
                
                    <div style={{ margin: '0 0 90px 0' }}>
                        <Style>
                            {`
                                .topMenu {
                                    color: grey;
                                    text-decoration: none;
                                }
                                .topMenu:hover {
                                    color: dimgray;
                                }
                            `}
                        <Navbar color="light" light expand="md" fixed="top" className="shadow">
                        <NavbarBrand style={{ fontSize: "35px", marginBottom: "10px" }}>
                        <Link to="/productsgridview" className="topMenu" onClick={() => this.props.refreshSelectProduct()}>
                            <b>{this.props.NavBrand}</b>&nbsp;<span style={{ fontSize: "16px" }}>Event Management System</span>
                        </Link>
                        {/* <img src={logo} alt="Purwadhika store logo" height={50} width={250} /> */}
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar style={{ fontSize: "14px", fontWeight: "bold" }}>
                                <NavItem>
                                <Link to="/productsgridview" className="topMenu" onClick={() => this.props.refreshSelectProduct()}>
                                    Hello, {this.props.username}
                                </Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="/productsgridview" className="topMenu" onClick={() => this.props.refreshSelectProduct()}>
                                    <i className="fa fa-home fa-lg"></i>&nbsp;Home
                                </Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {this.isAdmin()}
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="/wishlist" className="topMenu"><i className="fa fa-heart fa-lg"></i>&nbsp;Wishlist</Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="/cart" className="topMenu"><i className="fa fa-shopping-cart fa-lg"></i>
                                &nbsp;Cart&nbsp;<span className="badge badge-primary">{this.props.totalQtyCart}</span></Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="/history" className="topMenu"><i className="fa fa-history fa-lg"></i>&nbsp;History</Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="#" className="topMenu" onClick={() => this.onLogoutSelect()}><i className="fa fa-sign-out fa-lg"></i>&nbsp;Logout</Link>
                                </NavItem>
                            </Nav>
                        </Collapse>
                        </Navbar>
                        </Style>
                    </div>
                )
            } else {
                return (
                
                    <div style={{ margin: '0 0 90px 0' }}>
                        <Style>
                            {`
                                .topMenu {
                                    color: grey;
                                    text-decoration: none;
                                }
                                .topMenu:hover {
                                    color: dimgray;
                                }
                            `}
                        <Navbar color="light" light expand="md" fixed="top" className="shadow">
                        <NavbarBrand style={{ fontSize: "35px", marginBottom: "10px" }}>
                        <Link to="/productsgridview" className="topMenu" onClick={() => this.props.refreshSelectProduct()}>
                            <b>{this.props.NavBrand}</b>&nbsp;<span style={{ fontSize: "16px" }}>Event Management System</span>
                        </Link>
                        {/* <img src={logo} alt="Purwadhika store logo" height={50} width={250} /> */}
                        </NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar style={{ fontSize: "14px", fontWeight: "bold" }}>
                                <NavItem>
                                <Link to="/productsgridview" className="topMenu" onClick={() => this.props.refreshSelectProduct()}>
                                    Hello, {this.props.username}
                                </Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="/productsgridview" className="topMenu" onClick={() => this.props.refreshSelectProduct()}>
                                    <i className="fa fa-home fa-lg"></i>&nbsp;Home
                                </Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="/wishlist" className="topMenu"><i className="fa fa-heart fa-lg"></i>&nbsp;Wishlist</Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="/cart" className="topMenu"><i className="fa fa-shopping-cart fa-lg"></i>
                                &nbsp;Cart&nbsp;<span className="badge badge-primary">{this.props.totalQtyCart}</span></Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="/history" className="topMenu"><i className="fa fa-history fa-lg"></i>&nbsp;History</Link>
                                </NavItem>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <NavItem>
                                <Link to="#" className="topMenu" onClick={this.onLogoutSelect}><i className="fa fa-sign-out fa-lg"></i>&nbsp;Logout</Link>
                                </NavItem>
                            </Nav>
                        </Collapse>
                        </Navbar>
                        </Style>
                    </div>
                )
            }
            
        }
        
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        myRole: state.auth.role
    }
}

export default connect(mapStateToProps, { onUserLogout, onActivityLog, refreshSelectProduct })(HeaderReact);