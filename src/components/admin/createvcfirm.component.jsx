import React, { Component } from 'react';
import './createvcfirm.component.css';
import { Row,Col, FormControl, Button,Radio, FormGroup} from 'react-bootstrap';
// import HeaderComponent from '../header/header.component';
import {Fsnethttp} from '../../services/fsnethttp';
import { FsnetAuth } from '../../services/fsnetauth';
import {Constants} from '../../constants/constants';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import Loader from '../../widgets/loader/loader.component';

class CreateVcFirmComponent extends Component{

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth(); 
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.redirectHome = this.redirectHome.bind(this);
        this.state = {
            firmNameBorder: false,
            firmName: '',
            firmNameValid: false,
            firmNameMsz: '',
            firmFirstNameBorder: false,
            firmFirstName: '',
            firmFirstNameValid: false,
            firmFirstNameMsz: '',
            firmLastNameBorder: false,
            firmLastName: '',
            firmLastNameValid: false,
            firmLastNameMsz: '',
            emailBorder: false,
            email: '',
            emailValid: false,
            emailMsz: '',
            cellNumberBorder: false,
            cellNumber: '',
            cellNumberValid: false,
            cellNumberMsz: '',
            isFormValid: false,
            allowGPdelegatesToSign: null,
            isImporsonatingAllowed: null,
            isImporsonatingAllowedValid: false,
            allowGPdelegatesToSignValid: false,
            subscriptonType:1,
            vcFirmError: ''
        }
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.createVcFirmBtn = this.createVcFirmBtn.bind(this);
    }

    // componentDidMount() {
    //     if(this.FsnetAuth.isAuthenticated()){
    //         //Get user obj from local storage.
    //         let userObj = reactLocalStorage.getObject('userData');
    //         if(userObj) {
    //             this.setState({
    //                 loggedInUserObj: userObj
    //             }) 
    //         }
    //     }else{
    //        this.props.history.push('/');
    //     }  
    // }
    redirectHome() {
        this.props.history.push('/');
    }

    //Onchange event for all input text boxes.
    handleInputChangeEvent(event,type) {
        let dataObj = {}; 
        this.setState({
            vcFirmError: ''
        })
        switch(type) {
            case 'firmname':
                let firstNameValue = event.target.value.trim()
                if( firstNameValue === '' || firstNameValue === undefined) {
                    this.setState({
                        firmNameMsz: this.Constants.FIRM_NAME_REQUIRED,
                        firmName: '',
                        firmNameBorder: true,
                        firmNameValid: false
                    })
                    dataObj ={
                        firmNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        firmNameMsz: '',
                        firmName: firstNameValue,
                        firmNameBorder: false,
                        firmNameValid: true
                    })
                    dataObj ={
                        firmNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'firmFirstName':
                let firmFirstNameValue = event.target.value.trim()
                if(firmFirstNameValue === '' || firmFirstNameValue === undefined) {
                    this.setState({
                        firmFirstNameMsz: this.Constants.FIRST_NAME_REQUIRED,
                        firmFirstName: '',
                        firmFirstNameBorder: true,
                        firmFirstNameValid: false
                    })
                    dataObj ={
                        firmFirstNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        firmFirstNameMsz: '',
                        firmFirstName: firmFirstNameValue,
                        firmFirstNameBorder: false,
                        firmFirstNameValid: true
                    })
                    dataObj ={
                        firmFirstNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'firmLastName':
                let firmLastNameValue = event.target.value.trim()
                if(firmLastNameValue === '' || firmLastNameValue === undefined) {
                    this.setState({
                        firmLastNameMsz: this.Constants.LAST_NAME_REQUIRED,
                        firmLastName: '',
                        firmLastNameBorder: true,
                        firmLastNameValid: false
                    })
                    dataObj ={
                        firmLastNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        firmLastNameMsz: '',
                        firmLastName: firmLastNameValue,
                        firmLastNameBorder: false,
                        firmLastNameValid: true
                    })
                    dataObj ={
                        firmLastNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'email':
                let emailValue = event.target.value.trim()
                if(emailValue === '' || emailValue === undefined) {
                    this.setState({
                        emailMsz: this.Constants.VALID_EMAIL,
                        email: '',
                        emailBorder: true,
                        emailValid: false
                    })
                    dataObj ={
                        emailValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        emailMsz: '',
                        email: emailValue,
                        emailBorder: false,
                        emailValid: true
                    })
                    dataObj ={
                        emailValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'cellNumber':
                if(event === '' || event === undefined) {
                    this.setState({
                        cellNumberMsz: this.Constants.CELL_NUMBER_VALID,
                        cellNumber: '',
                        cellNumberBorder: true,
                        cellNumberValid: false
                    })
                    dataObj ={
                        cellNumberValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        cellNumberMsz: '',
                        cellNumber: event,
                        cellNumberBorder: false,
                        cellNumberValid: true
                    })
                    dataObj ={
                        cellNumberValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'allowGPdelegatesToSign':
                if(event === 'on') {
                    this.setState({
                        allowGPdelegatesToSign: 1
                    })
                } else if(event === 'off') {
                    this.setState({
                        allowGPdelegatesToSign: 0
                    })
                }
                dataObj ={
                    allowGPdelegatesToSignValid :true
                };
                this.updateStateParams(dataObj);
                break;
            case 'isImporsonatingAllowed':
                if(event === 'on') {
                    this.setState({
                        isImporsonatingAllowed: 1
                    })
                } else if(event === 'off') {
                    this.setState({
                        isImporsonatingAllowed: 0
                    })
                }
                dataObj ={
                    isImporsonatingAllowedValid :true
                };
                this.updateStateParams(dataObj);
                break;
            default:
                //Do Nothing
                break;

        }

    }

    // Update state params values and login button visibility

    updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableSubmitButton();
        });
    }

    // Enable / Disble functionality of Login Button

    enableDisableSubmitButton(){
        let status = (this.state.firmNameValid && this.state.firmFirstNameValid && this.state.firmLastNameValid && this.state.emailValid && this.state.cellNumberValid &&this.state.isImporsonatingAllowedValid  && this.state.allowGPdelegatesToSignValid ) ? true : false;
        this.setState({
            isFormValid : status
        });
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    createVcFirmBtn() {
        let postObj = {firmName:this.state.firmName, firstName:this.state.firmFirstName, lastName:this.state.firmLastName, email: this.state.email, cellNumber: this.state.cellNumber,
        isImporsonatingAllowed: this.state.isImporsonatingAllowed, allowGPdelegatesToSign: this.state.allowGPdelegatesToSign, subscriptonType: this.state.subscriptonType};
        this.open();
        this.Fsnethttp.createVcFirm(postObj).then(result=>{
            this.close();
            alert('VC Firm has been created successfully');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch(error=>{
            this.close();
            if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                this.setState({
                    vcFirmError: error.response.data.errors[0].msg,
                });
            } else {
                this.setState({
                    vcFirmError: this.Constants.INTERNAL_SERVER_ERROR,
                });
            }
        });
    }

    render(){
        return(
            <div id="addFirmContainer">
                <Row className="dashboardMainRow">
                    <Col lg={5} md={6} sm={6} xs={12}>
                        <Row>
                            <div className="fsnet-logo" onClick={this.redirectHome}>FSNET LOGO</div>    
                        </Row>
                    </Col>
                    {/* <HeaderComponent ></HeaderComponent> */}
                </Row>
                <Row className="addFirmRow">
                    
                    <Row id="firm-header">
                        <Col lg={6} md={6} sm={6} xs={6}>
                            <div className="firm-add">Add Firm</div>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={6}>
                            <div className="firm-cancel"><a href="/login">Cancel</a></div>
                        </Col>
                    </Row>
                    
                    <div className="topBorder"></div>
                    <div className="parentDiv">
                        <label className="label-header">Firm Details</label>
                        <div className="subText">Enter the details for the firm below. Fields marked with an * are mandatory.</div>
                        <Row className="marginBot20">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Firm Name*</label>
                                <FormControl type="text" name="firmName" className={"inputFormControl " + (this.state.firmNameBorder ? 'inputError' : '')} maxLength="200" placeholder="Scale Investment Firm" onChange={(e) => this.handleInputChangeEvent(e,'firmname')} onBlur={(e) => this.handleInputChangeEvent(e,'firmname')}/>
                                <span className="error">{this.state.firmNameMsz}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40"></Col>
                        </Row>
                        <label className="label-header">Main Contact Details</label>
                        <div className="subText">Enter the details for the firm’s primary contact. Fields marked with an * are mandatory.</div>
                        <Row className="marginBot20">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">First Name*</label>
                                <FormControl type="text" name="firmFirstName" className={"inputFormControl " + (this.state.firmFirstNameBorder ? 'inputError' : '')} maxLength="200" placeholder="Elisha" onChange={(e) => this.handleInputChangeEvent(e,'firmFirstName')} onBlur={(e) => this.handleInputChangeEvent(e,'firmFirstName')}/>
                                <span className="error">{this.state.firmFirstNameMsz}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Last Name*</label>
                                <FormControl type="text" name="firmLastName" className={"inputFormControl " + (this.state.firmLastNameBorder ? 'inputError' : '')} maxLength="200" placeholder="Benedict" onChange={(e) => this.handleInputChangeEvent(e,'firmLastName')} onBlur={(e) => this.handleInputChangeEvent(e,'firmLastName')}/>
                                <span className="error">{this.state.firmLastNameMsz}</span>
                            </Col>
                        </Row>
                        <Row className="marginBot20">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Email Address*</label>
                                <FormControl type="text" name="firmName" className={"inputFormControl " + (this.state.emailBorder ? 'inputError' : '')} maxLength="200" placeholder="EBenedict@gmail.com" onChange={(e) => this.handleInputChangeEvent(e,'email')} onBlur={(e) => this.handleInputChangeEvent(e,'email')}/>
                                <span className="error">{this.state.emailMsz}</span>
                            </Col>
                            <form>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Phone Number*</label>
                                <PhoneInput className={(this.state.cellNumberBorder ? 'inputError' : '')} maxLength="14" placeholder="(123) 456-7890" value={ this.state.cellNumber } country="US" onChange={phone => this.handleInputChangeEvent(phone,'cellNumber')} />
                                <span className="error">{this.state.cellNumberMsz}</span>
                            </Col>
                            </form>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40"></Col>
                        </Row>
                        <label className="label-header">Privacy Options</label>
                        <div className="subText">Allow FSNET admin access to view and edit firm funds? This will allow an admin to impersonate a GP from firm and take actions on their behalf</div>
                        <Radio name="isImporsonatingAllowed" className="marginLeft15" inline onChange={(e) => this.handleInputChangeEvent('on','isImporsonatingAllowed')}>
                            On
                            <span className="radio-checkmark"></span>
                        </Radio>
                        <Radio name="isImporsonatingAllowed" className="marginLeft15" inline onChange={(e) => this.handleInputChangeEvent('off','isImporsonatingAllowed')}>
                            Off
                            <span className="radio-checkmark"></span>
                        </Radio>
                        <div className="subText">Allow GP delegates to sign documents on behalf of GP?</div>
                        <FormGroup>
                            <Radio name="allowGPdelegatesToSign" className="marginLeft15" inline onChange={(e) => this.handleInputChangeEvent('on','allowGPdelegatesToSign')}>
                                On
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="allowGPdelegatesToSign" className="marginLeft15" inline onChange={(e) => this.handleInputChangeEvent('off','allowGPdelegatesToSign')}>
                                Off
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </FormGroup>
                        <div className="error marginLeft15">{this.state.vcFirmError}</div>
                    </div>
                    <div className="topBorder"></div>
                    <div className="parentDiv">
                        <Button className={"submitBtn "+ (this.state.isFormValid ? 'btnEnabled' : '') } disabled={!this.state.isFormValid} onClick={this.createVcFirmBtn}>Submit</Button>
                    </div>
                </Row>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default CreateVcFirmComponent;



