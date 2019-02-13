import React, { Component } from 'react';

class WaitVerification extends Component {
    render(){
        return(
            <div className="alert alert-info">
                <h3 align="center">Thank you for created an account in our website.<br/> 
                    Please check your email (inbox/spam) for account verification link.
                </h3>
            </div>
        )
    }
}

export default WaitVerification;