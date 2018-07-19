
import React, { Component } from 'react';
import './createfund.component.css';
import { Row } from 'react-bootstrap';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from '../../services/fsnetauth';
import { Client } from '../../services/eventservice.component';
import { Route, Link } from "react-router-dom";
import Step1Component from '../createfund/step1/step1.component';
import Step2Component from '../createfund/step2/step2.component';
import Step3Component from '../createfund/step3/step3.component';
import Step5Component from '../createfund/step5/step5.component';
import Step6Component from '../createfund/step6/step6.component';
import HeaderComponent from '../header/header.component';
import {EventEmitter} from 'fbemitter';

class CreateFundComponent extends Component {
    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.addEvent = this.addEvent.bind(this);
        this.client = new Client();
        this.logout = this.logout.bind(this);
        this.state = {
            loggedInUserObj: [],
            currentPage: 'funddetails',
            currentPageNumber: 1,
            totalPageCount: 5,
            fundId: null
        }

    }

    logout() {
        reactLocalStorage.clear();
        this.props.history.push('/');
    }

    componentWillMount() {
        this.client.on('fundData', this.addEvent);
    }

    addEvent(data){
        console.log("fsgkl")
    }

    componentDidMount() {
        if (this.FsnetAuth.isAuthenticated()) {
            //Get user obj from local storage.
            let userObj = reactLocalStorage.getObject('userData');
            let url = window.location.href;
            let page = url.split('/createfund/');
            this.getCurrentPageNumber();
            if (userObj) {
                this.setState({
                    loggedInUserObj: userObj,
                    currentPage: page[1]
                })
            }
        } else {
            this.props.history.push('/');
        }
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
                    <ul className="sidenav-menu">
                        <li><Link to="/createfund/funddetails" onClick={(e) => this.getCurrentPageNumber('sideNav', 'funddetails')} className={(this.state.currentPage === 'funddetails' ? 'active' : '')}>Fund Details<span className="checkIcon"><i className="fa fa-check faChk" aria-hidden="true"></i></span></Link></li>
                        <li><Link to={"/createfund/gpDelegate/"+this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'gpDelegate')} className={(this.state.currentPage === 'gpDelegate' ? 'active' : '')}>Assign GP Delegates<span className="checkIcon"><i className="fa fa-check faChk" aria-hidden="true"></i></span></Link></li>
                        <li><Link to={"/createfund/upload/"+this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'upload')} className={(this.state.currentPage === 'upload' ? 'active' : '')}>Partnership Agreement<span className="checkIcon"><i className="fa fa-check faChk" aria-hidden="true"></i></span></Link></li>
                        <li><Link to={"/createfund/lp/"+this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'lp')} className={(this.state.currentPage === 'lp' ? 'active' : '')}>Assign LP's to Fund<span className="checkIcon"><i className="fa fa-check faChk" aria-hidden="true"></i></span></Link></li>
                        <li><Link to={"/createfund/review/"+this.state.fundId} onClick={(e) => this.getCurrentPageNumber('sideNav', 'review')} className={(this.state.currentPage === 'review' ? 'active' : '')}>Review & Confirm<span className="checkIcon"><i className="fa fa-check faChk" aria-hidden="true"></i></span></Link></li>
                    </ul>

                    <div className="start-box"><i className="fa fa-check strtFndChk" aria-hidden="true"></i>&nbsp;Start Fund</div>

                    <div className="section-head">GP Delegates<span className="btn-add pull-right">+</span></div>
                    <div className="section">
                        {/* <div className="user">
                            <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                            <p>You haven’t added any GP Delegates to this fund yet</p>
                        </div> */}
                        <div className="gpDelDiv">
                            <div className="gpDelegateInfo">
                                <div className="dpDelImg"><i className="fa fa-picture-o" aria-hidden="true"></i></div>
                                <div className="dpDelName">Ben Parker</div>
                                <div className="dpDelgDel"><i className="fa fa-minus"></i></div>
                            </div>
                            <div className="gpDelegateInfo">
                                <div className="dpDelImg"><i className="fa fa-picture-o" aria-hidden="true"></i></div>
                                <div className="dpDelName">Ben Parker</div>
                                <div className="dpDelgDel"><i className="fa fa-minus"></i></div>
                            </div>
                        </div>
                    </div>

                    <div className="section-head">LP's<span className="btn-add pull-right">+</span></div>
                    <div className="section">
                        {/* <div className="user">
                            <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                            <p>You haven’t added any LP’s to this fund yet</p>
                        </div> */}
                        <div className="gpDelDiv">
                            <div className="gpDelegateInfo">
                                <div className="dpDelImg"><i className="fa fa-picture-o" aria-hidden="true"></i></div>
                                <div className="dpDelName">Ben Parker</div>
                                <div className="dpDelgDel"><i className="fa fa-minus"></i></div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="main">
                    <HeaderComponent ></HeaderComponent>
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
                </div>
            </div>
        );
    }
}

export default CreateFundComponent;

