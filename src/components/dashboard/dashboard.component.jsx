
import React, { Component } from 'react';
import './dashboard.component.css';
import { FsnetAuth } from '../../services/fsnetauth';
import { Row, Col, FormControl, Button } from 'react-bootstrap';
import userDefaultImage from '../../images/fund-default.png';
import { reactLocalStorage } from 'reactjs-localstorage';
import HeaderComponent from '../header/header.component';
import { Fsnethttp } from '../../services/fsnethttp';
import { Constants } from '../../constants/constants';
import { FsnetUtil } from '../../util/util';
import Loader from '../../widgets/loader/loader.component';
import boxNotificationImage from '../../images/boxNotiImage.svg';
import plusImg from '../../images/plus.svg';
import vanillaLogo from '../../images/Vanilla.png';

class DashboardComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.showActivityFeed = this.showActivityFeed.bind(this);
        this.openFund = this.openFund.bind(this);
        this.searchInputChangeEvent = this.searchInputChangeEvent.bind(this);
        this.navigateToCreateFund = this.navigateToCreateFund.bind(this);
        this.openpartnershipDocument = this.openpartnershipDocument.bind(this);
        this.openLpFund = this.openLpFund.bind(this);
        this.rejectFund = this.rejectFund.bind(this);
        this.acceptFund = this.acceptFund.bind(this);
        this.state = {
            isHide: true,
            rowData: 0,
            filterState: 'Off',
            allGPFundsList: [],
            allLpFundsList: [],
            noFundsMessage: '',
            showRejectedFundText: false
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

    showActivityFeed() {
        this.setState({
            rowData: 1
        })
    }

    navigateToCreateFund() {
        this.props.history.push('/createfund/funddetails');
    }

    openFund(e, id, status) {
        // this.props.history.push('/createfund/funddetails/' + id);
        this.props.history.push('/fund/view/' + id);
    }

    openLpFund(e, id, status) {
        if(status !== 'Open' && status !== 'Not Interested') {
            this.props.history.push('/lp/investorInfo/' + id);
        }
    }

    searchInputChangeEvent(e) {
        let value = e.target.value;
        if (value !== '') {
            let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
            if (value.trim() !== '') {
                this.Fsnethttp.getSearchFunds(headers, value.trim()).then(result => {
                    if (result.data && result.data.data.length > 0) {
                        this.setState({
                            allGPFundsList: result.data.data
                        })
                    } else {
                        this.setState({
                            allGPFundsList: [],
                            noFundsMessage: 'There are no funds with the given search name.'
                        })
                    }
                })
                    .catch(error => {
                        console.log(error)
                    });
            }
        } else {
            this.getGpFunds()
        }
    }

    // Get current loggedin user details
    //If token is undefined then redirect to login page 
    componentDidMount() {
        console.log("Dashboard Component Did Mount called");
        if (this.FsnetAuth.isAuthenticated()) {
            //Get user obj from local storage.
            let userObj = reactLocalStorage.getObject('userData');
            console.log("userObj::"+userObj);
            if (userObj) {
                if (userObj.accountType === 'GP' || userObj.accountType === 'GPDelegate') {
                    this.getGpFunds();
                } else {
                    this.getLpFunds();
                }
                this.setState({
                    loggedInUserObj: userObj,
                    dashboardType: userObj.accountType
                })
            }
        } else {
            this.props.history.push('/');
        }
    }

    //Get list of GP funds
    getGpFunds() {
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.getListOfAllFunds(headers).then(result => {
            this.close();
            if (result.data && result.data.data.length > 0) {
                this.setState({
                    allGPFundsList: result.data.data,
                })
            } else {
                this.setState({
                    allGPFundsList: [],
                    noFundsMessage: this.Constants.NO_GP_FUNDS
                })
            }
        })
            .catch(error => {
                this.close();
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    this.setState({
                        allGPFundsList: [],
                        noFundsMessage: this.Constants.NO_GP_FUNDS
                    })
                }
            });

    }

    redirectToLogin() {
        reactLocalStorage.clear();
        this.props.history.push('/login');
    }

    //Get list of GP funds
    getLpFunds() {
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.getListOfLpFunds(headers).then(result => {
            this.close();
            if (result.data && result.data.data.length > 0) {
                this.setState({
                    allLpFundsList: result.data.data,
                },()=>{
                    for(let index of this.state.allLpFundsList) {
                        if(index['subscriptionStatus']['id'] === 3) {
                            this.setState({
                                showRejectedFundText: true
                            })
                            break;
                        } else {
                            this.setState({
                                showRejectedFundText: false
                            })
                        }
                    }
                })
            } else {
                this.setState({
                    allLpFundsList: [],
                    noFundsMessage: this.Constants.NO_LP_FUNDS
                })
            }
        })
            .catch(error => {
                this.close();
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    this.setState({
                        allLpFundsList: [],
                        noFundsMessage: this.Constants.NO_LP_FUNDS
                    })
                }
            });
    }

    openpartnershipDocument(link) {
        if(link) {
            window.open(link, '_blank', 'width = 1000px, height = 600px')
        }
    }

    rejectFund(id) {
        if(id) {
            this.open();
            let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
            let obj = {subscriptionId: id}
            this.Fsnethttp.rejectGPInvitedFund(headers,obj).then(result => {
                this.close();
                this.getLpFunds();
            })
            .catch(error => {
                this.close();
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } 
            });
        }
    }

    acceptFund(id) {
        if(id) {
            this.open();
            let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
            let obj = {subscriptionId: id}
            this.Fsnethttp.acceptGPInvitedFund(headers,obj).then(result => {
                this.close();
                this.getLpFunds();
            })
            .catch(error => {
                this.close();
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } 
            });
        }
    }

    render() {
        return (
            <Row className="dashboardContainer" id="MainDashboard">
                <Row className="dashboardMainRow">
                    <Col lg={5} md={6} sm={6} xs={12}>
                        <img src={vanillaLogo} alt="vanilla" className="vanilla-logo marginLeft30"/>
                    </Col>
                    <Col lg={7} md={6} sm={6} xs={12}>
                        <HeaderComponent ></HeaderComponent>
                    </Col>
                </Row>
                {
                   ( this.state.dashboardType === 'GP' || this.state.dashboardType === 'GPDelegate') ?
                        <Row className="dashboardMainRow fund-container">
                            <div className="myFunds">Your Funds</div>
                            <Col lg={12} md={12} sm={12} xs={12}>
                                <Col lg={6} md={6} sm={6} xs={12} className="display-filter display-filter-padding display-left-filter">
                                    <span className="search-icon"><i className="fa fa-search" aria-hidden="true"></i></span>
                                    <FormControl type="text" placeholder="Search Funds" className="formFilterControl" onChange={(e) => this.searchInputChangeEvent(e)} />
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12} className="display-filter filter-right display-right-filter">
                                    <div className="filter-right-block">
                                        <Button className="newFundButton" onClick={this.navigateToCreateFund}><img src={plusImg} alt="plusImg" className="plusImg" />New Fund</Button>
                                    </div>
                                </Col>
                            </Col>

                            {this.state.allGPFundsList.length > 0 ?
                                this.state.allGPFundsList.map((record, index) => {
                                    return (
                                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container" key={index}>
                                            <div onClick={(e) => this.openFund(e, record['id'], record['status'])} className={"fundBoxEdit " + (record['status'] == 'Deactivated' ? 'disabled fundDeactivated' : '')}>
                                                <div className="fundImageEdit">
                                                    {
                                                        record['fundImage'] ?
                                                            <img src={record['fundImage']['url']} alt="img" className="Fund-Image" /> :
                                                            <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                                    }
                                                    <div className={'Fund-Name ' + (record['legalEntity'].length <= 20 ? 'fund-name-align' : 'removeTop')}>{record['legalEntity']}</div>
                                                    {/* <i className="fa fa-bell-o bellO" onClick={this.showActivityFeed} aria-hidden="true"></i> */}
                                                    <img src={boxNotificationImage} onClick={this.showActivityFeed} alt="notification-icon" className="notification-icon boxNotifStyle" />
                                                    <span className="notificationCount">0</span>
                                                    <div className="invitedDivStyle">{record['lpsSelected'].length} Invited</div>
                                                </div>
                                                <div className="actnRqStyle">
                                                    {/* <Button className="actionRequired">Action Required</Button> */}
                                                </div>
                                                <div className="Line"></div>
                                                <div className="text-center progressDivAlign">
                                                    <div className="inProgressDiv">
                                                        <div className="Invited">{record['inProgress']}</div>
                                                        <div className="labelInvited">In Progress</div>
                                                        <div className="labelInvitedPrice" title={record['sumOfCapitalCommitmentForInProgress'] ? this.FsnetUtil.convertToCurrency(record['sumOfCapitalCommitmentForInProgress']) : '$0.00'}>{record['sumOfCapitalCommitmentForInProgress'] ? this.FsnetUtil.convertToCurrency(record['sumOfCapitalCommitmentForInProgress']) : '$0.00'}</div>
                                                    </div>
                                                    <div className="closeReadyDiv">
                                                        <div className="Invited1">{record['closeReady']}</div>
                                                        <div className="labelClosedReady">Close-Ready</div>
                                                        <div className="labelClosedPrice" title={record['sumOfCapitalCommitmentForCloseReady'] ? this.FsnetUtil.convertToCurrency(record['sumOfCapitalCommitmentForCloseReady']) : '$0.00'}>{record['sumOfCapitalCommitmentForCloseReady'] ? this.FsnetUtil.convertToCurrency(record['sumOfCapitalCommitmentForCloseReady']) : '$0.00'}</div>
                                                    </div>
                                                    <div className="closedDiv">
                                                        <div className="Invited2">{record['closed']}</div>
                                                        <div className="labelClosed">Closed</div>
                                                        <div className="labelClosedReadyPrice" title={record['sumOfCapitalCommitmentForClosed'] ? this.FsnetUtil.convertToCurrency(record['sumOfCapitalCommitmentForClosed']) : '$0.00'}>{record['sumOfCapitalCommitmentForClosed'] ? this.FsnetUtil.convertToCurrency(record['sumOfCapitalCommitmentForClosed']) : '$0.00'}</div>
                                                    </div>
                                                </div>
                                                <div className="Line clear-both"></div>

                                                <div className="bold tPriceStyle price-meter">T:&nbsp;<span>{this.FsnetUtil.convertToCurrency(record['fundTargetCommitment'])}</span></div>
                                                <div className="fund-progress-bar">
                                                    <div className="price-percentage" style={{ left: (record['fundTargetCommitmentPercent'] ? record['fundTargetCommitmentPercent']+'%' : '0%') }} hidden={!record['fundTargetCommitment']}>
                                                        {/* <div className="pull-right bold tPriceStyle price-meter">T: {this.FsnetUtil.convertToCurrency(record['fundTargetCommitment'])}</div> */}
                                                        <div className="caretDownAlign"><i className="fa fa-caret-down"></i></div>
                                                    </div>
                                                    <div className="progress-bar">
                                                        <div className={"progress progress-pink progress-radius-left "+ (!record['closeReadyPercent'] && !record['closedPercent'] ? 'progress-radius-left progress-radius-right' : '')} style={{ width: (record['inProgressPercent'] ? record['inProgressPercent']+'%' : '0%')}}></div>
                                                        <div className={"progress progress-yellow "+ (!record['inProgressPercent'] ? 'progress-radius-left ' : ' ') + (!record['closedPercent'] ? 'progress-radius-right' : '')} style={{ width: (record['closeReadyPercent'] ? record['closeReadyPercent']+'%' : '0%')}}></div>
                                                        <div className={"progress progress-green progress-radius-right "+ (!record['closeReadyPercent'] && !record['inProgressPercent'] ? 'progress-radius-left progress-radius-right' : '')} style={{ width: (record['closedPercent'] ? record['closedPercent']+'%' : '0%')}}></div>
                                                    </div>
                                                    <div className="price-percentage" style={{ left: (record['fundHardCapPercent'] ? record['fundHardCapPercent']+'%' : '70%') }} hidden={!record['fundHardCap']}>
                                                        <div className="caretUpAlign"><i className="fa fa-caret-up"></i></div>
                                                        {/* <div className="pull-right bold hcPriceStyle price-meter">HC: {this.FsnetUtil.convertToCurrency(record['fundHardCap'])}</div> */}
                                                    </div>
                                                </div>
                                                <div className="bold hcPriceStyle price-meter">HC:&nbsp;<span>{this.FsnetUtil.convertToCurrency(record['fundHardCap'])}</span></div>
                                            </div>
                                        </Col>
                                    );
                                })
                                :
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <div className="title margin20 text-center marginTop50">{this.state.noFundsMessage}</div>
                                </Col>
                            }
                        </Row> :
                        <Row className="dashboardMainRow fund-container" id="lpMainDashboard">
                            <div className="myFunds">My Funds</div>
                            {this.state.allLpFundsList.length > 0 ?
                                this.state.allLpFundsList.map((record, index) => {
                                    return (
                                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container" hidden={record['subscriptionStatus']['id'] === 3} key={index}>
                                            <div className="fundBoxEdit" onClick={(e) => this.openLpFund(e, record['id'], record['subscriptionStatus']['name'])}>
                                                <div className="invited" hidden={record['subscriptionStatus']['name'] !='Open'}>
                                                    You have been invited to join:
                                                </div>
                                                <div className="fundImage" hidden={record['subscriptionStatus']['name'] !='Open'}>
                                                    {
                                                    record['fund']['fundImage']?
                                                    <img src={record['fund']['fundImage']['url']} alt="img" className="Fund-Image" />:
                                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                                    }
                                                    <div className={'Fund-Name ' + (record['fund']['legalEntity'].length <= 20 ? 'fund-name-align' : 'removeTop')} title={record['fund']['legalEntity']}>{record['fund']['legalEntity']}</div>
                                                </div>
                                                <div className="fundImageEdit" hidden={record['subscriptionStatus']['name'] ==='Open'}>
                                                    {
                                                    record['fund']['fundImage']?
                                                    <img src={record['fund']['fundImage']['url']} alt="img" className="Fund-Image" />: 
                                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                                    }
                                                    <div className={'Fund-Name ' + (record['fund']['legalEntity'].length <= 20 ? 'fund-name-align' : 'removeTop')} title={record['fund']['legalEntity']}>{record['fund']['legalEntity']}</div>
                                                    <img src={boxNotificationImage} alt="notification-icon" className="notification-icon boxNotifStyle"/>
                                                    <span className="notificationCount">0</span>
                                                </div>
                                                <div className="openForm" hidden={record['subscriptionStatus']['name'] ==='Open'}>
                                                    <div className="closedFormText">{record['subscriptionStatus']['name']}</div>
                                                </div>
                                                <div className="viewParticipant" hidden={record['subscriptionStatus']['name'] !='Open'} onClick={()=>this.openpartnershipDocument(record['fund']['partnershipDocument']['url'])}>
                                                    View Participation Document
                                                </div>
                                                <div hidden={!record['lpCapitalCommitment']}>
                                                    <div className="Line" hidden={record['subscriptionStatus']['name'] =='Open'}></div>
                                                    <div className="fundContribution" hidden={record['subscriptionStatus']['name'] ==='Open'}>
                                                        <div className="contributionLabel">My Contribution:</div>
                                                        <div className="contributionAmount" title={record['lpCapitalCommitment'] ? this.FsnetUtil.convertToCurrency(record['lpCapitalCommitment']) : ''}>{record['lpCapitalCommitment'] ? this.FsnetUtil.convertToCurrency(record['lpCapitalCommitment']) : ''}</div>
                                                    </div>
                                                    <div className="Line" hidden={record['subscriptionStatus']['name'] =='Open'}></div>
                                                </div>
                                                <div className="fund-user-details" hidden={record['subscriptionStatus']['name'] ==='Open'}>
                                                    <div className="gp-details"><label>GP Name: </label> <div title={`${record['fund']['gp']['firstName']} ${record['fund']['gp']['lastName']}`}>{record['fund']['gp']['firstName']} {record['fund']['gp']['lastName']}</div></div>
                                                    <div className="gp-details"><label>Phone Number: </label> <div>{record['fund']['gp']['cellNumber']}</div></div>
                                                    <div className="gp-details"><label hidden={record['fund']['gp']['city'] === null}>City: </label> <div>{record['fund']['gp']['city']}</div></div>
                                                    <div className="gp-details"><label hidden={record['fund']['gp']['state'] === null}>State: </label><div>{record['fund']['gp']['state']}</div> </div>
                                                    <div className="gp-details"><label hidden={record['fund']['gp']['country'] === null}>Country: </label><div>{record['fund']['gp']['country']}</div> </div>
                                                </div>
                                                <div className="Line" hidden={record['subscriptionStatus']['name'] !='Open'}></div>
                                                <div className="interested marginAlign" hidden={record['subscriptionStatus']['name'] !='Open'} onClick={()=>this.acceptFund(record['id'])}>Yes, I am interested.</div>
                                                <div className="interested" hidden={record['subscriptionStatus']['name'] !='Open'} onClick={()=>this.rejectFund(record['id'])}>No, not at this time.</div>
                                            </div>
                                        </Col>
                                    );
                                })
                                :
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <div className="title margin20 text-center marginTop50">{this.state.noFundsMessage}</div>
                                </Col>
                            }
                            <div className="rejectedFunds" hidden={!this.state.showRejectedFundText}>Rejected Funds</div>
                            {this.state.allLpFundsList.length > 0 ?
                                this.state.allLpFundsList.map((record, index) => {
                                    return (
                                        <Col lg={4} md={6} sm={6} xs={12} className="fund-col-container" hidden={record['subscriptionStatus']['id'] !== 3} key={index} >
                                            <div className="fundBoxEdit">
                                                <div className="fundImageEdit">
                                                    {
                                                    record['fundImage']?
                                                    <img src={record['fundImage']['url']} alt="img" className="Fund-Image" />: 
                                                    <img src={userDefaultImage} alt="fund_image" className="Fund-Image" />
                                                    }
                                                    <div title={record['fund']['legalEntity']} className={'Fund-Name ' + (record['fund']['legalEntity'].length <= 20 ? 'fund-name-align' : 'removeTop')}>{record['fund']['legalEntity']}</div>
                                                </div>
                                                <div className="fund-user-details">
                                                    <div className="gp-details"><label>GP Name: </label> <div>{record['fund']['gp']['firstName']} {record['fund']['gp']['lastName']}</div></div>
                                                    <div className="gp-details"><label>Phone Number: </label> <div>{record['fund']['gp']['cellNumber']}</div></div>
                                                    <div className="gp-details"><label hidden={record['fund']['gp']['city'] === null}>City: </label> <div>{record['fund']['gp']['city']}</div></div>
                                                    <div className="gp-details"><label hidden={record['fund']['gp']['state'] === null}>State: </label><div>{record['fund']['gp']['state']}</div> </div>
                                                    <div className="gp-details"><label hidden={record['fund']['gp']['country'] === null}>Country: </label><div>{record['fund']['gp']['country']}</div> </div>
                                                </div>
                                            </div>
                                        </Col>
                                    );
                                })
                                :
                                <Col lg={12} md={12} sm={12} xs={12}>
                                   
                                </Col>
                            }
                        </Row>
                }
                <Loader isShow={this.state.showModal}></Loader>
            </Row>
        );
    }
}

export default DashboardComponent;

