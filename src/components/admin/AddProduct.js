import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import queryString from 'query-string';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import {
    PRODUCTS_ADD,
    PRODUCTS_GET,
    PRODUCTS_DELETE,
    LOCATION_GETLIST,
    CATEGORY_GETLIST
} from '../../supports/api-url/apisuburl';
import { Redirect } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { onActivityLog } from '../../actions';
import SideBar from './SideBar';

class ProductsEditDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listProduct: [],
            listLocation: [],
            locationDetails: [],
            listCategory: [],
            listAllCategory: [],
            idLocation: 0,
            idCategory: 0,
            days: [],
            tinyMCE: '',
            addressDisabled: true,
            priceDisabled: false
        };

        // this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange = (e) => {
        if(e.target.type === 'checkbox' && e.target.checked) {
            this.state.days.push(e.target.name);
        } else if(e.target.type === 'checkbox' && !e.target.checked) {
            var index = 0;
            index = this.state.days.indexOf(e.target.name);
            if (index > -1) {
                this.state.days.splice(index, 1);
             }
        }
        console.log(this.state.days)
    }

    handleLocationChange = (e) => {
        var index = e.nativeEvent.target.selectedIndex;
        if (e.nativeEvent.target[index].text === "Online") {
            this.setState({ addressDisabled: true })
        } else {
            this.setState({ addressDisabled: false })
        }
    }

    handlePriceChange = (e) => {
        if(e.target.type === 'checkbox' && e.target.checked) {
            this.setState({ priceDisabled: true })
        } else {
            this.setState({ priceDisabled: false })
        }
    }

    handleEditorChange = (e) => {
        console.log('Content was updated:', e.target.getContent());
        this.setState({ tinyMCE: e.target.getContent() });
    }

    componentDidMount() {
        var params = queryString.parse(this.props.location.search);
        var productsId = params.id;
        axios.post(API_URL_1 + PRODUCTS_GET, {
            id: productsId
        }).then((res) => {
            this.setState({
                listProduct: res.data
            });
        })
        .catch((err) => {
            console.log(err);
        })

        this.showLocation();
        this.showCity();
        this.showCategory();
    }

    onBtnAddClick = (e) => {
        e.preventDefault();

        if(!this.state.days || this.state.tinyMCE === '') alert('All fields required.');
        else {
            if(document.getElementById("addImg").files[0] !== undefined) {
                var formData = new FormData();
                var headers = {
                    headers:
                    {'Content-Type': 'multipart/form-data'}
                }

                const category = this.refs.addCategory.value;
                const location = this.refs.addLocation.value;
                const address = this.refs.addAddress.value;
                const item = this.refs.addItem.value;
                const price = this.refs.addPrice.value;
                const startDate = this.refs.addStartDate.value;
                const endDate = this.refs.addEndDate.value;
                const startTime = this.refs.addStartTime.value;
                const endTime = this.refs.addEndTime.value;
                const desc = this.state.tinyMCE;
                const days = this.state.days;

                var data = {
                    idCategory: category,
                    idLocation: location,
                    creatorRole: this.props.myRole,
                    createdBy: this.props.username,
                    address, item, price, startDate, endDate, startTime, endTime, desc, days: days.toString()
                }

                if(document.getElementById('addImg')){
                    formData.append('img', document.getElementById('addImg').files[0]);
                }

                formData.append('data', JSON.stringify(data)); //Convert object javascript menjadi JSON
                console.log(formData)
                axios.post(API_URL_1 + PRODUCTS_ADD, formData, headers)
                .then((res) => {
                    console.log(res);
                    document.getElementById('message').innerHTML = '<strong>Add product success!</strong>';
                    //=======> Activity Log
                    this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Add product: '+item});
                    this.refs.formAdd.reset();
                })
                .catch((err) =>{
                    console.log(err);
                })
            } else alert('All fields required.');
        }
    }

    onBtnDeleteClick = (id, item) => {
        if(window.confirm('Are you sure want to delete: ' + item + ' ?')) {
            axios.delete(API_URL_1 + PRODUCTS_DELETE + id)
            .then((res) => {
                console.log(res);
                window.location.replace('/admin/manageproducts');
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    showCity = () => {
        axios.get(API_URL_1 + LOCATION_GETLIST)
        .then((res) => {
            console.log(res);
            this.setState({
                locationDetails: res.data
            });

        }).catch((err) => {
            console.log(err);
        })
    }

    renderCity = (idLocation) => {
        var listJSXCity = this.state.locationDetails.map((item) => {
           if(idLocation === item.id) {
               return item.city;
           } else return false;
        })
        return listJSXCity;
    }

    showLocation = () => {
        axios.get(API_URL_1 + LOCATION_GETLIST)
        .then((res) => {
            this.setState({
                listLocation: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    renderListLocation = () => {
        var listJSXLocation = this.state.listLocation.map((item) => {
            return (
                <option value={item.id}>{item.city}</option>
            )
        })
        return listJSXLocation;
    }

    showCategory = () => {
        axios.get(API_URL_1 + CATEGORY_GETLIST)
        .then((res) => {
            this.setState({
                listCategory: res.data,
                listAllCategory: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    renderCategory = (idCategory) => {
        var listJSXCategory = this.state.listCategory.map((item) => {
           if(idCategory === item.id) {
               return item.name;
           } else return false;
        })
        return listJSXCategory;
    }

    renderAllCategory = () => {
        var listJSXAllCategory = this.state.listAllCategory.map((item) => {
            return (
                <option value={item.id}>{item.name}</option>
            )
        })
        return listJSXAllCategory;
    }

    render() {
        //====================START >> EDIT ITEM PRODUK=========================//
        if(this.props.myRole === "ADMIN" || this.props.myRole === "PRODUCER") {
            return(
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                    <style>{"tr{border-top: hidden;}"}</style>
                    <div className="row">

                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                        <SideBar active='Add Product' />
                        </div>

                        <div className="col-lg-10 card bg-light" style={{ padding: "20px" }}>
                        <div className="row">
                            <div className="col-lg-12">
                            <h2>Add Product</h2>
                            <hr/>
                            </div>
                        </div>
                        <div className="row">

                        <div style={{ fontSize: "13px", marginLeft: "20px", marginTop: "10px" }}
                            className="col-lg-8 card shadow p-3 mb-5 bg-white rounded">
                        <br/>

                        <form ref="formAdd" onSubmit={this.onBtnAddClick}>
                        <div className="table-responsive">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td>&nbsp;Item</td>
                                        <td>:</td>
                                        <td>
                                            <input type="text" size="4" style={{ fontSize: "12px" }}
                                                ref="addItem" className="form-control form-control-lg" required/>
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;Category</td>
                                        <td>:</td>
                                        <td>
                                            <select ref="addCategory" className="form-control form-control-lg" style={{ fontSize: "12px" }} required>
                                                {this.renderAllCategory()}
                                            </select>
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;Location</td>
                                        <td>:</td>
                                        <td>
                                            <select ref="addLocation" className="form-control form-control-lg" style={{ fontSize: "12px" }} onChange={this.handleLocationChange} required>
                                                {this.renderListLocation()}
                                            </select>
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;Address</td>
                                        <td>:</td>
                                        <td>
                                            <input type="text" size="4" style={{ fontSize: "12px" }} ref="addAddress" className="form-control form-control-lg"
                                                disabled={this.state.addressDisabled}/>
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;Price</td>
                                        <td>:</td>
                                        <td>
                                            {/* <input name="free" type="checkbox" onChange={this.handlePriceChange} /> Free &nbsp;
                                            <br/><br/> */}
                                            <input type="number" style={{ fontSize: "12px" }}
                                                ref="addPrice" className="form-control form-control-lg" placeholder="Rp." disabled={this.state.priceDisabled} required/> *Input 0 if Free
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;Image</td>
                                        <td>:</td>
                                        <td>
                                            <input type="file" id="addImg" name="addImg"
                                                label={this.state.addImg} onChange={this.addImgChange} required/>
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;Start Date</td>
                                        <td>:</td>
                                        <td>
                                            <input type="date" size="4" style={{ fontSize: "12px" }}
                                                ref="addStartDate" className="form-control form-control-lg" required/>
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;End Date</td>
                                        <td>:</td>
                                        <td>
                                            <input type="date" size="4" style={{ fontSize: "12px" }}
                                                ref="addEndDate" className="form-control form-control-lg" required/>
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;Start Time</td>
                                        <td>:</td>
                                        <td>
                                            <input type="time" size="4" style={{ fontSize: "12px" }}
                                                ref="addStartTime" className="form-control form-control-lg" required/>
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;End Time</td>
                                        <td>:</td>
                                        <td>
                                            <input type="time" size="4" style={{ fontSize: "12px" }}
                                                ref="addEndTime" className="form-control form-control-lg" required/>
                                        &nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;Day(s)</td>
                                        <td>:</td>
                                        <td>
                                        <input name="Sunday" type="checkbox"
                                            onChange={this.handleInputChange} /> Sunday &nbsp;
                                        <input name="Monday" type="checkbox"
                                            onChange={this.handleInputChange} /> Monday &nbsp;
                                        <input name="Tuesday" type="checkbox"
                                            onChange={this.handleInputChange} /> Tuesday &nbsp;
                                        <input name="Wednesday" type="checkbox"
                                            onChange={this.handleInputChange} /> Wednesday &nbsp;
                                        <input name="Thursday" type="checkbox"
                                            onChange={this.handleInputChange} /> Thursday &nbsp;
                                        <input name="Friday" type="checkbox"
                                            onChange={this.handleInputChange} /> Friday &nbsp;
                                        <input name="Saturday" type="checkbox"
                                            onChange={this.handleInputChange} /> Saturday &nbsp;
                                        &nbsp;</td>
                                    </tr>
                                    <tr><td></td><td></td><td></td></tr>
                                    <tr>
                                        <td>&nbsp;Description</td>
                                        <td>:</td>
                                        <td>
                                            {/* <textarea className="form-control" style={{ fontSize: "12px" }}
                                                ref="addDesc" rows="4" cols="40">
                                            </textarea>&nbsp; */}
                                            <Editor
                                                apiKey='rh7l8avejcgd40a81hu5b2e4u9g441bva85ut25b72kkop0a'
                                                initialValue={this.state.tinyMCE}
                                                init={{
                                                    height: 300,
                                                    plugins: [
                                                        'advlist autolink lists link image charmap print preview anchor textcolor',
                                                        'searchreplace visualblocks code fullscreen',
                                                        'insertdatetime media table paste code help wordcount'
                                                    ],
                                                    toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                                                    content_css: [
                                                        '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
                                                        '//www.tiny.cloud/css/codepen.min.css'
                                                    ]
                                                }}
                                                onChange={this.handleEditorChange}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>
                                            <br/>
                                            <button type="submit" className="btn btn-success" style={{ fontSize: "12px" }}>
                                                <i className="fa fa-check fa-sm"></i> Submit
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td><div id="message"></div>&nbsp;</td>
                                    </tr>
                                </tbody>
                            </table>
                            </div>
                            </form>

                        </div>

                        </div>
                        </div>

                    </div>

                </div>
            )
        } else {
            return (
                <Redirect to="/login" />
            )
        }
        //====================END >> EDIT ITEM PRODUK=========================//

    }
}

const mapStateToProps = (state) => {
    return { username: state.auth.username, myRole: state.auth.role }
}

export default connect(mapStateToProps, { onActivityLog })(ProductsEditDetails);