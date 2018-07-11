import React, { Component } from 'react';
import '../createfund.component.css';
import staticProfile from '../../../images/profilePic.jpg';
import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class Step1Component extends Component{

    constructor(props){
        super(props);
    }


    render(){
        return(
            <div>
                <div className="form-grid">
                    <h2>Fund Details</h2>
                    <h4>Enter the details for the fund below. Fields marked with an * are mandatory.</h4>
                   
                    <div controlId="step1Form">
                        <Row className="step1Form-row">
                            <Col xs={6} md={6} sm={6} xs={12}>
                                <label className="form-label">Legal Entity*</label>
                                <input type="text" className= "inputFormControl" placeholder="Helios" />
                               
                            </Col>
                            <Col xs={6} md={6} sm={6} xs={12}>
                                <label className="form-label">Fund hard cap</label>
                                <input type="text" className= "inputFormControl" placeholder="$15,000,000.00" />
                       
                            </Col>
                        </Row>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">Fund manager (GP) legal entity name*</label>
                                <input type="text" className= "inputFormControl" placeholder="Helios GP I,LLC" />   
                            </Col>
                            <Col xs={6} md={6}>
                                <label className="form-label">Fund target commitment</label>
                                <input type="text" className= "inputFormControl" placeholder="$20,000,000" />
                        
                            </Col>
                        </Row>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">All delegates must sign fund:</label>
                                <CBox inline id="yesCheckbox">&nbsp; Yes</CBox>
                                <CBox inline id="noCheckbox">&nbsp; No</CBox>
                            </Col>
                            <Col xs={6} md={6}>
                                <label className="form-label">Capital commitment by fund manager*</label>
                                <input type="text" className= "inputFormControl" placeholder="$12,000.00" />
                               
                            </Col>
                           
                        </Row>
                        <label className="profile-text">Fund Image:(Image must not exceed 96x96)</label>
                        <Row className="profile-Row profileMargin">
                            <Col lg={6} md={6} sm={6} xs={12} >
                                <img src={staticProfile} alt="profile-pic" className="profile-pic"/>
                                <span className="profilePicName">menlo.jpg</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <input type="file" id="uploadBtn" className="hide"/>
                                <Button className="uploadFile">Upload File</Button> <br/>
                                <label className="removeBtn">Remove</label>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}

export default Step1Component;



