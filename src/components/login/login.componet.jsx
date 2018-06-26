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
            <Grid>                
                <Row>                    
                    <Col className="loginContainer" md={8} lg={6} sm={12} xs={12}>
                        <Row>
                            <div className="fsnet-logo">FSNET LOGO</div>
                            <Col lg={9} md={9} sm={9} xs={10} className="formContainer">
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
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default LoginComponent;

