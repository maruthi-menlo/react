import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Button, Radio, Row, Col, FormControl, Modal,OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { FsnetUtil } from '../../../util/util';
import PhoneInput from 'react-phone-number-input';
import { PubSub } from 'pubsub-js';
import { reactLocalStorage } from 'reactjs-localstorage';


// var getLpSubscription = {};
class InvestorInformationComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.investorHandleChangeEvent = this.investorHandleChangeEvent.bind(this);
        this.openStartConfirmationModal = this.openStartConfirmationModal.bind(this);
        this.closeConfirmationModal = this.closeConfirmationModal.bind(this);
        this.submitInvestorInfoStep1Details = this.submitInvestorInfoStep1Details.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.state = {
            showModal: false,
            showConfirmationModal: false,
            email: '',
            investorType: 'LLC',
            mailingAddressPhoneNumber: '',
            cellNumberBorder:false,
            cellNumberMsz:'',
            mailingAddressPhoneNumberValid: false,
            areYouSubscribingAsJointIndividual: false,
            investorPageValid: false,
            name:'',
            nameBorder:false,
            nameMsz:'',
            nameValid: false,
            mailingAddressStreet:'',
            streetBorder:false,
            streetMsz:'',
            mailingAddressStreetValid: false,
            mailingAddressCity:'',
            cityBorder:false,
            cityMsz:'',
            mailingAddressCityValid: false,
            mailingAddressState:'',
            stateBorder:false,
            stateMsz:'',
            mailingAddressStateValid: false,
            mailingAddressZip:'',
            zipBorder:false,
            zipMsz:'',
            mailingAddressZipValid: false,
            spouseName:'',
            typeOfLegalOwnership: '',
            showIndividualStep1: true,
            lpsubscriptionTotalObj: {},
            typeOfLegalOwnershipValid: false,
            areYouSubscribingAsJointIndividualValid: false,
            enableLeftIcon: false,
            typeOfLegalOwnershipName: '',
            showLLCInvestorInfoPage1: true,
            showInvestorType: true,
            investorSubTypes:[],
            isEntityTaxExemptForUSFederalIncomeTax:'',
            isEntityTaxExemptForUSFederalIncomeTaxValid:false,
            isEntityUS501c3:'',
            isEntityUS501c3Valid:false,
            releaseInvestmentEntityRequired:'',
            releaseInvestmentEntityRequiredValid:false,
            istheEntityFundOfFundsOrSimilarTypeVehicle:'',
            istheEntityFundOfFundsOrSimilarTypeVehicleValid: false,
            entityName:'',
            entityNameBorder:false,
            entityNameMsz:'',
            entityNameValid: false,
            investorSubType:0,
            investorSubTypeBorder:false,
            investorSubTypeMsz:'',
            investorSubTypeValid: false,
            otherInvestorSubType:'',
            otherInvestorSubTypeBorder:false,
            otherInvestorSubTypeMsz:'',
            otherInvestorSubTypeValid: false,
            jurisdictionEntityLegallyRegistered: '',
            jurisdictionEntityLegallyRegisteredBorder: false,
            jurisdictionEntityLegallyRegisteredValid: false,
            jurisdictionEntityLegallyRegisteredMsz: '',
            investorJurisdictionTypes:[],
            isEntityUS501c3Msz: '',
            investorInfoErrorMsz:''
        }
    }

    //Get the id from the url
    //Get the investor sub types
    componentDidMount() {
        let id = this.FsnetUtil.getLpFundId();
        this.investorSubTypes();
        this.getSubscriptionDetails(id);
    }

    //Call investor sub types
    investorSubTypes() {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        this.Fsnethttp.getInvestorSubTypes(headers).then(result => {
            this.close();
            if (result.data) {
                this.setState({
                    investorSubTypes: result.data
                })
            }
        })
        .catch(error => {
            this.close();
        });
    }

    //Get countries or states based on sub types selection
    //ISUS value is taken to check whether investor sub type belongs to US or  nonUS
    jurisdictionTypes(isUs, value) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let url = 'getAllCountires'
        if(value === 'otherEntity') {
            url = 'getAllCountires/1'
        }
        if(isUs === '0') {
            url = 'getUSStates'
        }
        this.Fsnethttp.getJurisdictionTypes(headers,url).then(result => {
            if (result.data) {
                this.setState({
                    investorJurisdictionTypes: result.data
                })
            }
        })
        .catch(error => {
            this.close();
        });
    }

    //Get the fund data
    getSubscriptionDetails(id) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        if (id) {
            this.open();
            this.Fsnethttp.getLpSubscriptionDetails(id, headers).then(result => {
                this.close();
                if (result.data) {
                    this.setState({
                        lpsubscriptionTotalObj:result.data.data,
                        email: result.data.data.email,
                        investorType: result.data.data.investorType?result.data.data.investorType:'LLC',
                    })
                    if(result.data.data.investorType === 'Individual') {
                        this.updateIndividualData(result.data.data)
                    }else if(result.data.data.investorType === 'LLC') {
                        this.updateLLCData(result.data.data)
                    }
                }
            })
            .catch(error => {
                this.close();
                //this.props.history.push('/dashboard');
            });
        }
    }

    //Update individual data when investor type is individual
    updateIndividualData(data) {
        let obj = data;
        obj['currentInvestorInfoPageNumber'] = 1;
        obj['currentPageCount'] = 1;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        //This is for to send data to left nav component
        PubSub.publish('investorData',obj );
        this.setState({
            lpsubscriptionTotalObj: data,
        },()=>{
            this.checkInvestorSubType(this.state.lpsubscriptionTotalObj)
            this.updateInvestorInputFields(this.state.lpsubscriptionTotalObj)
        })
    }

    //Update LLC data when investor type is LLC
    updateLLCData(data) {
        this.investorSubTypes();
        let obj = data;
        obj['currentInvestorInfoPageNumber'] = 1;
        obj['currentPageCount'] = 1;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        PubSub.publish('investorData',obj );
        this.setState({
            lpsubscriptionTotalObj: data,
        },()=>{
            this.checkInvestorSubType(this.state.lpsubscriptionTotalObj)
            this.updateInvestorInputFields(this.state.lpsubscriptionTotalObj)
        })
    }

    //Call Jurisdiction types for the first time when investorSubTypes value is exists
    checkInvestorSubType(data) {
        if(data.investorSubType !== null) {
            if(this.state.investorSubTypes.length >0) {
                for(let index of this.state.investorSubTypes) {
                    if(index['id'] === this.state.lpsubscriptionTotalObj.investorSubType) {
                        let isUS = index['isus'];
                        this.jurisdictionTypes(isUS,this.state.lpsubscriptionTotalObj.investorSubType);
                    }
                }
            }
        }
    }

    //Update all fileds to state 
    updateInvestorInputFields(data) {
        if(data) {
            let keys = [];
            for(let index in data) {
                keys.push(index);
            }
            if(keys) {
                for(let idx of keys) {
                    if(idx === 'typeOfLegalOwnership') {
                        this.getOwnerShipName(data[idx])
                    }
                    this.setState({
                        [idx]: data[idx]
                    },()=>{
                        if(this.state.otherInvestorSubType !== null && this.state.otherInvestorSubType !== undefined) {
                            this.setState({
                                investorSubType:'otherEntity'
                            })
                        }
                        this.enableNextButtonStep1();
                    })
                }
            }
        }
    }

    //Enable next icon based on mandatory fileds.
    //Mandatory fields will be changed for investor type is individual and LLC
    enableNextButtonStep1() {
        let mandatoryFileds = [];
        if(this.state.investorType === 'Individual') {
            mandatoryFileds = ['investorType', 'name', 'areYouSubscribingAsJointIndividual', 'typeOfLegalOwnership'];
        } else if(this.state.investorType === 'LLC') {
            mandatoryFileds = ['investorType', 'investorSubType', 'jurisdictionEntityLegallyRegistered', 'entityName', 'isEntityTaxExemptForUSFederalIncomeTax', 'isEntityUS501c3','istheEntityFundOfFundsOrSimilarTypeVehicle','istheEntityFundOfFundsOrSimilarTypeVehicle','releaseInvestmentEntityRequired'];
        }

        for(let field of mandatoryFileds) {
            if(this.state[field] === null && this.state[field] === '' && this.state[field] === undefined) {
                this.setState({
                    investorPageValid: false,
                    [field+'Valid']: false
                })
                break;
            } else {
                this.setState({
                    investorPageValid: true,
                    [field+'Valid']: true
                })
            }
        }
    }

    //Enable next icon based on mandatory fileds for investor information2 page.
    //Mandatory fields will be changed for investor type is individual and LLC
    enableNextButtonStep2() {
        let mandatoryFileds = ['mailingAddressStreet', 'mailingAddressCity', 'mailingAddressState', 'mailingAddressZip', 'mailingAddressPhoneNumber'];
        for(let field of mandatoryFileds) {
            if(this.state[field] === null && this.state[field] === '' && this.state[field] === undefined) {
                this.setState({
                    investorPageValid: false,
                    [field+'Valid']: false
                })
                break;
            } else {
                this.setState({
                    investorPageValid: true,
                    [field+'Valid']: true
                })
            }
        }
    }

    //Update owner name based on the typeOfLegalOwnershipName
    getOwnerShipName(name) {
        if(name === 'tenantsInCommon') {
            this.setState({
                typeOfLegalOwnershipName: 'Tenants in Common'
            })
        } else if(name === 'jointTenants') {
            this.setState({
                typeOfLegalOwnershipName: 'Joint Tenants'
            })
        } else if(name === 'communityProperty') {
            this.setState({
                typeOfLegalOwnershipName: 'Community Property'
            })
        }
    }

    //ProgressLoader : Close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loader
    open() {
        this.setState({ showModal: true });
    }

    //Open modal
    openStartConfirmationModal(){
        this.setState({ showConfirmationModal: true });
    }

    //Close modal
    closeConfirmationModal(){
        this.setState({ showConfirmationModal: false });
    }

    //On change event for all input fileds
    investorHandleChangeEvent(event, type, radioTypeName, blur) {
        let key = type;
        let value;
        if(type === 'mailingAddressZip') {
            const re = /^[0-9\b]+$/;
            // if value is not blank, then test the regex
            if(event.target.value.trim() !== '') {
                if (!re.test(event.target.value.trim()) || event.target.value.trim().length >10) {
                    return true
                }
            }
        }
        
        if(blur !== 'cellNumberBlur') {
            if(key === 'mailingAddressPhoneNumber') {
                value = event
            } else {
                if(event.target.value.trim() === '') {
                    value = event.target.value.trim()
                } else {
                    value = event.target.value
                }
            }
        } else {
            value = event.target.value
        }
        let dataObj = {};
        switch(type) {
            case 'radio':
                if(blur === 'investorType') {
                    let obj = this.state.lpsubscriptionTotalObj;
                    obj['investorType']= radioTypeName;
                    obj['currentInvestorInfoPageNumber'] = 1;
                    obj['currentPage'] = 'personaldetails';
                    obj['currentPageCount'] = 1;
                    PubSub.publish('investorData',obj );
                }
                if(blur === 'typeOfLegalOwnership') {
                    this.getOwnerShipName(radioTypeName)
                }
                if(blur === 'isEntityUS501c3') {
                    this.setState({
                        isEntityUS501c3Msz:''
                    })
                }
                this.setState({
                    [blur]: radioTypeName,
                },()=>{
                    if(blur === 'investorType') {
                        this.enableNextButtonStep1();
                        this.enableDisableInvestorDetailsButton();
                        let name = blur+'Valid'
                        dataObj ={
                            [name] :true
                        };
                        this.updateStateParams(dataObj);
                    }
                })
                if(blur !== 'investorType') {
                    let name = blur+'Valid'
                    dataObj ={
                        [name] :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'spouseName': 
                this.setState({
                    spouseName: value
                })
                break;
            case key:
                if(type === 'investorSubType' || type === 'jurisdictionEntityLegallyRegistered') {
                    if(value === '0') {
                        value = ''
                    } else {
                        if(type === 'investorSubType') {
                            let isUs = event.target[event.target.selectedIndex].getAttribute('isus');
                            this.jurisdictionTypes(isUs,event.target.value);
                        }
                    }
                }
                if(value === '' || value === undefined) {
                    this.setState({
                        [key+'Msz']: this.Constants[radioTypeName],
                        [key+'Valid']: false,
                        [key+'Border']: true,
                        [key]: ''
                    })
                    let name = key+'Valid'
                    dataObj ={
                        [name] :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        [key+'Msz']: '',
                        [key+'Valid']: true,
                        [key+'Border']: false,
                        [key]: value
                    })
                    let name = key+'Valid'
                    dataObj ={
                        [name] :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
           
            default:
                break;
        }
    }

    //Show investor information step1 page
    proceedToBack() {
        if(this.state.investorType === 'Individual') {
            let obj = this.state.lpsubscriptionTotalObj;
            obj['currentInvestorInfoPageNumber'] = 1;
            obj['currentPage'] = 'personaldetails';
            obj['currentPageCount'] = 1;
            PubSub.publish('investorData', obj);
            this.setState({
                showIndividualStep1: true,
                enableLeftIcon: false,
                investorPageValid: true,
                showInvestorType: true
            })
        } else if(this.state.investorType === 'LLC') {
            this.setState({
                showLLCInvestorInfoPage1: true,
                enableLeftIcon: false,
                investorPageValid: true,
                showInvestorType: true
            })
        }
    }

    //Proceed to next for all investor types
    proceedToNext() {
        if(this.state.investorType === 'Individual') {
            this.invidualNextStep();
        } else if(this.state.investorType === 'LLC') {
            this.LLCNextStep();
        }
    }

    //Open modal if investor type is individual  in investor information step1
    //For step2 call the submitStep2Details method.
    invidualNextStep() {
        if(this.state.showIndividualStep1) {
            this.openStartConfirmationModal();
        } else {
            this.submitStep2Details()
        }
    }

    //Submit investor info step2 details.
    submitStep2Details() {
        if(this.state.mailingAddressPhoneNumber.length < 12 || this.state.mailingAddressPhoneNumber.length > 13) {
            this.setState({
                cellNumberMsz: this.Constants.CELL_NUMBER_VALID
            })
        } else {
            let postobj = {investorType:this.state.investorType,subscriptonId:this.state.lpsubscriptionTotalObj.id, step:2, mailingAddressStreet:this.state.mailingAddressStreet, mailingAddressCity: this.state.mailingAddressCity,mailingAddressState:this.state.mailingAddressState, mailingAddressZip:this.state.mailingAddressZip, mailingAddressPhoneNumber:this.state.mailingAddressPhoneNumber }
            this.open();
            let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
            this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
                this.close();
                if (result.data) {
                    this.props.history.push('/lp/AccreditedInvestor/'+this.state.lpsubscriptionTotalObj.id);
                }
            })
            .catch(error => {
                this.close();
                if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        investorInfoErrorMsz: error.response.data.errors[0].msg,
                    });
                } else {
                    this.setState({
                        investorInfoErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                    });
                }
            });
            
        }
    }

    //For llc call LLC step 1 and step2 methods.
    LLCNextStep() {
        if(this.state.showLLCInvestorInfoPage1) {
           this.submitLLCInfoStep1Details();
        } else {
            this.submitStep2Details();
        }
    }

    //Submit LLC Step1 Details
    submitLLCInfoStep1Details() {
        if(this.state.investorSubType === 'otherEntity') {
            if(this.state.otherInvestorSubType === '' || this.state.otherInvestorSubType === null) {
                this.setState({
                    otherInvestorSubTypeBorder: true,
                    otherInvestorSubTypeMsz: this.Constants.ENTITY_TYPE_REQUIRED
                })
                return true;
            }
        } 

        if(this.state.isEntityTaxExemptForUSFederalIncomeTax === true) {
            if(this.state.isEntityUS501c3 === '' || this.state.isEntityUS501c3 === null) {
                this.setState({
                    isEntityUS501c3Msz: this.Constants.ENTITY_US_501_REQUIRED
                })
                return true;
            }

        }
        let postInvestorObj = {subscriptonId:this.state.lpsubscriptionTotalObj.id, step:1,fundId: this.state.fundId, investorType: this.state.investorType,investorSubType:this.state.investorSubType, jurisdictionEntityLegallyRegistered:this.state.jurisdictionEntityLegallyRegistered, entityName:this.state.entityName,isEntityTaxExemptForUSFederalIncomeTax:this.state.isEntityTaxExemptForUSFederalIncomeTax, istheEntityFundOfFundsOrSimilarTypeVehicle:this.state.istheEntityFundOfFundsOrSimilarTypeVehicle, releaseInvestmentEntityRequired:this.state.releaseInvestmentEntityRequired}
        if(this.state.investorSubType === 'otherEntity') {
            postInvestorObj['otherInvestorSubType'] = this.state.otherInvestorSubType;
        } else {
            postInvestorObj['otherInvestorSubType'] = null;
        }
        if(this.state.isEntityTaxExemptForUSFederalIncomeTax === true) {
            postInvestorObj['isEntityUS501c3'] = this.state.isEntityUS501c3;
        }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postInvestorObj, headers).then(result => {
            this.close();
            if (result.data) {
                let obj = this.state.lpsubscriptionTotalObj;
                obj['currentInvestorInfoPageNumber'] = 2;
                obj['currentPage'] = 'personaldetails';
                obj['currentPageCount'] = 1;
                PubSub.publish('investorData', obj);
                this.setState({
                    showLLCInvestorInfoPage1: false,
                    showInvestorType: false,
                    enableLeftIcon: true,
                    investorPageValid: false
                })
                this.enableNextButtonStep2()
            }
        })
        .catch(error => {
            this.close();
        });
    }


    //Submit Individual Step1 Details
    submitInvestorInfoStep1Details() {
        let postInvestorObj = {subscriptonId:this.state.lpsubscriptionTotalObj.id, step:1,fundId: this.state.fundId, investorType: this.state.investorType,name:this.state.name,areYouSubscribingAsJointIndividual:this.state.areYouSubscribingAsJointIndividual,typeOfLegalOwnership:this.state.typeOfLegalOwnership}
        if(this.state.areYouSubscribingAsJointIndividual === true) {
            postInvestorObj['spouseName'] = this.state.spouseName
        }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postInvestorObj, headers).then(result => {
            this.close();
            if (result.data) {
                let obj = this.state.lpsubscriptionTotalObj;
                obj['currentInvestorInfoPageNumber'] = 2;
                obj['currentPage'] = 'personaldetails';
                obj['currentPageCount'] = 1;
                PubSub.publish('investorData', obj);
                this.setState({
                    showIndividualStep1: false,
                    enableLeftIcon: true,
                    showInvestorType: false
                })
                this.enableNextButtonStep2()
                this.closeConfirmationModal();
            }
        })
        .catch(error => {
            this.close();
            this.setState({
                showIndividualStep1: false,
                enableLeftIcon: true
            })
            this.closeConfirmationModal();
        });
    }

    // Update state params values and login button visibility

    updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableInvestorDetailsButton();
        });
    }

    // Enable / Disble functionality of Investor Details next Button
    enableDisableInvestorDetailsButton(){
        let status;
        if(this.state.investorType === 'Individual') {
            if(this.state.showIndividualStep1) {
                status = (this.state.nameValid && this.state.typeOfLegalOwnershipValid && this.state.areYouSubscribingAsJointIndividualValid) ? true : false;
            } else {
                status = (this.state.mailingAddressCityValid && this.state.mailingAddressStreetValid && this.state.mailingAddressStateValid && this.state.mailingAddressZipValid && this.state.mailingAddressPhoneNumberValid) ? true : false;
            }
        } else if(this.state.investorType === 'LLC') {
            if(this.state.showLLCInvestorInfoPage1) {
                status = (this.state.investorSubTypeValid && this.state.jurisdictionEntityLegallyRegisteredValid  && this.state.entityNameValid  && this.state.isEntityTaxExemptForUSFederalIncomeTaxValid  && this.state.istheEntityFundOfFundsOrSimilarTypeVehicleValid && this.state.releaseInvestmentEntityRequiredValid ) ? true : false;
            } else {
                status = (this.state.mailingAddressCityValid && this.state.mailingAddressStreetValid && this.state.mailingAddressStateValid && this.state.mailingAddressZipValid && this.state.mailingAddressPhoneNumberValid) ? true : false;
            }
        }

        this.setState({
            investorPageValid : status,
        });
    }

    render() {

        function LinkWithTooltip({ id, children, href, tooltip }) {
            return (
              <OverlayTrigger
                overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
                placement="right"
                delayShow={300}
                delayHide={150}
              >
                <a href={href}>{children}</a>
              </OverlayTrigger>
            );
          }

        return (
            <div className="individualForm">
                <div className="form-grid formGridDivMargin min-height-400">
                    <div id="individualForm">
                        {
                            this.state.showInvestorType ?
                            <div>
                            <div className="title">Investor Information</div>
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}>
                                        <label className="form-label width100">Investor Type</label>
                                        <Radio name="investorType"  inline checked={this.state.investorType === 'LLC'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'LLC', 'investorType')}>&nbsp; Entity
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="investorType" className="marginRight10" inline checked={this.state.investorType === 'Individual'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'Individual', 'investorType')}>&nbsp; Individual or Joint Individual
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="investorType" inline checked={this.state.investorType === 'trust'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'trust', 'investorType')}>&nbsp; Trust
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                </Row>
                                <div className="individual" hidden={this.state.investorType !== 'Individual'}>
                                    <Row className="step1Form-row">
                                        <Col lg={6} md={6} sm={6} xs={12}>
                                            <label className="form-label">Email Address</label>
                                            <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className="inputFormControl" readOnly value={this.state.email} />
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <label className="form-label">Enter your name &nbsp;
                                            <span>
                                                <LinkWithTooltip tooltip="Please use your full legal name.  This name will appear in the Fund’s records and on tax reporting information" href="#" id="tooltip-1">
                                                <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                </LinkWithTooltip>
                                            </span>                                                                                                                                        
                                            </label>
                                            <FormControl type="text" placeholder="Enter your name" className={"inputFormControl " + (this.state.nameBorder ? 'inputError' : '')} value= {this.state.name}  onChange={(e) => this.investorHandleChangeEvent(e,'name', 'NAME_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'name','NAME_REQUIRED')}/>
                                            <span className="error">{this.state.nameMsz}</span>
                                        </Col>
                                    </Row>
                                    <Row className="step1Form-row">
                                        <Col xs={12} md={12}>
                                            <label className="form-label width100">Are you subscribing as joint individuals with your spouse, such as community property or tenants in comment?</label>
                                            <Radio name="jointIndividual" inline checked={this.state.areYouSubscribingAsJointIndividual === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'areYouSubscribingAsJointIndividual')}>&nbsp; Yes
                                            <span className="radio-checkmark"></span>
                                            </Radio>
                                            <Radio name="jointIndividual" inline checked={this.state.areYouSubscribingAsJointIndividual === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'areYouSubscribingAsJointIndividual')}>&nbsp; No
                                            <span className="radio-checkmark"></span>
                                            </Radio>
                                        </Col>
                                    </Row>
                                    <Row className="step1Form-row" hidden={this.state.areYouSubscribingAsJointIndividual === false || this.state.areYouSubscribingAsJointIndividual === null}>
                                        <Col xs={6} md={6}>
                                            <label className="form-label">Enter Your Spouse’s Name &nbsp;
                                            <span>
                                                <LinkWithTooltip tooltip="Please use your spouse’s full legal name.  This name will appear in the Fund’s records and on tax reporting information." href="#" id="tooltip-1">
                                                <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                </LinkWithTooltip>
                                            </span>  
                                            </label>
                                            <FormControl type="text" defaultValue=""  value={this.state.spouseName} onChange={(e) => this.investorHandleChangeEvent(e,'spouseName')}placeholder="Enter Your Spouse’s Name" className="inputFormControl"/>
                                        </Col>
                                    </Row>
                                    <Row className="step1Form-row" hidden={this.state.areYouSubscribingAsJointIndividual !== true}>
                                        <Col xs={12} md={12}>
                                            <label className="form-label width100">Indicate The Type of Legal Ownership Desired</label>
                                            <Radio name="ownershipType" className="radioTxtWidth" inline checked={this.state.typeOfLegalOwnership === 'communityProperty'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'communityProperty', 'typeOfLegalOwnership')}>&nbsp; Community Property
                                            <span className="radio-checkmark"></span>
                                            </Radio>
                                            <Radio name="ownershipType" className="radioTxtWidth" inline checked={this.state.typeOfLegalOwnership === 'tenantsInCommon'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'tenantsInCommon', 'typeOfLegalOwnership')}>&nbsp; Tenants in Common
                                            <span className="radio-checkmark"></span>
                                            </Radio>
                                            <Radio name="ownershipType" className="radioTxtWidth" inline checked={this.state.typeOfLegalOwnership === 'jointTenants'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'jointTenants', 'typeOfLegalOwnership')}>&nbsp; Joint Tenants
                                            <span className="radio-checkmark"></span>
                                            </Radio>
                                        </Col>
                                    </Row>
                                </div>                            
                            </div>:
                            <div>
                                <div className="individual" hidden={this.state.investorType !== 'Individual'}>   
                                    <Row className="step1Form-row">
                                        <Col xs={12} md={12}> 
                                        <label className="title">Enter Your Mailing Address</label>
                                        </Col>
                                    </Row>
                                    <Row className="marginTop10">
                                        <Col xs={6} md={6}>
                                            <label className="form-label">Street</label>
                                            <FormControl type="text" placeholder="Street" className={"inputFormControl " + (this.state.streetBorder ? 'inputError' : '')} value= {this.state.mailingAddressStreet}   onChange={(e) => this.investorHandleChangeEvent(e,'mailingAddressStreet', 'STREET_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'mailingAddressStreet','STREET_REQUIRED')} />
                                            <span className="error">{this.state.streetMsz}</span>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <label className="form-label">City</label>
                                            <FormControl type="text" placeholder="City" className={"inputFormControl " + (this.state.cityBorder ? 'inputError' : '')} value= {this.state.mailingAddressCity}   onChange={(e) => this.investorHandleChangeEvent(e,'mailingAddressCity', 'CITY_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'mailingAddressCity','CITY_REQUIRED')} />
                                            <span className="error">{this.state.cityMsz}</span>
                                        </Col>
                                    </Row>
                                    <Row className="step1Form-row">
                                        <Col xs={6} md={6}>
                                            <label className="form-label">State</label>
                                            <FormControl type="text" placeholder="State" className={"inputFormControl " + (this.state.stateBorder ? 'inputError' : '')} value= {this.state.mailingAddressState}   onChange={(e) => this.investorHandleChangeEvent(e,'mailingAddressState', 'STATE_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'mailingAddressState','STATE_REQUIRED')} />
                                            <span className="error">{this.state.stateMsz}</span>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <label className="form-label">Zip</label>
                                            <FormControl type="text" placeholder="Zip" className={"inputFormControl " + (this.state.zipBorder ? 'inputError' : '')} value= {this.state.mailingAddressZip} onChange={(e) => this.investorHandleChangeEvent(e,'mailingAddressZip', 'ZIP_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'mailingAddressZip','ZIP_REQUIRED')}/>
                                            <span className="error">{this.state.zipMsz}</span>
                                        </Col>
                                    </Row>  
                                    <Row className="step1Form-row">
                                        <Col xs={6} md={6}>
                                            <label className="form-label">Enter Your Phone Number</label>
                                            <form>
                                                <PhoneInput className={"marginTop10 "+ (this.state.cellNumberBorder ? 'inputError' : '')} maxLength="14" placeholder="(123) 456-7890" value={ this.state.mailingAddressPhoneNumber } country="US" onChange={phone => this.investorHandleChangeEvent(phone,'mailingAddressPhoneNumber', 'CELL_NUMBER_REQUIRED')} onBlur={phone => this.investorHandleChangeEvent(phone,'mailingAddressPhoneNumber', 'CELL_NUMBER_REQUIRED', 'cellNumberBlur')} />
                                            </form>
                                            <span className="error">{this.state.cellNumberMsz}</span>
                                        </Col>
                                    </Row>  
                                </div>                            
                            </div>
                        }
                        
                        

                        <div className="LLC" hidden={this.state.investorType !== 'LLC'}>
                            <div hidden={!this.state.showLLCInvestorInfoPage1}>
                                <Row className="step1Form-row">
                                    <Col lg={6} md={6} sm={6} xs={12}>
                                        <label className="form-label">Investor Sub Type:</label>
                                        <FormControl defaultValue="0" value={this.state.investorSubType} componentClass="select" placeholder="Select Investor Sub Type" className={"selectFormControl " + (this.state.investorSubTypeBorder ? 'inputError' : '')} onChange={(e) => this.investorHandleChangeEvent(e, 'investorSubType',  'INVESTOR_SUB_TYPE_REQUIRED')}>
                                            <option value="0">Select Investor Sub Type</option>
                                            {this.state.investorSubTypes.map((record, index) => {
                                                return (
                                                    <option isus={record['isUS']} value={record['id']}  key={index} >{record['name']}</option>
                                                );
                                            })}
                                            <option value="otherEntity" isus='1'>Other Entity</option>
                                        </FormControl> 
                                        <span className="error">{this.state.investorSubTypeMsz}</span>           
                                    </Col>
                                    <Col xs={6} md={6} hidden={this.state.investorSubType !=='otherEntity'}>
                                        <label className="form-label">Enter the Entity Type:   
                                        </label>
                                        <FormControl type="text" placeholder="Enter the Entity Type" className={"inputFormControl " + (this.state.otherInvestorSubTypeBorder ? 'inputError' : '')} value= {this.state.otherInvestorSubType} onChange={(e) => this.investorHandleChangeEvent(e,'otherInvestorSubType', 'ENTITY_TYPE_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'otherInvestorSubType','ENTITY_TYPE_REQUIRED')} />
                                        <span className="error">{this.state.otherInvestorSubTypeMsz}</span>
                                    </Col>
                                    
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">In what jurisdiction is the Entity legally registered?</label> 
                                        <FormControl defaultValue="0" value={this.state.jurisdictionEntityLegallyRegistered} componentClass="select"  placeholder="Select Jurisdiction" className={"selectFormControl " + (this.state.jurisdictionEntityLegallyRegisteredBorder ? 'inputError' : '')} onChange={(e) => this.investorHandleChangeEvent(e, 'jurisdictionEntityLegallyRegistered',  'JURIDICTION_REQUIRED')}>
                                            <option value="0">Select Jurisdiction</option>
                                            {this.state.investorJurisdictionTypes.map((record, index) => {
                                                return (
                                                    <option value={record['id']} key={index}>{record['name']}</option>
                                                );
                                            })}
                                        </FormControl> 
                                        <span className="error">{this.state.jurisdictionEntityLegallyRegisteredMsz}</span>                                 
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Email Address</label>
                                        <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className="inputFormControl" readOnly value= {this.state.email}/>   
                                        <span className="error"></span>      
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Enter the Entity’s Name: &nbsp;
                                        <span>
                                            <LinkWithTooltip tooltip="Please use the exact, complete legal name of the investing Entity.  This name will appear in the Fund’s records and on tax reporting information." href="#" id="tooltip-1">
                                            <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                            </LinkWithTooltip>
                                        </span>    
                                        </label>
                                        <FormControl type="text" placeholder="Enter the Entity’s Name" className={"inputFormControl " + (this.state.entityNameBorder ? 'inputError' : '')} value= {this.state.entityName} onChange={(e) => this.investorHandleChangeEvent(e,'entityName', 'ENTITY_NAME_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'entityName','ENTITY_NAME_REQUIRED')}/>
                                        <span className="error">{this.state.entityNameMsz}</span>
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label block">Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes?</label>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline checked={this.state.isEntityTaxExemptForUSFederalIncomeTax === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'isEntityTaxExemptForUSFederalIncomeTax')}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline checked={this.state.isEntityTaxExemptForUSFederalIncomeTax === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'isEntityTaxExemptForUSFederalIncomeTax')}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6} hidden={this.state.isEntityTaxExemptForUSFederalIncomeTax !== true}>
                                        <label className="form-label block">Is the Entity a U.S. 501(c)(3)?</label>
                                        <Radio name="isEntityUS501c3" className="radioSmallTxtWidth" inline checked={this.state.isEntityUS501c3 === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'isEntityUS501c3')}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="isEntityUS501c3" className="radioSmallTxtWidth" inline checked={this.state.isEntityUS501c3 === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'isEntityUS501c3')}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <div className="error">{this.state.isEntityUS501c3Msz}</div>
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label block">Is the Entity a fund-of-funds or a similar type vehicle?</label>
                                        <Radio name="istheEntityFundOfFundsOrSimilarTypeVehicle" className="radioSmallTxtWidth" inline checked={this.state.istheEntityFundOfFundsOrSimilarTypeVehicle === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'istheEntityFundOfFundsOrSimilarTypeVehicle')}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="istheEntityFundOfFundsOrSimilarTypeVehicle" className="radioSmallTxtWidth" inline checked={this.state.istheEntityFundOfFundsOrSimilarTypeVehicle === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'istheEntityFundOfFundsOrSimilarTypeVehicle')}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}>
                                        <label className="form-label width100">Is the Entity required, if requested, under United States or other federal, state, 
                                            local or non-United States similar regulations to release investment information? For example under the United 
                                            States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?</label>
                                        <Radio name="releaseInvestmentEntityRequired" className="radioSmallTxtWidth" inline checked={this.state.releaseInvestmentEntityRequired === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'releaseInvestmentEntityRequired')}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="releaseInvestmentEntityRequired" className="radioSmallTxtWidth" inline checked={this.state.releaseInvestmentEntityRequired === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'releaseInvestmentEntityRequired')}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                </Row>
                            </div>
                            <div hidden={this.state.showLLCInvestorInfoPage1}>
                            <Row className="step1Form-row">
                                        <Col xs={12} md={12}> 
                                        <label className="title">Enter Your Mailing Address</label>
                                        </Col>
                                    </Row>
                                    <Row className="marginTop10">
                                        <Col xs={6} md={6}>
                                            <label className="form-label">Street</label>
                                            <FormControl type="text" placeholder="Street" className={"inputFormControl " + (this.state.streetBorder ? 'inputError' : '')} value= {this.state.mailingAddressStreet}   onChange={(e) => this.investorHandleChangeEvent(e,'mailingAddressStreet', 'STREET_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'mailingAddressStreet','STREET_REQUIRED')} />
                                            <span className="error">{this.state.streetMsz}</span>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <label className="form-label">City</label>
                                            <FormControl type="text" placeholder="City" className={"inputFormControl " + (this.state.cityBorder ? 'inputError' : '')} value= {this.state.mailingAddressCity}   onChange={(e) => this.investorHandleChangeEvent(e,'mailingAddressCity', 'CITY_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'mailingAddressCity','CITY_REQUIRED')} />
                                            <span className="error">{this.state.cityMsz}</span>
                                        </Col>
                                    </Row>
                                    <Row className="step1Form-row">
                                        <Col xs={6} md={6}>
                                            <label className="form-label">State</label>
                                            <FormControl type="text" placeholder="State" className={"inputFormControl " + (this.state.stateBorder ? 'inputError' : '')} value= {this.state.mailingAddressState}   onChange={(e) => this.investorHandleChangeEvent(e,'mailingAddressState', 'STATE_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'mailingAddressState','STATE_REQUIRED')} />
                                            <span className="error">{this.state.stateMsz}</span>
                                        </Col>
                                        <Col xs={6} md={6}>
                                            <label className="form-label">Zip</label>
                                            <FormControl type="text" placeholder="Zip" className={"inputFormControl " + (this.state.zipBorder ? 'inputError' : '')} value= {this.state.mailingAddressZip} onChange={(e) => this.investorHandleChangeEvent(e,'mailingAddressZip', 'ZIP_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e,'mailingAddressZip','ZIP_REQUIRED')}/>
                                            <span className="error">{this.state.zipMsz}</span>
                                        </Col>
                                    </Row>  
                                    <Row className="step1Form-row">
                                        <Col xs={6} md={6}>
                                            <label className="form-label">Enter Your Phone Number</label>
                                            <form>
                                                <PhoneInput className={"marginTop10 "+ (this.state.cellNumberBorder ? 'inputError' : '')} maxLength="14" placeholder="(123) 456-7890" value={ this.state.mailingAddressPhoneNumber } country="US" onChange={phone => this.investorHandleChangeEvent(phone,'mailingAddressPhoneNumber', 'CELL_NUMBER_REQUIRED')} onBlur={phone => this.investorHandleChangeEvent(phone,'mailingAddressPhoneNumber', 'CELL_NUMBER_REQUIRED', 'cellNumberBlur')} />
                                            </form>
                                            <span className="error">{this.state.cellNumberMsz}</span>
                                        </Col>
                                    </Row>  
                            </div>
                        </div>

                        <div className="trust" hidden={this.state.investorType !== 'trust'}>
                            <Row className="step1Form-row">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Investor Sub Type:</label>
                                    <FormControl defaultValue="0" className="selectFormControl"  componentClass="select" placeholder="Select Investor Sub Type">
                                        <option value={0}>Select Investor Sub Type</option>
                                        <option value="UsCCorp">Revocable Trust</option>
                                        <option value="UsSCorp">Irrevocable Trust</option>
                                    </FormControl>            
                                </Col>
                            </Row>
                            <div id="RecoverableTrust">
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Enter the number of Grantors of the Trust</label>
                                        <FormControl type="text" placeholder="Enter number of Grantors" className="inputFormControl" />
                                        <span className="error"></span>     
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Email Address</label>
                                        <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className="inputFormControl"/>   
                                        <span className="error"></span>      
                                    </Col>
                                    
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Enter the Entity’s Name: &nbsp;
                                        <span>
                                            <LinkWithTooltip tooltip="Please use the entire legal name of the Revocable Trust (the “Trust”).  This name will appear in the Fund’s records and on tax reporting information.  Your estate planning advisor should have supplied you with the exact legal wording to use for this purpose.  Most revocable trusts hold title through the trustee(s), such as: “John Smith, Trustee of the John and Linda Smith Revocable Trust Dated January 1, 2000”.  Accordingly, most commonly entries such as “The John and Linda Smith Revocable Trust” will not be correct.  If you have questions about the correct legal title, contact your estate planning advisor." href="#" id="tooltip-1">
                                            <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                            </LinkWithTooltip>
                                        </span>    
                                        </label>                                
                                        <FormControl type="text" placeholder="Enter the Entity’s Name" className="inputFormControl" />
                                        <span className="error"></span>
                                    </Col>
                                    <Col lg={6} md={6} sm={6} xs={12}>
                                        <label className="form-label">Where is the Trust legally domiciled? &nbsp;
                                        <span>
                                            <LinkWithTooltip tooltip="Your estate planning adviser should have supplied you with this information.  If you are unsure of this answer, contact your estate planning adviser." href="#" id="tooltip-1">
                                            <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                            </LinkWithTooltip>
                                        </span> 
                                        </label>
                                        <FormControl defaultValue="0" className="selectFormControl"  componentClass="select" placeholder="Select Investor Sub Type">
                                            <option value={0}>Select Country</option>
                                        </FormControl>            
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes?</label>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Is the Entity a U.S. 501(c)(3)?</label>
                                        <Radio name="entity501" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="entity501" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                    
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Is the Entity a fund-of-funds or a similar type vehicle?</label>
                                        <Radio name="entityFunds" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="entityFunds" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}>
                                        <label className="form-label width100">Is the Entity required, if requested, under United States or other federal, state, 
                                            local or non-United States similar regulations to release investment information? For example under the United 
                                            States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?</label>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}> 
                                    <label className="title">Enter Your Mailing Address</label>                                                         
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Street</label>
                                        <FormControl type="text" placeholder="Street" className="inputFormControl"  />
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">City</label>
                                        <FormControl type="text" placeholder="City" className="inputFormControl"  />
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">State</label>
                                        <FormControl type="text" placeholder="State" className="inputFormControl"  />
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Zip</label>
                                        <FormControl type="text" placeholder="Zip" className="inputFormControl"  />
                                    </Col>
                                </Row>  
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Enter Your Phone Number</label>
                                        <PhoneInput value={ this.state.cellNumber } onChange={phone => this.investorHandleChangeEvent(phone,'cellNumber')}  maxLength="14" placeholder="(123) 456-7890"  country="US" />
                                    </Col>
                                </Row>
                           </div>
                           <div id="IrrecoverableTrust">
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Enter the Trust’s name &nbsp;
                                        <span>
                                            <LinkWithTooltip tooltip=" Please use the entire legal name of the Revocable Trust (the “Trust”).  This name will appear in the Fund’s records and on tax reporting information.  Your estate planning advisor should have supplied you with the exact legal wording to use for this purpose." href="#" id="tooltip-1">
                                            <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                            </LinkWithTooltip>
                                        </span>
                                        </label>
                                        <FormControl type="text" placeholder="Enter the Trust’s name" className="inputFormControl" />
                                        <span className="error"></span>     
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Email Address</label>
                                        <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className="inputFormControl"/>   
                                        <span className="error"></span>      
                                    </Col>
                                    
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Enter the Entity’s Name: &nbsp;
                                        <span>
                                            <LinkWithTooltip tooltip="Please use the entire legal name of the Revocable Trust (the “Trust”).  This name will appear in the Fund’s records and on tax reporting information.  Your estate planning advisor should have supplied you with the exact legal wording to use for this purpose.  Most revocable trusts hold title through the trustee(s), such as: “John Smith, Trustee of the John and Linda Smith Revocable Trust Dated January 1, 2000”.  Accordingly, most commonly entries such as “The John and Linda Smith Revocable Trust” will not be correct.  If you have questions about the correct legal title, contact your estate planning advisor." href="#" id="tooltip-1">
                                            <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                            </LinkWithTooltip>
                                        </span>    
                                        </label>                                
                                        <FormControl type="text" placeholder="Enter the Entity’s Name" className="inputFormControl" />
                                        <span className="error"></span>
                                    </Col>
                                    <Col lg={6} md={6} sm={6} xs={12}>
                                        <label className="form-label">Where is the Trust legally domiciled? &nbsp;
                                        <span>
                                            <LinkWithTooltip tooltip="Your estate planning adviser should have supplied you with this information.  If you are unsure of this answer, contact your estate planning adviser. " href="#" id="tooltip-1">
                                            <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                            </LinkWithTooltip>
                                        </span>
                                        </label>
                                        <FormControl defaultValue="0" className="selectFormControl"  componentClass="select" placeholder="Select Investor Sub Type">
                                            <option value={0}>Select Country</option>
                                        </FormControl>            
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes?</label>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Is the Entity a U.S. 501(c)(3)?</label>
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
                                            States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?</label>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}> 
                                    <label className="title">Enter Your Mailing Address</label>                                                         
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Street</label>
                                        <FormControl type="text" placeholder="Street" className="inputFormControl"  />
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">City</label>
                                        <FormControl type="text" placeholder="City" className="inputFormControl"  />
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">State</label>
                                        <FormControl type="text" placeholder="State" className="inputFormControl"  />
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Zip</label>
                                        <FormControl type="text" placeholder="Zip" className="inputFormControl"  />
                                    </Col>
                                </Row>  
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}>
                                        <label className="form-label width100">Please input the exact legal title designation you would like used by the 
                                            fund to hold the Trust’s interest.</label>
                                            <Col xs={6} md={6} className="padding-left-0">
                                                <FormControl type="text" placeholder="Legal Title" className="inputFormControl"  />
                                            </Col>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Enter Your Phone Number</label>
                                        <PhoneInput value={ this.state.cellNumber } onChange={phone => this.investorHandleChangeEvent(phone,'cellNumber')}  maxLength="14" placeholder="(123) 456-7890"  country="US" />
                                    </Col>
                                </Row>
                           </div>
                        </div>
                    </div>
                </div>
                <div className="margin30 error">{this.state.investorInfoErrorMsz}</div>
                <div className="footer-nav footerDivAlign">
                    <i className={"fa fa-chevron-left " + (!this.state.enableLeftIcon ? 'disabled' : '')} onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.investorPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Modal id="confirmInvestorModal" show={this.state.showConfirmationModal}  onHide={this.closeConfirmationModal} dialogClassName="confirmInvestorDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <h1 className="title" hidden={this.state.areYouSubscribingAsJointIndividual === false}>Based on your input, the fund will hold your interest in the following name: {this.state.name} and {this.state.spouseName},    {this.state.typeOfLegalOwnershipName} </h1>
                        <h1 className="title" hidden={this.state.areYouSubscribingAsJointIndividual === true}>Based on your input, the fund will hold your interest in the following name:        {this.state.name}, {this.state.typeOfLegalOwnershipName} </h1>
                        <div className="subtext">Is this acceptable?</div>
                        <div className="error">{this.state.startFundErrorMsz}</div>
                        <Row className="fundBtnRow">
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Button type="button" onClick={this.submitInvestorInfoStep1Details} className="fsnetSubmitButton btnEnabled" >Yes</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Button type="button" className="fsnetSubmitButton btnEnabled" onClick={this.closeConfirmationModal}>No</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default InvestorInformationComponent;

