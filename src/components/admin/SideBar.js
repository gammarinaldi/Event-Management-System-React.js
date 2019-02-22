import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';

class SideBar extends Component {

    state = {
        sideMenu: 0,
        disabled1: 'auto',
        disabled2: 'auto',
        disabled3: 'auto',
        disabled4: 'auto',
        disabled5: 'auto',
        disabled6: 'auto',
        disabled7: 'auto',
        dashboard: 'list-group-item',
        manageproducts: 'list-group-item',
        manageusers: 'list-group-item',
        managetrx: 'list-group-item',
        managecategory: 'list-group-item',
        managelocation: 'list-group-item',
        viewactivitylog: 'list-group-item',
    }

    onChangeActive = () => {
        alert('masuk')
        if(this.state.sideMenu === 1) {
            this.setState({ dashboard: 'list-group-item active' });
            return <Redirect to={`/admin/dashboard`} />;
        } else if(this.state.sideMenu === 2) {
            this.setState({ manageproducts: 'list-group-item active' });
            return <Redirect to={`/admin/manageproducts`} />;
        } else if(this.state.sideMenu === 3) {
            this.setState({ manageusers: 'list-group-item active' });
            return <Redirect to={`/admin/manageusers`} />;
        } else if(this.state.sideMenu === 4) {
            this.setState({ managetrx: 'list-group-item active' });
            return <Redirect to={`/admin/managetrx`} />;
        } else if(this.state.sideMenu === 5) {
            this.setState({ managecategory: 'list-group-item active' });
            return <Redirect to={`/admin/managecategory`} />;
        } else if(this.state.sideMenu === 6) {
            this.setState({ managelocation: 'list-group-item active' });
            return <Redirect to={`/admin/managelocation`} />;
        } else if(this.state.sideMenu === 7) {
            this.setState({ viewactivitylog: 'list-group-item active' });
            return <Redirect to={`/admin/viewactivitylog`} />;
        }
    }

    render() {

        if(this.props.myRole === "ADMIN") {
            return <div className="list-group">
                        <Link to="/" className={this.state.dashboard}>Dashboard</Link>
                        <Link to="/admin/manageproducts" className={this.state.manageproducts}>Manage Products</Link>
                        <Link to="/admin/manageusers" className={this.state.manageusers}>Manage Users</Link>
                        <Link to="/admin/managetrx" className={this.state.managetrx}>Manage Transactions</Link>
                        <Link to="/admin/managecategory" className={this.state.managecategory}>Manage Category</Link>
                        <Link to="/admin/managelocation" className={this.state.managelocation}>Manage Location</Link>  
                        <Link to="/admin/viewactivitylog" className={this.state.viewactivitylog}>View Activity Log</Link>
                    </div>;
        } else if(this.props.myRole === "PRODUCER") {
            return <div className="list-group">
                        <Link to="/admin/manageproducts" className={this.state.manageproducts}>Manage Products</Link>
                        <Link to="/admin/managecategory" className={this.state.managecategory}>Manage Category</Link>
                        <Link to="/admin/managelocation" className={this.state.managelocation}>Manage Location</Link>
                    </div>;
        }
    }
}

export default SideBar;