
import React, { Component } from 'react';
import './createfund.component.css';
import { Col, Row } from 'react-bootstrap';
// import userDefaultImage from '../../images/default_user.png';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from '../../services/fsnetauth';
import { Route } from "react-router-dom";
import Step1Component from '../createfund/step1/step1.component';
import Step2Component from '../createfund/step2/step2.component';
import Step3Component from '../createfund/step3/step3.component';
import Step4Component from '../createfund/step4/step4.component';
import Step5Component from '../createfund/step5/step5.component';
import Step6Component from '../createfund/step6/step6.component';
import HeaderComponent from '../header/header.component';


class CreateFundComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.logout = this.logout.bind(this);
        this.state = {
            loggedInUserObj: []
        }

    }

    // proceedToBack() {
    //     let page = this.state.currentPage;
    //     if (this.state.currentPage <= this.state.totalPageCount + 1 && this.state.currentPage >= 0) {
    //         switch (page) {
    //             case 2:
    //                 this.setState({
    //                     showStep2Page: false,
    //                     showStep1Page: true,
    //                     currentPage: page - 1,
    //                 })
    //                 break;
    //             case 3:
    //                 this.setState({
    //                     showStep3Page: false,
    //                     showStep2Page: true,
    //                     currentPage: page - 1,
    //                 })
    //                 break;
    //             case 4:
    //                 this.setState({
    //                     showStep3Page: true,
    //                     showStep4Page: false,
    //                     currentPage: page - 1,
    //                 })
    //                 break;
    //             case 5:
    //                 this.setState({
    //                     showStep4Page: true,
    //                     showStep5Page: false,
    //                     currentPage: page - 1,
    //                 })
    //                 break;
    //             case 6:
    //                 this.setState({
    //                     showStep5Page: true,
    //                     showStep6Page: false,
    //                     currentPage: page - 1,
    //                 })
    //                 break;
    //             default:
    //             //Do nothing
    //         }
    //     }
    // }

    // proceedToNext() {
    //     let page = this.state.currentPage;
    //     if (this.state.currentPage <= this.state.totalPageCount) {
    //         switch (page) {
    //             case 1:
    //                 this.setState({
    //                     showStep2Page: true,
    //                     showStep1Page: false,
    //                     currentPage: page + 1,
    //                 })
    //                 break;
    //             case 2:
    //                 this.setState({
    //                     showStep3Page: true,
    //                     showStep2Page: false,
    //                     currentPage: page + 1,
    //                 })
    //                 break;
    //             case 3:
    //                 this.setState({
    //                     showStep4Page: true,
    //                     showStep3Page: false,
    //                     currentPage: page + 1,
    //                 })
    //                 break;
    //             case 4:
    //                 this.setState({
    //                     showStep5Page: true,
    //                     showStep4Page: false,
    //                     currentPage: page + 1,
    //                 })
    //                 break;
    //             case 5:
    //                 this.setState({
    //                     showStep6Page: true,
    //                     showStep5Page: false,
    //                     currentPage: page + 1,
    //                 })
    //                 break;
    //             default:
    //             //Do nothing
    //         }
    //     }


    // }

    logout() {
        reactLocalStorage.clear();
        this.props.history.push('/');
    }

    componentDidMount() {
        if (this.FsnetAuth.isAuthenticated()) {
            //Get user obj from local storage.
            let userObj = reactLocalStorage.getObject('userData');
            if (userObj) {
                this.setState({
                    loggedInUserObj: userObj
                })
            }
        } else {
            this.props.history.push('/');
        }
    }


    childData() {
        alert('jao');
    }
    
    render() {
        const {match} = this.props;
        return (
            <div className="wrapper" id="createFund">
                <div className="sidenav">
                    <h1><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; FSNET LOGO</h1>
                    <h2><i className="fa fa-home" aria-hidden="true"></i>&nbsp; <a href="/dashboard">Dashboard</a></h2>
                    <div className="active-item"><i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;Create New Fund <span className="fsbadge">1/5</span></div>
                    <ul className="sidenav-menu">
                        <li><a href="/createfund/step1">Fund Details</a></li>
                        <li><a href="/createfund/step2">Assign GP Delegates</a></li>
                        <li><a href="/createfund/step3">Upload Fund Documents</a></li>
                        <li><a href="/createfund/step4">View and Approve Form</a></li>
                        <li><a href="/createfund/step5">Asign LP's to Fund</a></li>
                        <li><a href="/createfund/step6">Review & Confirm</a></li>
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
                    <Col xs={6} md={12}>
                        <div className="main-heading"><span className="main-title">Create New Fund</span><a href="/dashboard" className="cancel-fund">Cancel</a></div>
                    </Col>
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
                        <Route exact path={`${match.url}/step2`} gpData={this.childData}  component={Step2Component} />
                        <Route exact path={`${match.url}/step3`} component={Step3Component} />
                        <Route exact path={`${match.url}/step4`} component={Step4Component} />
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
        );
    }
}

export default CreateFundComponent;

