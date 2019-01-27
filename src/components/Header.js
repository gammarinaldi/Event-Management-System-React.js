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
import { onUserLogout, onActivityLog } from '../actions';
import Cookies from 'universal-cookie';
import logo from '../supports/img/logo.png';
import { API_URL_1 } from '../supports/api-url/apiurl';
import axios from 'axios';

const cookies = new Cookies();

class HeaderReact extends Component {

    state = { listCart: [], cartCount: 0, wishlistCount: 0 }

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    componentDidMount() {
        this.cartCount();
        this.wishlistCount();
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    onLogoutSelect = () => {
        if(window.confirm('Are you sure want to Logout?')) {
            if(this.props.onUserLogout()) {
                //=======> Activity Log
                this.props.onActivityLog({username: this.props.username, role: this.props.role, desc: 'Logout'});
            }
            cookies.remove('usernameCookie', 'emailCookie', 'roleCookie');
        }
    }

    isProducer() {
        if(this.props.role === "PRODUCER") {
            return <NavItem><NavLink href="/"><div style={{ color: 'LIGHTSEAGREEN' }}>Manage Products</div></NavLink></NavItem>;
        }
    }

    cartCount = () => {
        axios.post(API_URL_1 + '/cart/getlistcart', {
            username: this.props.username
        }).then((res) => {
            this.setState({
                cartCount: res.data[0].length
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    wishlistCount = () => {
        axios.post(API_URL_1 + '/wishlist/getlistwishlist', {
            username: this.props.username
        }).then((res) => {
            this.setState({
                wishlistCount: res.data[0].length
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    render() {
        if(this.props.username === "") {

            return (
                <div style={{ margin: '0 0 90px 0' }}>
                    <Navbar color="light" light expand="md" fixed="top" className="shadow">
                    <NavbarBrand href="/" style={{ fontSize: "16px" }}>
                    {/* <b>{this.props.NavBrand}</b> */}
                    <img src={logo} alt="Purwadhika store logo" height={50} width={250} />
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar style={{ fontSize: "14px", fontWeight: "bold" }}>

                        <NavItem>
                        <Link to="/login"><NavLink><i className="fa fa-sign-in"></i> Sign In</NavLink></Link>
                        </NavItem>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <NavItem>
                        <Link to="/register"><NavLink><i className="fa fa-user-plus"></i> Sign Up</NavLink></Link>
                        </NavItem>

                        </Nav>
                    </Collapse>
                    </Navbar>
                </div>
            )

        } else {
            return (
                
                <div style={{ margin: '0 0 90px 0' }}>
                    <Navbar color="light" light expand="md" fixed="top" className="shadow">
                    <NavbarBrand href="/" style={{ fontSize: "16px" }}>
                    {/* <b>{this.props.NavBrand}</b> */}
                    <img src={logo} alt="Purwadhika store logo" height={50} width={250} />
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar style={{ fontSize: "14px", fontWeight: "bold" }}>
                            <NavItem>
                            <NavLink href="/">Hello, {this.props.username}</NavLink>
                            </NavItem>
                            &nbsp;
                            <NavItem>
                            {/* <NavLink href="/productsgridview">Home</NavLink> */}
                            <NavLink href="/productsgridview">
                            <i className="fa fa-home fa-lg"></i>&nbsp;Home
                            </NavLink>
                            </NavItem>
                            {this.isProducer()}
                            &nbsp;
                            <NavItem>
                            {/* <NavLink href="/wishlist">Wishlist</NavLink> */}
                            <NavLink href="/wishlist"><i className="fa fa-heart fa-lg"></i>&nbsp;Wishlist
                            </NavLink>
                            </NavItem>
                            &nbsp;
                            <NavItem>
                            {/* <NavLink href="/cart">Cart ({this.state.cartCount})</NavLink> */}
                            <NavLink href="/cart">
                            <i className="fa fa-shopping-cart fa-lg"></i>
                            &nbsp;Cart&nbsp;<span className="badge badge-primary">{this.state.cartCount}</span>
                            </NavLink>
                            </NavItem>
                            &nbsp;
                            <NavItem>
                            {/* <NavLink href="/history">Transactions</NavLink> */}
                            <NavLink href="/history">
                            <i className="fa fa-history fa-lg"></i>&nbsp;History
                            </NavLink>
                            </NavItem>
                            &nbsp;
                            <NavItem>
                            {/* <NavLink href="#" onClick={this.onLogoutSelect}>Logout</NavLink> */}
                            <NavLink href="#" onClick={this.onLogoutSelect}>
                            <i className="fa fa-sign-out fa-lg"></i>
                            &nbsp;Logout
                            </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    </Navbar>
                </div>
            )
        }
        
    }
}

const mapStateToProps = (state) => {
    return {
        username: state.auth.username,
        role: state.auth.role
    }
}

export default connect(mapStateToProps, { onUserLogout, onActivityLog })(HeaderReact);