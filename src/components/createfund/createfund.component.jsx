
import React, { Component } from 'react';
import './createfund.component.css';
import { Row, Modal, Button } from 'react-bootstrap';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from '../../services/fsnetauth';
import { Route, Link } from "react-router-dom";
import Step1Component from '../createfund/step1/step1.component';
import Step2Component from '../createfund/step2/step2.component';
import Step3Component from '../createfund/step3/step3.component';
import Step5Component from '../createfund/step5/step5.component';
import Step6Component from '../createfund/step6/step6.component';
import ModalComponent from '../createfund/modals/modals.component';
import HeaderComponent from '../header/header.component';
import { Fsnethttp } from '../../services/fsnethttp';
import userDefaultImage from '../../images/default_user.png';
import homeImage from '../../images/home.png';
import fundImage from '../../images/picture.png';
import successImage from '../../images/success-small.png';
import Loader from '../../widgets/loader/loader.component';
import { Constants } from '../../constants/constants';
import { PubSub } from 'pubsub-js';
import vanillaLogo from '../../images/Vanilla-white.png';

var fundInfo = {}, pageInfo={};
class CreateFundComponent extends Component {

    constructor(props) {
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.FsnetAuth = new FsnetAuth();
        this.emitStartBtnModal = this.emitStartBtnModal.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.hamburgerClick = this.hamburgerClick.bind(this)
        this.handleGpShow = this.handleGpShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            showSideNav : true,
            loggedInUserObj: [],
            getGpDelegatesList: [],
            getLpList: [],
            currentPage: 'funddetails',
            currentPageNumber: 1,
            totalPageCount: 5,
            fundId: null,
            firmId: null,
            createdFundDataObj: {},
            show: false,
            fundName: 'Create New Fund',
            fundImage: fundImage,
            showLeftNavLinks: false,
            startFundValid: false,
            gpDelegatesSelectedUsers: false,
            lpSelectedUsers: false
        }
        fundInfo = PubSub.subscribe('fundData', (msg, data) => {
            this.setState({
                fundId: data.id
            }, () => {
                this.updateObjandNavLinks(data);
            })
        });
        pageInfo = PubSub.subscribe('pageNumber', (msg, data) => {
            this.getCurrentPageNumber(data.type, data.page)
        });

    }

    //Unsuscribe the pubsub
    componentWillUnmount() {
        PubSub.unsubscribe(fundInfo);
        PubSub.unsubscribe(pageInfo);
    }


    logout() {
        reactLocalStorage.clear();
        this.props.history.push('/');
    }

    emitStartBtnModal() {
        PubSub.publish('startBtnEmit', true);
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

    componentDidMount() {
        if (this.FsnetAuth.isAuthenticated()) {
            //Get user obj from local storage.
            let userObj = reactLocalStorage.getObject('userData');
            let firmId = reactLocalStorage.getObject('firmId');
            var url = window.location.href;
            var parts = url.split("/");
            var urlSplitFundId = parts[parts.length - 1];
            this.getCurrentPageNumber();
            if (userObj) {
                this.setState({
                    loggedInUserObj: userObj,
                    currentPage: urlSplitFundId,
                    firmId: firmId
                })
            }
            var url = window.location.href;
            var parts = url.split("/");
            var urlSplitFundId = parts[parts.length - 1];
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
                    this.props.history.push('/createfund/funddetails');
                }
            });
        }
    }

    updateObjandNavLinks(data) {
        this.setState({
            createdFundDataObj: data,
            fundId: data.id,
            fundName: data.legalEntity,
            fundImage: data.fundImage ? data.fundImage.url : fundImage,
            getGpDelegatesList: data.gpDelegates ? data.gpDelegates: [],
            getLpList: data.lps ? data.lps: [],
            showLeftNavLinks: true,
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
                },()=>{
                    this.enableStartFundButton();
                })
            }
        }
    }

    

    enableStartFundButton() {
        if (this.state.fundId && this.state.createdFundDataObj.partnershipDocument !== null && this.state.lpSelectedUsers && this.state.createdFundDataObj.status === 'New-Draft' && this.state.currentPage === 'review') {
            this.setState({
                startFundValid: true
            })
        } else {
            this.setState({
                startFundValid: false
            })
        }
    }


    handleClose() {
        this.setState({ show: false });
    }

    handleShow() {
        PubSub.publish('openLpModal', this.state.createdFundDataObj );
    }

    handleGpShow() {
        PubSub.publish('openGpModal', this.state.createdFundDataObj);
    }

    deleteLp(e, id) {
        PubSub.publish('openLpDelModal', { data: this.state.createdFundDataObj, delegateId: id });
    }

    deleteGp(e, id) {
        PubSub.publish('openGpDelModal', { data: this.state.createdFundDataObj, delegateId: id });
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    getCurrentPageNumber(type, fundPage) {
        let page;
        if (type === 'sideNav') {
            page = fundPage
        } else {
            let url = window.location.href;
            let splitUrl = url.split('/createfund/');
            if (splitUrl[1] !== undefined) {
                page = splitUrl[1].split('/')[0];
            }
        }
        let number;
        if (page === 'funddetails') {
            number = 1;
        } else if (page === 'gpDelegate') {
            number = 2;
        } else if (page === 'upload') {
            number = 3;
        } else if (page === 'lp') {
            number = 4;
        } else if (page === 'review') {
            number = 5;
        }
        this.setState({
            currentPageNumber: number,
            currentPage: page
        },()=>{
            this.enableStartFundButton();
        })
    }

    redirectToLogin() {
        reactLocalStorage.clear();
        this.props.history.push('/login');
    }

    render() {
        const { match } = this.props;
        return (
            <div className="" id="createFund">
               
                        <nav className="navbar navbar-custom">
                        <div className="navbar-header">
                        <div className="sidenav">
                            <h1 className="text-left"><i className="fa fa-bars" aria-hidden="true" onClick={(e) => this.hamburgerClick()}></i>&nbsp; <img src={vanillaLogo} alt="vanilla" className="vanilla-logo"/></h1>
                        </div>
                        </div>
                        <div className="text-center navbar-collapse-custom" id="navbar-collapse" hidden={!this.state.showSideNav}>
                        <div className="sidenav">
                        <h1 className="text-left logoHamburger"><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; <img src={vanillaLogo} alt="vanilla" className="vanilla-logo"/></h1>
                        <h2 className="text-left"><img src={homeImage} alt="home_image" className="" />&nbsp; <Link to="/dashboard">Dashboard</Link></h2>
                        <div className="active-item text-left"><label className="fund-left-pic-label"><img src={this.state.fundImage} alt="fund_image" /></label>&nbsp;<div className="left-nav-fund-name text-left">{this.state.fundName}</div> <span className="fsbadge">{this.state.currentPageNumber}/{this.state.totalPageCount}</span></div>
                        {
                            this.state.fundId && this.state.showLeftNavLinks ?
                                <ul className="sidenav-menu">
                                    <li>
                                        <Link to={"/createfund/funddetails/" + this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'funddetails')} className={(this.state.currentPage === 'funddetails' ? 'active' : '')}>Fund Details<span className="checkIcon"><img src={successImage} alt="successImage" /></span></Link>
                                    </li>
                                    <li>
                                        <Link to={"/createfund/gpDelegate/" + this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'gpDelegate')} className={(this.state.currentPage === 'gpDelegate' ? 'active' : '')}>Assign GP Delegates<span className="checkIcon" hidden={!this.state.gpDelegatesSelectedUsers}><img src={successImage} alt="successImage" /></span></Link>
                                    </li>
                                    <li>
                                        <Link to={"/createfund/upload/" + this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'upload')} className={(this.state.currentPage === 'upload' ? 'active' : '')}>Partnership Agreement<span className="checkIcon" hidden={this.state.createdFundDataObj.partnershipDocument === null}><img src={successImage} alt="successImage" /></span></Link>
                                    </li>
                                    <li>
                                        <Link to={"/createfund/lp/" + this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'lp')} className={(this.state.currentPage === 'lp' ? 'active' : '')}>Assign LPs to Fund<span className="checkIcon" hidden={!this.state.lpSelectedUsers}><img src={successImage} alt="successImage" /></span></Link>
                                    </li>
                                    <li>
                                        <Link to={"/createfund/review/" + this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'review')} className={(this.state.currentPage === 'review' ? 'active' : '')}>Review & Confirm</Link>
                                    </li>
                                </ul>
    
                                :
                                <ul className="sidenav-menu">
                                    <li><a className={(this.state.currentPage === 'funddetails' ? 'active' : '')}>Fund Details</a></li>
                                    <li><a>Assign GP Delegates</a></li>
                                    <li><a>Partnership Agreement</a></li>
                                    <li><a>Assign LPs to Fund</a></li>
                                    <li><a>Review & Confirm</a></li>
                                </ul>
                        }
                        <div><div className="start-box" hidden={this.state.startFundValid === true}><i className="fa fa-check strtFndChk" aria-hidden="true"></i>&nbsp;Start Fund</div></div>
                    <div className="start-fund" onClick={this.emitStartBtnModal} hidden={this.state.startFundValid === false}><i className="fa fa-check strtFndChk" aria-hidden="true"></i>&nbsp;Start Fund</div>
                    <div className="section-head text-left"><span className="sectionHeadTxt">GP Delegates</span><span className={"btn-add pull-right " + (this.state.fundId === null ? 'disabledAddIcon' : '')} onClick={this.handleGpShow}>+</span></div>
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

                    <div className="section-head text-left"><span className="sectionHeadTxt">LPs</span><span className={"btn-add pull-right " + (this.state.fundId === null ? 'disabledAddIcon' : '')} onClick={this.handleShow}>+</span></div>
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

                      <div className="main">
                    <div>
                        <HeaderComponent ></HeaderComponent>
                    </div>
                    <div className="contentWidth">
                        <div className="main-heading"><span className="main-title">{this.state.fundId ? 'Edit' : 'Create New'} Fund</span><Link to="/dashboard" className="cancel-fund">Cancel</Link></div>
                        <Row className="main-content">
                            <Route exact path={`${match.url}/funddetails`} component={Step1Component} />
                            <Route exact path={`${match.url}/funddetails/:id`} component={Step1Component} />
                            <Route exact path={`${match.url}/gpDelegate/:id`} component={Step2Component} />
                            <Route exact path={`${match.url}/upload/:id`} component={Step3Component} />
                            <Route exact path={`${match.url}/lp/:id`} component={Step5Component} />
                            <Route exact path={`${match.url}/review/:id`} component={Step6Component} />
                        </Row>
                    </div>
                    <Loader isShow={this.state.showModal}></Loader>
                </div>
                <ModalComponent></ModalComponent>
                      

            </div>
        );
    }
}

export default CreateFundComponent;

