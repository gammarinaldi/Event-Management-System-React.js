import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import queryString from 'query-string';
import { API_URL_1 } from '../../supports/api-url/apiurl';
import { Redirect } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { onActivityLog } from '../../actions';
import { 
    PRODUCTS_GET, 
    LOCATION_GET, 
    CATEGORY_GET, 
    PRODUCTS_EDIT, 
    PRODUCTS_DELETE, 
    LOCATION_GETLIST, 
    CATEGORY_GETLIST 
} from '../../supports/api-url/apisuburl';

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
            tinyMCE: '',
            days: [],
            sunday: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.showProduct();
        this.showLocation();
        this.showCity();
        this.showCategory();
    }

    handleInputChange(event) {

        if(event.target.checked === true && event.target.name === 'Sunday') {
            this.setState({ sunday: true });
        } else if(event.target.checked === false && event.target.name === 'Sunday') {
            this.setState({ sunday: false });
        } else if(event.target.checked === true && event.target.name === 'Monday') {
            this.setState({ monday: true });
        } else if(event.target.checked === false && event.target.name === 'Monday') {
            this.setState({ monday: false });
        } else if(event.target.checked === true && event.target.name === 'Tuesday') {
            this.setState({ tuesday: true });
        } else if(event.target.checked === false && event.target.name === 'Tuesday') {
            this.setState({ tuesday: false });
        } else if(event.target.checked === true && event.target.name === 'Wednesday') {
            this.setState({ wednesday: true });
        } else if(event.target.checked === false && event.target.name === 'Wednesday') {
            this.setState({ wednesday: false });
        } else if(event.target.checked === true && event.target.name === 'Thursday') {
            this.setState({ thursday: true });
        } else if(event.target.checked === false && event.target.name === 'Thursday') {
            this.setState({ thursday: false });
        } else if(event.target.checked === true && event.target.name === 'Friday') {
            this.setState({ friday: true });
        } else if(event.target.checked === false && event.target.name === 'Friday') {
            this.setState({ friday: false });
        } else if(event.target.checked === true && event.target.name === 'Saturday') {
            this.setState({ saturday: true });
        } else if(event.target.checked === false && event.target.name === 'Saturday') {
            this.setState({ saturday: false });
        } 

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

    showProduct() {
        var params = queryString.parse(this.props.location.search);
        axios.post(API_URL_1 + PRODUCTS_GET, {
            id: params.id
        })
        .then((res) => {
            var days = res.data[0].days.split(',');
            this.setState({
                listProduct: res.data[0],
                tinyMCE: res.data[0].desc,
                days
            });

            for(let i = 0; i < days.length; i++) {
                switch(days[i]) {
                    case 'Sunday' : 
                        this.setState({ sunday: true });
                        break;
                    case 'Monday' : 
                        this.setState({ monday: true });
                        break;
                    case 'Tuesday' : 
                        this.setState({ tuesday: true });
                        break;
                    case 'Wednesday' : 
                        this.setState({ wednesday: true });
                        break;
                    case 'Thursday' : 
                        this.setState({ thursday: true });
                        break;
                    case 'Friday' : 
                        this.setState({ friday: true });
                        break;
                    case 'Saturday' : 
                        this.setState({ saturday: true });
                        break;
                    default:
                        break;
                }
            }
        })
        .catch((err) => {
            console.log(err);
        })
    }

    onBtnSaveClick(id) {

        const category = this.refs.updateCategory.value;
        const location = this.refs.updateLocation.value;
        const item = this.refs.updateItem.value;
        const price = this.refs.updatePrice.value;
        const img = this.refs.updateImg.value;
        const startDate = this.refs.updateStartDate.value;
        const endDate = this.refs.updateEndDate.value;
        const startTime = this.refs.updateStartTime.value;
        const endTime = this.refs.updateEndTime.value;
        const desc = this.state.tinyMCE;
        const days = this.state.days;

        axios.post(API_URL_1 + LOCATION_GET, {
            city: location
        }).then((res) => {
            this.setState({ 
                idLocation: res.data.id 
            });

            axios.post(API_URL_1 + CATEGORY_GET, {
                name: category
            }).then((res) => {
                this.setState({ 
                    idCategory: res.data.id
                });

                axios.put(API_URL_1 + PRODUCTS_EDIT + id, {
                    idCategory: this.state.idCategory, 
                    idLocation: this.state.idLocation,
                    item, price, img, startDate, endDate, startTime, endTime, desc, days
                }).then((res) => {
                    document.getElementById('message').innerHTML = '<strong>Update success!</strong>';
                    //=======> Activity Log
                    this.props.onActivityLog({username: this.props.username, role: this.props.myRole, desc: 'Edit product: '+item});
                    //window.location.replace('/admin/manageproducts');
                }).catch((err) => {
                    console.log(err);
                })

            }).catch((err) => {
                console.log(err);
            })

        }).catch((err) => {
            console.log(err);
        })
        
    }

    onBtnDeleteClick(id, item) {
        if(window.confirm('Are you sure want to delete: ' + item + ' ?')) {
            axios.delete(API_URL_1 + PRODUCTS_DELETE + id)
            .then((res) => {
                window.location.replace('/admin/manageproducts');
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    showCity() {
        axios.get(API_URL_1 + LOCATION_GETLIST)
        .then((res) => {
            this.setState({ 
                locationDetails: res.data
            });
            
        }).catch((err) => {
            console.log(err);
        })
    }

    renderCity(idLocation) {
        var listJSXCity = this.state.locationDetails.map((item) => {
           if(idLocation === item.id) {
               return item.city;
           } else return false;
        })
        return listJSXCity;
    }

    showLocation() {
        axios.get(API_URL_1 + LOCATION_GETLIST)
        .then((res) => {
            this.setState({ 
                listLocation: res.data
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    renderListLocation() {
        var listJSXLocation = this.state.listLocation.map((item) => {
            return (
                <option>{item.city}</option>
            )
        })
        return listJSXLocation;
    }

    showCategory() {
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

    renderCategory(idCategory) {
        var listJSXCategory = this.state.listCategory.map((item) => {
           if(idCategory === item.id) {
               return item.name;
           } else return false;
        })
        return listJSXCategory;
    }

    renderAllCategory() {
        var listJSXAllCategory = this.state.listAllCategory.map((item) => {
            return (
                <option>{item.name}</option>
            )
        })
        return listJSXAllCategory;
    }

    sideBarMenu () {
        if(this.props.myRole === "ADMIN") {
            return <div className="list-group">
                        <a href="/" className="list-group-item">Dashboard</a>
                        <a href="/admin/manageproducts" className="list-group-item active">Manage Products</a>
                        <a href="/admin/manageusers" className="list-group-item">Manage Users</a>
                        <a href="/admin/managetrx" className="list-group-item">Manage Transactions</a>
                        <a href="/admin/managecategory" className="list-group-item">Manage Category</a>
                        <a href="/admin/managelocation" className="list-group-item">Manage Location</a>
                        <a href="/admin/viewactivitylog" className="list-group-item">View Activity Log</a>
                    </div>;
        } else if(this.props.myRole === "PRODUCER") {
            return <div className="list-group">
                        <a href="/admin/manageproducts" className="list-group-item active">Manage Products</a>
                    </div>;
        }
    }

    render() {
        
        const { id, idCategory, idLocation, item, price, img, startDate, endDate, startTime, endTime } = this.state.listProduct;

        //====================START >> EDIT ITEM PRODUK=========================//
        if(this.props.myRole === "ADMIN" || this.props.myRole === "PRODUCER") {
            return(
                <div className="card bg-light" style={{ padding: "20px", fontSize: "13px" }}>
                <style>{"tr{border-top: hidden;}"}</style>
                    <div className="row">
                        <div className="col-lg-2" style={{ marginBottom: "20px" }}>
                            {this.sideBarMenu()}
                            </div>
                            <div className="card bg-light col-lg-6" style={{ padding: "20px" }}>
                            <h4>Edit Product Details</h4>
                            <hr/>

                            <div className="card shadow p-3 mb-5 bg-white rounded">
                                <div className="table-responsive ">
                                    <table className="table table-borderless">
                                        <tbody>
                                            <tr>
                                                <td>&nbsp;ID</td>
                                                <td>:</td>
                                                <td>{id}</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Category</td>
                                                <td>:</td>
                                                <td>
                                                    <select ref="updateCategory" className="custom-select" style={{ fontSize: "12px" }}>
                                                        <option>{this.renderCategory(idCategory)}</option>
                                                        {this.renderAllCategory()}
                                                    </select>
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Location</td>
                                                <td>:</td>
                                                <td>
                                                    <select ref="updateLocation" className="custom-select" style={{ fontSize: "12px" }}>
                                                        <option>{this.renderCity(idLocation)}</option>
                                                        {this.renderListLocation()}
                                                    </select>    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Item</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="text" defaultValue={item} size="4" style={{ fontSize: "12px" }}
                                                        ref="updateItem" className="form-control" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Price</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="number" defaultValue={price} style={{ fontSize: "12px" }} 
                                                        ref="updatePrice" className="form-control" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Image</td>
                                                <td>:</td>
                                                <td>
                                                    <img src={img} alt={item} width="100px" height="100px"/>
                                                    <input type="text" defaultValue={img} size="4" style={{ fontSize: "12px" }}
                                                        ref="updateImg" className="form-control" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Start Date</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="date" defaultValue={startDate} size="4" style={{ fontSize: "12px" }}
                                                        ref="updateStartDate" className="form-control" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;End Date</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="date" defaultValue={endDate} size="4" style={{ fontSize: "12px" }}
                                                        ref="updateEndDate" className="form-control" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Start Time</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="time" defaultValue={startTime} size="4" style={{ fontSize: "12px" }}
                                                        ref="updateStartTime" className="form-control" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;End Time</td>
                                                <td>:</td>
                                                <td>
                                                    <input type="time" defaultValue={endTime} size="4" style={{ fontSize: "12px" }}
                                                        ref="updateEndTime" className="form-control" />    
                                                &nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td>&nbsp;Day(s)</td>
                                                <td>:</td>
                                                <td>
                                                <input name="Sunday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.sunday} /> Sunday &nbsp;
                                                <input name="Monday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.monday} /> Monday &nbsp;
                                                <input name="Tuesday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.tuesday} /> Tuesday &nbsp;
                                                <input name="Wednesday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.wednesday} /> Wednesday &nbsp;
                                                <input name="Thursday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.thursday} /> Thursday &nbsp;
                                                <input name="Friday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.friday} /> Friday &nbsp;
                                                <input name="Saturday" type="checkbox" 
                                                    onChange={this.handleInputChange}
                                                    checked={this.state.saturday} /> Saturday &nbsp;
                                                &nbsp;</td>
                                            </tr>
                                            <tr><td></td><td></td><td></td></tr>
                                            <tr>
                                                <td>&nbsp;Description</td>
                                                <td>:</td>
                                                <td>
                                                    {/* <textarea className="form-control" value={this.state.value} style={{ fontSize: "12px" }}
                                                        onChange={this.handleChange.bind(this)}
                                                        ref="updateDesc" rows="4" cols="40">
                                                    </textarea>&nbsp; */}
                                                    <Editor
                                                    apiKey='rh7l8avejcgd40a81hu5b2e4u9g441bva85ut25b72kkop0a'
                                                    initialValue={this.state.tinyMCE}
                                                    init={{
                                                    height: 300,
                                                    plugins: 'link image code',
                                                    toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code'
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
                                                    <button className="btn btn-success" style={{ fontSize: "12px" }}
                                                        onClick={() => this.onBtnSaveClick(id)}>
                                                        <i className="fa fa-save fa-sm"></i> Update
                                                    </button>    
                                                &nbsp;
                                                &nbsp;
                                                    <button className="btn btn-danger" style={{ fontSize: "12px" }}
                                                        onClick={ () => this.onBtnDeleteClick(id, item) }>
                                                        <i className="fa fa-trash fa-sm"></i> Delete
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