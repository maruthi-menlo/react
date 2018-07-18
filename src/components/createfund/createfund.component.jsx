
import React, { Component } from 'react';
import './createfund.component.css';
import { Col, Row } from 'react-bootstrap';
// import userDefaultImage from '../../images/default_user.png';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from '../../services/fsnetauth';
import { Route, Link } from "react-router-dom";
import Step1Component from '../createfund/step1/step1.component';
import Step2Component from '../createfund/step2/step2.component';
import Step3Component from '../createfund/step3/step3.component';
import Step5Component from '../createfund/step5/step5.component';
import Step6Component from '../createfund/step6/step6.component';
import HeaderComponent from '../header/header.component';


class CreateFundComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.logout = this.logout.bind(this);
        this.state = {
            loggedInUserObj: [],
            currentPage: 'step1',
            currentPageNumber: 1,
            totalPageCount: 5
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
        if(type === 'sideNav') {
            page = fundPage
        } else {
            let url = window.location.href;
            page = url.split('/createfund/')[1];
        }
        let number;
        if(page === 'step1') {
            number = 1;
        }else if(page === 'step2') {
            number = 2;
        }else if(page === 'step3') {
            number = 3;
        }else if(page === 'step5') {
            number = 4;
        }else if(page === 'step6') {
            number = 5;
        }
        this.setState({
            currentPageNumber: number,
            currentPage: page
        })
    }
    
    render() {
        const {match} = this.props;
        return (
            <div className="wrapper" id="createFund">
                <div className="sidenav">
                    <h1><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; FSNET LOGO</h1>
                    <h2><i className="fa fa-home" aria-hidden="true"></i>&nbsp; <a href="/dashboard">Dashboard</a></h2>
                    <div className="active-item"><i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;Create New Fund <span className="fsbadge">{this.state.currentPageNumber}/{this.state.totalPageCount}</span></div>
                    <ul className="sidenav-menu">
                        <li><Link to="/createfund/step1" onClick={(e) => this.getCurrentPageNumber('sideNav','step1')} className={(this.state.currentPage === 'step1' ? 'active' : '') }>Fund Details<span className="checkIcon"><i className="fa fa-check" aria-hidden="true"></i></span></Link></li>
                        <li><Link to="/createfund/step2" onClick={(e) => this.getCurrentPageNumber('sideNav','step2')} className={(this.state.currentPage === 'step2' ? 'active' : '') }>Assign GP Delegates<span className="checkIcon"><i className="fa fa-check" aria-hidden="true"></i></span></Link></li>
                        <li><Link to="/createfund/step3" onClick={(e) => this.getCurrentPageNumber('sideNav','step3')} className={(this.state.currentPage === 'step3' ? 'active' : '') }>Partnership Agreement<span className="checkIcon"><i className="fa fa-check" aria-hidden="true"></i></span></Link></li>
                        <li><Link to="/createfund/step5" onClick={(e) => this.getCurrentPageNumber('sideNav','step5')} className={(this.state.currentPage === 'step5' ? 'active' : '') }>Assign LP's to Fund<span className="checkIcon"><i className="fa fa-check" aria-hidden="true"></i></span></Link></li>
                        <li><Link to="/createfund/step6" onClick={(e) => this.getCurrentPageNumber('sideNav','step6')} className={(this.state.currentPage === 'step6' ? 'active' : '') }>Review & Confirm<span className="checkIcon"><i className="fa fa-check" aria-hidden="true"></i></span></Link></li>
                    </ul>

                    <div className="start-box"><i className="fa fa-check" aria-hidden="true"></i>&nbsp;Start Fund</div>

                    <div className="section-head">GP Delegates<span className="btn-add pull-right">+</span></div>
                    <div className="section">
                        <div className="user">
                            <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                            <p>You haven’t added any GP Delegates to this fund yet</p>
                        </div>
                    </div>

                    <div className="section-head">LP's<span className="btn-add pull-right">+</span></div>
                    <div className="section">
                        <div className="user">
                            <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                            <p>You haven’t added any LP’s to this fund yet</p>
                        </div>
                    </div>

                </div>

                <div className="main">
                    <HeaderComponent ></HeaderComponent>
                    <div className="contentWidth">
                        <div className="main-heading"><span className="main-title">Create New Fund</span><a href="/dashboard" className="cancel-fund">Cancel</a></div>
                    {/* <div hidden={!this.state.showStep1Page}>
                        <Step1Component></Step1Component>
                    </div>
                    <div hidden={!this.state.showStep2Page}>
                        <Step2Component></Step2Component>
                    </div>
                    <div hidden={!this.state.showStep3Page}>
                        <Step3Component></Step3Component>
                    </div>
                    <div hidden={!this.state.showStep4Page}>
                        <Step4Component></Step4Component>
                    </div>
                    <div hidden={!this.state.showStep5Page}>
                        <Step5Component></Step5Component>
                    </div>
                    <div hidden={!this.state.showStep6Page}>
                        <Step6Component></Step6Component>
                    </div> */}
                    <Row className="main-content">
                        <Route exact path={`${match.url}/step1`} component={Step1Component} />
                        <Route exact path={`${match.url}/step2`} component={Step2Component} />
                        <Route exact path={`${match.url}/step3`} component={Step3Component} />
                        <Route exact path={`${match.url}/step5`} component={Step5Component} />
                        <Route exact path={`${match.url}/step6`} component={Step6Component} />
                    
                    </Row>

                    {/* <Col xs={6} md={12}>
                        <div className="footer-nav">
                            <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                            <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                        </div>
                    </Col> */}

                    {/* </Grid> */}
                </div>
            </div>
            </div>
        );
    }
}

export default CreateFundComponent;

