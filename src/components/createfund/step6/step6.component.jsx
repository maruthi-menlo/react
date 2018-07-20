import React, { Component } from 'react';
import '../createfund.component.css';
import { Button,Checkbox as CBox, Row, Col } from 'react-bootstrap';
import staticImage from '../../../images/profilePic.jpg';
import { Fsnethttp } from '../../../services/fsnethttp';
import {Constants} from '../../../constants/constants';
import Loader from '../../../widgets/loader/loader.component';
import { reactLocalStorage } from 'reactjs-localstorage';

class Step6Component extends Component {

    constructor(props) {
        super(props);        
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.state = {
            getLpList:[],
            fundId: null,
            firmId : null,
            showNameAsc: true,
            showOrgAsc : true,
            showStartFundModal: false,
            startFundErrorMsz:'',
            currentFundDataObj:[],
            fundImage:staticImage,
            fundImageName: 'Helios_Fund.jpg'
        }
        this.proceedToBack = this.proceedToBack.bind(this);
        this.openStartFundModal = this.openStartFundModal.bind(this);
        this.closeStartFundModal = this.closeStartFundModal.bind(this);
        this.startBtnFn = this.startBtnFn.bind(this);
        
    }

    componentDidMount() { 
        let firmId = reactLocalStorage.getObject('firmId');
        var url = window.location.href;
        var parts = url.split("/");
        var urlSplitFundId = parts[parts.length - 1];
        this.setState({ 
            fundId: urlSplitFundId,
            firmId : firmId,
        }, () => this.getFundDetails());        
    }

    getFundDetails() {
        this.getLpDetails();
        this.getCurrentFundData();
    }

    openStartFundModal() {
        window.scrollTo(300, 0)   
        this.setState({
            showStartFundModal: true,
            startFundErrorMsz:''
        })
    }

    closeStartFundModal() {
        this.setState({
            showStartFundModal: false,
            startFundErrorMsz:''
        })
    }

    getCurrentFundData() {
        this.open();
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let fundId = this.state.fundId;
        this.Fsnethttp.getFund(fundId,headers).then(result=>{
            this.close();
            if(result.data && result.data.data != undefined) {
                this.setState({
                    currentFundDataObj: result.data.data,
                    fundImage: result.data.data.fundImage ? result.data.data.fundImage.url: staticImage,
                    fundImageName: result.data.data.fundImage ? result.data.data.fundImage.originalname: 'Helios_Fund.jpg',
                })
            }
        })
        .catch(error=>{
            this.close();
        });
    }

    startBtnFn() {
        this.open();
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let fundObj = {fundId: this.state.fundId}
        this.Fsnethttp.startFund(fundObj,headers).then(result=>{
            this.close();
            if(result) {
                this.props.history.push('/dashboard');
            }
        })
        .catch(error=>{
            this.close();
            if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                this.setState({
                    startFundErrorMsz: error.response.data.errors[0].msg
                })
            } 
        });
    }


    getLpDetails() {
        var url = window.location.href;
        var parts = url.split("/");
        var urlSplitFundId = parts[parts.length - 1];
        let fundId = urlSplitFundId;
        this.setState({
            fundId: urlSplitFundId
        })
        this.open();
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let firmId = reactLocalStorage.getObject('firmId');
        this.Fsnethttp.getLp(firmId, fundId, headers).then(result=>{
            this.close();
            if(result.data && result.data.data.length >0) {
                this.setState({ getLpList: result.data.data });
            } else {
                this.setState({
                    getLpList: []
                })
            }
        })
        .catch(error=>{
                this.close();
                this.setState({
                    getLpList: []
            })
           
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
        this.props.history.push('/createfund/lp/'+this.state.fundId);
    }

    sortLp(e, colName, sortVal) { 
        this.open();
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let firmId = this.state.firmId;
        let fundId = this.state.fundId;
        this.Fsnethttp.getLpSort(firmId, fundId, headers,colName,sortVal).then(result=>{
            if(result.data && result.data.data.length >0) {
                this.close();
                this.setState({ getLpList: result.data.data });
                if(colName == 'firstName') {
                    if (sortVal == 'desc') {
                        this.setState({
                        showNameAsc : true
                        })
                    } else {
                        this.setState({
                            showNameAsc : false
                        })
                    }
                 } else {
                    if (sortVal == 'desc') {
                        this.setState({
                            showOrgAsc : true
                        })
                    } else {
                        this.setState({
                            showOrgAsc : false
                        })
                    }
                }
                
            } else {
                this.close();
                this.setState({
                    getLpList: [],
                    showNameAsc : false
                },)
            }
        })
        .catch(error=>{
                this.close();
                this.setState({
                    getLpList: []
                })
           
        });
    }
    

    render() {
        return (
            <div className="step6Class marginTop30">
                <div className="step6ClassAboveFooter">
                    <div className="staticContent">
                        <h2>Review & Confirm</h2>
                        <h4>Verify that everything looks correct before starting your fund</h4>
                    </div>
                    <Row id="step6-rows1" >
                        <Col md={3} sm={3} xs={6}>
                            <span className="col1">Fund Details</span>                    
                        </Col>
                        <Col md={5} sm={5} xs={6}>
                            <div className="col2">Legal Entity:  {this.state.currentFundDataObj.legalEntity}</div>
                            <div className="col2">Hard cap: {this.state.currentFundDataObj.fundHardCap}</div>
                            <div className="col2">Fund Manager (GP) Legal Entity Name: {this.state.currentFundDataObj.fundManagerLegalEntityName}</div>
                            <div className="col2" hidden={this.state.currentFundDataObj.percentageOfLPCommitment === null}>% of LP Commitment: {this.state.currentFundDataObj.percentageOfLPCommitment}</div>
                            <div className="col2" hidden={this.state.currentFundDataObj.percentageOfLPAndGPAggregateCommitment === null}>% of LP + GP Aggregate Commitment: {this.state.currentFundDataObj.percentageOfLPAndGPAggregateCommitment}</div>
                            <div className="col2" hidden={this.state.currentFundDataObj.capitalCommitmentByGP ===  null}>Capital commitment by fund manager: {this.state.currentFundDataObj.capitalCommitmentByGP}</div>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <div className="col3">Fund Image:</div>
                            <div className="col3"><img src={this.state.fundImage} alt="profile-pic" className="profile-pic"/></div>
                            <div className="col3">{this.state.fundImageName}</div>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><a href={"/createfund/funddetails/"+this.state.fundId}>Change</a></span>
                        </Col>
                    </Row>
                    {/* Remaining rows items============ */}
                    <Row className="step6-rows" >
                        <Col md={3} sm={3} xs={6}>
                            <span className="col1">GP Delegates</span>                    
                        </Col>
                        <Col md={4} sm={4} xs={6}>
                            <span className="col2">Review delegates in sidebar and add or remove as necessary</span>
                        </Col>
                        <Col md={3} sm={3} xs={6}>
                            <span className="col3"></span>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><a href={"/createfund/gpDelegate/"+this.state.fundId}>Change</a></span>
                        </Col>
                    </Row>
                    <Row className="step6-rows" >
                        <Col md={3} sm={3} xs={6}>
                            <span className="col1">Partnership Agreement</span>                 
                        </Col>
                        <Col md={4} sm={4} xs={6}>
                            <span className="col2"><a className="patnership-link" href={"/createfund/upload/"+this.state.fundId}>View Fund Documents</a></span>
                        </Col>
                        <Col md={3} sm={3} xs={6}>
                            <span className="col3"></span>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><a href={"/createfund/upload/"+this.state.fundId}>Change</a></span>
                        </Col>
                    </Row>
                    <Row className="step6-rows" >
                        <Col md={3} sm={3} xs={6}>
                            <span className="col1">Limited Partners</span>                    
                        </Col>
                        <Col md={4} sm={4} xs={6}>
                            <span className="col2">Review LP’s in sidebard and add or remove as necessary</span>
                        </Col>
                        <Col md={3} sm={3} xs={6}>
                            <span className="col3"></span>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><a href={"/createfund/lp/"+this.state.fundId}>Change</a></span>
                        </Col>
                    </Row>
                    <div className="staticTextAndTbl marginTop20">
                        <h2 className="staticText">Select which documents are required for which LPs (check all that apply)</h2>
                        <div className="table">
                            <table className="tableClass">
                                <thead className="tableHeaderClass">
                                    <tr>

                                        <th className="name-heading marginLeft75 borderTopNone text-left" hidden={!this.state.showNameAsc} onClick={(e) => this.sortLp(e,'firstName','asc')}>
                                            LP Name
                                                <i className="fa fa-sort-asc"   aria-hidden="true"  ></i>
                                        </th>
                                        <th className="name-heading marginLeft75 borderTopNone text-left" onClick={(e) => this.sortLp(e,'firstName','desc')} hidden={this.state.showNameAsc}>
                                            LP Name
                                            <i className="fa fa-sort-desc"  aria-hidden="true"  ></i>
                                        </th>
                                        <th className="name-heading borderTopNone text-left" onClick={(e) => this.sortLp(e,'organizationName','asc')} hidden={!this.state.showOrgAsc}>
                                            Organization
                                            <i className="fa fa-sort-asc"  aria-hidden="true"></i>
                                        </th>
                                        <th className="name-heading borderTopNone text-left" onClick={(e) => this.sortLp(e,'organizationName','desc')} hidden={this.state.showOrgAsc}>
                                            Organization
                                            <i className="fa fa-sort-desc"  aria-hidden="true" ></i>
                                        </th>
                                        {/* <th className="tableCaret borderTopNone">LP Name<i className="fa fa-caret-down"></i></th> */}
                                        <th className="borderTopNone text-left">partnership...</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    this.state.getLpList.map((record, index)=>{
                                        return(
                                    
                                            <tr key={index}>
                                                <td className="tableCols lpNameWidth text-left borderRightNone">
                                                    <div>
                                                        <CBox defaultChecked className="pointerNone cboxAlign">
                                                            <span className="checkmark"></span>
                                                        </CBox>
                                                        <span>{record['firstName']}</span>
                                                    </div>
                                                </td>
                                                <td className="tableCols orgNameStyle borderRightNone borderLeftNone">{record['organizationName']}</td>
                                                <td className="tableCols borderLeftNone text-left"><CBox defaultChecked className="pointerNone cboxAlign"><span className="checkmark"></span></CBox></td>
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
                                                <span> Select All</span>
                                            </div>      
                                        </td>
                                        <td className="outsideTableCols"></td>
                                        <td className="outsideTableCols text-left"><CBox defaultChecked className="pointerNone cboxAlign"><span className="checkmark"></span></CBox></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <Loader isShow={this.state.showModal}></Loader>
                    </div>
                    <div className="staticTextBelowTable text-center">Once everything is confirmed correct, click the “Start Fund”.</div>
                    <div className="startFundButtonStyle">
                        <Button className="fsnetButton" onClick={this.openStartFundModal}><i className="fa fa-check strtFndChk" aria-hidden="true"></i>&nbsp;Start Fund</Button>                                    
                    </div>

                </div>
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    {/* <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i> */}
                </div>

                <div className="fundStartModal" hidden={!this.state.showStartFundModal}>
                    <div className="croosMarkStyle"><span className="cursor-pointer" onClick={this.closeStartFundModal}>x</span></div>
                    <h1 className="title">Are you sure you want to start this Fund?</h1>
                    <div className="subtext">All LPs invited to the fund will receive an email invitation and in app notification to join the fund. If an LP has not yet registered on FSNET they will be invited to register for an account.</div>
                    <div className="error">{this.state.startFundErrorMsz}</div>
                    <Row className="fundBtnRow">
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetSubmitButton btnEnabled" onClick={this.closeStartFundModal}>No, take me back</Button>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetSubmitButton btnEnabled" onClick={this.startBtnFn}>Yes, start the fund</Button>
                        </Col>
                    </Row> 
                </div>
            </div>
        );
    }
}

export default Step6Component;



