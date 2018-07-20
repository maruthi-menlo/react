
import React, { Component } from 'react';
import './dashboard.component.css';
import { FsnetAuth } from '../../services/fsnetauth';
import { Row, Col, FormControl, Button } from 'react-bootstrap';
import userDefaultImage from '../../images/default_user.png';
import { reactLocalStorage } from 'reactjs-localstorage';
import HeaderComponent from '../header/header.component';
import {Fsnethttp} from '../../services/fsnethttp';
import {Constants} from '../../constants/constants';
import Loader from '../../widgets/loader/loader.component';

// import { DateRange } from 'react-date-range';

class DashboardComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.showActivityFeed = this.showActivityFeed.bind(this);
        this.searchInputChangeEvent = this.searchInputChangeEvent.bind(this);
        this.navigateToCreateFund = this.navigateToCreateFund.bind(this);
        this.state = {
            isHide: true,
            rowData: 0,
            filterState: 'Off',
            allFundsList: [],
            noFundsMessage: 'You haven’t created any funds yet.'
        }
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    showActivityFeed() {
        this.setState({
            rowData: 1
        })
    }

    navigateToCreateFund() {
        this.props.history.push('/createfund/funddetails');
    }

    searchInputChangeEvent(e) {
        let value = e.target.value;
        if(value != '') {
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            this.Fsnethttp.getSearchFunds(headers, value).then(result=>{
                if(result.data && result.data.data.length >0) {
                    this.setState({
                        allFundsList: result.data.data
                    })
                }else {
                    this.setState({
                        allFundsList: [],
                        noFundsMessage: 'There are no funds with the given search name.'
                    })
                }
            })
            .catch(error=>{
                console.log(error)
            });
        }else {
            this.getFunds()
        }
    }

    // Get current loggedin user details
    //If token is undefined then redirect to login page 
    componentDidMount() {
        if(this.FsnetAuth.isAuthenticated()){
            //Get user obj from local storage.
            let userObj = reactLocalStorage.getObject('userData');
            if(userObj) {
                this.getFunds();
                this.setState({
                    loggedInUserObj: userObj
                }) 
            }
        }else{
           this.props.history.push('/');
        }        
    }

    //Get list of funds
    getFunds() {
        this.open();
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        this.Fsnethttp.getListOfAllFunds(headers).then(result=>{
            this.close();
            if(result.data && result.data.data.length >0) {
                this.setState({
                    allFundsList: result.data.data,
                })
            } else {
                this.setState({
                    allFundsList: [],
                })
            }
        })
        .catch(error=>{
            this.close();
            this.setState({
                allFundsList: []
            })
        });

    }

    render() {
        return (
            <Row className="dashboardContainer" id="MainDashboard">
                <Row className="dashboardMainRow">
                    <Col lg={5} md={6} sm={6} xs={12}>
                        <Row>
                            <div className="fsnet-logo">FSNET LOGO</div>    
                        </Row>
                    </Col>
                    <HeaderComponent ></HeaderComponent>
                </Row>
                <Row className="dashboardMainRow fund-container">
                    <div className="myFunds">Your Funds</div>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Col lg={6} md={6} sm={6} xs={12} className="display-filter display-filter-padding display-left-filter">
                            <span className="search-icon"><i className="fa fa-search" aria-hidden="true"></i></span>
                            <FormControl type="text" placeholder="Search Funds" className="formFilterControl" onChange={(e) => this.searchInputChangeEvent(e)}/>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12} className="display-filter filter-right display-right-filter">
                            <div className="filter-right-block">
                                <Button className="newFundButton" onClick={this.navigateToCreateFund}><i className="fa fa-plus"></i>New Fund</Button>
                            </div>
                        </Col>
                    </Col>
                        
                        {this.state.allFundsList.length >0 ?
                            this.state.allFundsList.map((record, index)=>{
                                return(
                                    <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container" key={index}>
                                    <div className="fundBoxEdit">
                                        <div className="fundImageEdit">
                                            <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                            <div className="Fund-Name">The Pheonician Investment Fund</div>
                                            <i className="fa fa-bell-o bellO" onClick={this.showActivityFeed} aria-hidden="true"></i>
                                            {/* <span className="notificationCount">11</span> */}
                                            <div className="invitedDivStyle">10 Invited</div>
                                        </div>
                                        <div className="actnRqStyle">
                                            <Button className="actionRequired">Action Required</Button>
                                        </div>
                                        <div className="Line"></div>
                                        <div>
                                            <span className="Invited">24</span>
                                            <span className="Invited1">18</span>
                                            <span className="Invited2">8</span>
                                        </div>
                                        <div>
                                            <span className="labelInvited">In Progress</span>
                                            <span className="labelClosedReady">Close-Ready</span>
                                            <span className="labelClosed">Closed</span>
                                        </div>
                                        <div className="priceDivAlign">
                                            <span className="labelInvitedPrice">$ 3.1 M</span>
                                            <span className="labelClosedReadyPrice">$ 5.4 M</span>
                                            <span className="labelClosedPrice">$ 1.2 M</span>
                                        </div>
                                        <div className="Line"></div>
                                        <div className="pull-right bold width37 tPriceStyle">T: $7.5M</div>
                                        <div className="caretDownAlign"><i className="fa fa-caret-down"></i></div>
                                        <div className="progress-bar">
                                            <div className="progress progress-pink"></div>
                                            <div className="progress progress-yellow"></div>
                                            <div className="progress progress-green"></div>
                                            <div className="progress progress-white"></div>
                                        </div>
                                        <div className="caretUpAlign"><i className="fa fa-caret-up"></i></div>
                                        <div className="pull-right bold hcPriceStyle">HC: $10M</div>
                                    </div>
                                </Col>
                                );
                            })
                            :
                            <Col lg={12} md={12} sm={12} xs={12}>
                            <div className="title margin20 text-center marginTop50">{this.state.noFundsMessage}</div>
                            </Col>
                        }
                </Row>
                <Loader isShow={this.state.showModal}></Loader>
            </Row>
        );
    }
}

export default DashboardComponent;

