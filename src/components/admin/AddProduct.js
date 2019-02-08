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
import { onActivityLog, sideBarMenu } from '../../actions';

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
            tinyMCE: ''
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) { 

        if(event.target.type === 'checkbox' && event.target.checked) {
            this.state.days.push(event.target.name);
        } else if(event.target.type === 'checkbox' && !event.target.checked) {
            var index = 0;
            index = this.state.days.indexOf(event.target.name);
            if (index > -1) {
                this.state.days.splice(index, 1);
             }
        }

        console.log(this.state.days)
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

        if(document.getElementById("addImg").files[0] !== undefined) {
            var formData = new FormData();
            var headers = {
                headers: 
                {'Content-Type': 'multipart/form-data'}
            }

            const category = this.refs.addCategory.value;
            const location = this.refs.addLocation.value;
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
                creator: this.props.myRole,
                createdBy: this.props.username,
                item, price, startDate, endDate, startTime, endTime, desc, days: days.toString()
            }

            if(document.getElementById('addImg')){
                formData.append('img', document.getElementById('addImg').files[0]);
            }

            formData.append('data', JSON.stringify(data)); //Convert object javascript menjadi JSON

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
                                {this.props.sideBarMenu({ myRole: this.props.myRole, active: 'Add Product' })}
                            </div>
                            <div className="card bg-light col-6" style={{ padding: "20px" }}>
                            <h4>Add Product</h4>
                            <hr/>
                            <div className="table-responsive card shadow p-3 mb-5 bg-white rounded">

                                <form ref="formAdd" onSubmit={this.onBtnAddClick}>
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <td>&nbsp;Category</td>
                                            <td>:</td>
                                            <td>
                                                <select ref="addCategory" className="custom-select" style={{ fontSize: "12px" }}>
                                                    {this.renderAllCategory()}
                                                </select>
                                            &nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;Location</td>
                                            <td>:</td>
                                            <td>
                                                <select ref="addLocation" className="custom-select" style={{ fontSize: "12px" }}>
                                                    {this.renderListLocation()}
                                                </select>    
                                            &nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;Item</td>
                                            <td>:</td>
                                            <td>
                                                <input type="text" size="4" style={{ fontSize: "12px" }}
                                                    ref="addItem" className="form-control" />    
                                            &nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;Price</td>
                                            <td>:</td>
                                            <td>
                                                <input type="number" style={{ fontSize: "12px" }} 
                                                    ref="addPrice" className="form-control" placeholder="Rp." />    
                                            &nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;Image</td>
                                            <td>:</td>
                                            <td>
                                                <input type="file" id="addImg" name="addImg" 
                                                    label={this.state.addImg} onChange={this.addImgChange} />
                                            &nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;Start Date</td>
                                            <td>:</td>
                                            <td>
                                                <input type="date" size="4" style={{ fontSize: "12px" }}
                                                    ref="addStartDate" className="form-control" />    
                                            &nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;End Date</td>
                                            <td>:</td>
                                            <td>
                                                <input type="date" size="4" style={{ fontSize: "12px" }}
                                                    ref="addEndDate" className="form-control" />    
                                            &nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;Start Time</td>
                                            <td>:</td>
                                            <td>
                                                <input type="time" size="4" style={{ fontSize: "12px" }}
                                                    ref="addStartTime" className="form-control" />    
                                            &nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td>&nbsp;End Time</td>
                                            <td>:</td>
                                            <td>
                                                <input type="time" size="4" style={{ fontSize: "12px" }}
                                                    ref="addEndTime" className="form-control" />    
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
                                                    <i className="fa fa-check-up fa-sm"></i> Submit
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
                                </form>

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

export default connect(mapStateToProps, { onActivityLog, sideBarMenu })(ProductsEditDetails);