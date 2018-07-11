import React, { Component } from 'react';
import '../createfund.component.css';
import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import userDefaultImage from '../../../images/default_user.png';

class Step5Component extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="GpDelegatesContainer">
                <h1 className="assignGp">Assign LPs</h1>
                <p className="Subtext">Select LPs from the list below or choose to add new LP to Fund.</p>
                <Button className="gpDelegateButton lpDelegateButton">Limited Partner</Button>
                <div className="checkBoxGpContainer">
                    <Row className="rowWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <span className="lpNameHeading">LP Name</span>  
                        <i className="fa fa-sort-desc" aria-hidden="true"></i>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationHeading">Organization</span>
                        <i className="fa fa-sort-desc" aria-hidden="true"></i>
                        </Col>
                    </Row>        
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Sarah Douglas</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>    
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Douglas Perkins</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>    
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Maria Robertson</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>    
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Ryan Ramirez</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>    
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Roger Elliott</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>    
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Samuel Clark</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>    
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Sarah Lopez</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>    
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Sarmad Ahallah</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>                    
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Tina Farizza</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>    
                    <Row className="rowLpWidth">
                        <Col lg={5} md={5} sm={5} xs={5}>
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg lpDelegateImg" />
                        <span className="lpName">Timothy Byers</span>
                        </Col>
                        <Col lg={7} md={7} sm={7} xs={7}>
                        <span className="organizationName">Organization Name</span>
                        <CBox className="checkBoxBen lpCheckBox">
                        </CBox>
                        </Col>
                    </Row>    
                </div>    
            </div>
        );
    }
}

export default Step5Component;



