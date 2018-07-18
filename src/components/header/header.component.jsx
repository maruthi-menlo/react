import React, { Component } from 'react';
import './header.component.css';
import { Row,Col} from 'react-bootstrap';
import userDefaultImage from '../../images/default_user.png';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from'../../services/fsnetauth';
import profileImage from '../../images/key.svg';
import backImage from '../../images/back.svg';
import editImage from '../../images/edit.svg';

class HeaderComponent extends Component{

    constructor(props){
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.redirectHome = this.redirectHome.bind(this);
        this.userDropdownList = this.userDropdownList.bind(this);
        this.logout = this.logout.bind(this);
        this.state = {
            loggedInUserObj: [],
            showandhideUserDropdown: true
        }
    }

    userDropdownList () {
        let value = this.state.showandhideUserDropdown;
        this.setState({
            showandhideUserDropdown: !value,
        })

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
                    loggedInUserObj: userObj
                }) 
            }
        }else{
            this.props.history.push('/');
        }        
    }


    render(){
        return(
            
                <Col lg={6} md={6} sm={6} xs={12} id="header-right">
                    <Row className="header-right-row">
                        <div className="user-dropdown-list" hidden={this.state.showandhideUserDropdown}>
                            <ul>
                                <li><img src={editImage} alt="edit-profile" /><a href="edit-profile">Edit Profile</a></li>
                                <li><img src={profileImage} alt="change-password" /><a href="/change-password">Change Password</a></li>
                                <li onClick={this.logout}><img src={backImage} alt="logout" /><a href="/">Log Out</a></li>
                            </ul>    
                        </div>
                        
                        <div className={"user-name " + (this.state.showandhideUserDropdown ? '' : 'active')} onClick={this.userDropdownList}>{this.state.loggedInUserObj.firstName} {this.state.loggedInUserObj.lastName} <i className="fa fa-caret-down" aria-hidden="true"></i></div>
                        <img src={userDefaultImage} alt="profilePic" className="profilePic"/>
                        <i className="fa fa-bell-o notification-icon" aria-hidden="true"></i>
                        {/* <span className="notification-count">3</span> */}
                        {/* <i className="fa fa-ellipsis-h ellipsisH" aria-hidden="true"></i> */}
                    </Row>
                </Col>
            // </Row>
        );
    }
}

export default HeaderComponent;



