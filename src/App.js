import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { keepLogin, cookieChecked, cartCount } from './actions';
import Header from './components/Header';
import Spinner from './components/Spinner';
import Routing from './routers';
import BreadCrumb from './components/BreadCrumb';

const cookies = new Cookies();

class App extends Component {

  componentDidMount() {
    const username = cookies.get('usernameCookie');
    if(username) {
      this.props.keepLogin(username);
      this.props.cartCount(username);
    } else {
      this.props.cookieChecked();
    }
  }

  render() {

    if(this.props.cookie) {

      return (
        <div className="container-fluid">

          <Header NavBrand={`EMS`} totalQtyCart={this.props.totalQtyCart} />

          <BreadCrumb />
          
          <Routing />

      </div>
      )
    }

    return (
      <div style={{ marginTop: "200px" ,fontSize: "20px" }}>
        <center><Spinner /></center>
      </div> 
    )
  }
}

const mapStateToProps = (state) => {
  return { 
    username: state.auth.username,
    cookie: state.auth.cookie,
    totalQtyCart: state.cartCount.totalItem
  }
}
export default withRouter(connect(mapStateToProps, { keepLogin, cookieChecked, cartCount })(App));
