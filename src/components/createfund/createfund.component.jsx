
import React, { Component } from 'react';
import './createfund.component.css';
import { Row } from 'react-bootstrap';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from '../../services/fsnetauth';
import { Route, Link } from "react-router-dom";
import Step1Component from '../createfund/step1/step1.component';
import Step2Component from '../createfund/step2/step2.component';
import Step3Component from '../createfund/step3/step3.component';
import Step5Component from '../createfund/step5/step5.component';
import Step6Component from '../createfund/step6/step6.component';
import HeaderComponent from '../header/header.component';
import { Fsnethttp } from '../../services/fsnethttp';
import userDefaultImage from '../../images/default_user.png';
import Loader from '../../widgets/loader/loader.component';
import {Constants} from '../../constants/constants';
import { PubSub } from 'pubsub-js';


class CreateFundComponent extends Component {

    constructor(props) {
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.FsnetAuth = new FsnetAuth();
        this.getGpDeligates = this.getGpDeligates.bind(this);
        this.getLp = this.getLp.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            loggedInUserObj: [],
            getGpDelegatesList: [],
            getLpList:[],
            currentPage: 'funddetails',
            currentPageNumber: 1,
            totalPageCount: 5,
            fundId: null,
            firmId : null,
            createdFundDataObj: {}
        }

    }

    logout() {
        reactLocalStorage.clear();
        this.props.history.push('/');
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
                    firmId:firmId
                })
            }
        } else {
            this.props.history.push('/');
        }
        var token = PubSub.subscribe('fundData', (msg, data) => {
            console.log('bhjsdjlahdls:', msg, data);
            this.setState({
                createdFundDataObj: data,
                fundId: data.id
            })
        });
        var url = window.location.href;
        var parts = url.split("/");
        var urlSplitFundId = parts[parts.length - 1];
        let fundId = urlSplitFundId;
        if(fundId != 'funddetails') {
            this.setState({ fundId: fundId }, () => this.getLPandGP());
        }
    }

    getLPandGP() {
        if(this.state.fundId) {
            this.getGpDeligates();
            this.getLp();
        }
    }
    getGpDeligates() {
        this.open();
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let firmId = this.state.firmId;
        let fundId = this.state.fundId
        this.Fsnethttp.getGpDelegates(firmId, fundId, headers).then(result=>{
            this.close();
            if(result.data && result.data.data.length >0) {
                this.setState({ getGpDelegatesList: result.data.data });
                console.log("123",this.state.getGpDelegatesList)
            } else {
                this.setState({
                    getGpDelegatesList: []
                })
            }
        })
        .catch(error=>{
                this.close();
                this.setState({
                    getGpDelegatesList: []
                })
           
        });

    }

    getLp() {
        this.open();
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let firmId = this.state.firmId;
        let fundId = this.state.fundId
        this.Fsnethttp.getLp(firmId, fundId, headers).then(result=>{
            this.close();
            if(result.data && result.data.data.length >0) {
                this.setState({ getLpList: result.data.data });
            } else {
                this.setState({
                    getLpList: []
                })
            }
        })
        .catch(error=>{
                this.close();
                this.setState({
                    getLpList: []
            })
           
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

    getCurrentPageNumber(type, fundPage) {
        let page;
        if (type === 'sideNav') {
            page = fundPage
        } else {
            let url = window.location.href;
            page = url.split('/createfund/')[1].split('/')[0];
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
        })
    }

    render() {
        const { match } = this.props;
        return (
            <div className="wrapper" id="createFund">
                <div className="sidenav">
                    <h1><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; FSNET LOGO</h1>
                    <h2><i className="fa fa-home" aria-hidden="true"></i>&nbsp; <a href="/dashboard">Dashboard</a></h2>
                    <div className="active-item"><i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;Create New Fund <span className="fsbadge">{this.state.currentPageNumber}/{this.state.totalPageCount}</span></div>
                    {
                        this.state.fundId?
                        <ul className="sidenav-menu">
                        <li><Link to={"/createfund/funddetails/"+this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'funddetails')} className={(this.state.currentPage === 'funddetails' ? 'active' : '')}>Fund Details<span className="checkIcon"><i className="fa fa-check faChk" aria-hidden="true"></i></span></Link></li>
                        <li><Link to={"/createfund/gpDelegate/"+this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'gpDelegate')} className={(this.state.currentPage === 'gpDelegate' ? 'active' : '')}>Assign GP Delegates<span className="checkIcon"><i className="fa fa-check faChk" aria-hidden="true"></i></span></Link></li>
                        <li><Link to={"/createfund/upload/"+this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'upload')} className={(this.state.currentPage === 'upload' ? 'active' : '')}>Partnership Agreement<span className="checkIcon"><i className="fa fa-check faChk" aria-hidden="true"></i></span></Link></li>
                        <li><Link to={"/createfund/lp/"+this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'lp')} className={(this.state.currentPage === 'lp' ? 'active' : '')}>Assign LP's to Fund<span className="checkIcon"><i className="fa fa-check faChk" aria-hidden="true"></i></span></Link></li>
                        <li><Link to={"/createfund/review/"+this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'review')} className={(this.state.currentPage === 'review' ? 'active' : '')}>Review & Confirm</Link></li>
                    </ul>

                        :
                        <ul className="sidenav-menu">
                            <li><a className={(this.state.currentPage === 'funddetails' ? 'active' : '')}>Fund Details</a></li>
                            <li><a>Assign GP Delegates</a></li>
                            <li><a>Partnership Agreement</a></li>
                            <li><a>Assign LP's to Fund</a></li>
                            <li><a>Review & Confirm</a></li>
                        </ul>
                    }
                    

                    <div className="start-box"><i className="fa fa-check strtFndChk" aria-hidden="true"></i>&nbsp;Start Fund</div>

                    <div className="section-head">GP Delegates<span className="btn-add pull-right">+</span></div>
                    <div className="section">
                        <div className="gpDelDiv">
                            {this.state.getGpDelegatesList.length >0 ?
                            this.state.getGpDelegatesList.map((record, index)=>{
                                return(
                                <div className="gpDelegateInfo" key={index}>
                                <div className="dpDelImg">
                                {
                                    record['profilePic']  ?
                                    <img src={record['profilePic']} alt="user_image" className="user-image" />
                                        : <img src={userDefaultImage} alt="user_image" className="user-image" />
                                }
                                </div>
                                    <div className="dpDelName">{record['firstName']}</div>
                                    <div className="dpDelgDel"><i className="fa fa-minus"></i></div>
                                </div>
                                );
                            })
                            :
                            <div className="user">
                                <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                                <p>You haven’t added any GP Delegates to this fund yet</p>
                            </div> 
                            } 
                        </div>
                    </div>

                    <div className="section-head">LPs<span className="btn-add pull-right">+</span></div>
                    <div className="section">
                        <div className="gpDelDiv">
                            {this.state.getLpList.length >0 ?
                            this.state.getLpList.map((record, index)=>{
                                return(
                                <div className="gpDelegateInfo" key={index}>
                                <div className="dpDelImg">
                                {
                                    record['profilePic']  ?
                                    <img src={record['profilePic']} alt="user_image" className="user-image" />
                                        : <img src={userDefaultImage} alt="user_image" className="user-image" />
                                }
                                </div>
                                    <div className="dpDelName">{record['firstName']}</div>
                                    <div className="dpDelgDel"><i className="fa fa-minus"></i></div>
                                </div>
                                );
                            })
                            :
                            <div className="user">
                                <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                                <p>You haven’t added any LP’s to this fund yet</p>
                            </div>
                            } 
                        </div>
                    </div>

                </div>

                <div className="main">
                    <div>
                        <HeaderComponent ></HeaderComponent>
                    </div>
                    <div className="contentWidth">
                        <div className="main-heading"><span className="main-title">Create New Fund</span><a href="/dashboard" className="cancel-fund">Cancel</a></div>
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
            </div>
        );
    }
}

export default CreateFundComponent;

