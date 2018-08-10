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
import { PubSub } from 'pubsub-js';
import InvestorInformationComponent from '../lp/Investor-Information/investorinformation.component';
import LlcFormComponent from '../lp/llc/llc.component';
import AccreditedInvestorComponent from '../lp/accreditedInvestor/accreditedInvestor.component';
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

var investor = {};
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
        this.handleLpShow = this.handleLpShow.bind(this);
        this.state = {
            showModal: false,
            show: false,
            showSideNav: true,
            investorType: 'LLC',
            lpsubscriptionObj: {},
            currentPage: null,
            currentPageCount:1,
            totalPageCount:3,
            currentInvestorInfoPageNumber: 1,
            investorInfoValid: false,
            qualifiedPurchaserValid: false,
            accreditedInvestorValid: false,
            companiesActValid: false,
            equityOwnersValid: false,
            entityProposingValid: false,
            erisaValid: false,
            legalEntity: null,
            pagesCompleted:0,
            status: 'Open',
            currentFundImage : FundImage,
        }
        //Get the data from other steps
        investor = PubSub.subscribe('investorData', (msg, data) => {
            this.setState({
                investorType: 'LLC',
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
                    this.validateIndividualPages();
                } else if(this.state.investorType === 'LLC') {
                    this.validateLLCPages();
                }
            })
        });
    }

    //Unsuscribe the pubsub
    componentWillUnmount() {
        PubSub.unsubscribe(investor);
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
        }
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
                        investorType: 'LLC',
                        legalEntity: result.data.data.fund.legalEntity,
                        status: result.data.data.subscriptionStatus.name,
                        currentFundImage: result.data.data.fund.fundImage? result.data.data.fund.fundImage.url: FundImage
                    },()=>{
                        //Assing total pages count based on investor type.
                        if(result.data.data.investorType === 'Individual') {
                            this.setState({
                                totalPageCount:3
                            });
                            this.validateIndividualPages();
                        } else if(result.data.data.investorType === 'LLC') {
                            this.setState({
                                totalPageCount:7
                            });
                            this.validateLLCPages();
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
        PubSub.publish('openModal',true);
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
            mandatoryFields = ['investorType', 'name', 'areYouSubscribingAsJointIndividual', 'typeOfLegalOwnership', 'mailingAddressCity', 'mailingAddressPhoneNumber', 'mailingAddressState','mailingAddressStreet','mailingAddressZip'];
        } else if(this.state.investorType === 'LLC') {
            mandatoryFields = ['investorType','jurisdictionEntityLegallyRegistered','entityName','isEntityTaxExemptForUSFederalIncomeTax', 'istheEntityFundOfFundsOrSimilarTypeVehicle', 'releaseInvestmentEntityRequired', 'mailingAddressCity', 'mailingAddressPhoneNumber', 'mailingAddressState','mailingAddressStreet','mailingAddressZip'];
        }
        
        let  valid = this.FsnetUtil.checkNullOrEmpty(mandatoryFields, this.state.lpsubscriptionObj);
        if(valid){
            this.setState({
                investorInfoValid: true,
                pagesCompleted:1
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
                pagesCompleted:3
            })
        } else {
            this.setState({
                qualifiedPurchaserValid: false
            })
        }
    }

    //Check accredited Investor page is valid
    accreditedInvestorPageValid() {
        if(this.state.lpsubscriptionObj.areYouAccreditedInvestor!== null && this.state.lpsubscriptionObj.areYouAccreditedInvestor!== undefined) {
            this.setState({
                accreditedInvestorValid: true,
                pagesCompleted:2
            })
        } else {
            this.setState({
                accreditedInvestorValid: false
            })
        }
    }

    //Check companies act page is valid
    companiesActPageValid() {
        if(this.state.lpsubscriptionObj.companiesAct!== null && this.state.lpsubscriptionObj.companiesAct!== undefined) {
            this.setState({
                companiesActValid: true,
                pagesCompleted:4
            })
        } else {
            this.setState({
                companiesActValid: false
            })
        }
    }

    //Check equity owners page is valid
    equityOwnersPageValid() {
        if(this.state.lpsubscriptionObj.numberOfDirectEquityOwners && this.state.lpsubscriptionObj.existingOrProspectiveInvestorsOfTheFund!== null) {
            this.setState({
                equityOwnersValid: true,
                pagesCompleted:5
            })
        } else {
            this.setState({
                equityOwnersValid: false
            })
        }
    }

    //Check entity proposing page is valid
    enitityProposingPageValid() {
        if((this.state.lpsubscriptionObj.entityProposingAcquiringInvestment!== null && this.state.lpsubscriptionObj.entityProposingAcquiringInvestment!== undefined) && this.state.lpsubscriptionObj.anyOtherInvestorInTheFund!== null && this.state.lpsubscriptionObj.entityHasMadeInvestmentsPriorToThedate!== null && this.state.lpsubscriptionObj.partnershipWillNotConstituteMoreThanFortyPercent!== null && this.state.lpsubscriptionObj.beneficialInvestmentMadeByTheEntity!== null) {
            this.setState({
                entityProposingValid: true,
                pagesCompleted:6
            })
        } else {
            this.setState({
                entityProposingValid: false
            })
        }
    }

    //Check Erisa page is valid
    erisaPageValid() {
        if((this.state.lpsubscriptionObj.employeeBenefitPlan!==null && this.state.lpsubscriptionObj.employeeBenefitPlan!==undefined) && this.state.lpsubscriptionObj.planAsDefinedInSection4975e1!==null && this.state.lpsubscriptionObj.benefitPlanInvestor!==null ) {
            this.setState({
                erisaValid: true,
                pagesCompleted:7
            })
        } else {
            this.setState({
                erisaValid: false
            })
        }
    }

    //Call all the pages related to investor type individual
    //Validates all pages
    validateIndividualPages() {
        this.investorPageValid();
        this.accreditedInvestorPageValid();
        this.qualifiedPurchaserPageValid();
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
    }

    //Redirect to login
    //When user clicks on logout 
    //Clear the localstorage.
    redirectToLogin() {
        reactLocalStorage.clear();
        this.props.history.push('/login');
    }

    render() {
        const { match } = this.props;
        return (
            <div className="lpSubFormStyle" id="">
                <nav className="navbar navbar-custom">
                    <div className="navbar-header">
                        <div className="sidenav">
                            <h1 className="text-left"><i className="fa fa-bars" aria-hidden="true" onClick={(e) => this.hamburgerClick()}></i>&nbsp; FSNET LOGO</h1>
                        </div>
                    </div>
                    <div className="text-center navbar-collapse-custom" id="navbar-collapse" hidden={!this.state.showSideNav}>
                        <div className="sidenav">
                            <h1 className="text-left logoHamburger"><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; FSNET LOGO</h1>
                            <h2 className="text-left lpDashAlign"><img src={homeImage} alt="home_image" className="" />&nbsp; <Link to="/dashboard" className="dashboardTxtAlign">Dashboard</Link></h2>
                            <div className="active-item text-left"><label className="fund-left-pic-label"><img src={copyImage} alt="image" /></label>&nbsp;<div className="left-nav-fund-name text-left subAgrmnt">Subscription Agreement</div> <span className="fsbadge fsbadgeAlign">{this.state.currentPageCount}/{this.state.totalPageCount}</span></div>
                            {
                                this.state.investorType ?
                                <ul className="sidenav-menu">
                                    <li>
                                        <Link className={(this.state.currentPage === 'personaldetails' ? 'active' : '')} to={"/lp/personaldetails/"+this.state.lpsubscriptionObj.id}>Investor Information ({this.state.currentInvestorInfoPageNumber}/2)<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.investorInfoValid === false}/></Link>
                                    </li>
                                    <li>
                                        <Link className={(this.state.currentPage === 'AccreditedInvestor' ? 'active' : '')} to={"/lp/AccreditedInvestor/"+this.state.lpsubscriptionObj.id}>Accredited Investor<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.accreditedInvestorValid === false} /></Link>
                                    </li>
                                    <li>
                                        <Link className={(this.state.currentPage === 'qualifiedPurchaser' ? 'active' : '')} to={"/lp/qualifiedPurchaser/"+this.state.lpsubscriptionObj.id}>Qualified Purchaser/Client<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.qualifiedPurchaserValid === false}/></Link>
                                    </li>
                                    <li hidden={this.state.investorType === 'Individual'}>
                                        <Link to={"/lp/companiesAct/"+this.state.lpsubscriptionObj.id}>Companies Act<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.companiesActValid === false}/></Link>
                                    </li>
                                    <li hidden={this.state.investorType !== 'LLC'}>
                                        <Link to={"/lp/equityOwners/"+this.state.lpsubscriptionObj.id}>Equity owners<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.equityOwnersValid === false}/></Link></li>
                                    <li hidden={this.state.investorType !== 'LLC'}>
                                        <Link to={"/lp/entityProposing/"+this.state.lpsubscriptionObj.id}>Entity proposing<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.entityProposingValid === false}/></Link>
                                    </li>
                                    <li hidden={this.state.investorType === 'Individual'}>
                                        <Link to={"/lp/erisa/"+this.state.lpsubscriptionObj.id}>ERISA<img src={successImage} alt="successImage" className="ptrSuccessImage successImg" hidden={this.state.erisaValid === false}/></Link>
                                    </li>
                                    <li><Link className={(this.state.currentPage === 'review' ? 'active' : '')} to={"/lp/review/"+this.state.lpsubscriptionObj.id}>Review & Confirm
                                    {/* <img src={successImage} alt="successImage" className="ptrSuccessImage successImg" /> */}
                                    </Link></li>
                                </ul>:
                                <ul className="sidenav-menu minHeight150">
                                    <li>
                                        <Link className={(this.state.currentPage === 'personaldetails' ? 'active' : '')} to={"/lp/personaldetails/"+this.state.lpsubscriptionObj.id}>Investor Information (1/2)</Link>
                                    </li>
                                </ul>
                            }
                            <div className="text-left parnershipAgrementStyle"><label className=""><img src={handShakeImage} alt="image" className="handShakeImageStyle" /></label>&nbsp;<div className="left-nav-fund-name text-left agrementTxtStyle"><span className="agreementTxtAlign">Partnership Agreement</span>
                            {/* <span className="successImgAlign"><img src={successImage} alt="successImage" className="ptrSuccessImage margin-Left-5" /></span> */}
                            </div></div>                            
                            <div><div className="sign-box"><img src={signFundImg} alt="successImage" className="pencilAlign" />&nbsp;<span className="signFundAlign">Sign and Submit Documents</span></div></div>
                            <div className="section-head text-left"><span className="sectionHeadTxt lpAlign">LP Delegates</span><span className="btn-add pull-right" onClick={this.handleLpShow}>+</span></div>
                            <div className="section">
                                <div className="gpDelDiv">
                                    <div className="user">
                                        <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                                        <p className="opacity75">You haven’t added any LP Delegates to this Fund yet</p>
                                    </div>
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
                                    <span className="main-title">{this.state.legalEntity}</span><span className="statusTxtStyle">{this.state.status}</span>
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
                            <Route exact path={`${match.url}/personaldetails/:id`} component={InvestorInformationComponent} />
                            <Route exact path={`${match.url}/llc/:id`} component={LlcFormComponent} />  
                            <Route exact path={`${match.url}/AccreditedInvestor/:id`} component={AccreditedInvestorComponent} />    
                            <Route exact path={`${match.url}/confirm/:id`} component={confirmComponent} />     
                            <Route exact path={`${match.url}/qualifiedPurchaser/:id`} component={QualifiedPurchaserComponent} />
                            <Route exact path={`${match.url}/qualifiedClient/:id`} component={QualifiedClientComponent} />    
                            <Route exact path={`${match.url}/companiesAct/:id`} component={companiesActComponent} />  
                            <Route exact path={`${match.url}/equityOwners/:id`} component={equityOwnersComponent} />          
                            <Route exact path={`${match.url}/entityProposing/:id`} component={entityProposingComponent} />  
                            <Route exact path={`${match.url}/erisa/:id`} component={ERISAComponent} />
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

