import React, { Component } from 'react';
import '../settings.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Link } from "react-router-dom";
import { Row, Col, Button } from 'react-bootstrap';

class changePasswordComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            
        }

    }

    componentDidMount() {
        
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
                            <input type="password" name="password" className="forgotFormControl inputMarginBottom"/><br />
                        </Col>
                    </Row>
                    <Row className="marginTop20">
                        <Col className="width40" lg={6} md={6} sm={6} xs={12}>
                            <label className="input-label">Password</label>
                            <input type="password" name="newPassword" className="forgotFormControl inputMarginBottom"/><br />
                        </Col>
                    </Row>
                    <Row className="marginTop20">
                        <Col className="width40" lg={6} md={6} sm={6} xs={12}>
                            <label className="input-label">Password again</label>
                            <input type="password" name="confirmPassword" className="forgotFormControl" />
                        </Col>
                    </Row>
                    <Row className="marginTop20">
                        <Button className="reset-password-btn btnEnabled">Reset Password</Button>
                    </Row>
                    <label className="cancel-btn cancelBtn marginTop20"> <a href="/dashboard">Cancel</a></label>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default changePasswordComponent;

