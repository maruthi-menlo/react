
import React, { Component } from 'react';
import './createfund.component.css';
import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import userDefaultImage from '../../images/default_user.png';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from '../../services/fsnetauth';
import Step1Component from '../createfund/step1/step1.component';
import Step2Component from '../createfund/step2/step2.component';
import Step3Component from '../createfund/step3/step3.component';
import Step4Component from '../createfund/step4/step4.component';
import Step5Component from '../createfund/step5/step5.component';
import HeaderComponent from '../header/header.component';


class CreateFundComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.logout = this.logout.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.state = {
            loggedInUserObj: [],
            showStep1Page : true,
            showStep2Page : false,
            showStep3Page : false,
            showStep4Page : false,
            showStep5Page : false,
            currentPage: 1,
            totalPageCount: 4,
        }

    }

    proceedToBack() {
        let page = this.state.currentPage;
        if(this.state.currentPage <= this.state.totalPageCount+1 && this.state.currentPage >=0) {
            console.log(this.state.currentPage);
            switch(page) {
                case 2:
                    this.setState({
                        showStep2Page : false,
                        showStep1Page : true,
                        currentPage: page-1,
                    })
                    break;
                case 3:
                    this.setState({
                        showStep3Page : false,
                        showStep2Page : true,
                        currentPage: page-1,
                    })
                    break;
                case 4:
                    this.setState({
                        showStep3Page : true,
                        showStep4Page : false,
                        currentPage: page-1,
                    })
                    break;
                case 5:
                    this.setState({
                        showStep4Page : true,
                        showStep5Page : false,
                        currentPage: page-1,
                    })
                    break;
                default:
                    //Do nothing
            }
        }
    }

    proceedToNext() {
        let page = this.state.currentPage;
        if(this.state.currentPage <= this.state.totalPageCount) {
            console.log(this.state.currentPage);
            switch(page) {
                case 1:
                    this.setState({
                        showStep2Page : true,
                        showStep1Page : false,
                        currentPage: page+1,
                    })
                    break;
                case 2:
                    this.setState({
                        showStep3Page : true,
                        showStep2Page : false,
                        currentPage: page+1,
                    })
                    break;
                case 3:
                    this.setState({
                        showStep4Page : true,
                        showStep3Page : false,
                        currentPage: page+1,
                    })
                    break;
                case 4:
                    this.setState({
                        showStep5Page : true,
                        showStep4Page : false,
                        currentPage: page+1,
                    })
                    break;
                default:
                    //Do nothing
            }
        }

        
    }

    logout() {
        reactLocalStorage.clear();
        this.props.history.push('/');
    }

    componentDidMount() {
        if(this.FsnetAuth.isAuthenticated()){
            //Get user obj from local storage.
            let userObj = reactLocalStorage.getObject('userData');
            if(userObj) {
                this.setState({
                    loggedInUserObj: userObj
                }) 
            }
        }else{
            this.props.history.push('/');
        }        
    }

    render() {
        return (
            <div className="wrapper" id="createFund">
                <div className="sidenav">
                    <h1><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; FSNET LOGO</h1>
                    <h2><i className="fa fa-home" aria-hidden="true"></i>&nbsp; Dashboard</h2>
                    <div className="active-item"><i className="fa fa-picture-o" aria-hidden="true"></i>&nbsp;Create New Fund <span className="fsbadge">1/5</span></div>
                    <ul className="sidenav-menu">
                        <li><a href="#about">Fund Details</a></li>
                        <li><a href="#services">Assign GP Delegates</a></li>
                        <li><a href="#clients">Upload Fund Documents</a></li>
                        <li><a href="#contact">View and Approve Form</a></li>
                        <li><a href="#clients">Asign LP's to Fund</a></li>
                        <li><a href="#contact">Review & Confirm</a></li>
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

                    {/* <Grid fluid="true"> */}
                    {/* <Col xs={6} md={12}>
                        <Row className="header-right-row">
                            <span className="logout" onClick={this.logout}>Logout </span>
                            <div className="user-name">{this.state.loggedInUserObj.firstName}{this.state.loggedInUserObj.lastName} <i className="fa fa-caret-down" aria-hidden="true"></i></div>
                            <img src={userDefaultImage} alt="profilePic" className="profilePic" />
                            <i className="fa fa-bell-o notification-icon" aria-hidden="true"></i>
                            <span className="notification-count">3</span>
                            <i className="fa fa-ellipsis-h ellipsisH" aria-hidden="true"></i>
                        </Row>
                    </Col> */}
                    <HeaderComponent ></HeaderComponent>
                    <div hidden={!this.state.showStep1Page}>
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
                    <Col xs={6} md={12}>
                        <div className="footer-nav">
                            <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                            <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                        </div>
                    </Col>

                    {/* </Grid> */}
                </div>
            </div>
        );
    }
}

export default CreateFundComponent;

