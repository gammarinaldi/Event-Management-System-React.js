import React, { Component } from 'react';

class WaitVerification extends Component {
    render(){
        return(
            <div class="d-flex justify-content-center">
                <div class="p-5 alert alert-info">
                    <h3 align="center">Thank you for created an account in our website.<br/> 
                        Please check your email (inbox/spam) for account verification link.
                    </h3>
                </div>
            </div>
        )
    }
}

export default WaitVerification;