
import React, { Component } from 'react';
import './dashboard.component.css';
import { FsnetAuth } from'../../services/fsnetauth';
import { Row, Col, FormControl,Button } from 'react-bootstrap';
import userDefaultImage from '../../images/default_user.png';

class DashboardComponent extends Component{

    constructor(props){
        super(props);
        this.FsnetAuth = new FsnetAuth();
    }

    // Get current loggedin user details
    //If token is undefined then redirect to login page 
    componentDidMount() {
        if(this.FsnetAuth.isAuthenticated()){
            //Get user obj from local storage.
        }else{
            //this.props.history.push('/');
        }        
    }

    render(){
        return(
            <Row className="dashboardContainer">
                <Row className="dashboardMainRow">
                    <Col lg={6} md={6} sm={6} xs={12}>
                        <Row>
                            <div className="fsnet-logo">FSNET LOGO</div>    
                        </Row>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12}>
                        <Row>
                            <div className="John-Appleseed">John Appleseed</div>
                            <img src="" alt="arrow-down" className="ArrowDownBounding-Box"/>
                            <img src={userDefaultImage} alt="profilePic" className="profilePic"/>
                            <img src="" alt="bellicon" className="notificationsBell"/>
                            <img src="" alt="icon" className="overFlowIcon"/>
                        </Row>
                    </Col>
                </Row>
                <Row className="dashboardMainRow fund-container"> 
                    <div className="myFunds">Your Funds</div>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <img src="" alt="filter" className="dashboard-filter"/>
                        <span className="filter-mode">Filter (Off)</span>
                        <FormControl type="text" placeholder="Search Funds" className="formFilterControl"/>
                        <img src="" alt="grid" className="gridIcon"/>
                        <span className="view-mode">View (Card)</span>
                        <Button className="newFundButton">New Fund</Button>
                    </Col>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <Col lg={4} md={4} sm={6} xs={12}>
                            <div className="fundBoxEdit">
                                <div className="fundImageEdit">
                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image"/>
                                    <p className="Fund-Name">The Pheonician Investment Fund</p>
                                    <img src={userDefaultImage} alt="fund_image" className="Bounding-Box"/>
                                    <span className="notificationCount">11</span>
                                </div>
                                <div>
                                <Button className="openEdit">Open</Button>
                                <Button className="actionRequired">Closed Already</Button>
                                </div>
                                <div>
                                    <label className="Fund-Start-Date">Fund Start Date: <span className="text-style-1">2/24/2018</span></label>
                                    <label className="Fund-End-Date">Fund Start Date: <span className="text-style-1">2/24/2018</span></label>
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

