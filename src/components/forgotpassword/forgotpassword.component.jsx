import React, { Component } from 'react';
import { Row,Col,Button, FormControl} from 'react-bootstrap';
import  HeaderComponent from '../authheader/header.component'
import './forgotpassword.component.css';
import { FsnetAuth } from'../../services/fsnetauth';
import {Fsnethttp} from '../../services/fsnethttp';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import {Constants} from '../../constants/constants';
import Loader from '../../widgets/loader/loader.component';

class ForgotPasswordComponent extends Component{
    constructor(props){
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.state = {
            showForgotScreen1: true,
            showForgotScreen2: false,
            showForgotScreen3: false,
            showForgotScreen4: false,
            email:'',
            cellNumber: '',
            accountType:'',
            accountTypeRequired: '',
            forgotScreen1ErrorMsz: '',
            showVerifyCodeIcon: false,
            invalidVerifyCodeMsz:'',
            verificationCode:'',
            createNewPwdErr:false,
            createNewPwdErrMsz: '',
            password: '',
            confirmPassword : ''
        }
        this.showForgotScreenFn = this.showForgotScreenFn.bind(this);
        this.handleChangeEvent = this.handleChangeEvent.bind(this);
        this.sendCodeAgain = this.sendCodeAgain.bind(this); 
        this.verifyCode = this.verifyCode.bind(this);
    }
    
    componentDidMount() {
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        //Check if user already logged in
        //If yes redirect to dashboard page
        if(this.FsnetAuth.isAuthenticated()){
            this.props.history.push('/dashboard');
        }
    }

    handleChangeEvent(event, type) {
        switch(type) {
            case 'email':
                this.setState({
                    email: event.target.value,
                    forgotScreen1ErrorMsz:'',
                })
                break;
            case 'cellNumber':
                this.setState({
                    cellNumber: event,
                    forgotScreen1ErrorMsz:'',
                })
                break;
            case 'accountType':
                this.setState({
                    accountType: event.target.value,
                    accountTypeRequired: ''
                })
                break;
            case 'password':
                this.setState({
                    password: event.target.value,
                    createNewPwdErr: false,
                    createNewPwdErrMsz: ''
                })
                break; 
            case 'confirmPassword':
                this.setState({
                    confirmPassword: event.target.value,
                    createNewPwdErr: false,
                    createNewPwdErrMsz: ''
                })
                break; 
            default:
                // do nothing
        }
    }

    verifyCode(event, button) {
        let code = '';
        if(button !== 'verifyResetButton') {
            code = event.target.value;
        } else {
            code = this.state.verificationCode
        }
        if((event.target !==undefined  && event.target.value.length === 6) || button === 'verifyResetButton') {
            this.open();
            let postObj = {email:this.state.email, cellNumber:this.state.cellNumber, accountType:this.state.accountType, code:code}
            this.Fsnethttp.verifycode(postObj).then(result=>{
                this.close();
                if(result) {
                    this.setState({
                        showVerifyCodeIcon: true,
                        verificationCode:code,
                    });
                    if(button === 'verifyResetButton') {
                        this.setState({
                            showForgotScreen2: false,
                            showForgotScreen3: true,
                        });
                    }
                }
            })
            .catch(error=>{
                this.close();
                if(error.response.data !==undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        invalidVerifyCodeMsz: error.response.data.errors[0].msg,
                        verificationCode:code,
                        showForgotScreen2: false,
                        showForgotScreen3: true,
                    });
                }
            });
        } else {
            this.setState({
                showVerifyCodeIcon: false,
                invalidVerifyCodeMsz:'',
                verificationCode:''
            });
        }
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    //Send code again
    sendCodeAgain() {
        let forgotObj = {email:this.state.email, cellNumber:this.state.cellNumber, accountType:this.state.accountType}
        this.Fsnethttp.forgotPassword(forgotObj).then(result=>{
            this.close();
            if(result.data) {
                this.setState({
                    showForgotScreen1: false,
                    showForgotScreen2: true,
                });
            }
        })
        .catch(error=>{
            this.close();
            if(error.response.data !==undefined && error.response.data.errors !== undefined) {
                this.setState({
                    forgotScreen1ErrorMsz: error.response.data.errors[0].msg
                })
            }
        });
    }

    //Show forgot screens based on the screen type.
    showForgotScreenFn(event, screen) {
        switch(screen){
            case 'screen1':
                let valid = this.screen1Validations();
                if(!valid) {
                    this.open();
                    this.sendCodeAgain();
                }
                break;
            case 'screen2':
                if(this.state.verificationCode !== '') {
                    this.verifyCode(this.state.verificationCode,'verifyResetButton');
                } else {
                    this.setState({
                        invalidVerifyCodeMsz: this.Constants.INVALID_VERIFY_CODE
                    })
                }
                break;
            case 'screen3':
                let resetPwdvalid = this.screen3Validations();
                if(!resetPwdvalid) {
                    this.open();
                    this.resetPassword();
                }
                break;
            case 'screen4':
                this.props.history.push('/login');
                break;
            default:
                // do nothing
        }

    }

    resetPassword() {
        let resetPwdObj = {email:this.state.email, cellNumber:this.state.cellNumber, accountType:this.state.accountType, code: this.state.verificationCode, password: this.state.password, passwordConfirmation: this.state.confirmPassword}
        this.Fsnethttp.resetPassword(resetPwdObj).then(result=>{
            this.close();
            if(result.data) {
                this.setState({
                    showForgotScreen3: false,
                    showForgotScreen4: true,
                });
            }
        })
        .catch(error=>{
            this.close();
            if(error.response.data !==undefined && error.response.data.errors !== undefined) {
                this.setState({
                    createNewPwdErr: false,
                    createNewPwdErrMsz: error.response.data.errors[0].msg,
                });
            }
        });
    }

    screen1Validations() {
        let email = this.state.email;
        let number = this.state.cellNumber;
        let type = this.state.accountType;
        let error = false;
        if(type === '0' || type === '') {
            this.setState({
                accountTypeRequired: this.Constants.ACCOUNT_TYPE_REQUIRED
            })
            error = true;
        }

        if(email === '' && number === '') {
            this.setState({
                forgotScreen1ErrorMsz: this.Constants.EMAIL_MOBILE_REQUIRED
            })
            error = true;
        } 

        if(error) {
            return true
        } else {
            return false
        }
    }

    screen3Validations() {
        let password = this.state.password;
        let cnfrmPassword = this.state.confirmPassword;
        let error = false;
        if(password === '' || cnfrmPassword === '') {
            this.setState({
                createNewPwdErr:true,
                createNewPwdErrMsz: this.Constants.LOGIN_PASSWORD_REQUIRED,
            });
            error = true;
        } else if(password !== cnfrmPassword) {
            this.setState({
                createNewPwdErr:true,
                createNewPwdErrMsz: this.Constants.REQUIRED_PASSWORD_CONFIRMPASSWORD_SAME,
            });
            error = true;
        } else {
            let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
            if(!passwordRegex.test(this.state.password) || !passwordRegex.test(this.state.confirmPassword)) {
                this.setState({
                    createNewPwdErr:true,
                    createNewPwdErrMsz: this.Constants.PASSWORD_NOT_MATCH,
                });
                error = true;
            }
        }

        if(error) {
            return true
        } else {
            return false
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
                        <div className="instructions-content marginBottom30" hidden={!this.state.showForgotScreen2}>Enter the code we sent to your phone number.</div>
                        <div className="instructions-content" hidden={!this.state.showForgotScreen3}>Create a new password. Password must contain 8 or more characters with a mix of letters, numbers & symbols</div>
                        <Row hidden={!this.state.showForgotScreen1}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Email Address</label>
                                <input type="text" name="email" onChange={(e) => this.handleChangeEvent(e,'email')} className="forgotFormControl" placeholder="JohnDoe@gmail.com"/>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Phone Number (Cell)</label>
                                <PhoneInput maxLength="14" placeholder="(123) 456-7890" value={ this.state.cellNumber } country="US" onChange={phone => this.handleChangeEvent(phone,'cellNumber')}/>
                            </Col>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Account type*</label>
                                <FormControl defaultValue="0" className="forgotFormControl" componentClass="select" onChange={(e) => this.handleChangeEvent(e,'accountType')} placeholder="Select Role">
                                    <option value={0}>Select Role</option>
                                    <option value="FSNETAdministrator">FSNETAdministrator</option>
                                    <option value="GP">GP</option>
                                    <option value="GPDelegate">GPDelegate</option>
                                    <option value="LP">LP</option>
                                    <option value="LPDelegate">LPDelegate</option>
                                </FormControl>
                                <span className="error">{this.state.accountTypeRequired}</span>
                                <div className="error">{this.state.forgotScreen1ErrorMsz} </div>
                            </Col>
                            <Row>
                                <Button className="forgot-submit" onClick={(e) => this.showForgotScreenFn(e,'screen1')}>Submit</Button> <br/>
                            </Row>
                            <label className="cancel-text"> <a href="/login">Cancel</a></label>
                        </Row>
                        <Row hidden={!this.state.showForgotScreen2}>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <label className="forgot-label-text">Verification Code</label>
                                <input type="text" name="verifyPhoneNumber" placeholder="A3456IHOP" maxLength="6" minLength="6" onChange={this.verifyCode} className="forgotFormControl marginBotNone"/> 
                                <div className="code-success-icon" hidden={!this.state.showVerifyCodeIcon}>
                                    <i className="fa fa-check-circle" aria-hidden="true"></i>
                                </div>
                                <span className="sendCodeAgain" onClick={this.sendCodeAgain}>Send Code Again</span><br/>
                                <span className="error">{this.state.invalidVerifyCodeMsz}</span>
                            </Col>
                            <Row>
                                <Button className="forgot-submit" onClick={(e) => this.showForgotScreenFn(e,'screen2')}>Reset Password</Button> <br/>
                            </Row>
                            <label className="cancel-text"> <a href="/login">Cancel</a></label>
                        </Row>
                        <Row hidden={!this.state.showForgotScreen3}>
                            <Col className="width40" lg={6} md={6} sm={6} xs={12}>
                                <label className="forgot-label-text">Password</label>
                                <input type="password" name="password" onChange={(e) => this.handleChangeEvent(e,'password')} className="forgotFormControl inputMarginBottom"/><br/>
                                <span className="passwordDNRequirements" hidden={!this.state.createNewPwdErr}>{this.state.createNewPwdErrMsz}</span>
                            </Col>
                            <Col className="width40" lg={6} md={6} sm={6} xs={12}>
                                <label className="forgot-label-text">Password Again</label>
                                <input type="password" onChange={(e) => this.handleChangeEvent(e,'confirmPassword')} name="confirmPassword" className="forgotFormControl"/>
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
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default ForgotPasswordComponent;

