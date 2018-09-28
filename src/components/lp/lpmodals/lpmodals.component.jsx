
import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import { PubSub } from 'pubsub-js';
import { Button, Modal,Row, Col, FormControl } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import { Constants } from '../../../constants/constants';
import { Fsnethttp } from '../../../services/fsnethttp';
import { reactLocalStorage } from 'reactjs-localstorage';
import Loader from '../../../widgets/loader/loader.component';

class LpModalComponent extends Component {

    constructor(props) {
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.handleShow = this.handleShow.bind(this);
        this.handleLpDelShow = this.handleLpDelShow.bind(this);
        this.handleLpDelClose = this.handleLpDelClose.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.addLPDelegateFn = this.addLPDelegateFn.bind(this);
        this.deleteLpDelegate = this.deleteLpDelegate.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.closeInvestorModal = this.closeInvestorModal.bind(this);
        this.toggleToolTipModal = this.toggleToolTipModal.bind(this);
        this.state = {
            show: false,
            LPDelshow : false,
            isLpDelegateFormValid: false,
            investorType: 'LLC',
            lpDelegateErrorMsz:'',
            lpsubscriptionObj:{},
            lpDelegateId:'',
            firstName:'',
            firstNameMsz:'',
            firstNameBorder:false,
            isValidated: false,
            lastName:'',
            lastNameMsz:'',
            lastNameBorder:false,
            email:'',
            emailMsz:'',
            emailBorder:false,
            actModal: {
                security: {
                    heading: 'Securities Act',
                    content: 'United States Securities Act of 1940, as amended'
                },
                exchange: {
                    heading: 'Exchange Act',
                    content: 'United States Commodities Exchange Act'
                },
                company: {
                    heading: 'Companies Act',
                    content: 'United Stated Investment Company Act of 1940, as amended'
                },
                adviser: {
                    heading: 'Advisers Act',
                    content: 'United States Investment Advisers Act of 1940, as amended'
                },
                securityExchange: {
                    heading: 'Securities Exchange Act',
                    content: 'United States Securities Exchange Act of 1940, as amended'
                },
                code: {
                    heading: 'Code',
                    content: 'United States Internal Revenue Code, as amended, and the rules and regulations promulgated thereunder'
                },
                erisa: {
                    heading: 'ERISA',
                    content: 'The United States Employee Retirement Income Security Act of 1974, as amended'
                },
                planAssetRegulation: {
                    heading: 'Plan Asset Regulation',
                    content: 'United States Department of Labor final plan assets regulation, 29 C.F.R. 2510.3-101, as amended'
                },
                valued: {
                    heading: 'Valued',
                    content: 'Valued shall mean either the fair market value or cost of Investments net of the amount of any outstanding indebtedness incurred to acquire such Investments.'
                }
            },
            selectedActModal: {
                heading: null,
                content: null
            }
        }

        PubSub.subscribe('openModal', (msg, data) => {
            console.log('data:::', data);
            if(data && data.modalType) {
                if(data.modalType == 'actModalWindow') {
                    this.toggleToolTipModal('actModal', true, data.type);
                } else {
                    this.toggleToolTipModal(data.type);
                    // this.setState({ [data.type]: true, investorType:data.investorType });    
                }
                this.setState({ investorType:data.investorType, investorSubType: data.investorSubType });
            } else {
                this.handleShow();
                this.setState({ show: true,lpsubscriptionObj:data  });   
            }
        });

      
        PubSub.subscribe('openLpDelModal', (msg, data) => {
            this.setState({
                lpsubscriptionObj: data.data,
                lpDelegateId: data.delegateId
            },()=>{
                this.handleLpDelShow();
            })
        });
       
    }

    deleteLpDelegate() {
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let postObj = {fundId:this.state.lpsubscriptionObj.fundId, delegateId: this.state.lpDelegateId}
        this.open()
        this.Fsnethttp.removeLpDelegate(postObj,headers).then(result=>{
            this.close();
            if(result) {
                PubSub.publish('removeLpDelegate', {delegateId: this.state.lpDelegateId});
                this.handleLpDelClose()
            }
        })
        .catch(error=>{
            this.close();
        });
    }


    handleClose() {
        this.clearFormFileds();
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleLpDelShow() {
        this.setState({ LPDelshow: true });
    }
    handleLpDelClose() {
        this.setState({ LPDelshow: false });
    }

    //Clear the fileds
    clearFormFileds() {
        this.setState({
            firstName:'',
            firstNameMsz:'',
            firstNameBorder:false,
            lastName:'',
            lastNameMsz:'',
            lastNameBorder:false,
            email:'',
            emailMsz:'',
            emailBorder:false,
            lpDelegateErrorMsz:''
        });
    }
    updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableSubmitButtion();
        });
    }
    enableDisableSubmitButtion(){
        let status = (this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid) ? true : false;
        this.setState({
            isLpDelegateFormValid : status
        });
    }

    closeInvestorModal() {
        console.log('accredited');
        this.setState({ accreditedModal: false });
    }


    //Onchange event for all input text boxes.
    handleInputChangeEvent(event,type, obj, eventType) {
        let dataObj = {}; 
        this.setState({
            lpDelegateErrorMsz: ''
        })
        switch(type) {
            case 'firstName':
                if(event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        firstNameMsz: this.Constants.FIRST_NAME_REQUIRED,
                        firstNameValid: false,
                        firstNameBorder: true,
                        firstName: ''
                    })
                    dataObj ={
                        firstNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        firstName: event.target.value,
                        firstNameValid: true,
                        firstNameBorder: false,
                        firstNameMsz: ''
                        
                    })
                    dataObj ={
                        firstNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'lastName':
                if(event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        lastNameMsz: this.Constants.LAST_NAME_REQUIRED,
                        lastNameValid: false,
                        lastNameBorder: true,
                        lastName: ''
                    })
                    dataObj ={
                        lastNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        lastName: event.target.value,
                        lastNameMsz: '',
                        lastNameValid: true,
                        lastNameBorder: false,
                    })
                    dataObj ={
                        lastNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'email':
                if(event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        emailMsz: this.Constants.VALID_EMAIL,
                        emailValid: false,
                        emailBorder: true,
                        email: ''
                    })
                    dataObj ={
                        emailValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
                    if(event.target.value !== '' && emailRegex.test(event.target.value)) {
                        this.setState({
                            email: event.target.value,
                            emailMsz: '',
                            emailValid: true,
                            emailBorder: false,
                        
                        }, () => {
                            if(eventType != 'blur') {
                                this.checkEmail('lpDelegate');
                            }
                        })
                        dataObj ={
                            emailValid :true
                        };
                    } else {
                        this.setState({
                            email: event.target.value,
                            isValidated: false,
                            emailMsz: '',
                            emailValid: true,
                            emailBorder: false,
                        })
                        dataObj ={
                            emailValid :true
                        };
                    }
                    this.updateStateParams(dataObj);
                }
                break;
            default:
                // do nothing
                break;
        }
    }

    checkEmail(type) {
        let postObj = {email:this.state.email, fundId: this.state.fundId};
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        this.open()
        let url = type == 'gpDelegate' ? 'delegate/gp/check' : (type == 'lpDelegate' ? 'delegate/lp/check' : 'lp/check');
        this.Fsnethttp.checkEmail(url, postObj,headers).then(result=>{
            this.close();
            if(result.data) {
                console.log('data::::', result.data);
                this.setState({
                    isNew: result.data.isNew,
                    isValidated: true,
                    firstName:  result.data.firstName,
                    lastName:  result.data.lastName
                }, () => {
                    Object.keys(result.data).forEach(key => {
                        // console.log(key, obj[data])
                        if(key != 'email') {
                            this.handleInputChangeEvent({target: {value : result.data[key]}}, key);
                        }
                    })
                })
            }
        })
        .catch(error=>{
            this.close();
            if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                this.setState({
                    lpDelegateErrorMsz: error.response.data.errors[0].msg,
                });
            } else {
                this.setState({
                    lpDelegateErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                });
            }
        });
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    addLPDelegateFn() {
        let firstName = this.state.firstName;
        let lastName = this.state.lastName;
        let email = this.state.email;
        let error = false;
        let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if(email !== '' && !emailRegex.test(email)) {
            this.setState({
                emailMsz: this.Constants.VALID_EMAIL,
                emailBorder: true,
            
            })
            error = true;
        } 
        
        if(!error) {
            let postObj = {firstName:firstName, lastName:lastName, email:email, fundId: this.state.lpsubscriptionObj.fundId};
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            this.open()
            this.Fsnethttp.addLpDelegate(postObj,headers).then(result=>{
                this.close();
                if(result.data) {
                    let lpDelegateObj = result.data.data;
                    lpDelegateObj['profilePic'] = null;
                    PubSub.publish('lpDelegate', lpDelegateObj);
                    this.handleClose();  
                }
            })
            .catch(error=>{
                this.close();
                if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        lpDelegateErrorMsz: error.response.data.errors[0].msg,
                    });
                } else {
                    this.setState({
                        lpDelegateErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                    });
                }
            });
        }
    }

    toggleToolTipModal(type, isActModal, actModalType) {
        if(type) {
            if(isActModal) {
                this.setState( {actModalWindow: !this.state.actModalWindow, selectedActModal : this.state.actModal[actModalType] });
            } else {
                this.setState( {[type] : !this.state[type] });    
            }
        } else {
            this.setState( { codeWindow: !this.state.codeWindow });
        }
    }

    handleFocus(key) {
        this.setState({
            [key+'Touched']: true
        })
    }

    render() {
        return (
            <div>
                <Modal id="LPModal" show={this.state.show} onHide={this.handleClose} dialogClassName="LPModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Add LP Delegate</Modal.Title>     
                    <Modal.Body>
                        <div className="subtext modal-subtext">Fill in the form below to add a new LP Delegate to the Fund. Fields marked with an * are required.</div>
                        <div className="form-main-div add-delegate">
                        <form>    
                            <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Email Address*</label>
                                    <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className={"inputFormControl " + (this.state.emailBorder ? 'inputError' : '')} value= {this.state.email} onChange={(e) => this.handleInputChangeEvent(e,'email')} onBlur={(e) => this.handleInputChangeEvent(e,'email', null, 'blur')}/>   
                                    <span className="error">{this.state.emailMsz}</span>            
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12} hidden={!this.state.isValidated || !this.state.email}>
                                    <label className="form-label">First Name*</label>
                                    <FormControl type="text" name="firstName" placeholder="Charles" className={"inputFormControl " + (this.state.firstNameTouched && this.state.firstNameBorder ? 'inputError' : '')} value= {this.state.firstName} disabled={!this.state.isNew && this.state.firstName} onChange={(e) => this.handleInputChangeEvent(e,'firstName')} onBlur={(e) => this.handleInputChangeEvent(e,'firstName')} onFocus={(e) => this.handleFocus('firstName')}/>   
                                    <span className="error" hidden={!this.state.firstNameTouched}>{this.state.firstNameMsz}</span>
                                </Col>
                            </Row>           
                            <Row className="marginBot20" hidden={!this.state.isValidated || !this.state.email}>
                                {/* <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">First Name*</label>
                                    <FormControl type="text" name="firstName" placeholder="Charles" className={"inputFormControl " + (this.state.firstNameBorder ? 'inputError' : '')} value= {this.state.firstName} disabled={!this.state.isNew && this.state.firstName} onChange={(e) => this.handleInputChangeEvent(e,'firstName')} onBlur={(e) => this.handleInputChangeEvent(e,'firstName')}/>   
                                    <span className="error">{this.state.firstNameMsz}</span>
                                </Col> */}
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Last Name*</label>
                                    <FormControl type="text" name="lastName" placeholder="Xavier" className={"inputFormControl " + (this.state.lastNameTouched && this.state.lastNameBorder ? 'inputError' : '')} value= {this.state.lastName} disabled={!this.state.isNew && this.state.lastName} onChange={(e) => this.handleInputChangeEvent(e,'lastName')} onBlur={(e) => this.handleInputChangeEvent(e,'lastName')} onFocus={(e) => this.handleFocus('lastName')}/>   
                                    <span className="error" hidden={!this.state.lastNameTouched}>{this.state.lastNameMsz}</span>
                                </Col>
                            </Row> 
                            {/* <Row className="marginBot20"> */}
                                {/* <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Email Address*</label>
                                    <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className={"inputFormControl " + (this.state.emailBorder ? 'inputError' : '')} value= {this.state.email} onChange={(e) => this.handleInputChangeEvent(e,'email')} onBlur={(e) => this.handleInputChangeEvent(e,'email')}/>   
                                    <span className="error">{this.state.emailMsz}</span>            
                                </Col> */}
                                {/* <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Organization Name</label>
                                    <FormControl type="text" name="orgName" placeholder="Organization Name" className="inputFormControl" value= {this.state.orgName} onChange={(e) => this.handleInputChangeEvent(e,'orgName')}/>   
                                </Col> */}
                            {/* </Row> */}
                            {/* <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Phone Number (Cell)*</label>
                                    <PhoneInput className={(this.state.cellNumberBorder ? 'inputError' : '')} maxLength="14" placeholder="(123) 456-7890" value={ this.state.cellNumber } country="US" onChange={phone => this.handleInputChangeEvent(phone,'cellNumber')} />
                                    <span className="error">{this.state.cellNumberMsz}</span>
                                </Col>
                            </Row> */}
                        </form>
                        <div className="error">{this.state.lpDelegateErrorMsz}</div>
                        </div> 
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton" onClick={this.handleClose}>Cancel</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button className={"fsnetSubmitButton "+ (this.state.isLpDelegateFormValid ? 'btnEnabled' : '') } disabled={!this.state.isLpDelegateFormValid} onClick={this.addLPDelegateFn}>Submit</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>

                <Modal id="LPDelModal" show={this.state.LPDelshow} onHide={this.handleLpDelClose} dialogClassName="LPDelModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Delete LP Delegate</Modal.Title>                                        
                    <Modal.Body>
                        <div className="subtext modal-subtext">Are you sure you want to delete LP Delegate?</div>         
                        <div className="form-main-div">
                        </div> 
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton" onClick={this.handleLpDelClose}>Cancel</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton btnEnabled" onClick={this.deleteLpDelegate}>Delete</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>


                {/* Accredited Investors Modal */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.accreditedModal} onHide={() => { this.toggleToolTipModal('accreditedModal') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Accredited Investor</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div hidden={this.state.investorType !== 'Individual'}>
                            {/* Accredited investor data:<br/> */}
                            <p className="list-heading">You are an accredited investor if you either (x) have a <span className="helpWord" onClick={() => { this.toggleToolTipModal('netWorthModal')}}>net worth</span>, either individually or upon a joint 	basis with your spouse, of at least USD $1,000,000, or (y) have had an individual income in excess of USD $200,000 for each of the two most recent fully completed calendar years, or a joint income with your spouse in excess of USD $300,000 in each of those years, and have a reasonable expectation of reaching the same income level in the current calendar year.</p>
                            {/* Net worth data:<br/>
                            In calculating your "net worth": (i) your primary residence shall not be included as an asset; (ii) indebtedness that is secured by your primary residence, up to the estimated fair market value of the primary residence at the time of the closing on your investment in the investment fund for which you are proposing to subscribe (the "Closing"), shall not be included as a liability (except that if the amount of such indebtedness outstanding at the time of the Closing exceeds the amount outstanding 60 days before such time, other than as a result of the acquisition of the primary residence, the amount of such excess shall be included as a liability); and (iii) indebtedness that is secured by your primary residence in excess of the estimated fair market value of the primary residence at the time of the Closing shall be included as a liability. In calculating your joint net worth with your spouse, your spouse’s primary residence (if different from your own primary residence) and indebtedness secured by such primary residence should be treated in a similar manner.<br/> */}
                        </div>
                        <div hidden={this.state.investorType !== 'LLC'}>
                            <p className="list-heading">If any one of the four options below apply, the Entity is considered an accredited investor and if none of the four options below apply, the Entity is not an accredited investor:</p>
                            <p>(1)  [MOST COMMON]  The Entity is a corporation, partnership, limited liability company or business trust, not formed for the purpose of acquiring the Interest, or an organization described in Section 501(c)(3) of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'code')}}>Code</span>, in each case with total assets in excess of $5,000,000.</p>
                            <p className="text-center">OR</p>
                            <p>(2)  All of the equity owners of the Entity qualify on their own merits as accredited investors.  This is true where each such equity owner either (x) has a <span className="helpWord" onClick={() => { this.toggleToolTipModal('netWorthModal')}}>net worth</span> either individually or upon a joint basis with such person’s spouse of at least USD $1,000,000, or (y) has had an individual income in excess of USD $200,000 for each of the two most recent fully completed calendar years, or a joint income with such person’s spouse in excess of USD $300,000 in each of those years, and have a reasonable expectation of reaching the same income level in the current calendar year.</p>
                            <p className="text-center">OR</p>
                            <p>(3)  The Entity is a bank, insurance company, investment company registered under the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'company')}}>Companies Act</span>, a broker or dealer registered pursuant to Section 15 of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'exchange')}}>Exchange Act</span>, a business development company, a Small Business Investment Company licensed by the United States Small Business Administration, a plan with total assets in excess of USD $5,000,000 established and maintained by a state for the benefit of its employees, or a private business development company as defined in Section 202(a)(22) of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'adviser')}}>Advisers Act</span>.</p>
                            <p className="text-center">OR</p>
                            <p>(4)  The Entity is an employee benefit plan and either all investment decisions are made by a bank, savings and loan association, insurance company, or registered investment advisor, or the employee benefit plan has total assets in excess of USD $5,000,000 or, if such employee benefit plan is a self-directed plan, investment decisions are made solely by persons who are accredited investors as described in clause (2) above.</p>
                        </div>
                        
                        {
                            this.state.investorType == 'Trust' && this.state.investorSubType == 9
                        ?
                            <div hidden={this.state.investorType !== 'Trust'}>
                                <p className="list-heading">If any one of the three options below apply, the Trust is considered an accredited investor and if none of the three options below apply, the Trust is not an accredited investor:</p>
                                <p>(1)  [MOST COMMON] The Trust is a living trust or other revocable trust in which all of the grantors and trustees either (A) qualify under options (2), (3) or (4) below, or (B) either (x) have a <span className="helpWord" onClick={() => { this.toggleToolTipModal('netWorthModal')}}>net worth</span> either individually or upon a joint basis with such person’s spouse of at least USD $1,000,000, or (y) have had an individual income in excess of USD $200,000 for each of the two most recent fully completed calendar years, or a joint income with such person’s spouse in excess of USD $300,000 in each of those years, and have a reasonable expectation of reaching the same income level in the current calendar year.</p>
                                <p className="text-center">OR</p>
                                <p>(2)  The Trust is a business trust, not formed for the purpose of acquiring the investment in the fund as to which the Trust proposes to subscribe, or an organization described in Section 501(c)(3) of the Code, in each case with total assets in excess of USD $5,000,000.</p>
                                <p className="text-center">OR</p>
                                <p>(3)  The Trust is a bank, insurance company, investment company registered under the Companies Act, a broker or dealer registered pursuant to Section 15 of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'securityExchange')}}>Securities Exchange Act</span>, a business development company, a Small Business Investment Company licensed by the United States Small Business Administration, a plan with total assets in excess of USD $5,000,000 established and maintained by a state for the benefit of its employees, or a private business development company as defined in Section 202(a)(22) of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'adviser')}}>Advisers Act</span>.</p>
                                {/* <p className="text-center">OR</p>
                                <p>(4)  The Entity is an employee benefit plan and either all investment decisions are made by a bank, savings and loan association, insurance company, or registered investment advisor, or the employee benefit plan has total assets in excess of USD $5,000,000 or, if such employee benefit plan is a self-directed plan, investment decisions are made solely by persons who are accredited investors as described in clause (2) above.</p> */}
                            </div>
                        :
                            <div hidden={this.state.investorType !== 'Trust'}>
                                <p className="list-heading">If any one of the three options below apply, the Trust is considered an accredited investor and if none of the three options below apply, the Trust is not an accredited investor:</p>
                                <p>(1)  The Trust has total assets in excess of USD $5,000,000 and the acquisition of those assets is directed by a person with such knowledge and experience in financial and business matters that such person is capable of evaluating the merits and risks of an investment in the investment fund as to which the Trust proposes to subscribe.</p>
                                <p className="text-center">OR</p>
                                <p>(2)  The Trust is a business trust, not formed for the purpose of acquiring the investment in the fund as to which the Trust proposes to subscribe, or an organization described in Section 501(c)(3) of the Code, in each case with total assets in excess of USD $5,000,000.</p>
                                <p className="text-center">OR</p>
                                <p>(3)  The Trust is a bank, insurance company, investment company registered under the Companies Act, a broker or dealer registered pursuant to Section 15 of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'securityExchange')}}>Securities Exchange Act</span>, a business development company, a Small Business Investment Company licensed by the United States Small Business Administration, a plan with total assets in excess of USD $5,000,000 established and maintained by a state for the benefit of its employees, or a private business development company as defined in Section 202(a)(22) of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'adviser')}}>Advisers Act</span>.</p>
                                {/* <p className="text-center">OR</p>
                                <p>(4)  The Entity is an employee benefit plan and either all investment decisions are made by a bank, savings and loan association, insurance company, or registered investment advisor, or the employee benefit plan has total assets in excess of USD $5,000,000 or, if such employee benefit plan is a self-directed plan, investment decisions are made solely by persons who are accredited investors as described in clause (2) above.</p> */}
                            </div>
                        }

                    </Modal.Body>
                </Modal>

                {/* Qualifier Purchase Modal */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.qualifierModal} onHide={() => { this.toggleToolTipModal('qualifierModal') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Qualified Purchaser</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div hidden={this.state.investorType !== 'Individual'}>
                            {/* Accredited investor data:<br/> */}
                            <p>You are an qualified purchaser if you own <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> that are <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'valued')}}>valued</span> at not less than USD $5,000,000.  If you propose to acquire the interest in the investment fund as to which you propose to subscribe in a joint capacity with your spouse, such as community property or a similar shared interest, then you may include in this determination <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> owned by your spouse.</p>
                            {/* Net worth data:<br/>
                            In calculating your "net worth": (i) your primary residence shall not be included as an asset; (ii) indebtedness that is secured by your primary residence, up to the estimated fair market value of the primary residence at the time of the closing on your investment in the investment fund for which you are proposing to subscribe (the "Closing"), shall not be included as a liability (except that if the amount of such indebtedness outstanding at the time of the Closing exceeds the amount outstanding 60 days before such time, other than as a result of the acquisition of the primary residence, the amount of such excess shall be included as a liability); and (iii) indebtedness that is secured by your primary residence in excess of the estimated fair market value of the primary residence at the time of the Closing shall be included as a liability. In calculating your joint net worth with your spouse, your spouse’s primary residence (if different from your own primary residence) and indebtedness secured by such primary residence should be treated in a similar manner.<br/> */}
                        </div>
                        <div hidden={this.state.investorType !== 'LLC'}>
                            <p className="list-heading">If any one of the four options below apply, the Entity is considered a qualified purchaser and if none of the four options below apply, the Entity is not a qualified purchaser:</p>
                            <p>(1)  [MOST COMMON] The Entity is acting for its own account or the accounts of others described in clauses (2), (3) or (4) below, and in the aggregate owns and invests on a discretionary basis <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> that are <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'valued')}}>valued</span> at not less than USD $25,000,000.</p>
                            <p className="text-center">OR</p>
                            <p>(2)  [MOST COMMON] The Entity owns <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> that are <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'valued')}}>valued</span> at not less than $5,000,000 and is owned directly or indirectly by two (2) or more natural persons related as siblings, spouses (including former spouses) or direct lineal descendants by birth or adoption, spouses of such persons, the estates of such persons, or foundations, charitable organizations or trusts established by or for the benefit of such persons.</p>
                            <p className="text-center">OR</p>
                            <p>(3)  The Entity  is a qualified institutional buyer as defined in paragraph (a) of Rule 144A under the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'security')}}>Securities Act</span>, acting for its own account, the account of another qualified institutional buyer, or the account of a qualified purchaser; provided that (i) a dealer described in paragraph (a)(1)(ii) of Rule 144A must own and invest on a discretionary basis at least USD $25,000,000 in securities of issuers that are not affiliated persons of the dealer and (ii) a plan referred to in paragraph (a)(1)(i)(D) or (a)(1)(i)(E) of Rule 144A, or a trust fund referred to in paragraph (a)(1)(i)(F) of Rule 144A that holds the assets of such a plan, will not be deemed to be acting for its own account if investment decisions with respect to the plan are made by the beneficiaries of the plan, except with respect to investment decisions made solely by the fiduciary, trustee or sponsor of such plan.</p>
                            <p className="text-center">OR</p>
                            <p>(4)  The Entity is not covered by clauses (1), (2) or (3) above, is not formed for the specific purpose of acquiring the investment in the fund as to which the Entity proposes to subscribe, and each equity owner of the Entity is an individual (including any person who is acquiring such investment with his or her spouse in a joint capacity, as community property or similar shared interest) who either individually or together with a spouse, owns <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> that are <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'valued')}}>valued</span> at not less than USD $5,000,000.</p>
                        </div>
                        <div hidden={this.state.investorType !== 'Trust'}>
                            <p className="list-heading">If any one of the four options below apply, the Trust is considered a qualified purchaser and if none of the four options below apply, the Trust is not a qualified purchaser:</p>
                            <p>(1)  [MOST COMMON] The Trust is acting for its own account or the accounts of others described in clauses (2), (3) or (4) below, and in the aggregate owns and invests on a discretionary basis <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> that are <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'valued')}}>valued</span> at not less than USD $25,000,000.</p>
                            <p className="text-center">OR</p>
                            <p>(2)  [MOST COMMON] The Trust owns <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> that are <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'valued')}}>valued</span> at not less than $5,000,000 and is owned directly or indirectly by two (2) or more natural persons related as siblings, spouses (including former spouses) or direct lineal descendants by birth or adoption, spouses of such persons, the estates of such persons, or foundations, charitable organizations or trusts established by or for the benefit of such persons.</p>
                            <p className="text-center">OR</p>
                            <p>(3)  The Trust  is a qualified institutional buyer as defined in paragraph (a) of Rule 144A under the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'security')}}>Securities Act</span>, acting for its own account, the account of another qualified institutional buyer, or the account of a qualified purchaser; provided that (i) a dealer described in paragraph (a)(1)(ii) of Rule 144A must own and invest on a discretionary basis at least USD $25,000,000 in securities of issuers that are not affiliated persons of the dealer and (ii) a plan referred to in paragraph (a)(1)(i)(D) or (a)(1)(i)(E) of Rule 144A, or a trust fund referred to in paragraph (a)(1)(i)(F) of Rule 144A that holds the assets of such a plan, will not be deemed to be acting for its own account if investment decisions with respect to the plan are made by the beneficiaries of the plan, except with respect to investment decisions made solely by the fiduciary, trustee or sponsor of such plan.</p>
                            <p className="text-center">OR</p>
                            <p>(4)  The Trust is not covered by clauses (1), (2) or (3) above, is not formed for the specific purpose of acquiring the investment in the fund as to which the Trust proposes to subscribe, as to which the trustee or other person authorized to make decisions with respect to the Trust and each settlor or other person who has contributed assets to the Trust is a person described as an individual (including any person who is acquiring such investment with his or her spouse in a joint capacity, as community property or similar shared interest) who either individually or together with a spouse, owns <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> that are <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'valued')}}>valued</span> at not less than USD $5,000,000.</p>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Qualifier Client Modal */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.qualifierClientModal} onHide={() => { this.toggleToolTipModal('qualifierClientModal') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Qualified Client</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div hidden={this.state.investorType !== 'Individual'}>
                            {/* Accredited investor data:<br/> */}
                            <p>You are a qualified client if you either</p> 
                            <p>(x) are making a capital commitment to the investment fund for which you propose to subscribe of USD $1,000,000 or greater, or</p>
                            <p>(y) have a <span className="helpWord" onClick={() => { this.toggleToolTipModal('netWorthModal')}}>net worth</span>, either individually or upon a joint basis with your spouse, of more than USD $2,100,000.</p>
                            {/* Net worth data:<br/>
                            In calculating your "net worth": (i) your primary residence shall not be included as an asset; (ii) indebtedness that is secured by your primary residence, up to the estimated fair market value of the primary residence at the time of the closing on your investment in the investment fund for which you are proposing to subscribe (the "Closing"), shall not be included as a liability (except that if the amount of such indebtedness outstanding at the time of the Closing exceeds the amount outstanding 60 days before such time, other than as a result of the acquisition of the primary residence, the amount of such excess shall be included as a liability); and (iii) indebtedness that is secured by your primary residence in excess of the estimated fair market value of the primary residence at the time of the Closing shall be included as a liability. In calculating your joint net worth with your spouse, your spouse’s primary residence (if different from your own primary residence) and indebtedness secured by such primary residence should be treated in a similar manner.<br/> */}
                        </div>
                        <div hidden={this.state.investorType !== 'LLC'}>
                            <p className="list-heading">The Entity is a qualified client if it is either making a capital commitment to the investment fund for which it proposes to subscribe of USD $1,000,000 or greater or is a Entity with <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> that are <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'valued')}}>valued</span> at more than $2,100,000.</p>
                        </div>
                        <div hidden={this.state.investorType !== 'Trust'}>
                            <p className="list-heading">The Trust is a qualified client if it is either making a capital commitment to the investment fund for which it proposes to subscribe of USD $1,000,000 or greater or is a Trust with <span className="helpWord" onClick={() => { this.toggleToolTipModal('investmentModal')}}>investments</span> that are <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'valued')}}>valued</span> at more than $2,100,000.</p>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* section 3 C 1 Modal */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.section3c1} onHide={() => { this.toggleToolTipModal('section3c1') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Section 3(c)(1)</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div hidden={this.state.investorType !== 'Individual'}>
                            {/* Accredited investor data:<br/> */}
                            You are an  accredited investor if you either (x) have a net worth, either individually or upon a joint  basis with your spouse, of at least USD $1,000,000, or (y) have had an individual income in excess of USD $200,000 for each of the two most recent fully completed calendar years, or a joint income with your spouse in excess of USD $300,000 in each of those years, and have a reasonable expectation of reaching the same income level in the current calendar year.<br/>
                            {/* Net worth data:<br/>
                            In calculating your "net worth": (i) your primary residence shall not be included as an asset; (ii) indebtedness that is secured by your primary residence, up to the estimated fair market value of the primary residence at the time of the closing on your investment in the investment fund for which you are proposing to subscribe (the "Closing"), shall not be included as a liability (except that if the amount of such indebtedness outstanding at the time of the Closing exceeds the amount outstanding 60 days before such time, other than as a result of the acquisition of the primary residence, the amount of such excess shall be included as a liability); and (iii) indebtedness that is secured by your primary residence in excess of the estimated fair market value of the primary residence at the time of the Closing shall be included as a liability. In calculating your joint net worth with your spouse, your spouse’s primary residence (if different from your own primary residence) and indebtedness secured by such primary residence should be treated in a similar manner.<br/> */}
                        </div>
                        <div hidden={this.state.investorType !== 'LLC' && this.state.investorType !== 'Trust'}>
                            <p className="list-heading">None of the following persons is an <span className="helpWord" onClick={() => { this.toggleToolTipModal('companyActModal')}}>investment company</span> …Any issuer whose outstanding securities (other than short-term paper) are beneficially owned by not more than one hundred persons and which is not making and does not presently propose to make a public offering of its securities…For purposes of the preceding, beneficial ownership by a company shall be deemed to be beneficial ownership by one person, except that, if the company owns 10 per centum or more of the outstanding voting securities of the issuer and is or, but for the exception provided for in this paragraph or under <span className="helpWord" onClick={() => { this.toggleToolTipModal('section3c7')}}>Section 3(c)(7)</span> of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'company')}}>Companies Act</span>, would be an <span className="helpWord" onClick={() => { this.toggleToolTipModal('companyActModal')}}>investment company</span>, the beneficial ownership shall be deemed to be that of the holders of such company’s outstanding securities (other than short-term paper).</p>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* section 3 C 7 Modal */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.section3c7} onHide={() => { this.toggleToolTipModal('section3c7') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Section 3(c)(7)</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div hidden={this.state.investorType !== 'Individual'}>
                            {/* Accredited investor data:<br/> */}
                            You are an  accredited investor if you either (x) have a net worth, either individually or upon a joint  basis with your spouse, of at least USD $1,000,000, or (y) have had an individual income in excess of USD $200,000 for each of the two most recent fully completed calendar years, or a joint income with your spouse in excess of USD $300,000 in each of those years, and have a reasonable expectation of reaching the same income level in the current calendar year.<br/>
                            {/* Net worth data:<br/>
                            In calculating your "net worth": (i) your primary residence shall not be included as an asset; (ii) indebtedness that is secured by your primary residence, up to the estimated fair market value of the primary residence at the time of the closing on your investment in the investment fund for which you are proposing to subscribe (the "Closing"), shall not be included as a liability (except that if the amount of such indebtedness outstanding at the time of the Closing exceeds the amount outstanding 60 days before such time, other than as a result of the acquisition of the primary residence, the amount of such excess shall be included as a liability); and (iii) indebtedness that is secured by your primary residence in excess of the estimated fair market value of the primary residence at the time of the Closing shall be included as a liability. In calculating your joint net worth with your spouse, your spouse’s primary residence (if different from your own primary residence) and indebtedness secured by such primary residence should be treated in a similar manner.<br/> */}
                        </div>
                        <div hidden={this.state.investorType !== 'LLC' && this.state.investorType !== 'Trust'}>
                            <p className="list-heading">None of the following persons is an <span className="helpWord" onClick={() => { this.toggleToolTipModal('companyActModal')}}>investment company</span>…Any issuer, the outstanding securities of which are owned exclusively by persons who, at the time of acquisition of such securities, are <span className="helpWord" onClick={() => { this.toggleToolTipModal('qualifierModal')}}>qualified purchasers</span>, and which is not making and does not at the time propose to make a public offering of such securities.  Securities that are owned by persons who received the securities from a <span className="helpWord" onClick={() => { this.toggleToolTipModal('qualifierModal')}}>qualified purchaser</span> as a gift or bequest, or in a case in which the transfer was caused by legal separation, divorce, death, or other involuntary event, shall be deemed to be owned by a <span className="helpWord" onClick={() => { this.toggleToolTipModal('qualifierModal')}}>qualified purchaser</span>, subject to such rules, regulations, and orders as the United States Securities and Exchange Commission may prescribe as necessary or appropriate in the public interest or for the protection of investors.</p>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* investment company Modal */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.companyActModal} onHide={() => { this.toggleToolTipModal('companyActModal') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Investment Company</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div hidden={this.state.investorType !== 'Individual'}>
                            {/* Accredited investor data:<br/> */}
                            You are an  accredited investor if you either (x) have a net worth, either individually or upon a joint  basis with your spouse, of at least USD $1,000,000, or (y) have had an individual income in excess of USD $200,000 for each of the two most recent fully completed calendar years, or a joint income with your spouse in excess of USD $300,000 in each of those years, and have a reasonable expectation of reaching the same income level in the current calendar year.<br/>
                            {/* Net worth data:<br/>
                            In calculating your "net worth": (i) your primary residence shall not be included as an asset; (ii) indebtedness that is secured by your primary residence, up to the estimated fair market value of the primary residence at the time of the closing on your investment in the investment fund for which you are proposing to subscribe (the "Closing"), shall not be included as a liability (except that if the amount of such indebtedness outstanding at the time of the Closing exceeds the amount outstanding 60 days before such time, other than as a result of the acquisition of the primary residence, the amount of such excess shall be included as a liability); and (iii) indebtedness that is secured by your primary residence in excess of the estimated fair market value of the primary residence at the time of the Closing shall be included as a liability. In calculating your joint net worth with your spouse, your spouse’s primary residence (if different from your own primary residence) and indebtedness secured by such primary residence should be treated in a similar manner.<br/> */}
                        </div>
                        <div hidden={this.state.investorType !== 'LLC' && this.state.investorType !== 'Trust'}>
                            <p className="list-heading">Investment company means any entity which either:</p>
                            <p>(1) Is or holds itself out as being engaged primarily, or proposes to engage primarily, in the business of investing, reinvesting, or trading in securities.</p>
                            <p className="text-center">OR</p>
                            <p>(2) Is engaged or proposes to engage in the business of issuing face-amount certificates of the installment type, or has been engaged in such business and has any such certificate outstanding.</p>
                            <p className="text-center">OR</p>
                            <p>(3) Is engaged or proposes to engage in the business of investing, reinvesting, owning, holding, or trading in securities, and owns or proposes to acquire investment securities having a value exceeding 40 per centum of the value of such issuer’s total assets (exclusive of Government securities and cash items) on an unconsolidated basis.</p>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* Investment Modal */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.investmentModal} onHide={() => { this.toggleToolTipModal('investmentModal') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Investments</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div>
                            <p className="list-heading">Investments shall mean any of the following:</p>
                            <p>(1)	Securities as such term is defined by Section 2(a)(1) of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'security')}}>Securities Act.</span></p>
                            {/* <p className="text-center">OR</p> */}
                            <p>(2)	Real estate held for investment purposes (i.e., not used by you for personal purposes or as a place of business or in connection with your trade or business).</p>
                            {/* <p className="text-center">OR</p> */}
                            <p>(3)	Commodities futures contracts, options on such contracts or options on commodities that are traded on or subject to the rules of (i) any contract market designated for trading under the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'exchange')}}>Exchange Act</span> and rules thereunder or (ii) any board of trade or exchange outside the United States, as contemplated in Part 30 of the rules under the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'exchange')}}>Exchange Act</span>) held for investment purposes.</p>
                            {/* <p className="text-center">OR</p> */}
                            <p>(4)	Physical commodities (with respect to which a Commodity Interest is traded on a market specified in paragraph 3 above) held for investment purposes.</p>
                            <p>(5)	Financial contracts within the meaning of Section 3(c)(2)(B)(ii) of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'company')}}>Companies Act</span>, which are held for investment purposes.</p>
                            <p>(6)	Cash and cash equivalents (including bank deposits, certificates of deposits, bankers acceptances and similar bank instruments held for investment purposes and the net cash surrender value of insurance policies).</p>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* net worth modal */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.netWorthModal} onHide={() => { this.toggleToolTipModal('netWorthModal') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Net Worth</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div>
                            <p className="list-heading">In calculating your net worth:</p>
                            <p>(i) your primary residence shall not be included as an asset.</p>
                            <p>(ii) indebtedness that is secured by your primary residence, up to the estimated fair market value of the primary residence at the time of the closing on your investment in the investment fund for which you are proposing to subscribe (the Closing), shall not be included as a liability (except that if the amount of such indebtedness outstanding at the time of the Closing exceeds the amount outstanding 60 days before such time, other than as a result of the acquisition of the primary residence, the amount of such excess shall be included as a liability).</p>
                            <p>(iii) indebtedness that is secured by your primary residence in excess of the estimated fair market value of the primary residence at the time of the Closing shall be included as a liability. In calculating your joint net worth with your spouse, your spouse’s primary residence (if different from your own primary residence) and indebtedness secured by such primary residence should be treated in a similar manner.</p>
                        </div>
                    </Modal.Body>
                </Modal>


                {/* ============= Act modals ============= */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.actModalWindow} onHide={() => {this.toggleToolTipModal('actModalWindow')}}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>{this.state.selectedActModal.heading}</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div>
                            {this.state.selectedActModal.content}
                        </div>
                        
                    </Modal.Body>
                </Modal>

                {/*   Disqualifing Event Modal  */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.disqualifingEventModal} onHide={() => { this.toggleToolTipModal('disqualifingEventModal') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Disqualifying Event </h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div>
                            <p className="list-heading">A Disqualifying Event means (Pursuant to Regulation D Rule 506(d) of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'security')}}>Securities Act</span>) that the Investor or any of its <span className="helpWord" onClick={() => { this.toggleToolTipModal('beneficialOwnersModal')}}>Beneficial Owners</span> has been subject to any one or more of the events described below, or is currently the subject of any threatened or pending investigation, proceeding, action or other event that, if adversely determined, would give rise to any of the events described below.</p>
                            <p>(1)	The relevant person has been convicted within ten years of the date hereof of any felony or misdemeanor (i) in connection with the purchase or sale of any security, (ii) involving the making of any false filing with the U.S. Securities and Exchange Commission or (iii) arising out of the conduct of the business of an underwriter, broker, dealer, municipal securities dealer, investment adviser or paid solicitor of purchasers of securities.</p>
                            <p>(2)	The relevant person is subject to any order, judgment or decree of any court of competent jurisdiction entered within five years of the date hereof that presently restrains or enjoins such person from engaging or continuing to engage in any conduct or practice (i) in connection with the purchase or sale of any security, (ii) involving the making of any false filing with the U.S. Securities and Exchange Commission or (iii) arising out of the conduct of the business of an underwriter, broker, dealer, municipal securities dealer, investment adviser or paid solicitor of purchasers of securities.</p>
                            <p>(3)	The relevant person is subject to a final order of a U.S. state securities commission (or an agency or officer of a state performing like functions); a state authority that supervises or examines banks, savings associations or credit unions; a U.S. state insurance commission (or an agency or officer of a state performing like functions); an appropriate federal banking agency; the U.S. Commodity Futures Trading Commission; or the National Credit Union Administration that (i) as of the date hereof, bars such person from (A) association with an entity regulated by such commission, authority, agency or officer, (B) engaging in the business of securities, insurance or banking or (C) engaging in savings association or credit union activities or (ii) constitutes a final order based on a violation of any law or regulation that prohibits fraudulent, manipulative or deceptive conduct entered within ten years of the date hereof.</p>
                            <p>(4)  The relevant person is subject to any order of the U.S. Securities and Exchange Commission pursuant to Section 15(b) or 15B(c) of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'exchange')}}>Exchange Act</span>, or Section 203(e) or (f) of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'adviser')}}>Advisers Act</span> that as of the date hereof (i) suspends or revokes such party’s registration as a broker, dealer, municipal securities dealer or investment adviser, (ii) places limitations on the activities, functions or operations of such person or (iii) bars such person from being associated with any entity or from participating in the offering of any penny stock.</p>
                            <p>(5)  The relevant person is subject to any order of the U.S. Securities and Exchange Commission entered within five years of the date hereof that presently orders such person to cease and desist from committing or causing a violation or future violation of (i) any scienter-based anti-fraud provision of the federal securities laws or (ii) Section 5 of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'security')}}>Securities Act</span>.</p>
                            <p>(6)  The relevant person is, as of the date hereof, suspended or expelled from membership in, or suspended or barred from association with a member of, a registered national securities exchange or a registered national or affiliated securities association for any act or omission to act constituting conduct inconsistent with just and equitable principles of trade.</p>
                            <p>(7)  The relevant person has filed (as a registrant or issuer), or was or was named as an underwriter in, any registration statement or Regulation A offering statement filed with the U.S. Securities and Exchange Commission that, within five years of the date hereof, was the subject of a refusal order, stop order or order suspending the Regulation A exemption, or is presently the subject of an investigation or proceeding to determine whether a stop order or suspension order should be issued.</p>
                            <p>(8)  The relevant person is subject to a United States Postal Service false representation order entered within five years of the date hereof or is presently subject to a temporary restraining order or preliminary injunction with respect to conduct alleged by the United States Postal Service to constitute a scheme or device for obtaining money or property through the mail by means of false representations.</p>
                        </div>
                    </Modal.Body>
                </Modal>

                {/*   Beneficial Owners Modal  */}
                <Modal id="confirmInvestorModal" className="" dialogClassName="tooltipDialog" show={this.state.beneficialOwnersModal} onHide={() => { this.toggleToolTipModal('beneficialOwnersModal') }}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Beneficial Owner</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody investorModal">
                        <div>
                            <p className="list-heading">An individual or entity who, directly or indirectly, through any contract, arrangement, understanding, relationship or otherwise has or shares, or is deemed to have or share: (1) voting power, which includes the power to vote, or to direct the voting of, the Interest; and/or (2) investment power, which includes the power to dispose, or to direct the disposition of, the Interest, as determined consistent with Rule 13d-3 of the <span className="helpWord" onClick={() => { this.toggleToolTipModal('actModal', true, 'exchange')}}>Exchange Act</span>.</p>
                        </div>
                    </Modal.Body>
                </Modal>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default LpModalComponent;

