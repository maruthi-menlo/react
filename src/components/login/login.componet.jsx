import React, { Component } from 'react';
import './login.component.css';
import { Row, Col, Grid, Form, FormGroup, Checkbox as CBox, FormControl, ControlLabel, Button} from 'react-bootstrap';
import Loader from '../../widgets/loader/loader.component';

class LoginComponent extends Component{

    constructor(props){
        super(props);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.loginFn = this.loginFn.bind(this);
        this.state = {
            showModal : false,
        }
    }
    
    loginFn() {
        this.open();
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    render(){
        return(
            <Row>                    
                <Row className="mainContainer">
                    <div className="fsnet-logo">FSNET LOGO</div>
                </Row>
                <Row className="mainContainer">
                    <Col lg={6} md={6} sm={6} xs={12}>
                        <p className="content-heading">Nam dapibus nisl vitae elit fringilla rutrum. Aenean sollicitudin, erat a elementum rutrum, neque sem pretium metus, quis mollis nisl nunc et massa.</p>
                        <p className="content-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut pretium pretium tempor. Ut eget imperdiet neque. In volutpat ante semper diam molestie, et aliquam erat laoreet. Sed sit amet arcu aliquet, molestie justo at, auctor nunc. Phasellus ligula ipsum, volutpat eget semper id, viverra eget nibh. <br/>Suspendisse luctus mattis cursus. Nam consectetur ante at nisl hendrerit gravida.</p>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12} className="formContainer">
                        <p className="labelSignIn">Already Have an account? Sign In</p>
                        <Form horizontal id="loginForm">
                            <FormGroup controlId="username">
                                <ControlLabel className="labelFormControl">Username</ControlLabel>
                                <FormControl type="text" placeholder="Username" className="formControl"/>
                            </FormGroup>
                            <FormGroup controlId="password">
                                <ControlLabel className="labelFormControl">Password</ControlLabel>
                                <FormControl type="password" placeholder="Password"  className="formControl"/>
                            </FormGroup>
                            <CBox id="rememberme" className="cbRemeberMe">
                                &nbsp; Remember Username?
                            </CBox>
                            <Button className="btnText" onClick={this.loginFn}>Sign In</Button>
                        </Form>
                        <Loader isShow={this.state.showModal}></Loader>
                    </Col>
                </Row>
            </Row>
        );
    }
}

export default LoginComponent;

