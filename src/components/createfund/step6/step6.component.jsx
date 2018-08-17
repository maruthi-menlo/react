import React, { Component } from 'react';
import '../createfund.component.css';
import { Button, Checkbox as CBox, Row, Col,Modal } from 'react-bootstrap';
import { Link } from "react-router-dom";
import staticImage from '../../../images/profilePic.jpg';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetUtil } from '../../../util/util';
import { Constants } from '../../../constants/constants';
import Loader from '../../../widgets/loader/loader.component';
import { reactLocalStorage } from 'reactjs-localstorage';
import { PubSub } from 'pubsub-js';
import userDefaultImage from '../../../images/default_user.png';
import FundImage from '../../../images/fund-default@2x.png';

class Step6Component extends Component {

    constructor(props) {
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.FsnetUtil = new FsnetUtil();
        this.Constants = new Constants();
        this.state = {
            getLpList: [],
            fundId: null,
            firmId: null,
            showNameAsc: true,
            showOrgAsc: true,
            showStartFundModal: false,
            startFundErrorMsz: '',
            currentFundDataObj: [],
            fundImage: FundImage,
            fundImageName: 'fund_Pic.jpg',
            documentLink:''
        }
        this.proceedToBack = this.proceedToBack.bind(this);
        this.openStartFundModal = this.openStartFundModal.bind(this);
        this.closeStartFundModal = this.closeStartFundModal.bind(this);
        this.openDocument = this.openDocument.bind(this);
        this.startBtnFn = this.startBtnFn.bind(this);
        PubSub.subscribe('fundData', (msg, data) => {
            this.setState({
                fundId: data.id
            }, () => {
                this.getCurrentFundData();
            })
        });
        PubSub.subscribe('startBtnEmit', (msg, data) => {
            this.openStartFundModal();
        });
        PubSub.publish('pageNumber', {type:'sideNav', page: 'review'});
    }

    openDocument() {
        if(this.state.documentLink) {
            window.open(this.state.documentLink, '_blank', 'width = 1000px, height = 600px')
        }
    }

    componentDidMount() {
        let firmId = reactLocalStorage.getObject('firmId');
        var url = window.location.href;
        var parts = url.split("/");
        var urlSplitFundId = parts[parts.length - 1];
        this.setState({
            fundId: urlSplitFundId,
            firmId: firmId,
        }, () => this.getCurrentFundData());
    }

    openStartFundModal() {
        this.setState({
            showStartFundModal: true,
            startFundErrorMsz: ''
        })
    }

    closeStartFundModal() {
        this.setState({
            showStartFundModal: false,
            startFundErrorMsz: ''
        })
    }

    getCurrentFundData() {
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let fundId = this.state.fundId;
        this.Fsnethttp.getFund(fundId, headers).then(result => {
            this.close();
            if (result.data && result.data.data != undefined) {
                this.setState({
                    currentFundDataObj: result.data.data,
                    fundImage: result.data.data.fundImage ? result.data.data.fundImage.url : FundImage,
                    fundImageName: result.data.data.fundImage ? result.data.data.fundImage.originalname : 'fund_Pic.jpg',
                    documentLink: result.data.data.partnershipDocument ? result.data.data.partnershipDocument.url: '',
                    getLpList: result.data.data.lps ? result.data.data.lps : []
                })
            }
        })
        .catch(error => {
            this.close();
        });
    }

    startBtnFn() {
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let fundObj = { fundId: this.state.fundId }
        this.Fsnethttp.startFund(fundObj, headers).then(result => {
            this.close();
            if (result) {
                this.props.history.push('/dashboard');
            }
        })
            .catch(error => {
                this.close();
                if (error.response !== undefined && error.response.data !== undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        startFundErrorMsz: error.response.data.errors[0].msg
                    })
                }
            });
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    proceedToBack() {
        this.props.history.push('/createfund/lp/' + this.state.fundId);
    }

    sortLp(e, colName, sortVal) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let firmId = this.state.firmId;
        let fundId = this.state.fundId;
        if(this.state.getLpList && this.state.getLpList.length > 1) {
            this.open();
            this.Fsnethttp.getLpSort(firmId, fundId, headers, colName, sortVal).then(result => {
                if (result.data && result.data.data.length > 0) {
                    this.close();
                    this.setState({ getLpList: result.data.data });
                    if (colName === 'firstName') {
                        if (sortVal === 'desc') {
                            this.setState({
                                showNameAsc: true
                            })
                        } else {
                            this.setState({
                                showNameAsc: false
                            })
                        }
                    } else {
                        if (sortVal === 'desc') {
                            this.setState({
                                showOrgAsc: true
                            })
                        } else {
                            this.setState({
                                showOrgAsc: false
                            })
                        }
                    }
    
                } else {
                    this.close();
                    this.setState({
                        getLpList: [],
                        showNameAsc: false
                    }, )
                }
            })
                .catch(error => {
                    this.close();
                    this.setState({
                        getLpList: []
                    })
    
                });
        }
    }


    render() {
        return (
            <div className="step6Class marginTop6">
                <div className="step6ClassAboveFooter">
                    <div className="staticContent">
                        <h2 className="title marginBottom2">Review & Confirm</h2>
                        <h4 className="subtext marginBottom30">Verify that everything looks correct before starting your Fund</h4>
                    </div>
                    <Row id="step6-rows1" >
                        <Col md={3} sm={3} xs={6} className="step6-col-pad">
                            <span className="col1">Fund Details</span>
                        </Col>
                        <Col md={5} sm={5} xs={6}>
                            <div className="col2">Legal Entity:  {this.state.currentFundDataObj.legalEntity}</div>
                            <div className="col2" hidden={this.state.currentFundDataObj.fundHardCap === null}>Hard Cap: {this.FsnetUtil.convertToCurrency(this.state.currentFundDataObj.fundHardCap)}</div>
                            <div className="col2">Fund Manager (GP) Legal Entity Name:</div>
                            <div className="col2">{this.state.currentFundDataObj.fundManagerLegalEntityName}</div>
                            <div className="col2" hidden={this.state.currentFundDataObj.fundTargetCommitment === null}>Fund Target Commitment: {this.FsnetUtil.convertToCurrency(this.state.currentFundDataObj.fundTargetCommitment)}</div>
                            <div className="col2" hidden={this.state.currentFundDataObj.percentageOfLPCommitment === null}>% of LP Commitment: {this.state.currentFundDataObj.percentageOfLPCommitment}</div>
                            <div className="col2" hidden={this.state.currentFundDataObj.percentageOfLPAndGPAggregateCommitment === null}>% of LP + GP Aggregate Commitment: {this.FsnetUtil.convertToCurrency(this.state.currentFundDataObj.percentageOfLPAndGPAggregateCommitment)}</div>
                            <div className="col2" hidden={this.state.currentFundDataObj.capitalCommitmentByFundManager === null}>Capital commitment by Fund Manager: {this.state.currentFundDataObj.capitalCommitmentByFundManager}</div>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <div className="col3">Fund Image:</div>
                            <div className="col3"><img src={this.state.fundImage} alt="profile-pic" className="profile-pic" /></div>
                            <div className="col3">{this.state.fundImageName}</div>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><Link to={"/createfund/funddetails/" + this.state.fundId}>Change</Link></span>
                        </Col>
                    </Row>
                    {/* Remaining rows items============ */}
                    <Row className="step6-rows" >
                        <Col md={3} sm={3} xs={6} className="step-col-pad">
                            <span className="col1">GP Delegates</span>
                        </Col>
                        <Col md={7} sm={7} xs={6}>
                            <span className="col2">Review delegates in sidebar and add or remove as necessary</span>
                        </Col>
                        {/* <Col md={3} sm={3} xs={6}>
                            <span className="col3"></span>
                        </Col> */}
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><Link to={"/createfund/gpDelegate/" + this.state.fundId}>Change</Link></span>
                        </Col>
                    </Row>
                    <Row className="step6-rows" >
                        <Col md={3} sm={3} xs={6} className="step-col-pad">
                            <span className="col1">Partnership Agreement</span>
                        </Col>
                        <Col md={4} sm={4} xs={6}>
                            {
                                this.state.currentFundDataObj.partnershipDocument ?
                                <span className="col2"><a className="patnership-link" onClick={this.openDocument}>View Fund Documents</a></span>:
                                <span className="col2">Document not uploaded.</span>
                            }
                        </Col>
                        <Col md={3} sm={3} xs={6}>
                            <span className="col3"></span>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><Link to={"/createfund/upload/" + this.state.fundId}>Change</Link></span>
                        </Col>
                    </Row>
                    <Row className="step6-rows" >
                        <Col md={3} sm={3} xs={6} className="step-col-pad">
                            <span className="col1">Limited Partners</span>
                        </Col>
                        <Col md={7} sm={7} xs={6}>
                            <span className="col2">Review LPs in sidebar and add or remove as necessary</span>
                        </Col>
                        {/* <Col md={3} sm={3} xs={6}>
                            <span className="col3"></span>
                        </Col> */}
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><Link to={"/createfund/lp/" + this.state.fundId}>Change</Link></span>
                        </Col>
                    </Row>
                    <div className="staticTextAndTbl marginTop24">
                        <h2 className="staticText">Select which documents are required for which LPs (check all that apply)</h2>
                        <div className="table">
                            <table className="tableClass">
                                <thead className="tableHeaderClass">
                                    <tr>

                                        <th className="name-heading lpName_pad marginLeft75 borderTopNone text-left" hidden={!this.state.showNameAsc} onClick={(e) => this.sortLp(e, 'firstName', 'asc')}>
                                            LP Name
                                                <i className="fa fa-sort-asc" aria-hidden="true"  ></i>
                                        </th>
                                        <th className="name-heading lpName_pad marginLeft75 borderTopNone text-left" onClick={(e) => this.sortLp(e, 'firstName', 'desc')} hidden={this.state.showNameAsc}>
                                            LP Name
                                            <i className="fa fa-sort-desc" aria-hidden="true"  ></i>
                                        </th>
                                        <th className="name-heading borderTopNone text-left" onClick={(e) => this.sortLp(e, 'organizationName', 'asc')} hidden={!this.state.showOrgAsc}>
                                            Organization
                                            <i className="fa fa-sort-asc" aria-hidden="true"></i>
                                        </th>
                                        <th className="name-heading borderTopNone text-left" onClick={(e) => this.sortLp(e, 'organizationName', 'desc')} hidden={this.state.showOrgAsc}>
                                            Organization
                                            <i className="fa fa-sort-desc" aria-hidden="true" ></i>
                                        </th>
                                        {/* <th className="tableCaret borderTopNone">LP Name<i className="fa fa-caret-down"></i></th> */}
                                        <th className="name-heading borderTopNone text-left">Partnership Agreement</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.getLpList.map((record, index) => {
                                            return (
                                                <tr key={index} hidden={record['selected'] === false}>
                                                    <td className="tableCols lpNameWidth text-left borderRightNone">
                                                        <div>
                                                            <CBox defaultChecked className="pointerNone cboxAlign">
                                                                <span className="checkmark"></span>
                                                            </CBox>
                                                            {
                                                                record['profilePic'] ?
                                                                <img src={record['profilePic']['url']} alt="user-image" className="user-review-image" />
                                                                :
                                                                <img src={userDefaultImage} alt="user-image" className="user-review-image" />
                                                            }
                                                            <span className="review-name reviewLpName">{record['firstName']}&nbsp;{record['lastName']}</span>
                                                        </div>
                                                    </td>
                                                    <td className="tableCols orgNameStyle review-name borderRightNone borderLeftNone reviewOrgName">{record['organizationName']}</td>
                                                    <td className="tableCols borderLeftNone text-left"><CBox defaultChecked className="pointerNone cboxAlign patnerCheckbox"><span className="checkmark"></span></CBox></td>
                                                </tr>
                                            );
                                        })
                                    }
                                    <tr>
                                        <td className="outsideTableCols lpNameWidth text-left">
                                            <div>
                                                <CBox defaultChecked className="pointerNone cboxAlign">
                                                    <span className="checkmark"></span>
                                                </CBox>
                                                <span className="subtext reviewLpName"> Select All</span>
                                            </div>
                                        </td>
                                        <td className="outsideTableCols"></td>
                                        <td className="outsideTableCols text-left"><CBox defaultChecked className="pointerNone cboxAlign patnerCheckbox"><span className="checkmark"></span></CBox></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Loader isShow={this.state.showModal}></Loader>
                    </div>
                    <div className="staticTextBelowTable">
                        <div className="staticTextBelowText">
                            Once everything is confirmed correct, click the “Start Fund” button in the sidebar.
                    </div>
                    </div>
                    {/* <div className="startFundButtonStyle">
                        <Button className="fsnetButton" onClick={this.openStartFundModal}><i className="fa fa-check strtFndChk" aria-hidden="true"></i>&nbsp;Start Fund</Button>                                    
                    </div> */}

                </div>
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right disabled" aria-hidden="true"></i>
                </div>
                <Modal id="confirmFundModal" show={this.state.showStartFundModal}  onHide={this.closeStartFundModal} dialogClassName="confirmFundDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <h1 className="title">Are you sure you want to start this Fund?</h1>
                        <div className="subtext">All LPs invited to the Fund will receive an email invitation and in app notification to join the Fund. If an LP has not yet registered on FSNET they will be invited to register for an account.</div>
                        <div className="error">{this.state.startFundErrorMsz}</div>
                        <Row className="fundBtnRow">
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Button type="button" className="fsnetSubmitButton btnEnabled" onClick={this.closeStartFundModal}>No, take me back</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Button type="button" className="fsnetSubmitButton btnEnabled" onClick={this.startBtnFn}>Yes, start the fund</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>
















            </div>
        );
    }
}

export default Step6Component;



