import React, { Component } from 'react';
import './sidebar.component.css';
import { Row,Col} from 'react-bootstrap';
import { Link } from "react-router-dom";

class SidebarComponent extends Component{

    constructor(props){
        super(props);
        this.closeAlertModal = this.closeAlertModal.bind(this);
    }

    closeAlertModal() {
        this.props.toggleClose();
    }

    render(){
        return(
            <div>
                <div className={"notificationOverlay "+(this.props.visible ? 'show' : 'hide')}>
                </div>
                <Row className={"notificationContainer "+(this.props.visible ? 'show' : 'hide')}> 
                    <Row className="header">
                        <Col xs={10} sm={10} md={10} className="title">
                            Alerts
                        </Col>
                        <Col xs={2} sm={2} md={2} className="title closeAlert" onClick={this.closeAlertModal}>
                            X
                        </Col>
                        <div className="dismissAll">Dismiss All</div>
                    </Row>
                    <Row className="alerts-section">
                        <Row className="alert-row">
                            <Col xs={2} sm={2} md={2}>
                                    Img
                            </Col>
                            <Col xs={10} sm={10} md={10}>
                                <div className="alert-text">
                                    Jared Felugo (LP) accepted and joined <Link to="/dashboard">The Pheonician Investment Fund.</Link>
                                </div>
                                <div className="date">6/19 - 11:01 AM<span className="dismiss">X</span></div>
                                
                            </Col>
                        </Row>
                        <Row className="alert-row">
                            <Col xs={2} sm={2} md={2}>
                                    Img
                            </Col>
                            <Col xs={10} sm={10} md={10}>
                                <div className="alert-text">
                                    Jared Felugo (LP) accepted and joined <Link to="/dashboard">The Pheonician Investment Fund.</Link>
                                </div>
                                <div className="date">6/19 - 11:01 AM<span className="dismiss">X</span></div>
                                
                            </Col>
                        </Row>
                        <Row className="alert-row">
                            <Col xs={2} sm={2} md={2}>
                                    Img
                            </Col>
                            <Col xs={10} sm={10} md={10}>
                                <div className="alert-text">
                                    Jared Felugo (LP) accepted and joined <Link to="/dashboard">The Pheonician Investment Fund.</Link>
                                </div>
                                <div className="date">6/19 - 11:01 AM<span className="dismiss">X</span></div>
                                
                            </Col>
                        </Row>
                    </Row>
                </Row>
            </div>
        );
    }
}

export default SidebarComponent;



