import React, { Component } from 'react';
import { Row,Col,Button} from 'react-bootstrap';
import  HeaderComponent from '../authheader/header.component'
import './forgotpassword.component.css';

class ForgotPasswordComponent extends Component{
    constructor(props){
        super(props);
        this.state = {
            showForgotScreen1: true,
            showForgotScreen2: false,
            showForgotScreen3: false,
            showForgotScreen4: false,
        }
    }

    render(){
        return(
            <div className="parentContainer">
                <HeaderComponent></HeaderComponent>
                <Row className="forgotContainer">
                    <div className="forgotTopBorder"></div>
                    <div className="forgotParentDiv">
                        <h1 className="forgot-text">Forgot password</h1>
                        <div className="instructions-content" hidden={!this.state.showForgotScreen1}>Enter your email or phone below to receive instructions to reset your password.</div>
                        <div className="instructions-content" hidden={!this.state.showForgotScreen2}>Enter the code we sent to your phone nnumber.</div>
                        <div className="instructions-content" hidden={!this.state.showForgotScreen3}>Create a new password. Password must be Lorum Ipsum and Lorum Ipsum.</div>
                        <Row hidden={!this.state.showForgotScreen1}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Email Address</label>
                                <input type="text" name="email" className="forgotFormControl" placeholder="JohnDoe@gmail.com"/>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Phone Number</label>
                                <input type="text" name="phonenumber" className="forgotFormControl" placeholder="(123)4568-8910"/>
                            </Col>
                            <Row>
                                <Button className="forgot-submit">Submit</Button> <br/>
                            </Row>
                            <label className="cancel-text"> <a href="/login">Cancel</a></label>
                        </Row>
                        <Row hidden={!this.state.showForgotScreen2}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Verification Code</label>
                                <input type="text" name="verifyPhoneNumber" className="forgotFormControl"/> <span>Send Code Again</span>
                            </Col>
                            <Row>
                                <Button className="forgot-submit">Reset Password</Button> <br/>
                            </Row>
                            <label className="cancel-text"> <a href="/login">Cancel</a></label>
                        </Row>
                        <Row hidden={!this.state.showForgotScreen3}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">password</label>
                                <input type="text" name="password" className="forgotFormControl"/>
                                <label className="forgot-label-text">password Again</label>
                                <input type="text" name="confirmPassword" className="forgotFormControl"/>
                            </Col>
                            <Row>
                                <Button className="forgot-submit">Reset Password</Button> <br/>
                            </Row>
                            <label className="cancel-text"> <a href="/login">Cancel</a></label>
                        </Row>
                        <Row hidden={!this.state.showForgotScreen4}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">success</label>
                                <label className="forgot-label-text">Your password has been reset</label>
                            </Col>
                            <Row>
                                <Button className="forgot-submit">Sign In</Button> <br/>
                            </Row>
                        </Row>
                    </div>
                </Row>
            </div>
        );
    }
}

export default ForgotPasswordComponent;

