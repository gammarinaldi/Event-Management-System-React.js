import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import History from '../History';
import SideBar from './SideBar';

class ManageTrx extends Component {

    render() {
    
        if(this.props.myRole === "ADMIN" && this.props.username !== "") {
          return (
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                    <div className="row">
                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                        <SideBar myRole={this.props.myRole} />
                        </div>
                        <div className="col-lg-10 card bg-light" style={{ padding: "20px" }}>
                        <h2>Manage Transactions</h2>
                        <hr/>
                        <History />
                        </div>
                    </div>
                </div>
          )
        } else {
          return <Redirect to='/login' />
        }

    }

}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role }
  }

export default connect(mapStateToProps)(ManageTrx);