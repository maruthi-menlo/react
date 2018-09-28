import React, { Component } from 'react';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Row, Col,Table,Button} from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import HeaderComponent from '../../header/header.component';
import homeImage from '../../../images/home.png';
import fundLogoSample from '../../../images/fund_logo_sample.png';
import fundDefault from '../../../images/fund-default.png';
import successImage from '../../../images/success-small.png';
import helpImage from '../../../images/help.png';
import signFundImg from '../../../images/edit-grey.svg';
import copyImage from '../../../images/copy_img.svg';
import handShakeImage from '../../../images/handshake.svg';
import { Route, Link } from "react-router-dom";
import { PubSub } from 'pubsub-js';
import { FsnetUtil } from '../../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';
import vanillaLogo from '../../../images/Vanilla-white.png';
import userDefaultImage from '../../../images/default_user.png';
import notificationIcon from '../../../images/notifications.png';
import boxNotificationImage from '../../../images/boxNotiImage.svg';
import LpTableComponent from '../lptable/lptable.component';


class expandLpTableComponent extends Component {

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
            fundId: null,
            fundData: {}
        }

    }

    componentWillUnmount() {

    }

    componentDidMount() {

        let id = this.FsnetUtil.getLpFundId();
        console.log('fund ID::::', id);
        this.setState({
            fundId: id
        }, () => {
            this.getFundDetails(id);
        })
    }


    getFundDetails(fundId) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        // let fundId = this.state.fundId
        if (fundId) {
            this.open();
            this.Fsnethttp.getFundInfo(fundId, headers).then(result => {
                this.close();
                if (result.data) {
                    console.log(result.data);
                    this.setState({
                        fundData: result.data.data
                    })
                }
            })
            .catch(error => {
                this.close();
                if(error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    // this.props.history.push('/createfund/funddetails');
                }
            });
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
            <div className="viewFund expandTable">
                <Row className="fNameHeaderMargin">
                    <Col md={6}>
                        <Row>
                            <Col md={3}>
                                <img src={this.state.fundData.fundImage ? this.state.fundData.fundImage.url : fundDefault} alt="home_image" height="96" width="96" className="fundImageLarge"/>
                            </Col>
                            <Col md={8} className="fNameText">
                                <p className="fundName">{this.state.fundData.legalEntity}&nbsp;<span className="statusTxtStyle" hidden={!this.state.fundData.status}>{this.state.fundData.status}</span></p>
                                {/* <p className="fundDate">Fund Start Date: 6/18/2018</p>
                                <p className="fundDate">Fund End Date: 6/18/2021</p> */}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={5}>
                        <div className="bold tPriceStyle price-meter">T:&nbsp;<span>{this.state.fundData['fundTargetCommitment'] ? this.FsnetUtil.convertToCurrency(this.state.fundData['fundTargetCommitment']) : '$0.00'}</span></div>
                        <div className="fund-progress-bar">
                            <div className="price-percentage" style={{ left: (this.state.fundData['fundTargetCommitmentPercent'] ? this.state.fundData['fundTargetCommitmentPercent']+'%' : '0%') }} hidden={!this.state.fundData['fundTargetCommitment']}>
                                {/* <div className="pull-right bold tPriceStyle price-meter">T: {this.FsnetUtil.convertToCurrency(this.state.fundData['fundTargetCommitment'])}</div> */}
                                <div className="caretDownAlign"><i className="fa fa-caret-down"></i></div>
                            </div>
                            <div className="progress-bar">
                                <div className={"progress progress-pink progress-radius-left "+ (!this.state.fundData['closeReadyPercent'] && !this.state.fundData['closedPercent'] ? 'progress-radius-left progress-radius-right' : '')} style={{ width: (this.state.fundData['inProgressPercent'] ? this.state.fundData['inProgressPercent']+'%' : '0%')}}></div>
                                <div className={"progress progress-yellow "+ (!this.state.fundData['inProgressPercent'] ? 'progress-radius-left ' : ' ') + (!this.state.fundData['closedPercent'] ? 'progress-radius-right' : '')} style={{ width: (this.state.fundData['closeReadyPercent'] ? this.state.fundData['closeReadyPercent']+'%' : '0%')}}></div>
                                <div className={"progress progress-green progress-radius-right "+ (!this.state.fundData['closeReadyPercent'] && !this.state.fundData['inProgressPercent'] ? 'progress-radius-left progress-radius-right' : '')} style={{ width: (this.state.fundData['closedPercent'] ? this.state.fundData['closedPercent']+'%' : '0%')}}></div>
                            </div>
                            <div className="price-percentage" style={{ left: (this.state.fundData['fundHardCapPercent'] ? this.state.fundData['fundHardCapPercent']+'%' : '70%') }} hidden={!this.state.fundData['fundHardCap']}>
                                <div className="caretUpAlign"><i className="fa fa-caret-up"></i></div>
                                {/* <div className="pull-right bold hcPriceStyle price-meter">HC: {this.FsnetUtil.convertToCurrency(this.state.fundData['fundHardCap'])}</div> */}
                            </div>
                        </div>
                        <div className="bold hcPriceStyle price-meter">HC:&nbsp;<span>{this.state.fundData['fundHardCap'] ? this.FsnetUtil.convertToCurrency(this.state.fundData['fundHardCap']) : '$0.00'}</span></div>
                    </Col>
                    <Col md={1}>
                        <img src={boxNotificationImage} alt="home_image" className="notificationIcon" />
                        <span className="notificationCount">11</span>
                    </Col>
                </Row>
                <LpTableComponent fundId={this.state.fundId}></LpTableComponent>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default expandLpTableComponent;

