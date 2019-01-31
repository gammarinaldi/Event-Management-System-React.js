import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import CategoryList from './CategoryList';
import { sideBarMenu } from '../../actions';

class ManageCategory extends Component {

    render() {
    
        if(this.props.myRole === "ADMIN" && this.props.username !== "") {
          return (
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                    <div className="row">
                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                            {this.props.sideBarMenu({ myRole: this.props.myRole, active: 'Manage Category' })}
                        </div>
                        <div className="col-lg-10 card bg-light" style={{ padding: "20px" }}>
                        <h2>Manage Category</h2>
                        <hr/>
                        <CategoryList />
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

export default connect(mapStateToProps, { sideBarMenu })(ManageCategory);