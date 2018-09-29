import React, { Component } from 'react';
import './sidebar.component.css';
import { Row,Col} from 'react-bootstrap';
import { Link } from "react-router-dom";
import icon from '../../images/icon.svg';
import info from '../../images/info.svg';
import closeSmall from '../../images/close-small.svg'
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
                        <img src={icon} alt="home_image" className="" />
                        </Col>
                        <div className="dismissAll">Dismiss All</div>
                    </Row>
                    <Row className="alerts-section">
                        {/* <Row className="alert-row">
                            <Col xs={2} sm={2} md={2}>
                            <img src={info} alt="home_image" className="" />
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
                            <img src={info} alt="home_image" className="" />
                            </Col>
                            <Col xs={10} sm={10} md={10}>
                                <div className="alert-text">
                                    Jared Felugo (LP) accepted and joined <Link to="/dashboard">The Pheonician Investment Fund.</Link>
                                </div>
                                <div className="date">6/19 - 11:01 AM<span className="dismiss">X</span></div>
                                
                            </Col>
                        </Row> */}
                        <Row className="alert-row">
                            <Col xs={2} sm={2} md={2}>
                            <img src={info} alt="home_image" className="" />
                            </Col>
                            <Col xs={10} sm={10} md={10} className="alertPaddingLeft">                                
                                <Row>
                                    <div className="alert-text">Jared Felugo (LP)</div>
                                    <div className="date">6/19 - 11:01 AM</div>
                                </Row>
                                <Row>
                                    <div className="alert-text alertTextWidth">accepted and joined <Link to="/dashboard">The Pheonician Investment Fund.</Link></div>
                                    <div className="date alertWidth"><span className="dismiss"><img src={closeSmall} alt="home_image" className="" /></span></div>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="alert-row">
                            <Col xs={2} sm={2} md={2}>
                            <img src={info} alt="home_image" className="" />
                            </Col>
                            <Col xs={10} sm={10} md={10} className="alertPaddingLeft">                                
                                <Row>
                                    <div className="alert-text">Jared Felugo (LP)</div>
                                    <div className="date">6/19 - 11:01 AM</div>
                                </Row>
                                <Row>
                                    <div className="alert-text alertTextWidth">accepted and joined <Link to="/dashboard">The Pheonician Investment Fund.</Link></div>
                                    <div className="date alertWidth"><span className="dismiss"><img src={closeSmall} alt="home_image" className="" /></span></div>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="alert-row">
                            <Col xs={2} sm={2} md={2}>
                            <img src={info} alt="home_image" className="" />
                            </Col>
                            <Col xs={10} sm={10} md={10} className="alertPaddingLeft">                                
                                <Row>
                                    <div className="alert-text">Jared Felugo (LP)</div>
                                    <div className="date">6/19 - 11:01 AM</div>
                                </Row>
                                <Row>
                                    <div className="alert-text alertTextWidth">accepted and joined <Link to="/dashboard">The Pheonician Investment Fund.</Link></div>
                                    <div className="date alertWidth"><span className="dismiss"><img src={closeSmall} alt="home_image" className="" /></span></div>
                                </Row>
                            </Col>
                        </Row>
                    </Row>
                </Row>
            </div>
        );
    }
}

export default SidebarComponent;



