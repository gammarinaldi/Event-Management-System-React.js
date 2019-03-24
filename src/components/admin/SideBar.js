import { Component } from 'react';
import { connect } from 'react-redux';
import { sideBarMenu } from '../../actions';

class SideBar extends Component {

    render() {
        console.log(this.props.unconfirmedTrxCounter);
        return(
            this.props.sideBarMenu({ 
                myRole: this.props.myRole, 
                active: this.props.active, 
                trxNotif: this.props.unconfirmedTrxCounter 
            })
        )
    }
}

const mapStateToProps = (state) => {
    return { 
        myRole: state.auth.role,
        unconfirmedTrxCounter: state.unconfirmedTrx.totalUnconfirmedTrx 
    }
}
  
export default connect(mapStateToProps, { sideBarMenu })(SideBar);