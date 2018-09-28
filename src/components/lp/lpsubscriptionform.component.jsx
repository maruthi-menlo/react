import React, { Component } from 'react';
import './lpsubscriptionform.component.css';
import Loader from '../../widgets/loader/loader.component';
import { Constants } from '../../constants/constants';
import { Row, Col } from 'react-bootstrap';
import { Fsnethttp } from '../../services/fsnethttp';
import { FsnetAuth } from '../../services/fsnetauth';
import HeaderComponent from '../header/header.component';
import homeImage from '../../images/home.png';
import successImage from '../../images/success-small.png';
import FundImage from '../../images/fund-default@2x.png';
import signFundImg from '../../images/edit-grey.svg';
import copyImage from '../../images/copy_img.svg';
import handShakeImage from '../../images/handshake.svg';
import { Route, Link } from "react-router-dom";
import fundDefaultImage from '../../images/fund-default.png';
import userDefaultImage from '../../images/default_user.png';
import { PubSub } from 'pubsub-js';
import InvestorInformationComponent from '../lp/Investor-Information/investorinformation.component';
import LlcFormComponent from '../lp/llc/llc.component';
import AccreditedInvestorComponent from '../lp/accreditedInvestor/accreditedInvestor.component';
import capitalCommitmentComponent from '../lp/capitalCommitment/capitalCommitment.component';
import confirmComponent from '../lp/confirm/confirm.component';
import QualifiedPurchaserComponent from '../lp/qualifiedPurchaser/qualifiedPurchaser.component';
import QualifiedClientComponent from '../lp/qualifiedClient/qualifiedClient.component';
import companiesActComponent from '../lp/companiesAct/companiesAct.component';
import equityOwnersComponent from '../lp/equityOwners/equityOwners.component';
import entityProposingComponent from '../lp/entityProposing/entityProposing.component';
import ERISAComponent from '../lp/ERISA/ERISA.component';
import reviewComponent from '../lp/Review/review.component';
import LpModalComponent from '../lp/lpmodals/lpmodals.component';
import { FsnetUtil } from '../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';
import vanillaLogo from '../../images/Vanilla-white.png';

var investor = {}, addLpDelegate={}, removeDelegate={};
class LpSubscriptionFormComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.hamburgerClick = this.hamburgerClick.bind(this);
        this.deleteLpDelegate = this.deleteLpDelegate.bind(this);
        this.handleLpShow = this.handleLpShow.bind(this);
        this.openPatnershipDocument = this.openPatnershipDocument.bind(this);
        this.state = {
            showModal: false,
            show: false,
            showSideNav: true,
            investorType: 'LLC',
            lpsubscriptionObj: {},
            currentPage: null,
            currentPageCount:1,
            totalPageCount:8,
            currentInvestorInfoPageNumber: 1,
            investorInfoValid: false,
            qualifiedPurchaserValid: false,
            accreditedInvestorValid: false,
            capitalCommitmentValid: false,
            companiesActValid: false,
            equityOwnersValid: false,
            entityProposingValid: false,
            erisaValid: false,
            legalEntity: null,
            pagesCompleted:0,
            status: 'Open',
            currentFundImage : FundImage,
            lpDelegatesList:[]
        }
        
        //Get the data from other steps
        investor = PubSub.subscribe('investorData', (msg, data) => {
            this.setState({
                investorType: data.investorType? data.investorType:'LLC',
                lpsubscriptionObj: data,
                currentInvestorInfoPageNumber: data.currentInvestorInfoPageNumber,
                currentPage: data.currentPage,
                currentPageCount: data.currentPageCount,
                legalEntity: data.fund? data.fund.legalEntity:null,
                status: data.subscriptionStatus ? data.subscriptionStatus.name:null,
                currentFundImage: data.fund && data.fund.fundImage? data.fund.fundImage.url: FundImage
            },()=>{
                //Validate lef nav section based on investorType
                if(this.state.investorType === 'Individual') {
                    this.setState({
                        totalPageCount:4
                    });
                    this.validateIndividualPages();
                } else if(this.state.investorType === 'LLC') {
                    this.setState({
                        totalPageCount:8
                    });
                    this.validateLLCPages();
                } else if(this.state.investorType === 'Trust') {
                    this.setState({
                        totalPageCount:6
                    });
                    this.validateTrustPages();
                }
            })
        });

        //Add LP Delegate to the list when we add from modal
        addLpDelegate = PubSub.subscribe('lpDelegate', (msg, data) => {
            let delegatesList = this.state.lpDelegatesList;
            delegatesList.push(data);
            this.setState({
                lpDelegatesList: delegatesList
            })
        });

        //Remove LP Delegate to the list when we add from modal
        removeDelegate = PubSub.subscribe('removeLpDelegate', (msg, data) => {
            this.lpDelegates(this.state.lpsubscriptionObj.id);
        });
        
    }

    //Unsuscribe the pubsub
    componentWillUnmount() {
        PubSub.unsubscribe(investor);
        PubSub.unsubscribe(addLpDelegate);
        PubSub.unsubscribe(removeDelegate);
    }

    //Get current page
    getPage() {
        let page = this.FsnetUtil.getCurrentPageForLP();
        this.setState({
            currentPage: page
        });
    }


    componentDidMount() {
        //Check user is valid or not
        //If not redirect to login page
        if (!this.FsnetAuth.isAuthenticated()) {
            this.props.history.push('/');
        } else {
            //Get the id from the url
            let id = this.FsnetUtil.getLpFundId();
            this.getPage();
            this.getSubscriptionDetails(id);
            this.lpDelegates(id);
            window.scrollTo(0, 0);
        }
    }

    componentWillReceiveProps(newProps) {
        // console.log('new Props:::', newProps);
        let id = this.FsnetUtil.getLpFundId();
        this.getSubscriptionDetails(id);
    }

    //Get the fund details
    getSubscriptionDetails(id) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        if (id) {
            this.open();
            this.Fsnethttp.getLpSubscriptionDetails(id, headers).then(result => {
                this.close();
                if (result.data) {
                    this.setState({
                        lpsubscriptionObj: result.data.data,
                        investorTypeTemp: result.data.data.investorType? result.data.data.investorType:'LLC',
                        // investorType: result.data.data.investorType? result.data.data.investorType:'LLC',
                        investorType: this.state.investorType ? this.state.investorType : (result.data.data.investorType? result.data.data.investorType:'LLC'),
                        legalEntity: result.data.data.fund.legalEntity,
                        status: result.data.data.subscriptionStatus.name,
                        currentFundImage: result.data.data.fund.fundImage? result.data.data.fund.fundImage.url: FundImage
                    },()=>{
                        //Assing total pages count based on investor type.
                        if(result.data.data.investorType === 'Individual') {
                            this.setState({
                                totalPageCount:4
                            });
                            this.validateIndividualPages();
                        } else if(result.data.data.investorType === 'LLC') {
                            this.setState({
                                totalPageCount:8
                            });
                            this.validateLLCPages();
                        } else if(result.data.data.investorType === 'Trust') {
                            this.setState({
                                totalPageCount:6
                            });
                            this.validateTrustPages();
                        }
                    })
                    PubSub.publish('getLpSubscription', result.data.data);
                }
            })
            .catch(error => {
                this.close();
                if(error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    // this.props.history.push('/dashboard');
                }
            });
        }
    }

    //Close the modal
    handleClose() {
        this.setState({ show: false });
    }

    //Open the modal
    handleLpShow() {
        PubSub.publish('openModal',this.state.lpsubscriptionObj);
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    //Header hamburger click
    hamburgerClick() {
        if (this.state.showSideNav == true) {
            this.setState({
                showSideNav: false
            })
        } else {
            this.setState({
                showSideNav: true
            })
        }
    }

    //Check Investor info page is valid
    investorPageValid() {
        let mandatoryFields = [];
        if(this.state.investorType === 'Individual') {
            mandatoryFields = ['investorType', 'name', 'areYouSubscribingAsJointIndividual', 'isSubjectToDisqualifyingEvent', 'mailingAddressCity', 'mailingAddressState','mailingAddressStreet','mailingAddressZip'];
        } else if(this.state.investorType === 'LLC') {
            mandatoryFields = ['investorType','jurisdictionEntityLegallyRegistered','entityName','isEntityTaxExemptForUSFederalIncomeTax', 'isSubjectToDisqualifyingEvent', 'releaseInvestmentEntityRequired', 'mailingAddressCity', 'mailingAddressState','mailingAddressStreet','mailingAddressZip', 'otherInvestorAttributes'];
        } else if(this.state.investorType === 'Trust') {
            if(this.state.lpsubscriptionObj.investorSubType == 9) {
                mandatoryFields = ['investorType','investorSubType', 'email', 'trustName', 'trustLegallyDomiciled', 'isEntityTaxExemptForUSFederalIncomeTax', 'releaseInvestmentEntityRequired', 'isSubjectToDisqualifyingEvent', 'mailingAddressCity', 'mailingAddressStreet', 'mailingAddressCountry', 'mailingAddressState', 'mailingAddressZip', 'otherInvestorAttributes'];
                // mandatoryFields = ['investorType','investorSubType','email','entityName', 'country', 'istheEntityFundOfFundsOrSimilarTypeVehicle', 'mailingAddressCity', 'mailingAddressPhoneNumber', 'mailingAddressState','mailingAddressStreet','mailingAddressZip'];
            } else {
                mandatoryFields = ['investorType','investorSubType', 'email', 'trustName', 'trustLegallyDomiciled', 'isEntityTaxExemptForUSFederalIncomeTax', 'releaseInvestmentEntityRequired', 'isSubjectToDisqualifyingEvent', 'mailingAddressCity', 'mailingAddressStreet', 'mailingAddressCountry', 'mailingAddressState', 'mailingAddressZip', 'legalTitleDesignation', 'otherInvestorAttributes'];
            }
        }
        
        let  valid = this.FsnetUtil.checkNullOrEmpty(mandatoryFields, this.state.lpsubscriptionObj);
        if(valid){
            this.setState({
                investorInfoValid: true,
                currentInvestorInfoPageNumber: 2
            })
        } else {
            this.setState({
                investorInfoValid: false
            })
        }
    }

    //Check qualified purchaser page is valid
    qualifiedPurchaserPageValid() {
        if((this.state.lpsubscriptionObj.areYouQualifiedPurchaser === false && this.state.lpsubscriptionObj.areYouQualifiedClient !== null) || (this.state.lpsubscriptionObj.areYouQualifiedPurchaser === true)) {
            this.setState({
                qualifiedPurchaserValid: true,
            },()=>{
                this.stepsCompleted();
            })
        } else {
            this.setState({
                qualifiedPurchaserValid: false
            },()=>{
                this.stepsCompleted();
            })
        }
    }

    //Check accredited Investor page is valid
    accreditedInvestorPageValid() {
        if(this.state.lpsubscriptionObj.areYouAccreditedInvestor!== null && this.state.lpsubscriptionObj.areYouAccreditedInvestor!== undefined) {
            this.setState({
                accreditedInvestorValid: true,
            }, () => {
                this.stepsCompleted();
            })
        } else {
            this.setState({
                accreditedInvestorValid: false
            }, () => {
                this.stepsCompleted();
            })
        }
    }

    capitalCommitmentPageValid() {
        if(this.state.lpsubscriptionObj.lpCapitalCommitment!== null && this.state.lpsubscriptionObj.lpCapitalCommitment!== undefined && this.state.lpsubscriptionObj.lpCapitalCommitment!== '') {
            this.setState({
                capitalCommitmentValid: true,
            }, () => {
                this.stepsCompleted();
            })
        } else {
            this.setState({
                capitalCommitmentValid: false
            }, () => {
                this.stepsCompleted();
            })
        }
    }

    //Check companies act page is valid
    companiesActPageValid() {
        // if(this.state.lpsubscriptionObj.companiesAct!== null && this.state.lpsubscriptionObj.companiesAct!== undefined && this.state.lpsubscriptionObj.numberOfDirectEquityOwners && this.state.lpsubscriptionObj.existingOrProspectiveInvestorsOfTheFund!== null) {
        if(this.state.lpsubscriptionObj.companiesAct!== null && this.state.lpsubscriptionObj.companiesAct!== undefined) {
            
            this.setState({
                companiesActValid: true,
            }, () => {
                this.stepsCompleted();
            })
        } else if(this.state.investorType == 'Trust') {
                if((this.state.lpsubscriptionObj.companiesAct == 2 || this.state.lpsubscriptionObj.companiesAct == 3) && this.state.lpsubscriptionObj.numberOfDirectEquityOwners && this.state.lpsubscriptionObj.existingOrProspectiveInvestorsOfTheFund!== null) {
                    this.setState({
                        companiesActValid: true,
                    }, () => {
                        this.stepsCompleted();
                    })        
                }
        } else {
            this.setState({
                companiesActValid: false
            }, () => {
                this.stepsCompleted();
            })
        }
    }

    //Check equity owners page is valid
    equityOwnersPageValid() {
        if(this.state.lpsubscriptionObj.numberOfDirectEquityOwners >= 0 && this.state.lpsubscriptionObj.existingOrProspectiveInvestorsOfTheFund!== null) {
            this.setState({
                equityOwnersValid: true,
            }, () => {
                this.stepsCompleted();
            })
        } else {
            this.setState({
                equityOwnersValid: false
            }, () => {
                this.stepsCompleted();
            })
        }
    }

    //Check Look-Through Issues page is valid
    enitityProposingPageValid() {
        if((this.state.lpsubscriptionObj.entityProposingAcquiringInvestment!== null && this.state.lpsubscriptionObj.entityProposingAcquiringInvestment!== undefined) && this.state.lpsubscriptionObj.anyOtherInvestorInTheFund!== null && this.state.lpsubscriptionObj.entityHasMadeInvestmentsPriorToThedate!== null && this.state.lpsubscriptionObj.partnershipWillNotConstituteMoreThanFortyPercent!== null && this.state.lpsubscriptionObj.beneficialInvestmentMadeByTheEntity!== null) {
            this.setState({
                entityProposingValid: true,
            }, () => {
                this.stepsCompleted();
            })
        } else {
            this.setState({
                entityProposingValid: false
            }, () => {
                this.stepsCompleted();
            })
        }
    }

    isEmpty(value){
        return (value == null || value.length === 0);
    }

    //Check Erisa page is valid
    erisaPageValid() {
        if(!this.isEmpty(this.state.lpsubscriptionObj.employeeBenefitPlan) || !this.isEmpty(this.state.lpsubscriptionObj.planAsDefinedInSection4975e1) || !this.isEmpty(this.state.lpsubscriptionObj.benefitPlanInvestor)) {
            this.setState({
                erisaValid: true,
            },()=>{
                this.stepsCompleted();
            })
        } else {
            this.setState({
                erisaValid: false
            },()=>{
                this.stepsCompleted();
            })
        }
    }

    //Check how many pages completed
    stepsCompleted() {
        let pages = [];
        if(this.state.investorType === 'Individual') {
            pages = ['investorInfoValid', 'accreditedInvestorValid', 'qualifiedPurchaserValid', 'capitalCommitmentValid'];
        } else if(this.state.investorType === 'LLC') {
            pages = ['investorInfoValid', 'accreditedInvestorValid', 'qualifiedPurchaserValid', 'companiesActValid', 'equityOwnersValid', 'entityProposingValid', 'erisaValid', 'capitalCommitmentValid'];
        } else if (this.state.investorType === 'Trust') {
            pages = ['investorInfoValid', 'accreditedInvestorValid', 'qualifiedPurchaserValid', 'companiesActValid', 'erisaValid', 'capitalCommitmentValid'];
        }
        let idx = 0;
        for(let index of pages){
            if(this.state[index] === true) {
                idx = idx+1
                this.setState({
                    pagesCompleted: idx
                })
            };
        }
    }

    //Call all the pages related to investor type individual
    //Validates all pages
    validateIndividualPages() {
        this.investorPageValid();
        this.accreditedInvestorPageValid();
        this.qualifiedPurchaserPageValid();
        this.capitalCommitmentPageValid();
    }

    //Call all the pages related to investor type LLC
    //Validates all pages
    validateLLCPages() {
        this.investorPageValid();
        this.accreditedInvestorPageValid();
        this.qualifiedPurchaserPageValid();
        this.companiesActPageValid();
        this.equityOwnersPageValid();
        this.enitityProposingPageValid();
        this.erisaPageValid();
        this.capitalCommitmentPageValid();
    }

    validateTrustPages() {
        this.investorPageValid();
        this.accreditedInvestorPageValid();
        this.qualifiedPurchaserPageValid();
        this.companiesActPageValid();
        this.erisaPageValid();
        this.capitalCommitmentPageValid();
    }

    //Redirect to login
    //When user clicks on logout 
    //Clear the localstorage.
    redirectToLogin() {
        reactLocalStorage.clear();
        this.props.history.push('/login');
    }


    //Get LP Delegates
    lpDelegates(id) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        if (id) {
            this.open();
            this.Fsnethttp.getLpDelegates(id, headers).then(result => {
                this.close();
                if (result.data) {
                    this.setState({
                        lpDelegatesList: result.data.data
                    })
                }
            })
            .catch(error => {
                this.close();
                if(error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    this.setState({
                        lpDelegatesList: []
                    })
                }
            });
        }
    }

    //Delete LP Delegate
    deleteLpDelegate(e, id) {
        PubSub.publish('openLpDelModal', { data: this.state.lpsubscriptionObj, delegateId: id });
    }

    openPatnershipDocument() {
        if(this.state.lpsubscriptionObj.documentsForSignature) {
            let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
            this.open();
            this.Fsnethttp.getAggrement(this.state.lpsubscriptionObj.documentsForSignature.envelopeId, headers, this.state.lpsubscriptionObj.id).then(result => {
                this.close();
                if (result.data) {
                    window.location.href = result.data.url;
                }
            })
            .catch(error => {
                this.close();
            });
        }
    }

    render() {
        const { match } = this.props;
        return (
            <div className="lpSubFormStyle" id="">
                <nav className="navbar navbar-custom">
                    <div className="navbar-header">
                        <div className="sidenav">
                            <h1 className="text-left"><i className="fa fa-bars" aria-hidden="true" onClick={(e) => this.hamburgerClick()}></i>&nbsp; <img src={vanillaLogo} alt="vanilla" className="vanilla-logo"/></h1>
                        </div>
                    </div>
                    <div className="text-center navbar-collapse-custom" id="navbar-collapse" hidden={!this.state.showSideNav}>
                        <div className="sidenav">
                            <h1 className="text-left logoHamburger"><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; <img src={vanillaLogo} alt="vanilla" className="vanilla-logo"/></h1>
                            <h2 className="text-left lpDashAlign"><img src={homeImage} alt="home_image" className="" />&nbsp; <Link to="/dashboard" className="dashboardTxtAlign">Dashboard</Link></h2>
                            <div className="active-item text-left"><label className="fund-left-pic-label"><img src={copyImage} alt="image" /></label>&nbsp;<div className="left-nav-fund-name text-left subAgrmnt">Subscription Agreement</div> <span className="fsbadge fsbadgeAlign">{this.state.currentPageCount}/{this.state.totalPageCount}</span></div>
                            {
                                this.state.investorType ?
                                <ul className="sidenav-menu">
                                    <li>
                                        <Link className={(this.state.currentPage === 'investorInfo' ? 'active' : '')} to={"/lp/investorInfo/"+this.state.lpsubscriptionObj.id}>Investor Information ({this.state.currentInvestorInfoPageNumber}/2)<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.investorInfoValid === false}/></Link>
                                        {/* <Link className={`${this.state.currentPage === 'investorInfo' ? 'active' : ''}`} to={"/lp/investorInfo/"+this.state.lpsubscriptionObj.id}>Investor Information ({this.state.currentInvestorInfoPageNumber}/2)<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.investorInfoValid === false}/></Link> */}
                                    </li>
                                    <li>
                                        <Link className={(this.state.currentPage === 'AccreditedInvestor' ? 'active' : '')} to={"/lp/AccreditedInvestor/"+this.state.lpsubscriptionObj.id}>Accredited Investor<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.accreditedInvestorValid === false} /></Link>
                                    </li>
                                    <li>
                                        <Link className={(this.state.currentPage === 'qualifiedPurchaser' ? 'active' : '')} to={"/lp/qualifiedPurchaser/"+this.state.lpsubscriptionObj.id}>Qualified Purchaser/Client<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.qualifiedPurchaserValid === false}/></Link>
                                    </li>
                                    <li hidden={this.state.investorType === 'Individual'} className={(this.state.investorTypeTemp == 'Individual' ? 'not-allowed' : '')}>
                                        {/* <Link className={(this.state.currentPage === 'companiesAct' ? 'active' : '')} to={"/lp/companiesAct/"+this.state.lpsubscriptionObj.id}>Companies Act<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.companiesActValid === false}/></Link> */}
                                        <Link className={`${this.state.currentPage === 'companiesAct' ? 'active' : ''} ${this.state.investorTypeTemp == 'Individual' ? 'disabled' : ''}`} to={"/lp/companiesAct/"+this.state.lpsubscriptionObj.id}>Companies Act<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.companiesActValid === false}/></Link>
                                    </li>
                                    <li hidden={this.state.investorType !== 'LLC'} className={(this.state.investorTypeTemp != 'LLC' ? 'not-allowed' : '')}>
                                        {/* <Link className={(this.state.currentPage === 'equityOwners' ? 'active' : '')} to={"/lp/equityOwners/"+this.state.lpsubscriptionObj.id}>Equity owners<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.equityOwnersValid === false}/></Link></li> */}
                                        <Link className={`${this.state.currentPage === 'equityOwners' ? 'active' : ''} ${this.state.investorTypeTemp != 'LLC' ? 'disabled' : ''}`} to={"/lp/equityOwners/"+this.state.lpsubscriptionObj.id}>Equity owners<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.equityOwnersValid === false}/></Link></li>
                                    <li hidden={this.state.investorType !== 'LLC'} className={(this.state.investorTypeTemp != 'LLC' ? 'not-allowed' : '')}>
                                        {/* <Link className={(this.state.currentPage === 'entityProposing' ? 'active' : '')} to={"/lp/entityProposing/"+this.state.lpsubscriptionObj.id}>Look-Through Issues<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.entityProposingValid === false}/></Link> */}
                                        <Link className={`${this.state.currentPage === 'entityProposing' ? 'active' : ''} ${this.state.investorTypeTemp != 'LLC' ? 'disabled' : ''}`} to={"/lp/entityProposing/"+this.state.lpsubscriptionObj.id}>Look-Through Issues<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.entityProposingValid === false}/></Link>
                                    </li>
                                    <li hidden={this.state.investorType === 'Individual'} className={(this.state.investorTypeTemp == 'Individual' ? 'not-allowed' : '')}>
                                        {/* <Link className={(this.state.currentPage === 'erisa' ? 'active' : '')} to={"/lp/erisa/"+this.state.lpsubscriptionObj.id}>ERISA<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.erisaValid === false}/></Link> */}
                                        <Link className={`${this.state.currentPage === 'erisa' ? 'active' : ''} ${this.state.investorTypeTemp == 'Individual' ? 'disabled' : ''}`} to={"/lp/erisa/"+this.state.lpsubscriptionObj.id}>ERISA<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.erisaValid === false}/></Link>
                                    </li>
                                    <li><Link className={(this.state.currentPage === 'capitalCommitment' ? 'active' : '')} to={"/lp/capitalCommitment/"+this.state.lpsubscriptionObj.id}>Capital Commitment<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.capitalCommitmentValid === false}/></Link></li>
                                    <li><Link className={(this.state.currentPage === 'review' ? 'active' : '')} to={"/lp/review/"+this.state.lpsubscriptionObj.id}>Review & Confirm
                                    {/* <img src={successImage} alt="successImage" className="ptrSuccessImage successImg" /> */}
                                    </Link></li>
                                </ul>:
                                <ul className="sidenav-menu minHeight150">
                                    <li>
                                        <Link className={(this.state.currentPage === 'investorInfo' ? 'active' : '')} to={"/lp/investorInfo/"+this.state.lpsubscriptionObj.id}>Investor Information (1/2)</Link>
                                    </li>
                                </ul>
                            }
                            <div className="text-left parnershipAgrementStyle"><label className=""><img src={handShakeImage} alt="image" className="handShakeImageStyle" /></label>&nbsp;<div className="left-nav-fund-name text-left agrementTxtStyle"><span className="agreementTxtAlign" onClick={this.openPatnershipDocument}>Partnership Agreement</span>
                            {/* <span className="successImgAlign"><img src={successImage} alt="successImage" className="ptrSuccessImage margin-Left-5" /></span> */}
                            </div></div>                            
                            <div><div className="sign-box"><img src={signFundImg} alt="successImage" className="pencilAlign" />&nbsp;<span className="signFundAlign">Sign and Submit Documents</span></div></div>
                            <div className="section-head text-left"><span className="sectionHeadTxt lpAlign">LP Delegates</span><span className="btn-add pull-right" onClick={this.handleLpShow}>+</span></div>
                            <div className="section">
                                <div className="gpDelDiv">
                                {this.state.lpDelegatesList.length > 0 ?
                                this.state.lpDelegatesList.map((record, index) => {
                                    return (
                                        <div className="gpDelegateInfo" key={index}>
                                            <div className="dpDelImg">
                                                {
                                                    record['profilePic'] ?
                                                        <img src={record['profilePic']} alt="img" className="user-image" />
                                                        : <img src={userDefaultImage} alt="img" className="user-image" />
                                                }
                                            </div>
                                            <div className="dpDelName">{record['firstName']}&nbsp;{record['lastName']}</div>
                                            <div className="dpDelgDel"><i className="fa fa-minus" onClick={(e) => this.deleteLpDelegate(e, record['id'])}></i></div>
                                        </div>
                                    );
                                })
                                :
                                <div className="user">
                                    <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                                    <p className="opacity75">You haven’t added any LP Delegates to this Fund yet.</p>
                                </div>
                            }
                                </div>
                            </div>
                        </div>

                    </div>
                </nav>

                <div className="mainHead" >
                    <div className="">
                        <div className="mainHeading">
                            <Row className="">
                                <Col lg={6} md={6} sm={6} xs={12} id="">
                                    <Row>
                                        <Col lg={3} md={3} sm={3} xs={3} className="fundImageAllign">
                                            {
                                                this.state.lpsubscriptionObj['fund'] && this.state.lpsubscriptionObj['fund']['fundImage'] ?
                                                <img src={this.state.lpsubscriptionObj['fund']['fundImage']['url']} alt="img" className="header-fund-image"/>: 
                                                <img src={fundDefaultImage} alt="fund_image" className="header-fund-image"/>
                                            }
                                        </Col>
                                        <Col lg={9} md={9} sm={9} xs={9} className="fundNameAllign">
                                            <span className="main-title">{this.state.legalEntity}</span>
                                            {/* <span className="statusTxtStyle">{this.state.status}</span> */}
                                        </Col>
                                    </Row>  
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <HeaderComponent ></HeaderComponent>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <div className="progressBarPosition">
                                        <div className="progressBarAlign"><div className="progress progressColor" style={{width: (this.state.pagesCompleted/this.state.totalPageCount)*100 + "%"}}></div></div>
                                        <div className="progressDetailsStyle">Fund Enrollment Steps Completed<span className="progressTxtAlign">{this.state.pagesCompleted} of {this.state.totalPageCount}</span></div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Row className="main-content">
                            <Route exact path={`${match.url}/investorInfo/:id`} component={InvestorInformationComponent} />
                            <Route exact path={`${match.url}/llc/:id`} component={LlcFormComponent} />  
                            <Route exact path={`${match.url}/AccreditedInvestor/:id`} component={AccreditedInvestorComponent} />    
                            <Route exact path={`${match.url}/confirm/:id`} component={confirmComponent} />     
                            <Route exact path={`${match.url}/qualifiedPurchaser/:id`} component={QualifiedPurchaserComponent} />
                            <Route exact path={`${match.url}/qualifiedClient/:id`} component={QualifiedClientComponent} />    
                            <Route exact path={`${match.url}/companiesAct/:id`} component={companiesActComponent} />  
                            <Route exact path={`${match.url}/equityOwners/:id`} component={equityOwnersComponent} />          
                            <Route exact path={`${match.url}/entityProposing/:id`} component={entityProposingComponent} />  
                            <Route exact path={`${match.url}/erisa/:id`} component={ERISAComponent} />
                            <Route exact path={`${match.url}/capitalCommitment/:id`} component={capitalCommitmentComponent} />
                            <Route exact path={`${match.url}/review/:id`} component={reviewComponent} />                        
                        </Row>
                    </div>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
                <LpModalComponent></LpModalComponent>
            </div>
        );
    }
}

export default LpSubscriptionFormComponent;

