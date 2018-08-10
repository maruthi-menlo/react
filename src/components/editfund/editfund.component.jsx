import React, { Component } from 'react';
import './editfund.component.css';
import Loader from '../../widgets/loader/loader.component';
import { Constants } from '../../constants/constants';
import { Row } from 'react-bootstrap';
import { Fsnethttp } from '../../services/fsnethttp';
import { FsnetAuth } from '../../services/fsnetauth';
import HeaderComponent from '../header/header.component';
import homeImage from '../../images/home.png';
import successImage from '../../images/success-small.png';
import helpImage from '../../images/help.png';
import signFundImg from '../../images/edit-grey.svg';
import copyImage from '../../images/copy_img.svg';
import handShakeImage from '../../images/handshake.svg';
import { Route, Link } from "react-router-dom";
import { PubSub } from 'pubsub-js';
import { FsnetUtil } from '../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';

var investor = {};
class editFundComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.state = {
            showModal: false,
            showSideNav: true,
           
        }

    }

    componentWillUnmount() {

    }

    componentDidMount() {
       
    }

 

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    hamburgerClick() {
        if (this.state.showSideNav == true) {
            this.setState({
                showSideNav: false
            })
        } else {
            this.setState({
                showSideNav: true
            })
        }
    }

    
    render() {
        const { match } = this.props;
        return (
            <div className="lpSubFormStyle" id="">
                <nav className="navbar navbar-custom">
                    <div className="navbar-header">
                        <div className="sidenav">
                            <h1 className="text-left"><i className="fa fa-bars" aria-hidden="true" onClick={(e) => this.hamburgerClick()}></i>&nbsp; FSNET LOGO</h1>
                        </div>
                    </div>
                    <div className="text-center navbar-collapse-custom" id="navbar-collapse" hidden={!this.state.showSideNav}>
                        <div className="sidenav">
                            <h1 className="text-left logoHamburger"><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; FSNET LOGO</h1>
                            <h2 className="text-left lpDashAlign"><img src={homeImage} alt="home_image" className="" />&nbsp; <Link to="/dashboard" className="dashboardTxtAlign">Dashboard</Link></h2>
                            {
                                <ul className="sidenav-menu">
                                    <li><a>Edit Fund Details</a></li>
                                    <li><a>Print Fund Summary</a></li>
                                    <li><a>Addendums</a></li>
                                    <li><a>Partnership Agreements</a></li>
                                    <li><a>Side Letters</a></li>
                                    <li><a>Capital Call</a></li>
                                </ul>
                            }
                          
                            <div className="section-head text-left"><span className="sectionHeadTxt lpAlign">GP Delegates</span><span className="btn-add pull-right" onClick={this.handleLpShow}>+</span></div>
                            <div className="section">
                                <div className="gpDelDiv">
                                    <div className="user">
                                        <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                                        <p className="opacity75">You haven’t added any GP Delegates to this Fund yet</p>
                                    </div>
                                </div>
                            </div>
                            <div className="section-head text-left"><span className="sectionHeadTxt lpAlign">LPs</span><span className="btn-add pull-right" onClick={this.handleLpShow}>+</span></div>
                            <div className="section">
                                <div className="gpDelDiv">
                                    <div className="user">
                                        <i className="fa fa-user fa-2x" aria-hidden="true"></i>
                                        <p className="opacity75">You haven’t added any LP Delegates to this Fund yet</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </nav>

                <div className="main">
                    <div className="headerAlign">
                        <HeaderComponent ></HeaderComponent>
                    </div>
                    <div className="contentWidth">
                        <div className="main-heading height140"><div className="lpHeader"><span className="main-title">Fund Name</span><span className="statusTxtStyle">In Progress</span></div></div>
                        <div className="ProgressBarDiv">
                        <div className="progress-bar progressBarAlign"><div className="progress progressColor"></div></div>
                        <div className="progressDetailsStyle">Fund Enrollment Steps Completed<span className="progressTxtAlign">3 of 3</span></div>
                        <div className="helpImgAlign"><img src={helpImage} alt="helpImage" className="" />Help</div>
                        </div>
                        <Row className="main-content">
                                                    
                        </Row>
                    </div>
                </div>


                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default editFundComponent;

