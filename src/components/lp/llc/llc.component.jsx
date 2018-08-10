import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Button, Radio, Row, Col, FormControl } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { PubSub } from 'pubsub-js';
import { Route, Link } from "react-router-dom";

class LlcFormComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.state = {
            showModal: false,
            
    }
       
    }

    componentDidMount() {
       
    }

    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

        
    render() {
        return (
            <div className="individualForm">
                <div className="form-grid formGridDivMargin">
                    <div id="individualForm">
                        <Row className="step1Form-row">
                            <Col xs={12} md={12}>
                                <label className="form-label width100">Investor Type*</label>
                                <Radio name="investorType" inline id="yesCheckbox">&nbsp; Individual 
                                <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="investorType" inline id="yesCheckbox">&nbsp; LLC 
                                <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="investorType" inline id="yesCheckbox">&nbsp; Trust 
                                <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                        <div className="llc">
                            <Row className="step1Form-row">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Investor Sub Type:*</label>
                                    <FormControl defaultValue="0" className="selectFormControl"  componentClass="select" placeholder="Select Investor Sub Type">
                                        <option value={0}>Select Investor Sub Type</option>
                                        <option value="UsCCorp">U.S. C Corporation</option>
                                        <option value="UsSCorp">U.S. S Corporation</option>
                                        <option value="UsLimited">U.S. Limited Liability Company</option>
                                        <option value="UsLp">U.S. Limited Partnership</option>
                                        <option value="UsGeneral">U.S. General Partnership</option>
                                        <option value="NonUsCorp">Non-U.S. Corporation</option>
                                        <option value="NonUsLLC">Non-U.S. LLC or Similar Private Company</option>
                                        <option value="NonUsLimited">Non-U.S. Limited Partnership or Similar</option>
                                        <option value="otherEntity">Other Entity</option>
                                    </FormControl>            
                                </Col>
                                <Col xs={6} md={6}>
                                    <label className="form-label">Email Address*</label>
                                    <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className="inputFormControl"/>   
                                    <span className="error"></span>      
                                </Col>
                            </Row>
                            <Row className="step1Form-row">
                                <Col xs={6} md={6}>
                                    <label className="form-label height38">Enter the Entity’s Name:*</label>                                
                                    <FormControl type="text" placeholder="Enter the Entity’s Name:" className="inputFormControl" />
                                    <span className="error"></span>
                                </Col>
                                <Col xs={6} md={6}>
                                    <label className="form-label">In what jurisdiction is the Entity legally registered?*</label> 
                                    <FormControl defaultValue="0" className="selectFormControl" componentClass="select"  placeholder="Select Jurisdiction">
                                        <option value={0}>Select Jurisdiction</option>
                                    </FormControl>                                  
                                </Col>
                            </Row>
                            <Row className="step1Form-row">
                                <Col xs={6} md={6}>
                                    <label className="form-label">Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes?*</label>
                                    <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                    </Radio>
                                    <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                    <span className="radio-checkmark"></span>
                                    </Radio>
                                </Col>
                                <Col xs={6} md={6}>
                                    <label className="form-label height38">Is the Entity a U.S. 501(c)(3)?*</label>
                                    <Radio name="entity501" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                    </Radio>
                                    <Radio name="entity501" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                    <span className="radio-checkmark"></span>
                                    </Radio>
                                </Col>
                            </Row>
                            <Row className="step1Form-row">
                                <Col xs={12} md={12}>
                                    <label className="form-label width100">Is the Entity required, if requested, under United States or other federal, state, 
                                        local or non-United States similar regulations to release investment information? For example under the United 
                                        States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?*</label>
                                    <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                    </Radio>
                                    <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                    <span className="radio-checkmark"></span>
                                    </Radio>
                                </Col>
                            </Row>
                           
                            <div className="marginTop20 error"></div>
                        </div>
                    </div>
                </div>
                
                <div className="footer-nav footerDivAlign">        
                    <i className="fa fa-chevron-left disabled" aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.fundDetailsPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default LlcFormComponent;

