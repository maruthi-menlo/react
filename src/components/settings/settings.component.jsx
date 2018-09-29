import React, { Component } from 'react';
import './settings.component.css';
import Loader from '../../widgets/loader/loader.component';
import { Constants } from '../../constants/constants';
import { Row, Col } from 'react-bootstrap';
import { Fsnethttp } from '../../services/fsnethttp';
import { FsnetAuth } from '../../services/fsnetauth';
import HeaderComponent from '../header/header.component';
import profileComponent from '../settings/profile/profile.component';
import privacyComponent from '../settings/privacy/privacy.component';
import changePasswordComponent from '../settings/changePassword/changePassword.component';
import homeImage from '../../images/home.png';
import { Route, Link } from "react-router-dom";
import { FsnetUtil } from '../../util/util';
import vanillaLogo from '../../images/Vanilla-white.png';
import infoImage from '../../images/info.svg';
import vanillaDarkLogo from '../../images/Vanilla.png';
import dashboardComponent from '../dashboard/dashboard.component';
import personalSelected from '../../images/personalSelected.svg';
import key from '../../images/key.svg';

class SettingsComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.hamburgerClick = this.hamburgerClick.bind(this);
        this.state = {
            showModal: false,
            show: false,
            showSideNav: true,
        }
        
           
    }

    //Unsuscribe the pubsub
    componentWillUnmount() {
    }

    componentDidMount() {
        //Check user is valid or not
        //If not redirect to login page
        if (!this.FsnetAuth.isAuthenticated()) {
            this.props.history.push('/');
        } else {
            
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

    //Header hamburger click
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
            <div className="lpSubFormStyle settingsContainer" id="">
                <nav className="navbar navbar-custom" hidden={this.state.isExpanded}>
                    <div className="navbar-header">
                        <div className="sidenav">
                            <h1 className="text-left"><i className="fa fa-bars" aria-hidden="true" onClick={(e) => this.hamburgerClick()}></i>&nbsp; <img src={vanillaLogo} alt="vanilla" className="vanilla-logo"/></h1>
                        </div>
                    </div>
                    <div className="text-center navbar-collapse-custom" id="navbar-collapse" hidden={!this.state.showSideNav}>
                        <div className="sidenav">
                            <h1 className="text-left logoHamburger"><i className="fa fa-bars" aria-hidden="true"></i>&nbsp; <img src={vanillaLogo} alt="vanilla" className="vanilla-logo"/></h1>
                            <h2 className="text-left lpDashAlign"><img src={homeImage} alt="home_image" className="" />&nbsp; <Link to="/dashboard">Dashboard</Link></h2>
                            {
                                <ul className="sidenav-menu">
                                    <li>
                                        <Link to={"/settings/profile"}><img src={personalSelected} alt="home_image" className="" />&nbsp;<span>Personal Details</span></Link>
                                    </li>
                                    <li>
                                        <Link to={"/settings/change-password"}><img src={key} alt="home_image" className="" />&nbsp;<span>Change Password</span></Link>
                                    </li>
                                    <li>
                                        <Link to={"/settings/privacy"}><img src={infoImage} alt="home_image" className="" />&nbsp;<span>Settings</span></Link>
                                    </li>
                                </ul>
                            }
                        </div>

                    </div>
                </nav>

                <div className={"main "+(this.state.isExpanded ? 'marginHorizontal30 expanded' : '')}>
                    <div className={"headerAlign "+(this.state.isExpanded ? 'marginTop20' : '')}>
                        <div className="pull-left" hidden={!this.state.isExpanded}>
                            <img src={vanillaDarkLogo} alt="vanilla" className="vanilla-logo marginLeft30"/>
                        </div>
                        <HeaderComponent></HeaderComponent>
                    </div>
                    <div className="contentWidth">
                        {/* Actual Content */}
                        <Row className="main-content">
                            <Route exact path={`${match.url}/view/:id`} component={dashboardComponent} />                     
                            <Route exact path={`${match.url}/profile`} component={profileComponent} />                     
                            <Route exact path={`${match.url}/change-password`} component={changePasswordComponent} />                   
                            <Route exact path={`${match.url}/privacy`} component={privacyComponent} />                   
                        </Row>
                    </div>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default SettingsComponent;

