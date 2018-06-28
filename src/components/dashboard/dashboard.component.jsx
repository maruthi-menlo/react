
import React, { Component } from 'react';
import './dashboard.component.css';
import { FsnetAuth } from'../../services/fsnetauth';
import { Row, Col, FormControl } from 'react-bootstrap';

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
                            
                        </Row>
                    </Col>
                </Row>
                <Row className="dashboardMainRow fund-container"> 
                    <div className="myFunds">Your Funds</div>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <img src="" alt="filter" className="dashboard-filter"/>
                        <span className="filter-mode">Filter (Off)</span>
                        <FormControl type="text" placeholder="Search Funds" className="formFilterControl"/>
                    </Col>
                </Row>
            </Row>
        );
    }
}

export default DashboardComponent;

