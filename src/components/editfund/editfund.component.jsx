import React, { Component } from 'react';
import './editfund.component.css';
import Loader from '../../widgets/loader/loader.component';
import { Constants } from '../../constants/constants';
import { Row, Col } from 'react-bootstrap';
import { Fsnethttp } from '../../services/fsnethttp';
import { FsnetAuth } from '../../services/fsnetauth';
import HeaderComponent from '../header/header.component';
import homeImage from '../../images/home.png';
import ModalComponent from '../createfund/modals/modals.component';
import fundLogoSample from '../../images/fund_logo_sample.png';
import fundDefault from '../../images/fund-default.png';
import successImage from '../../images/success-small.png';
import helpImage from '../../images/help.png';
import signFundImg from '../../images/edit-grey.svg';
import copyImage from '../../images/copy_img.svg';

import ToastComponent from '../toast/toast.component';
import handShakeImage from '../../images/handshake_2.svg';
import handShakeWhiteImage from '../../images/handshake_white.svg';
import currencyImage from '../../images/currency.svg';
import currencyWhiteImage from '../../images/currency_white.svg';
import documentImage from '../../images/document.svg';
import documentWhiteImage from '../../images/document_white.svg';
import infoImage from '../../images/info.svg';
import infoWhiteImage from '../../images/info_white.svg';
import letterImage from '../../images/letter.svg';
import letterWhiteImage from '../../images/letter_white.svg';
import printImage from '../../images/print.svg';
import printWhiteImage from '../../images/print_white.svg';

import { Route, Link } from "react-router-dom";
import userDefaultImage from '../../images/default_user.png';
import { PubSub } from 'pubsub-js';
import { FsnetUtil } from '../../util/util';
import addendumsComponent from './addendums/addendums.component';
import sideLettersComponent from './sideLetter/sideLetters.component';
import dashboardComponent from './dashboard/dashboard.component';
import expandLpTableComponent from './expandLpTable/expandLpTable.component';
import { reactLocalStorage } from 'reactjs-localstorage';
import vanillaLogo from '../../images/Vanilla-white.png';
import vanillaDarkLogo from '../../images/Vanilla.png';

var fundInfo = {};
class editFundComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.hamburgerClick = this.hamburgerClick.bind(this)
        this.handleGpShow = this.handleGpShow.bind(this);
        this.openDocument = this.openDocument.bind(this);
        this.getFundDetails = this.getFundDetails.bind(this);
        this.state = {
            fundObj: {},
            showModal: false,
            isExpanded: false,
            showToast: false,
            toastMessage: '',
            toastType: 'success',
            showSideNav: true,
            gpDelegatesSelectedUsers: false,
        }
        fundInfo = PubSub.subscribe('fundData', (msg, data) => {
            console.log('hkdjalsdkjasdjasd', data);
            this.setState({
                fundId: data.id
            }, () => {
                this.updateObjandNavLinks(data);
            })
        });

        PubSub.subscribe('goToDashboard', () => {
            this.props.history.push('/dashboard');
        })

        PubSub.subscribe('toastNotification', (msg, data) => {
            this.setState({
                showToast: data.showToast,
                toastMessage: data.toastMessage,
                toastType: data.toastType
            })
        })

        PubSub.subscribe('closeToast', (msg, data) => {
            this.closeToast(data.timed);
        })
    }

    closeToast(timed) {
        if(timed) {
            setTimeout(() => {
                this.setState({
                    showToast: false,
                    toastMessage: '',
                    toastType: 'success'
                })  
            }, 4000);
        } else {
            this.setState({
                showToast: false,
                toastMessage: '',
                toastType: 'success'
            })  
        }
    }

    componentDidMount() {
        if (this.FsnetAuth.isAuthenticated()) {
            //Get user obj from local storage.
            let userObj = reactLocalStorage.getObject('userData');
            let firmId = reactLocalStorage.getObject('firmId');
            var url = window.location.href;
            var parts = url.split("/");
            console.log('parts:::', parts);
            var urlString = parts[parts.length - 2];
            var urlSplitFundId = parts[parts.length - 1];
            if(parts.indexOf('expandTable') > -1) {
                this.setState({
                    isExpanded: true
                })
            } else {
                this.setState({
                    isExpanded: false
                })
            }
            if (userObj) {
                this.setState({
                    loggedInUserObj: userObj,
                    currentPage: urlSplitFundId,
                    firmId: firmId
                })
            }
            let fundId = urlSplitFundId;
            if (fundId !== 'funddetails' && fundId !== 'createfund') {
                this.setState({ fundId: fundId }, () => this.getFundDetails());
            }
            window.scrollTo(0, 0);
        } else {
            this.props.history.push('/');
        }
    }

    getFundDetails() {
        console.log('calling fund data');
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let fundId = this.state.fundId
        if (fundId) {
            this.open();
            this.Fsnethttp.getFund(fundId, headers).then(result => {
                this.close();
                if (result.data) {
                    this.updateObjandNavLinks(result.data.data)
                }
            })
            .catch(error => {
                this.close();
                if(error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    this.props.history.push('/dashboard');
                }
            });
        }
    }

    redirectToLogin() {
        reactLocalStorage.clear();
        this.props.history.push('/login');
    }

    updateObjandNavLinks(data) {
        this.setState({
            fundName: data.legalEntity,
            fundStatus: data.status,
            fundObj: data,
            documentLink: data.partnershipDocument ? data.partnershipDocument.url : null,
            getGpDelegatesList: data.gpDelegates ? data.gpDelegates: [],
            getLpList: data.lps ? data.lps: [],
            gpDelegatesSelectedUsers: false,
            lpSelectedUsers: false,
        },()=>{
            this.gpSelectedFromFund();
            this.lpSelectedFromFund();
        })
    }

    //Check GP list selected true 
    gpSelectedFromFund() {
        for(let index of this.state.getGpDelegatesList) {
            if(index['selected'] === true) {
                this.setState({
                    gpDelegatesSelectedUsers: true
                })
            }
        }
    }

    //Check lP list selected true 
    lpSelectedFromFund() {
        for(let index of this.state.getLpList) {
            if(index['selected'] === true) {
                this.setState({
                    lpSelectedUsers: true
                })
            }
        }
    }

    //Unsuscribe the pubsub
    componentWillUnmount() {
        PubSub.unsubscribe(fundInfo);
    }


 

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    handleShow() {
        PubSub.publish('openLpModal', this.state.fundObj );
    }

    handleGpShow() {
        PubSub.publish('openGpModal', this.state.fundObj );
    }

    hamburgerClick() {
        if(this.state.showSideNav == true) {
            this.setState({
                showSideNav : false
            })
        } else {
            this.setState({
                showSideNav : true
            })
        }
    }

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

    closeFund() {
        console.log('clicked closeFund modal');
        PubSub.publish('openCloseFundModal', {fundId: this.state.fundId})
    }

    confirmDeactivate() {
        console.log('clicked modal');
        PubSub.publish('openfundDelModal', {fundId: this.state.fundId, fundName: this.state.fundName, fundStatus: this.state.fundStatus})
    }

    deleteLp(e, id) {
        PubSub.publish('openLpDelModal', { data: this.state.fundObj, delegateId: id });
    }

    deleteGp(e, id) {
        PubSub.publish('openGpDelModal', { data: this.state.fundObj, delegateId: id });
    }

    openDocument() {
        if(this.state.documentLink) {
            window.open(this.state.documentLink, '_blank', 'width = 1000px, height = 600px')
        }
    }
    
    render() {
        const { match } = this.props;
        return (
            <div className="lpSubFormStyle editFundContainer" id="">
                <nav className="navbar navbar-custom" hidden={this.state.isExpanded}>
                    <div className="navbar-header">
                        <div className="sidenav">
                            <h1 className="text-left"><i className="fa fa-bars" aria-hidden="true" onClick={(e) => this.hamburgerClick()}></i>&nbsp; <img src={vanillaLogo} alt="vanilla" className="vanilla-logo"/></h1>
                        </div>
                    </div>
                    <div className="text-center navbar-collapse-custom" id="navbar-collapse" hidden={!this.state.showSideNav}>
                        <div className="sidenav">
                            <h1 className="text-left logoHamburger"><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; <img src={vanillaLogo} alt="vanilla" className="vanilla-logo"/></h1>
                            <h2 className="text-left lpDashAlign"><img src={homeImage} alt="home_image" className="" />&nbsp; <Link to="/dashboard" className="dashboardTxtAlign">Dashboard</Link></h2>
                            {
                                <ul className="sidenav-menu">
                                    <li>
                                        <Link to={"/createfund/funddetails/"+this.state.fundId}><img src={infoImage} alt="home_image" className="" />&nbsp;<span>Edit Fund Details</span></Link>
                                    </li>
                                    <li>
                                        {/* <Link to={"/editFund/addendums/"+'2'}><img src={printImage} alt="home_image" className="" />&nbsp;<span>Print Fund Summary</span></Link> */}
                                        <a className="cursor" ><img src={printImage} alt="home_image" className="" />&nbsp;<span>Print Fund Summary</span></a>
                                    </li>
                                    <li>
                                        <Link to={"/fund/addendums/"+this.state.fundId}><img src={documentImage} alt="home_image" className="" />&nbsp;<span>Addendums</span></Link>
                                        {/* <a className="cursor" ><img src={documentImage} alt="home_image" className="" />&nbsp;<span>Addendums</span></a> */}
                                    </li>
                                    <li>
                                        <a className="cursor" onClick={this.state.fundObj.partnershipDocument ? this.openDocument : null}><img src={handShakeImage} alt="home_image" className="" />&nbsp;<span>Partnership Agreements</span></a>
                                        {/* <Link to={"/editFund/addendums/"+'2'}><img src={handShakeImage} alt="home_image" className="" />&nbsp;<span>Partnership Agreements</span></Link> */}
                                    </li>
                                    <li>
                                        <Link to={"/fund/sideLetters/"+this.state.fundId}><img src={letterImage} alt="home_image" className="" />&nbsp;<span>Side Letters</span></Link>
                                        {/* <a className="cursor" ><img src={letterImage} alt="home_image" className="" />&nbsp;<span>Side Letters</span></a> */}
                                    </li>
                                    <li>
                                        {/* <Link to={"/editFund/addendums/"+'2'}><img src={currencyImage} alt="home_image" className="" />&nbsp;<span>Capital Call</span></Link> */}
                                        <a className="cursor" ><img src={currencyImage} alt="home_image" className="" />&nbsp;<span>Capital Call</span></a>
                                    </li>
                                    <li>
                                        <a className="cursor" onClick={() => { this.closeFund()}}><img src={null} alt={null} className="" style={{ visibility: 'hidden' }}/>&nbsp;<span>Close Fund</span></a>
                                    </li>
                                    <li>
                                        <a className="cursor" onClick={() => { this.confirmDeactivate()}}><img src={null} alt={null} className="" style={{ visibility: 'hidden' }}/>&nbsp;<span>Deactivate Fund</span></a>
                                    </li>
                                </ul>
                            }
                          
                            <div className="section-head text-left"><span className="sectionHeadTxt lpAlign">GP Delegates</span><span className={"btn-add pull-right " + (this.state.fundId === null ? 'disabledAddIcon' : '')} onClick={this.handleGpShow}>+</span></div>
                            <div className="section">
                                <div className="gpDelDiv">
                                    {this.state.gpDelegatesSelectedUsers === true ?
                                        this.state.getGpDelegatesList.map((record, index) => {
                                            return (
                                                <div className="gpDelegateInfo" key={index} hidden={record['selected'] === false}>
                                                    <div className="dpDelImg">
                                                        {
                                                            record['profilePic'] ?
                                                                <img src={record['profilePic']['url']} alt="img" className="user-image" />
                                                                : <img src={userDefaultImage} alt="img" className="user-image" />
                                                        }
                                                    </div>
                                                    <div className="dpDelName" title={`${record['firstName']} ${record['lastName']}`}>{record['firstName']}&nbsp;{record['lastName']}</div>
                                                    <div className="dpDelgDel"><i className="fa fa-minus" onClick={(e) => this.deleteGp(e, record['id'])}></i></div>
                                                </div>
                                            );
                                        })
                                        :
                                        <div className="user">
                                            <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                                            <p className="opacity75">You haven’t added any GP Delegates to this Fund yet</p>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="section-head text-left"><span className="sectionHeadTxt lpAlign">LPs</span><span className={"btn-add pull-right " + (this.state.fundId === null ? 'disabledAddIcon' : '')} onClick={this.handleShow}>+</span></div>
                            <div className="section">
                                <div className="gpDelDiv">
                                    {this.state.lpSelectedUsers === true ?
                                        this.state.getLpList.map((record, index) => {
                                            return (
                                                <div className="gpDelegateInfo" key={index} hidden={record['selected'] === false}>
                                                    <div className="dpDelImg">
                                                        {
                                                            record['profilePic'] ?
                                                                <img src={record['profilePic']['url']} alt="img" className="user-image" />
                                                                : <img src={userDefaultImage} alt="img" className="user-image" />
                                                        }
                                                    </div>
                                                    <div className="dpDelName">{record['firstName']}&nbsp;{record['lastName']}</div>
                                                    <div className="dpDelgDel"><i className="fa fa-minus" onClick={(e) => this.deleteLp(e, record['id'])}></i></div>
                                                </div>
                                            );
                                        })
                                        :
                                        <div className="user">
                                            <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                                            <p className="opacity75">You haven’t added any LPs to this Fund yet</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                </nav>

                <div className={"main "+(this.state.isExpanded ? 'marginHorizontal30 expanded' : '')}>
                    <div className={"headerAlign "+(this.state.isExpanded ? 'marginTop20' : '')}>
                        <div className="pull-left" hidden={!this.state.isExpanded}>
                            <img src={vanillaDarkLogo} alt="vanilla" className="vanilla-logo marginLeft30"/>
                        </div>
                        <HeaderComponent></HeaderComponent>
                    </div>
                    <div className="contentWidth">
                        {/* Heading fund title content */}
                        {/* <Row>
                            <Col md={7}>
                                <Row>
                                    <Col md={2}>
                                        <img src={fundLogoSample} alt="home_image" className="" />
                                    </Col>
                                    <Col md={8}>
                                        <p className="fundName">Fund Name &nbsp;<span className="statusTxtStyle">Open</span></p>
                                        <p className="fundDate">Fund Start Date: 6/18/2018</p>
                                        <p className="fundDate">Fund End Date: 6/18/2021</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row> */}
                        {/* <div className="main-heading height140">
                            <div className="lpHeader">
                                <img src={fundLogoSample} alt="home_image" className="" />
                                <span className="main-title">Fund Name</span><span className="statusTxtStyle">In Progress</span>
                            </div>
                        </div> */}

                        {/* progress bar content */}
                        {/* <div className="ProgressBarDiv">
                            <div className="progress-bar progressBarAlign"><div className="progress progressColor"></div></div>
                            <div className="progressDetailsStyle">Fund Enrollment Steps Completed<span className="progressTxtAlign">3 of 3</span></div>
                            <div className="helpImgAlign"><img src={helpImage} alt="helpImage" className="" />Help</div>
                        </div> */}

                        {/* Actual Content */}
                        <Row className="main-content">
                            <Route exact path={`${match.url}/view/:id`} component={dashboardComponent} />                      
                            <Route exact path={`${match.url}/expandTable/:id`} component={expandLpTableComponent} />                      
                            <Route exact path={`${match.url}/addendums/:id`} component={addendumsComponent} />                      
                            <Route exact path={`${match.url}/sideLetters/:id`} component={sideLettersComponent} />                      
                        </Row>
                    </div>
                </div>

                
                <ToastComponent showToast={this.state.showToast} toastMessage={this.state.toastMessage} toastType={this.state.toastType}></ToastComponent>                        
                <Loader isShow={this.state.showModal}></Loader>
                {/* <ModalComponent></ModalComponent> */}
            </div>
        );
    }
}

export default editFundComponent;

