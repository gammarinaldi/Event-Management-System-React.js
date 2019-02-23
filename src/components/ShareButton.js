import React, { Component } from 'react';
import {
    FacebookShareButton,
    GooglePlusShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    LineShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    TelegramIcon,
    WhatsappIcon,
    GooglePlusIcon,
    LinkedinIcon,
    LineIcon,
    EmailIcon
} from 'react-share';

class ShareButton extends Component {

    state = {
        API_URL: 'http://localhost.com'
    }

    render() {
        return (
            <div>
                <table align="center">
                    <tr>
                        <td>
                        <FacebookShareButton
                            url={`${this.state.API_URL}/producteditdetails?id=${this.props.id}`}
                            quote={this.props.item}
                            style={{ marginTop: "10px" }}>
                            <FacebookIcon
                                size={32}
                                round />
                        </FacebookShareButton>
                        </td>&nbsp;
                        <td>
                        <WhatsappShareButton
                            url={`${this.state.API_URL}/producteditdetails?id=${this.props.id}`}
                            quote={this.props.item}
                            style={{ marginTop: "10px" }}>
                            <WhatsappIcon
                                size={32}
                                round />
                        </WhatsappShareButton>
                        </td>&nbsp;
                        <td>
                        <LinkedinShareButton
                            url={`${this.state.API_URL}/producteditdetails?id=${this.props.id}`}
                            quote={this.props.item}
                            style={{ marginTop: "10px" }}>
                            <LinkedinIcon
                                size={32}
                                round />
                        </LinkedinShareButton>
                        </td>&nbsp;
                        <td>
                        <LineShareButton
                            url={`${this.state.API_URL}/producteditdetails?id=${this.props.id}`}
                            quote={this.props.item}
                            style={{ marginTop: "10px" }}>
                            <LineIcon
                                size={32}
                                round />
                        </LineShareButton>
                        </td>&nbsp;
                        <td>
                        <GooglePlusShareButton
                            url={`${this.state.API_URL}/producteditdetails?id=${this.props.id}`}
                            quote={this.props.item}
                            style={{ marginTop: "10px" }}>
                            <GooglePlusIcon
                                size={32}
                                round />
                        </GooglePlusShareButton>
                        </td>&nbsp;
                        <td>
                        <EmailShareButton
                            url={`${this.state.API_URL}/producteditdetails?id=${this.props.id}`}
                            quote={this.props.item}
                            style={{ marginTop: "10px" }}>
                            <EmailIcon
                                size={32}
                                round />
                        </EmailShareButton>
                        </td>&nbsp;
                        <td>
                        <TwitterShareButton
                            url={`${this.state.API_URL}/producteditdetails?id=${this.props.id}`}
                            quote={this.props.item}
                            style={{ marginTop: "10px" }}>
                            <TwitterIcon
                                size={32}
                                round />
                        </TwitterShareButton>
                        </td>&nbsp;
                        <td>
                        <TelegramShareButton
                            url={`${this.state.API_URL}/producteditdetails?id=${this.props.id}`}
                            quote={this.props.item}
                            style={{ marginTop: "10px" }}>
                            <TelegramIcon
                                size={32}
                                round />
                        </TelegramShareButton>
                        </td>&nbsp;
                    </tr>
                </table>
            </div>
        )
    }
}

export default ShareButton;