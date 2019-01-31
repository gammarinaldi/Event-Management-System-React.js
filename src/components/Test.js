import React, { Component } from 'react';
import { connect } from 'react-redux';

class HomePage extends Component {

    componentDidMount() {
        console.log(this.props.username);
        var d = new Date('2015-03-04T00:00:00.000Z');
        console.log(d.getFullYear());
        console.log(d.getMonth());
        console.log(d.getDate());
    }

    render() {
      return (
          <div>
              <h1>{this.props.username}</h1>
          </div>
      )
    }
}

const mapStateToProps = (state) => {
  return { username: state.auth.username }
}

export default connect(mapStateToProps)(HomePage);