import React, { Component } from 'react';
import '../settings.component.css';
import Loader from '../../../widgets/loader/loader.component';
import userDefaultImage from '../../../images/default_user.png';
import { Link } from "react-router-dom";
import { Row,Col, Button, Checkbox as CBox, FormControl} from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'

class profileComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            userImageName: 'Profile_Pic.jpg',
            currentUserImage: userDefaultImage,
            profilePicFile: {},
            
        }
        this.handleChange = this.handleChange.bind(this);
        this.uploadBtnClick = this.uploadBtnClick.bind(this);
        this.removeImageBtn = this.removeImageBtn.bind(this);

    }

    componentDidMount() {
        
    }

    //USer profile pic upload.
    handleChange(event) {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            this.imageFile = event.target.files[0];
            let imageName = event.target.files[0].name
            var sFileExtension = imageName.split('.')[imageName.split('.').length - 1].toLowerCase();
            const imageFormats = ['png','jpg','jpeg','gif','tif','svg'];
            if(imageFormats.indexOf(sFileExtension) === -1) {
                document.getElementById('uploadBtn').value = "";
                alert('Please upload valid image.')
                return true;
            }
            //Change user profile image size limit here.
            if(this.imageFile.size <=1600000) {
                    this.setState({
                        profilePicFile : event.target.files[0],
                    });
                reader.readAsDataURL(this.imageFile);
                this.setState({
                    userImageName: event.target.files[0].name
                });
                reader.onload = () => {
                    this.setState({
                        currentUserImage : reader.result,
                    });
                }
            } else {
               alert('Please upload image Maximum file size : 512X512')
            }
        }
    }

     //Clear the input file value
     removeImageBtn() {
        this.setState({
            userImageName: 'Profile_Pic.jpg',
            currentUserImage : userDefaultImage,
            profilePicFile:{}
        });
        document.getElementById('uploadBtn').value = "";
    }

    uploadBtnClick() {
        document.getElementById('uploadBtn').click();
    }


    
    render() {
        return (
            <div className="width100">
                <div className="main-heading"><span className="main-title">Edit Profile</span><Link to="/dashboard" className="cancel-fund">Cancel</Link></div>
                <div className="profileContainer">
                    <h1 className="title">Personal Details</h1>
                    <form>
                        <Row className="marginBot24">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="input-label">Full Name</label>
                                <FormControl type="text" name="fullName" className="inputFormControl" maxLength="200" placeholder="John Doe"/>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="input-label">Email Address</label>
                                <FormControl type="text" name="email" className="inputFormControl" id="email" placeholder="JohnDoe@gmail.com"/>
                            </Col>
                        </Row>
                        <Row className="marginBot24">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="input-label">Street Address</label>
                                <FormControl type="text" name="street" className="inputFormControl" placeholder="123 Easy St."/>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="input-label"></label>
                                <FormControl type="text" name="address" className="inputFormControl" placeholder="Apartment, Suite, Unit, Building, etc."/>
                            </Col>
                        </Row>
                        <Row className="marginBot24">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="input-label">City</label>
                                <FormControl type="text" name="city" className="inputFormControl" placeholder="San Francisco"/>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="input-label">Zipcode</label>
                                <FormControl type="text" name="zipCode" className="inputFormControl" placeholder="95051"/>
                            </Col>
                        </Row>
                        <Row className="marginBot24">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="input-label">Country/Region</label>
                                <FormControl name='country' defaultValue={0} className="selectFormControl" componentClass="select">
                                    <option value={0}>Select Country</option>
                                </FormControl>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="input-label">Phone Number (Cell)</label>
                                <PhoneInput maxLength="14" placeholder="(123) 456-7890" country="US"/>
                            </Col>
                        </Row>
                        <label className="label-text marginBot12">Profile Picture: (Image must not exceed 512 x 512)</label>
                        <Row className="profile-Row profileMargin">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <img src={this.state.currentUserImage} alt="profile-pic" className="profile-pic"/>
                                <span className="profilePicName">{this.state.userImageName}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <input type="file" id="uploadBtn" className="hide" onChange={ (e) => this.handleChange(e) } />
                                <Button className="uploadFile fsnetBtn" onClick={this.uploadBtnClick}>Upload File</Button> <br/>
                                <label className="removeBtn" onClick={this.removeImageBtn}>Remove</label>
                            </Col>
                        </Row>
                    </form>
                </div>
                <div className="footer-profile">
                    <Button type="button" className="fsnetSubmitButton btnEnabled">Save Changes</Button>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default profileComponent;

