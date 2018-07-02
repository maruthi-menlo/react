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
        this.showForgotScreenFn = this.showForgotScreenFn.bind(this);
    }


    //Show forgot screens based on the screen type.
    showForgotScreenFn(event, screen) {
        switch(screen){
            case 'screen1':
                this.setState({
                    showForgotScreen1: false,
                    showForgotScreen2: true,
                });
                break;
            case 'screen2':
                this.setState({
                    showForgotScreen2: false,
                    showForgotScreen3: true,
                });
                break;
            case 'screen3':
                this.setState({
                    showForgotScreen3: false,
                    showForgotScreen4: true,
                });
                break;
            case 'screen4':
                this.props.history.push('/login');
                break;
            default:
                // do nothing
        }

    }

    render(){
        return(
            <div className="parentContainer">
                <HeaderComponent></HeaderComponent>
                <Row className="forgotContainer">
                    <div className="forgotTopBorder"></div>
                    <div className="forgotParentDiv">
                        <h1 className="forgot-text" hidden={this.state.showForgotScreen4}>Forgot password</h1>
                        <div className="instructions-content" hidden={!this.state.showForgotScreen1}>Enter your email or phone below to receive instructions to reset your password.</div>
                        <div className="instructions-content marginBottom30" hidden={!this.state.showForgotScreen2}>Enter the code we sent to your phone nnumber.</div>
                        <div className="instructions-content" hidden={!this.state.showForgotScreen3}>Create a new password. Password must be Lorum Ipsum and Lorum Ipsum.</div>
                        <Row hidden={!this.state.showForgotScreen1}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Email Address</label>
                                <input type="text" name="email" className="forgotFormControl emailFormControl" placeholder="JohnDoe@gmail.com"/>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Phone Number</label>
                                <input type="text" name="phonenumber" className="forgotFormControl " placeholder="(123)4568-8910"/>
                            </Col>
                            <Row>
                                <Button className="forgot-submit" onClick={(e) => this.showForgotScreenFn(e,'screen1')}>Submit</Button> <br/>
                            </Row>
                            <label className="cancel-text"> <a href="/login">Cancel</a></label>
                        </Row>
                        <Row hidden={!this.state.showForgotScreen2}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Verification Code</label>
                                <input type="text" name="verifyPhoneNumber" placeholder="A3456IHOP" className="forgotFormControl"/> <span className="sendCodeAgain">Send Code Again</span>
                            </Col>
                            <Row>
                                <Button className="forgot-submit" onClick={(e) => this.showForgotScreenFn(e,'screen2')}>Reset Password</Button> <br/>
                            </Row>
                            <label className="cancel-text"> <a href="/login">Cancel</a></label>
                        </Row>
                        <Row hidden={!this.state.showForgotScreen3}>
                            <Col className="width40" lg={6} md={6} sm={6} xs={12}>
                                <label className="forgot-label-text">Password</label>
                                <input type="text" name="password" className="forgotFormControl inputMarginBottom"/><br/>
                                <span className="passwordDNRequirements">Password doesn't meet requirements</span>
                            </Col>
                            <Col className="width40" lg={6} md={6} sm={6} xs={12}>
                                <label className="forgot-label-text">Password Again</label>
                                <input type="text" name="confirmPassword" className="forgotFormControl"/>
                            </Col>
                            <Row>
                                <Button className="forgot-submit" onClick={(e) => this.showForgotScreenFn(e,'screen3')}>Reset Password</Button> <br/>
                            </Row>
                            <label className="cancel-text"> <a href="/login">Cancel</a></label>
                        </Row>
                        <Row hidden={!this.state.showForgotScreen4}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-success-text">success</label>
                                <label className="forgot-reset-text">Your password has been reset</label>
                                <div className="success-icon">
                                    <i className="fa fa-check-circle" aria-hidden="true"></i>
                                </div>
                                <div className="text-center">
                                    <Button className="forgot-submit" onClick={(e) => this.showForgotScreenFn(e,'screen4')}>Sign In</Button> <br/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Row>
            </div>
        );
    }
}

export default ForgotPasswordComponent;

