import React, { Component } from 'react';
import '../createfund.component.css';
import {Button, Checkbox as CBox, Row, Col} from 'react-bootstrap';
import userDefaultImage from '../../../images/default_user.png';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'

class Step5Component extends Component {

    constructor(props){
        super(props);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.addLpDelegateBtn = this.addLpDelegateBtn.bind(this);
        this.closeLpDelegateModal = this.closeLpDelegateModal.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.state = {
            showAddLpDelegateModal: false,
        }
    }

    addLpDelegateBtn() {
        this.setState({
            showAddLpDelegateModal: true
        })
    }

    closeLpDelegateModal() {
        this.setState({
            showAddLpDelegateModal: false
        })
    }

    proceedToNext() {
        this.props.history.push('/createfund/step6');
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/step4');
    }

    handleInputChangeEvent(event,type) {



    }

    render() {
        return (
            <div className="GpDelegatesContainer">
                <h1 className="assignGp">Assign LPs</h1>
                <p className="Subtext">Select LPs from the list below or choose to add new LP to Fund.</p>
                <Button className="gpDelegateButton lpDelegateButton" onClick={this.addLpDelegateBtn}>Limited Partner</Button>
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
                <div className="addRoleModal" hidden={!this.state.showAddLpDelegateModal}>
                    
                    <h3 className="addGpDelegate">Add GP Delegate</h3>
                    <p className="addGpSubtext">Fill in the form below to add a new GP Delegate to the fund. Fields marked with an * are required.</p>                            
                    <Row>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <label className="addGpFLName">First Name*</label>
                            <input type="text" name="firstName" className="inputFormBox" placeholder="Charles"/>                    
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <label className="addGpFLName">Last Name*</label>
                            <input type="text" name="lastName" className="inputFormBox" placeholder="Xavier"/>
                        </Col>
                    </Row> 
                    <Row>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <label className="addGpFLName">Email Address*</label>
                            <input type="email" name="email" className="inputFormBox" placeholder="ProfessorX@gmail.com"/>                                
                        </Col>
                    </Row>  
                    <Row>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <label className="addGpFLName">Phone Number (Main)*</label>
                            <PhoneInput maxLength="14" placeholder="(123) 456-7890" country="US" onChange={phone => this.handleInputChangeEvent(phone,'cellNumber')}/>                 
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <label className="addGpFLName">Phone Number (Cell)</label>
                            <PhoneInput maxLength="14" placeholder="(123) 456-7890" country="US" onChange={phone => this.handleInputChangeEvent(phone,'mobileNumber')}/>  
                        </Col>
                    </Row> 
                    <Row className="cancelSubmitMargin">
                        <Col lg={6} md={6} sm={6} xs={12}>
                        <Button type="button" className="addGpCancelBox" onClick={this.closeLpDelegateModal}>Cancel</Button>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12}>
                        <Button type="button" className="addGpSubmitBox">Submit</Button>
                        </Col>
                    </Row> 
                       
                </div> 
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}

export default Step5Component;



