import React, { Component } from 'react';
import '../createfund.component.css';
import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class Step1Component extends Component{

    constructor(props){
        super(props);
    }


    render(){
        return(
            <div>
                <Col xs={6} md={12}>
                        <div className="main-heading"><span className="main-title">Create New Fund</span><a className="cancel-fund">Cancel</a></div>
                </Col>

                <div className="form-grid">
                    <form>
                        <h2>Fund Details</h2>
                        <h4>Enter the details for the fund below. Fields marked with an * are mandatory.</h4>
                        <FormGroup controlId="formBasicText">
                            <Row className="form-row">
                                <Col xs={6} md={6}>
                                    <ControlLabel className="form-label">Fund Name*</ControlLabel>
                                    <FormControl type="text" placeholder="Helios" />
                                    <FormControl.Feedback />
                                </Col>

                                <Col xs={6} md={6}>
                                    <ControlLabel className="form-label">Fund Amount*</ControlLabel>
                                    <FormControl type="text" placeholder="$15,000,000.00" />
                                    <FormControl.Feedback />
                                </Col>
                            </Row>

                            <Row className="form-row">
                                <Col xs={6} md={6}>
                                    {/* <DropdownButton title="Fund Duration" id="" className="ddstyles">
                            <MenuItem eventKey="1">Action</MenuItem>
                            <MenuItem eventKey="2">Another action</MenuItem>
                            <MenuItem eventKey="3">Something else here</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey="4">Separated link</MenuItem>
                        </DropdownButton> */}
                                </Col>
                            </Row>

                            <h2>Minimum Fund Participation Amount or Minimum Fund Participation Percentage</h2>
                            <h4>Fill in one. Minimum fund participation can be calculated based off on percentage participation.</h4>

                        </FormGroup>
                    </form>
                </div>
            </div>
        );
    }
}

export default Step1Component;



