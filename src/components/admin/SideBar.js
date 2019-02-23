import { Component } from 'react';
import { connect } from 'react-redux';
import { sideBarMenu } from '../../actions';

class SideBar extends Component {

    render() {
        return(
            this.props.sideBarMenu({ myRole: this.props.myRole, active: this.props.active })
        )
    }
}

const mapStateToProps = (state) => {
    return { myRole: state.auth.role }
}
  
export default connect(mapStateToProps, { sideBarMenu })(SideBar);