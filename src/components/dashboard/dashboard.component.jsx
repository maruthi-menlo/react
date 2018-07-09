
import React, { Component } from 'react';
import './dashboard.component.css';
import { FsnetAuth } from '../../services/fsnetauth';
import { Row, Col, FormControl, Button, Tabs, Tab, Checkbox as CBox } from 'react-bootstrap';
import userDefaultImage from '../../images/default_user.png';
import { reactLocalStorage } from 'reactjs-localstorage';
import HeaderComponent from '../header/header.component'

class DashboardComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.hideAndShowFilters = this.hideAndShowFilters.bind(this);
        this.showActivityFeed = this.showActivityFeed.bind(this);
        this.state = {
            isHide: true,
            rowData: 0
        }
    }
    showActivityFeed() {
        this.setState({
            rowData: 1
        })
    }

    // Get current loggedin user details
    //If token is undefined then redirect to login page 
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

    //To show and hide filters
    hideAndShowFilters() {
        let isHideLocal = !(this.state.isHide);
        this.setState({
            isHide: isHideLocal,
        });
    }

    render() {
        return (
            <Row className="dashboardContainer" id="MainDashboard">
                <HeaderComponent ></HeaderComponent>
                <Row className="dashboardMainRow fund-container">
                    <div className="myFunds">Your Funds</div>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Col lg={6} md={6} sm={6} xs={12} className="display-filter">
                            <span className="filter-icon"><i className="fa fa-filter" aria-hidden="true"></i></span>
                            <span className="filter-mode" onClick={this.hideAndShowFilters}>Filter (Off)<i className="fa fa-caret-down" aria-hidden="true"></i></span>
                            <span className="search-icon"><i className="fa fa-search" aria-hidden="true"></i></span>
                            <FormControl type="text" placeholder="Search Funds" className="formFilterControl" />
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12} className="display-filter">
                            <div className="filter-right-block">
                                <i className="fa fa-th-large thLarge" aria-hidden="true"></i>
                                <span className="view-mode">View (Card)<i className="fa fa-caret-down caretDown" aria-hidden="true"></i></span>
                                <Button className="newFundButton"><a href="/createfund">New Fund</a></Button>
                            </div>
                        </Col>
                    </Col>
                    <Row className="rowFilters" hidden={this.state.isHide}>
                        <Col lg={6} md={6} sm={12} xs={12} className="filtersHolder colEmpty">
                            <div className="filters">
                                <Tabs defaultActiveKey={0} id="fsnet-tabs">
                                    <Tab eventKey={0} title="Date Range">
                                        <div className="borderDateRange"></div>
                                        <div className="fundStartContainer">
                                            <label className="fsDate">Fund Start Date</label>
                                            <FormControl type="text" placeholder="12/12/2017" className="drfStartDate" />
                                            <label className="fsDate">Fund End Date</label>
                                            <FormControl type="text" placeholder="12/12/2017" className="drfStartDate drfEndDate" />
                                            <Button className="btnClearAll">Clear All</Button>
                                            <Button className="btnSave">Save</Button>
                                        </div>
                                    </Tab>
                                    <Tab eventKey={1} title="Status">
                                        <div className="borderStatusRange"></div>
                                        <div className="checkBoxContainer">
                                            <Row className="marginBottomCheckBox">
                                                <Col lg={6} md={6} sm={6} xs={6}>
                                                    <CBox className="checkBoxLogo">Closed</CBox>
                                                </Col>
                                                <Col lg={6} md={6} sm={6} xs={6}>
                                                    <CBox className="checkBoxLogo">Closed-Final </CBox>
                                                </Col>
                                            </Row>
                                            <Row className="marginBottomCheckBox">
                                                <Col lg={6} md={6} sm={6} xs={6}>
                                                    <CBox className="checkBoxLogo">Closed-Ready</CBox>
                                                </Col>
                                                <Col lg={6} md={6} sm={6} xs={6}>
                                                    <CBox className="checkBoxLogo">Open</CBox>
                                                </Col>
                                            </Row>
                                            <Row className="marginBottomCheckBox">
                                                <Col lg={6} md={6} sm={6} xs={6}>
                                                    <CBox className="checkBoxLogo">Open-Ready</CBox>
                                                </Col>
                                                <Col lg={6} md={6} sm={6} xs={6}>
                                                    <CBox className="checkBoxLogo">New-Draft</CBox>
                                                </Col>
                                            </Row>
                                        </div>
                                        <Button className="btnClearAll btnClearAllStatus">Clear All</Button>
                                        <Button className="btnSave">Save</Button>
                                    </Tab>
                                </Tabs>
                            </div>
                        </Col>
                        <Col lg={6} md={6} className="colEmpty">
                        </Col>
                    </Row>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container">
                            {/* <div className={"fundBoxEdit " + (this.state.rowData === 0 ? 'show' : 'hidden')}> */}
                            <div className="fundBoxEdit">
                                <div className="fundImageEdit">
                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                    <p className="Fund-Name">The Pheonician Investment Fund1</p>
                                    <i className="fa fa-bell-o bellO" onClick={this.showActivityFeed} aria-hidden="true"></i>
                                    <span className="notificationCount">11</span>
                                </div>
                                <div>
                                    <Button className="openEdit">Open</Button>
                                    <Button className="actionRequired">Action Required</Button>
                                </div>
                                <div>
                                    <label className="Fund-Start-Date">Fund Start Date <span className="text-style-1">:2/24/2018</span></label>
                                    <label className="Fund-End-Date">Fund End Date <span className="text-style-1">:2/24/2018</span></label>
                                </div>
                                <div className="Line"></div>
                                <div>
                                    <label className="Invited">24</label>
                                    <label className="Invited1">18</label>
                                    <label className="Invited2">8</label>
                                </div>
                                <div>
                                    <label className="labelInvited">Invited</label>
                                    <label className="labelClosedReady">Close-Ready</label>
                                    <label className="labelClosed">Closed</label>
                                </div>
                                <div className="Line"></div>
                                <label className="Hard-Cap-2000000">Hard Cap: $2,000,000,000</label>
                                <div className="progress-bar"><span className="progress"></span></div>
                                <label className="Dollars-Closed-17">Dollars Closed: <span className="text-style-1">$1,750,000,000</span></label>
                            </div>
                            {/* <div className={"fundBoxEdit " + (this.state.rowData === 1 ? 'show' : 'hidden')}>
                                
                                
                            </div> */}
                        </Col>
                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container">
                            <div className="fundBoxEdit">
                                <div className="fundImageEdit">
                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                    <p className="Fund-Name">The Pheonician Investment Fund</p>
                                    <i className="fa fa-bell-o bellO" aria-hidden="true"></i>
                                    <span className="notificationCount">11</span>
                                </div>
                                <div>
                                    <Button className="closedReadyEdit">Closed-Ready</Button>

                                </div>
                                <div>
                                    <label className="Fund-Start-Date">Fund Start Date <span className="text-style-1">:2/24/2018</span></label>
                                    <label className="Fund-End-Date">Fund End Date <span className="text-style-1">:2/24/2018</span></label>
                                </div>
                                <div className="Line"></div>
                                <div>
                                    <label className="Invited">24</label>
                                    <label className="Invited1">18</label>
                                    <label className="Invited2">8</label>
                                </div>
                                <div>
                                    <label className="labelInvited">Invited</label>
                                    <label className="labelClosedReady">Close-Ready</label>
                                    <label className="labelClosed">Closed</label>
                                </div>
                                <div className="Line"></div>
                                <label className="Hard-Cap-2000000">Hard Cap: $2,000,000,000</label>
                                <div className="progress-bar"><span className="progress"></span></div>
                                <label className="Dollars-Closed-17">Dollars Closed: <span className="text-style-1">$1,750,000,000</span></label>
                            </div>
                        </Col>
                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container">
                            <div className="fundBoxEdit">
                                <div className="fundImageEdit">
                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                    <p className="Fund-Name">The Pheonician Investment Fund</p>
                                    <i className="fa fa-bell-o bellO" aria-hidden="true"></i>
                                    <span className="notificationCount">11</span>
                                </div>
                                <div>
                                    <Button className="openEdit open-Ready-Edit">Open-Ready</Button>
                                    <Button className="actionRequired">Closed Ready</Button>
                                </div>
                                <div>
                                    <label className="Fund-Start-Date">Fund Start Date <span className="text-style-1">:2/24/2018</span></label>
                                    <label className="Fund-End-Date">Fund End Date <span className="text-style-1">:2/24/2018</span></label>
                                </div>
                                <div className="Line"></div>
                                <div>
                                    <label className="Invited">24</label>
                                    <label className="Invited1">18</label>
                                    <label className="Invited2">8</label>
                                </div>
                                <div>
                                    <label className="labelInvited">Invited</label>
                                    <label className="labelClosedReady">Close-Ready</label>
                                    <label className="labelClosed">Closed</label>
                                </div>
                                <div className="Line"></div>
                                <label className="Hard-Cap-2000000">Hard Cap: $2,000,000,000</label>
                                <div className="progress-bar"><span className="progress"></span></div>
                                <label className="Dollars-Closed-17">Dollars Closed: <span className="text-style-1">$1,750,000,000</span></label>
                            </div>
                        </Col>
                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container">
                            <div className="fundBoxEdit">
                                <div className="fundImageEdit">
                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                    <p className="Fund-Name">The Pheonician Investment Fund</p>
                                    <i className="fa fa-bell-o bellO" aria-hidden="true"></i>
                                    <span className="notificationCount">11</span>
                                </div>
                                <div>
                                    <Button className="closedEdit">Closed</Button>

                                </div>
                                <div>
                                    <label className="Fund-Start-Date">Fund Start Date <span className="text-style-1">:2/24/2018</span></label>
                                    <label className="Fund-End-Date">Fund End Date <span className="text-style-1">:2/24/2018</span></label>
                                </div>
                                <div className="Line"></div>
                                <div>
                                    <label className="Invited">24</label>
                                    <label className="Invited1">18</label>
                                    <label className="Invited2">8</label>
                                </div>
                                <div>
                                    <label className="labelInvited">Invited</label>
                                    <label className="labelClosedReady">Close-Ready</label>
                                    <label className="labelClosed">Closed</label>
                                </div>
                                <div className="Line"></div>
                                <label className="Hard-Cap-2000000">Hard Cap: $2,000,000,000</label>
                                <div className="progress-bar"><span className="progress"></span></div>
                                <label className="Dollars-Closed-17">Dollars Closed: <span className="text-style-1">$1,750,000,000</span></label>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Row>
        );
    }
}

export default DashboardComponent;

