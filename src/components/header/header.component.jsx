import React, { Component } from 'react';
import './header.component.css';
import { Row,Col} from 'react-bootstrap';
import userDefaultImage from '../../images/default_user.png';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from'../../services/fsnetauth';
import profileImage from '../../images/key.svg';
import backImage from '../../images/back.svg';
import editImage from '../../images/edit.svg';
import notificationImage from '../../images/notifications.png';
import SidebarComponent from '../sidebar/sidebar.component';
import { socket } from '../../util/socket.io'
class HeaderComponent extends Component{

    constructor(props){
        super(props);
        this.FsnetAuth = new FsnetAuth();
        // this.Socket = new socket();
        this.redirectHome = this.redirectHome.bind(this);
        this.userDropdownList = this.userDropdownList.bind(this);
        this.logout = this.logout.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);
        this.state = {
            loggedInUserObj: [],
            showandhideUserDropdown: true,
            menuShow: false,
            userImage: userDefaultImage
        }

        // socket.on('connect', (data) => {
        //     console.log('connected:::', data);
        // })
    }

    toggleMenu() {
        console.log('menu shown?:::', this.state.menuShow);
        this.setState({
            menuShow: !this.state.menuShow
        })
    }

    userDropdownList () {
        let value = this.state.showandhideUserDropdown;
        this.setState({
            showandhideUserDropdown: !value,
        })
        setTimeout(() => {
            this.setState({
                showandhideUserDropdown: value,
            })
        }, 3000);


    }

    logout() {
        reactLocalStorage.clear();
        // this.props.history.push('/');
    }

    

    redirectHome() {
        // this.props.history.push('/dashboard');
    }

    componentDidMount() {
        if(this.FsnetAuth.isAuthenticated()){
            //Get user obj from local storage.
            let userObj = reactLocalStorage.getObject('userData');
            if(userObj) {
                this.setState({
                    loggedInUserObj: userObj,
                    userImage: userObj.profilePic ? userObj.profilePic.url : userDefaultImage
                }) 
            }
        }else{
            window.location = '/';
            // this.props.history.push('/');
        }        
    }


    render(){
        return(
                <Col className="headers">
                    <Row className="rightHeader">
                        <div className="user-dropdown-list" hidden={this.state.showandhideUserDropdown}>
                            <ul>
                                <li><img src={editImage} alt="edit-profile" className="dropDownImg" /><a href="/settings/profile">Edit Profile</a></li>
                                <li><img src={profileImage} alt="change-password" className="dropDownImg" /><a href="/settings/change-password">Change Password</a></li>
                                <li onClick={this.logout}><img src={backImage} alt="logout" className="dropDownImg" /><a href="/settings">Log Out</a></li>
                            </ul>    
                        </div>
                        <Col xs={8} className="" onClick={this.userDropdownList}>
                            <div className={"user-name " + (this.state.showandhideUserDropdown ? '' : 'active')} >{this.state.loggedInUserObj.firstName} {this.state.loggedInUserObj.lastName}
                            </div>
                        </Col>
                        <Col xs={1} className="downArrowIcon" onClick={this.userDropdownList}>
                            <i className="fa fa-chevron-down"></i>
                        </Col>
                        <Col xs={2} className="">
                            <img src={this.state.userImage} alt="profilePic" className="profilePic"/>
                        </Col>
                        <Col xs={1} className="">
                            <img onClick={() => { this.toggleMenu()}} src={notificationImage} alt="notification-icon" className="notification-icon"/>
                        </Col>
                        {/* <i className="fa fa-bell-o notification-icon" aria-hidden="true"></i> */}
                        {/* <span className="notification-count">3</span> */}
                        {/* <i className="fa fa-ellipsis-h ellipsisH" aria-hidden="true"></i> */}
                    </Row>
                    <SidebarComponent visible={this.state.menuShow} toggleClose={this.toggleMenu}></SidebarComponent>
                </Col>
            // </Row>
        );
    }
}

export default HeaderComponent;



