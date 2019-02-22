import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import LocationList from './LocationList';
import SideBar from './SideBar';

class ManageLocation extends Component {

    render() {
    
        if((this.props.myRole === "ADMIN" || this.props.myRole === "PRODUCER") && this.props.username !== "") {
          return (
            <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>

            <div className="row">

                <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                <SideBar myRole={this.props.myRole} />
                </div>
                
                <div className="col-lg-10 card bg-light" style={{ padding: "20px" }}>
                  <div className="row">
                    <div className="col-lg-12">
                      <h2>Manage Location</h2>
                      <hr/>
                    </div>
                  </div>
                  <div className="row">
                    <LocationList />
                  </div>
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

export default connect(mapStateToProps)(ManageLocation);