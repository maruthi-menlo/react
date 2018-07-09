
import React, { Component } from 'react';
import './createfund.component.css';
import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl,  FormGroup } from 'react-bootstrap';
import userDefaultImage from '../../images/default_user.png';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetAuth } from'../../services/fsnetauth';

class CreateFundComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.logout = this.logout.bind(this);
        this.state = {
            loggedInUserObj: [],
        }

    }

    title = "ding";

    logout() {
        reactLocalStorage.clear();
        this.props.history.push('/');
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

    render() {
        return (
            <div class="wrapper">
                <div className="sidenav">
                    <h1><i class="fa fa-bars" aria-hidden="true"></i>&nbsp; FSNET LOGO</h1>
                    <h2><i class="fa fa-home" aria-hidden="true"></i>&nbsp; Dashboard</h2>
                    <div className="active-item"><i class="fa fa-picture-o" aria-hidden="true"></i>&nbsp;Create New Fund <span className="fsbadge" pullRight="true">1/5</span></div>
                    <ul className="sidenav-menu">
                        <li><a href="#about">Fund Details</a></li>
                        <li><a href="#services">Assign GP Delegates</a></li>
                        <li><a href="#clients">Upload Fund Documents</a></li>
                        <li><a href="#contact">View and Approve Form</a></li>
                        <li><a href="#clients">Asign LP's to Fund</a></li>
                        <li><a href="#contact">Review & Confirm</a></li>
                    </ul>

                    <div class="start-box"><i class="fa fa-check" aria-hidden="true"></i>&nbsp;Start Fund</div>

                    <div class="section-head">GP Delegates<span className="btn-add pull-right">+</span></div>
                    <div class="section">
                        <div class="user">
                            <i class="fa fa-user fa-2x" aria-hidden="true"></i>
                            <p>You haven’t added any GP Delegates to this fund yet</p>
                        </div>
                    </div>

                    <div class="section-head">LP's<span className="btn-add pull-right">+</span></div>
                    <div class="section">
                        <div class="user">
                            <i class="fa fa-user fa-2x" aria-hidden="true"></i>
                            <p>You haven’t added any LP’s to this fund yet</p>
                        </div>
                    </div>

                </div>

                <div className="main">

                    <Grid fluid="true">
                        <Col xs={6} md={12}>
                            <Row className="header-right-row">
                                <span className="logout" onClick={this.logout}>Logout </span>
                                <div className="user-name">{this.state.loggedInUserObj.firstName}{this.state.loggedInUserObj.lastName} <i className="fa fa-caret-down" aria-hidden="true"></i></div>
                                <img src={userDefaultImage} alt="profilePic" className="profilePic"/>
                                <i className="fa fa-bell-o notification-icon" aria-hidden="true"></i>
                                <span className="notification-count">3</span>
                                <i className="fa fa-ellipsis-h ellipsisH" aria-hidden="true"></i>
                            </Row>
                        </Col>

                        <Col xs={6} md={12}>
                            <div className="main-heading"><span className="main-title">Create New Fund</span><a className="cancel-fund">Cancel</a></div>
                        </Col>

                        <div className="form-grid">
                        <form>
                        <h2>Fund Details</h2>
                        <h4>Enter the details for the fund below. Fields marked with an * are mandatory.</h4>
                        <FormGroup controlId="formBasicText">
                        <Row bsClass="form-row">
                            <Col xs={6} md={6}>
                                <ControlLabel className="form-label">Fund Name*</ControlLabel>
                                <FormControl type="text" placeholder="Helios"/>
                                <FormControl.Feedback /> 
                            </Col>

                            <Col xs={6} md={6}>
                            <ControlLabel className="form-label">Fund Amount*</ControlLabel>
                                <FormControl type="text" placeholder="$15,000,000.00"/>
                                <FormControl.Feedback />
                            </Col>
                        </Row>    

                        <Row bsClass="form-row">
                            <Col xs={6} md={6}>
                            <DropdownButton title="Fund Duration"  className="ddstyles">
                                <MenuItem eventKey="1">Action</MenuItem>
                                <MenuItem eventKey="2">Another action</MenuItem>
                                <MenuItem eventKey="3">Something else here</MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey="4">Separated link</MenuItem>
                            </DropdownButton>
                            </Col>
                        </Row> 

                        <h2>Minimum Fund Participation Amount or Minimum Fund Participation Percentage</h2>
                        <h4>Fill in one. Minimum fund participation can be calculated based off on percentage participation.</h4>

                        </FormGroup>
                        </form>
        </div>
                        {/* <div className="GpDelegatesContainer">
                            <h1 className="assignGp">Assign GP Delegates</h1>
                            <p className="Subtext">Select GP Delegate(s) from the list below or add a new one.</p>
                            <Button className="gpDelegateButton">Gp Delegate</Button>
                            <div className="checkBoxGpContainer">
                                <label className="Rectangle-6">
                                    <span className="Ben-Parker">Ben Parker</span>
                                    <CBox className="checkBoxBen">
                                    </CBox>
                                </label>
                                <label className="Rectangle-6">
                                    <span className="Ben-Parker">Jeff Lynne</span>
                                    <CBox className="checkBoxBen">
                                    </CBox>
                                </label>
                                <label className="Rectangle-6">
                                    <span className="Ben-Parker">Kaitlyn Lopez</span>
                                    <CBox className="checkBoxBen">
                                    </CBox>
                                </label>
                                <label className="Rectangle-6">
                                    <span className="Ben-Parker">Larry Croft</span>
                                    <CBox className="checkBoxBen">
                                    </CBox>
                                </label>
                                <label className="Rectangle-6">
                                    <span className="Ben-Parker">Samrutha Karujika</span>
                                    <CBox className="checkBoxBen">
                                    </CBox>
                                </label>
                                <label className="Rectangle-6">
                                    <span className="Ben-Parker">Samrutha Karujika</span>
                                    <CBox className="checkBoxBen">
                                    </CBox>
                                </label>
                            </div>
                        </div> */}
                        <Col xs={6} md={12}>
                            <div className="footer-nav"><i class="fa fa-chevron-left" aria-hidden="true"></i><i class="fa fa-chevron-right" aria-hidden="true"></i></div>
                        </Col>

                    </Grid>
                </div>
            </div>
        );
    }
}

export default CreateFundComponent;

