import React, { Component } from 'react';
import '../createfund.component.css';
import { Button, Checkbox as CBox, Row, Col } from 'react-bootstrap';
import userDefaultImage from '../../../images/default_user.png';
class Step2Component extends Component {

    constructor(props) {
        super(props);
        this.addGpDelegateBtn = this.addGpDelegateBtn.bind(this);
        this.closeGpDelegateModal = this.closeGpDelegateModal.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.state = {
            showAddGpDelegateModal: false,
        }
    }

    proceedToNext() {
        this.props.history.push('/createfund/step3');
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/step1');
    }

    addGpDelegateBtn() {
        console.log(this.state.showAddGpDelegateModal);
        let userObj = {name:'Maruthi', type: 'GP'};
        // this.props.gpData();
        this.setState({
            showAddGpDelegateModal: true
        })
    }

    closeGpDelegateModal() {
        this.setState({
            showAddGpDelegateModal: false
        })
    }

    componentWillUnmount () {
        console.log(this.state.showAddGpDelegateModal)
    }

    render() {
        console.log(this.state.showAddGpDelegateModal)
        return (
            <div className="GpDelegatesContainer">
                <h1 className="assignGp">Assign GP Delegates</h1>
                <p className="Subtext">Select GP Delegate(s) from the list below or add a new one.</p>
                <Button className="gpDelegateButton" onClick={this.addGpDelegateBtn}>Gp Delegate</Button>
                <div className="checkBoxGpContainer">
                    <label className="Rectangle-6">
                    <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Ben Parker</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                    <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Jeff Lynne</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Kaitlyn Lopez</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Larry Croft</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Samrutha Karujika</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Sarmad Ahallah</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Terrence Osborne</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Virginia Tang</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Xiao Pang</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Zita Hoffenheimer</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                </div>
                <div className="addRoleModal" hidden={!this.state.showAddGpDelegateModal}>
                    
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
                    <Row className="cancelSubmitMargin">
                        <Col lg={6} md={6} sm={6} xs={12}>
                        <Button type="button" className="addGpCancelBox" onClick={this.closeGpDelegateModal}>Cancel</Button>
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

export default Step2Component;



