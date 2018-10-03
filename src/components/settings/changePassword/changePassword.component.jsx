import React, { Component } from 'react';
import '../settings.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Link } from "react-router-dom";
import { Row, Col, Button } from 'react-bootstrap';
import {Constants} from '../../../constants/constants';

class changePasswordComponent extends Component {

    constructor(props) {
        super(props);
        this.Constants = new Constants();
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.resetPasswordFn = this.resetPasswordFn.bind(this);
        this.state = {
            showModal: false,
            isFormValid: false,
            currentPasswordValid: false, 
            currentPassword: '', 
            currentPasswordBorder: false, 
            currentPasswordMsz: '', 
            passwordValid: false,
            password: '', 
            ppasswordBorder: false, 
            passwordMsz: '',
            cnfrmPasswordValid: false,
            cnfrmPassword: '', 
            cnfrmPasswordBorder: false, 
            cnfrmPasswordMsz: '',
            changePasswordErrorMsz: ''
        }

    }

    componentDidMount() {
        
    }

    //Onchange event for all input text boxes.
    handleInputChangeEvent(event,type,errorName) {
        let dataObj = {}; 
        switch(type) {
            case type:
                if(event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        [type+'Msz']: this.Constants[errorName],
                        [type+'Valid']: false,
                        [type+'Border']: true,
                    })
                    dataObj ={
                        [type+'Valid'] :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        [type]: event.target.value.trim(),
                        [type+'Msz']: '',
                        [type+'Valid']: true,
                        [type+'Border']: false,
                    })
                    dataObj ={
                        [type+'Valid'] :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            default:
                // do nothing
        }
    }

    // Update state params values and save button visibility

    updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableSaveButton();
        });
    }

    // Enable / Disble functionality of save Button

    enableDisableSaveButton(){
        let status = (this.state.currentPasswordValid && this.state.passwordValid && this.state.cnfrmPasswordValid ) ? true : false;
        this.setState({
            isFormValid : status
        });
    }

    resetPasswordFn() {
        if(this.state.password !== this.state.cnfrmPassword) {
            this.setState({
                changePasswordErrorMsz:this.Constants.REQUIRED_PASSWORD_CONFIRMPASSWORD_SAME
            })
            return true;
        }
    }
    
    render() {
        return (
            <div className="width100">
                <div className="main-heading"><span className="main-title">Change Password</span><Link to="/dashboard" className="cancel-fund">Cancel</Link></div>
                <div className="profileContainer">
                    <h1 className="title marginBottom2">Change Password</h1>
                    <div className="subtext">Create a new password. Password must contain 8 or more characters with a mix of letters, numbers & symbols.</div>
                    <Row className="marginTop20">
                        <Col className="width40" lg={6} md={6} sm={6} xs={12}>
                            <label className="input-label">Current Password</label>
                            <input type="password" name="password" placeholder="Enter Current Password" className={"forgotFormControl inputMarginBottom " + (this.state.currentPasswordBorder ? 'inputError' : '')} onChange={(e) => this.handleInputChangeEvent(e,'currentPassword', 'CURRENT_PWD_REQUIRED')} onBlur={(e) => this.handleInputChangeEvent(e,'currentPassword', 'CURRENT_PWD_REQUIRED')}/>
                            <span className="error">{this.state.currentPasswordMsz}</span>
                        </Col>
                    </Row>
                    <Row className="marginTop20">
                        <Col className="width40" lg={6} md={6} sm={6} xs={12}>
                            <label className="input-label">Password</label>
                            <input type="password" name="newPassword" placeholder="Enter Password" className={"forgotFormControl inputMarginBottom " + (this.state.passwordBorder ? 'inputError' : '')} onChange={(e) => this.handleInputChangeEvent(e,'password', 'LOGIN_PASSWORD_REQUIRED')} onBlur={(e) => this.handleInputChangeEvent(e,'password', 'LOGIN_PASSWORD_REQUIRED')}/>
                            <span className="error">{this.state.passwordMsz}</span>
                        </Col>
                    </Row>
                    <Row className="marginTop20">
                        <Col className="width40" lg={6} md={6} sm={6} xs={12}>
                            <label className="input-label">Confirm Password</label>
                            <input type="password" name="confirmPassword" placeholder="Enter Confirm Password" className={"forgotFormControl " + (this.state.cnfrmPasswordBorder ? 'inputError' : '')} onChange={(e) => this.handleInputChangeEvent(e,'cnfrmPassword', 'CNFRM_PWD_REQUIRED')} onBlur={(e) => this.handleInputChangeEvent(e,'cnfrmPassword', 'CNFRM_PWD_REQUIRED')} />
                            <span className="error">{this.state.cnfrmPasswordMsz}</span>
                        </Col>
                    </Row>
                    <div className="error marginTop20">{this.state.changePasswordErrorMsz}</div>
                    <Row className="marginTop20">
                        <Button className={"reset-password-btn "+ (this.state.isFormValid ? 'btnEnabled' : '') } onClick={this.resetPasswordFn}>Reset Password</Button>
                    </Row>
                    <label className="cancel-btn cancelBtn marginTop20"> <a href="/dashboard">Cancel</a></label>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default changePasswordComponent;

