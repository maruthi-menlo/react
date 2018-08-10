import React, { Component } from 'react';
import './login.component.css';
import { Row, Col, Form, FormGroup, Checkbox as CBox, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Loader from '../../widgets/loader/loader.component';
import {Constants} from '../../constants/constants';
import {Fsnethttp} from '../../services/fsnethttp';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from'../../services/fsnetauth';
import ReactDOM from 'react-dom';

class LoginComponent extends Component{

    constructor(props){
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.loginFn = this.loginFn.bind(this);
        this.loginInputHandleEvent = this.loginInputHandleEvent.bind(this);
        this.autoLoginOnEnterKey = this.autoLoginOnEnterKey.bind(this);
        this.state = {
            showModal : false,
            loginUserName:'',
            loginPassword:'',
            userNameError: '',
            passwordError:'',
            loginRemember: false,
            loginErrorMsz: '',
            userNameValid : false,
            passwordValid: false,
            isFormValid: false,
            userNameBorder: false,
            passwordBorder: false,
        }
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

    //Reset all state values to default value.
    componentWillUnmount() {
        this.setState({
            showModal : false,
            loginUserName:'',
            loginPassword:'',
            userNameError: '',
            passwordError:'',
            loginRemember: false,
            loginErrorMsz: '',
        });
    }

    // On enter key call auto login.
    autoLoginOnEnterKey(event){
        if(event.key === 'Enter'){
            let currentElem = ReactDOM.findDOMNode(this.login)
            currentElem.click();
        }
    }

    
    loginFn() {
        if(this.state.loginUserName.trim() && this.state.loginPassword.trim()) {
            // let passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[?\{\}\|\(\)\`~!@#\$%\^&\*\[\]"\';:_\-<>\., =\+\/\\]).{8,}$/;
            // //Check password contains min 8 letters with letters, numbers and symbols.
            // if(!passwordRegex.test(this.state.loginPassword.trim())) {
            //     this.setState({
            //         loginErrorMsz: this.Constants.PASSWORD_RULE_MESSAGE
            //     });
            // } else {
                this.open();
                let username = this.state.loginUserName;
                let password = this.state.loginPassword;
                let loginRemember = this.state.loginRemember;
                let loginObj = {username:username, password:password, rememberMe:loginRemember};
                this.Fsnethttp.login(loginObj).then(result=>{
                    this.close();
                    if(result.data) {
                        reactLocalStorage.set('userData', JSON.stringify(result.data.user));
                        reactLocalStorage.set('firmId', JSON.stringify(result.data.user.vcfirmId));
                        reactLocalStorage.set('token', JSON.stringify(result.data.token));
                        this.props.history.push('/dashboard');
                    }
                })
                .catch(error=>{
                    this.close();
                    if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                        this.setState({
                            loginErrorMsz: error.response.data.errors[0].msg,
                        });
                    } else {
                        this.setState({
                            loginErrorMsz: this.Constants.INVALID_LOGIN,
                        });
                    }
                });
            // }
        } 
        // else {
        //     if(this.state.loginUserName.trim() === '') {
        //         this.setState({
        //             userNameError: this.Constants.LOGIN_USER_NAME_REQUIRED,
        //             userNameValid: false,
        //         });
        //     } 
        //     if(this.state.loginPassword.trim() === '') {
        //         this.setState({
        //             passwordError: this.Constants.LOGIN_PASSWORD_REQUIRED,
        //             passwordValid: false,
        //         });
        //     }
        // }
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

     // Update state params values and login button visibility

     updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableLoginButtion();
        });
    }

    // Enable / Disble functionality of Login Button

    enableDisableLoginButtion(){
        let status = (this.state.userNameValid && this.state.passwordValid) ? true : false;
        this.setState({
            isFormValid : status
        });
    }

    //Onchange event for all input text boxes.
    loginInputHandleEvent(event,type) {
        //Clear the login error message.
        this.setState({
            loginErrorMsz: ''
        })
        let dataObj = {};  
        switch(type) {
            case 'username':
                //Add username value to state
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined) {
                    this.setState({
                        userNameError: this.Constants.LOGIN_USER_NAME_REQUIRED,
                        userNameValid: false,
                        userNameBorder: true,
                    })
                    dataObj ={
                        userNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        loginUserName: event.target.value,
                        userNameError: '',
                        userNameValid: true,
                        userNameBorder: false,
                    })
                    dataObj ={
                        userNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                
                break;
            case 'password':
                //Add password value to state
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined) {
                    this.setState({
                        passwordError: this.Constants.LOGIN_PASSWORD_REQUIRED,
                        passwordValid: false,
                        passwordBorder: true
                    })
                    dataObj ={
                        passwordValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        loginPassword: event.target.value,
                        passwordError:'',
                        passwordValid: true,
                        passwordBorder: false
                    })
                    dataObj ={
                        passwordValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'isRememberMe':
                this.setState({
                    loginRemember : event.target.checked
                });
                break;
            default:
                // do nothing
        }
    }

    render(){
        return(
            <Row id="loginContainer">                    
                <Row className="mainContainer">
                    <div className="fsnet-logo">FSNET LOGO</div>
                </Row>
                <Row className="loginContainer">
                    <Col lg={6} md={6} sm={6} xs={12}>
                        <p className="content-heading">Welcome to Vanilla. We are revolutionizing the way accredited investors subscribe to and manage their investments in private funds.</p>
                        <p className="content-text">Tired of completing lengthy subscription agreements? Signing by hand? Writing checks for capital calls? Lengthy and expensive transfer of interest procedures?<br/><br/>Vanilla allows managers of venture capital, private equity, real estate and other private funds to offer their limited partner subscribers a convenient, secure and efficient way to subscribe for and manage fund interests. Limited partners for their part can elect to store information so that there is no need to enter lengthy subscription qualification information fund after fund.<br/><br/>Toss out those PDF subscription agreements. There is a better way. It's Vanilla.</p>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12} className="paddingLeft7">
                        <div className="formContainer">
                            <p className="labelSignIn">Welcome to Vanilla. Please log in.</p>
                            <div className="error marginLeft20">{this.state.loginErrorMsz}</div>
                            <Form horizontal id="loginForm">
                                <FormGroup controlId="username">
                                    <ControlLabel className="labelFormControl">Username</ControlLabel>
                                    <FormControl type="text" placeholder="Username" className={"formControl " + (this.state.userNameBorder ? 'inputError' : '')} inputRef={(input)=>{this.userName = input}} onChange={(e)=> this.loginInputHandleEvent(e,'username')} onBlur={(e)=> this.loginInputHandleEvent(e,'username')} onKeyPress={this.autoLoginOnEnterKey} />
                                    <div className="error">{this.state.userNameError}</div>
                                </FormGroup>
                                <FormGroup controlId="password">
                                    <ControlLabel className="labelFormControl">Password</ControlLabel>
                                    <FormControl type="password" placeholder="Password" className={"formControl " + (this.state.passwordBorder ? 'inputError' : '')} inputRef={(input)=>{this.password = input}} onChange={(e)=> this.loginInputHandleEvent(e,'password')} onBlur={(e)=> this.loginInputHandleEvent(e,'password')} onKeyPress={this.autoLoginOnEnterKey} />
                                    <div className="error">{this.state.passwordError}</div>
                                </FormGroup>
                                <CBox onChange={(e) => this.loginInputHandleEvent(e,'isRememberMe')}>
                                    <span className="checkmark"></span>
                                </CBox>
                                <label className="remember-text">Remember username?</label>
                                <Button ref={(button) => {this.login = button}} className={"signinBtn "+ (this.state.isFormValid ? 'btnEnabled' : '') } disabled={!this.state.isFormValid}  onClick={this.loginFn}>Sign In</Button>
                                <div>
                                    <span className="forgot-pwd paddingLeft15"><a href="/forgot-password">Forgot password?</a></span>
                                    <span className="forgot-pwd padding15">|</span>
                                    <span className="forgot-pwd"><a href="mailto:jsilber@cooley.com" target="_top">Contact Us</a></span>
                                </div>
                            </Form>
                        </div>
                        <Loader isShow={this.state.showModal}></Loader>
                    </Col>
                </Row>
            </Row>
        );
    }
}

export default LoginComponent;

