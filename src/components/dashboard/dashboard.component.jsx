
import React, { Component } from 'react';
import './dashboard.component.css';
import { FsnetAuth } from '../../services/fsnetauth';
import { Row, Col, FormControl, Button, Tabs, Tab, Checkbox as CBox } from 'react-bootstrap';
import userDefaultImage from '../../images/default_user.png';
import rightIcon from '../../images/success-icon.svg';
import { reactLocalStorage } from 'reactjs-localstorage';
import HeaderComponent from '../header/header.component'
// import { DateRange } from 'react-date-range';

class DashboardComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.hideAndShowFilters = this.hideAndShowFilters.bind(this);
        this.showActivityFeed = this.showActivityFeed.bind(this);
        this.state = {
            isHide: true,
            rowData: 0,
            filterState: 'Off'
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
        if(!isHideLocal) {
            this.setState({
                filterState: 'On'
            })
        } else {
            this.setState({
                filterState: 'Off'
            })
        }
        this.setState({
            isHide: isHideLocal,
        });
    }

    render() {
        return (
            <Row className="dashboardContainer" id="MainDashboard">
                <Row className="dashboardMainRow">
                    <Col lg={5} md={6} sm={6} xs={12}>
                        <Row>
                            <div className="fsnet-logo" onClick={this.redirectHome}>FSNET LOGO</div>    
                        </Row>
                    </Col>
                    <HeaderComponent ></HeaderComponent>
                </Row>
                <Row className="dashboardMainRow fund-container">
                    <div className="myFunds">Your Funds</div>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Col lg={6} md={6} sm={6} xs={12} className="display-filter display-filter-padding">
                            <span className="filter-icon"><i className="fa fa-filter" aria-hidden="true"></i></span>
                            <span className="filter-mode" onClick={this.hideAndShowFilters}>Filter ({this.state.filterState})<i className="fa fa-caret-down" aria-hidden="true"></i></span>
                            <span className="search-icon"><i className="fa fa-search" aria-hidden="true"></i></span>
                            <FormControl type="text" placeholder="Search Funds" className="formFilterControl" />
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12} className="display-filter">
                            <div className="filter-right-block">
                                <i className="fa fa-th-large thLarge" aria-hidden="true"></i>
                                <span className="view-mode">View (Card)<i className="fa fa-caret-down caretDown" aria-hidden="true"></i></span>
                                <Button className="newFundButton"><i class="fa fa-plus"></i><a href="/createfund">New Fund</a></Button>
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
                                            {/* <DateRange calendars="1"/> */}
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
                    {/* <Col lg={12} md={12} sm={12} xs={12}> */}
                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container">
                            {/* <div className={"fundBoxEdit " + (this.state.rowData === 0 ? 'show' : 'hidden')}> */}
                            <div className="fundBoxEdit">
                                <div className="fundImageEdit">
                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                    <div className="Fund-Name">The Pheonician Investment Fund</div>
                                    <i className="fa fa-bell-o bellO" onClick={this.showActivityFeed} aria-hidden="true"></i>
                                    <span className="notificationCount">11</span>
                                </div>
                                <div>
                                    <Button className="openEdit">Open</Button>
                                    <Button className="actionRequired">Action Required</Button>
                                </div>
                                <div>
                                    <span className="Fund-Start-Date">Fund Start Date <span className="text-style-1">:2/24/2018</span></span>
                                    <span className="Fund-End-Date">Fund End Date <span className="text-style-1">:2/24/2018</span></span>
                                </div>
                                <div className="Line"></div>
                                <div>
                                    <span className="Invited">24</span>
                                    <span className="Invited1">18</span>
                                    <span className="Invited2">8</span>
                                </div>
                                <div>
                                    <span className="labelInvited">Invited</span>
                                    <span className="labelClosedReady">Close-Ready</span>
                                    <span className="labelClosed">Closed</span>
                                </div>
                                <div className="Line"></div>
                                <span className="Hard-Cap-2000000">Hard Cap: $2,000,000,000</span>
                                <div className="progress-bar"><span className="progress progress-yellow"></span></div>
                                <span className="Dollars-Closed-17">Dollars Closed: <span className="text-style-1">$1,750,000,000</span></span>
                            </div>
                            {/* <div className={"fundBoxEdit " + (this.state.rowData === 1 ? 'show' : 'hidden')}>
                                
                                
                            </div> */}
                        </Col>
                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container">
                            <div className="fundBoxEdit">
                                <div className="fundImageEdit">
                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                    <div className="Fund-Name">The Pheonician Investment Fund1</div>
                                    <i className="fa fa-bell-o bellO" aria-hidden="true"></i>
                                    <span className="notificationCount">2</span>
                                </div>
                                <div>
                                    <Button className="closedReadyEdit"><img src={rightIcon} alt="closed"/>Closed-Ready</Button>

                                </div>
                                <div>
                                    <span className="Fund-Start-Date">Fund Start Date <span className="text-style-1">:3/15/2018</span></span>
                                    <span className="Fund-End-Date">Fund End Date <span className="text-style-1">:6/18/2018</span></span>
                                </div>
                                <div className="Line"></div>
                                <div>
                                    <span className="Invited">34</span>
                                    <span className="Invited1">24</span>
                                    <span className="Invited2">8</span>
                                </div>
                                <div>
                                    <span className="labelInvited">Invited</span>
                                    <span className="labelClosedReady">Close-Ready</span>
                                    <span className="labelClosed">Closed</span>
                                </div>
                                <div className="Line"></div>
                                <span className="Hard-Cap-2000000 hardCapDollar1">Hard Cap: $1,525,000,000</span>
                                <div className="progress-bar"><span className="progress progress-green"></span></div>
                                <span className="Dollars-Closed-17">Dollars Closed: <span className="text-style-1">$4,350,000,000</span></span>
                            </div>
                        </Col>
                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container">
                            <div className="fundBoxEdit">
                                <div className="fundImageEdit">
                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                    <div className="Fund-Name">The Pheonician Investment Fund2</div>
                                    <i className="fa fa-bell-o bellO" aria-hidden="true"></i>
                                    <span className="notificationCount">20</span>
                                </div>
                                <div>
                                    <Button className="openEdit open-Ready-Edit">Open-Ready</Button>
                                    <Button className="actionRequired">Action Required</Button>
                                </div>
                                <div>
                                    <span className="Fund-Start-Date">Fund Start Date <span className="text-style-1">:4/1/2018</span></span>
                                    <span className="Fund-End-Date">Fund End Date <span className="text-style-1">:12/31/2018</span></span>
                                </div>
                                <div className="Line"></div>
                                <div>
                                    <span className="Invited">56</span>
                                    <span className="Invited1">24</span>
                                    <span className="Invited2">6</span>
                                </div>
                                <div>
                                    <span className="labelInvited">Invited</span>
                                    <span className="labelClosedReady">Close-Ready</span>
                                    <span className="labelClosed">Closed</span>
                                </div>
                                <div className="Line"></div>
                                <span className="Hard-Cap-2000000 hardCapDollar2">Hard Cap: $2,000,000,000</span>
                                <div className="progress-bar"><span className="progress progress-red"></span></div>
                                <span className="Dollars-Closed-17">Dollars Closed: <span className="text-style-1">$1,750,000,000</span></span>
                            </div>
                        </Col>
                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container">
                            <div className="fundBoxEdit">
                                <div className="fundImageEdit">
                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                    <div className="Fund-Name">Spartan Alliance Capital Fund </div>
                                    <i className="fa fa-bell-o bellO" aria-hidden="true"></i>
                                    <span className="notificationCount">11</span>
                                </div>
                                <div>
                                    <Button className="closedEdit">Closed</Button>

                                </div>
                                <div>
                                    <span className="Fund-Start-Date">Fund Start Date <span className="text-style-1">:3/1/2018</span></span>
                                    <span className="Fund-End-Date">Fund End Date <span className="text-style-1">:6/15/2018</span></span>
                                </div>
                                <div className="Line"></div>
                                <div>
                                    <span className="Invited">18</span>
                                    <span className="Invited1">0</span>
                                    <span className="Invited2">18</span>
                                </div>
                                <div>
                                    <span className="labelInvited">Invited</span>
                                    <span className="labelClosedReady">Close-Ready</span>
                                    <span className="labelClosed">Closed</span>
                                </div>
                                <div className="Line"></div>
                                <span className="Hard-Cap-2000000 hardCapDollar3">Hard Cap: $1,200,000,000</span>
                                <div className="progress-bar"><span className="progress progress-green"></span></div>
                                <span className="Dollars-Closed-17">Dollars Closed: <span className="text-style-1">$1,750,000,000</span></span>
                            </div>
                        </Col>
                        {/* <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container">
                            <div className="fundBoxEdit fundBoxEditHelios">
                                <div className="fundImageEdit heliosFundBox">
                                    <div className="heliosFundColumn">
                                    <i className="fa fa-bell-o speaker-fund-Picture" aria-hidden="true"></i>
                                    <label className="helios-Fund-Name">Helios Fund</label>
                                    <i className="fa fa-bell-o closeIcon" aria-hidden="true"></i>
                                    </div>
                                    <h4 className="activityFeed">Activity Feed</h4>
                                </div>
                                <div className="ellenSmithensonLp">
                                <i className="fa fa-bell-o ellenIcon" aria-hidden="true"></i>
                                    <div className="Ellen-Smithenson-LP"><label className="Ellen-Smithenson-LP-Font">Ellen Smithenson (LP)  </label> 
                                         has accepted the invite to the fund.</div>
                                        <span className="timeDate">6/19 - 11:01 AM</span>

                                </div>
                                <div className="ellenSmithensonLp">
                                <i className="fa fa-bell-o ellenIcon" aria-hidden="true"></i>
                                    <div className="Ellen-Smithenson-LP"><label className="Ellen-Smithenson-LP-Font">Sarah Douglas (LP) </label>
                                      has signed subscription document.</div>
                                        <span className="timeDate">6/18 - 3:12 PM</span>
                                </div>
                                <div className="ellenSmithensonLp benParker">
                                <i className="fa fa-bell-o ellenIcon" aria-hidden="true"></i>
                                    <div className="Ellen-Smithenson-LP"><label className="Ellen-Smithenson-LP-Font">Ben Parker (GP) </label>
                                     has amended fund.</div>
                                        <span className="timeDate">6/19 - 11:01 AM</span>
                                </div>
                                
                            </div>
                        </Col> */}
                    {/* </Col> */}
                </Row>
            </Row>
        );
    }
}

export default DashboardComponent;

