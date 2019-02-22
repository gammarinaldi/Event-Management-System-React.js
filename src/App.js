import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';
import { keepLogin, cookieChecked } from './actions';
import Header from './components/Header';
import Spinner from './components/Spinner';
import Routing from './routers';
import BreadCrumb from './components/BreadCrumb';

const cookies = new Cookies();

class App extends Component {

  componentDidMount() {
    const newCookie = cookies.get('usernameCookie');
    if(newCookie) {
      this.props.keepLogin(newCookie);
    } else {
      this.props.cookieChecked();
    }
  }

  roleStat = () => {
      if(this.props.myRole === 'ADMIN') {
        return '(Admin Mode)';
      } else if(this.props.myRole === 'PRODUCER') {
        return '(Producer Mode)';
      }else {
        return '';
      }
  }

  render() {

    if(this.props.cookie) {

      return (
        <div className="container-fluid">

          <Header NavBrand={`EMS`} />

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
           cookie: state.auth.cookie,
           path: state.auth.path,
           myRole: state.auth.role
          }
}
export default withRouter(connect(mapStateToProps, { keepLogin, cookieChecked })(App));
