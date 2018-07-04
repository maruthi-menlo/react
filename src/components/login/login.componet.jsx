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
        if(this.state.loginUserName && this.state.loginPassword) {
            this.open();
            let username = this.state.loginUserName;
            let password = this.state.loginPassword;
            let loginRemember = this.state.loginRemember;
            let loginObj = {username:username, password:password, rememberMe:loginRemember};
            this.Fsnethttp.login(loginObj).then(result=>{
                this.close();
                console.log(result);
                if(result.data) {
                    reactLocalStorage.set('userData', JSON.stringify(result.data.user));
                    this.props.history.push('/dashboard');
                }
            })
            .catch(error=>{
                if(error) {
                    this.close();
                    this.setState({
                        loginErrorMsz: this.Constants.INVALID_LOGIN
                    })
                }
            });
        } else {
            if(this.state.loginUserName === '') {
                this.setState({
                    userNameError: this.Constants.LOGIN_USER_NAME_REQUIRED
                });
            } 
            if(this.state.loginPassword === '') {
                this.setState({
                    passwordError: this.Constants.LOGIN_PASSWORD_REQUIRED
                });
            }
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

    //Onchange event for all input text boxes.
    loginInputHandleEvent(event,type) {
        //Clear the login error message.
        this.setState({
            loginErrorMsz: ''
        })
        switch(type) {
            case 'username':
                //Add username value to state
                this.setState({
                    loginUserName: event.target.value,
                    userNameError: '',
                })
                break;
            case 'password':
                //Add password value to state
                this.setState({
                    loginPassword: event.target.value,
                    passwordError:'',
                })
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
            <Row>                    
                <Row className="mainContainer">
                    <div className="fsnet-logo">FSNET LOGO</div>
                </Row>
                <Row className="loginContainer">
                    <Col lg={6} md={6} sm={6} xs={12}>
                        <p className="content-heading">Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa.</p>
                        <p className="content-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium pretium tempor. Ut eget imperdiet neque. In volutpat ante semper diam molestie, et aliquam erat laoreet. Sed sit amet arcu aliquet, molestie justo at, auctor nunc. Phasellus ligula ipsum, volutpat eget semper id, viverra eget nibh. <br/>Suspendisse luctus mattis cursus. Nam consectetur ante at nisl hendrerit gravida.</p>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12} className="paddingLeft7">
                        <div className="formContainer">
                            <p className="labelSignIn">Already Have an account? Sign In</p>
                            <div className="loginError marginLeft20">{this.state.loginErrorMsz}</div>
                            <Form horizontal id="loginForm">
                                <FormGroup controlId="username">
                                    <ControlLabel className="labelFormControl">Username</ControlLabel>
                                    <FormControl type="text" placeholder="Username" className="formControl" onChange={(e)=> this.loginInputHandleEvent(e,'username')} onKeyPress={this.autoLoginOnEnterKey} autoComplete="off"/>
                                    <div className="loginError">{this.state.userNameError}</div>
                                </FormGroup>
                                <FormGroup controlId="password">
                                    <ControlLabel className="labelFormControl">Password</ControlLabel>
                                    <FormControl type="password" placeholder="Password"  className="formControl" onChange={(e)=> this.loginInputHandleEvent(e,'password')} onKeyPress={this.autoLoginOnEnterKey} autoComplete="off"/>
                                    <div className="loginError">{this.state.passwordError}</div>
                                </FormGroup>
                                <CBox className="loginRemeberMe" onChange={(e) => this.loginInputHandleEvent(e,'isRememberMe')}>
                                    &nbsp; Remember Username?
                                </CBox>
                                <Button ref={(button) => {this.login = button}} className="signinBtn" onClick={this.loginFn}>Sign In</Button>
                                <div className="forgot-pwd"><a href="/forgot-password">Forgot Password?</a></div>
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

