import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Row, Col,Button} from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { FsnetUtil } from '../../../util/util';
import { Route, Link } from "react-router-dom";
import { PubSub } from 'pubsub-js';
import { reactLocalStorage } from 'reactjs-localstorage';

class reviewComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.proceedToBack = this.proceedToBack.bind(this);
        this.submitSubscription = this.submitSubscription.bind(this);
        this.state = {
            showModal: false,
            investorType: 'LLC',
            lpObj:{},
            investorSubTypeName:'',
            jurisdictionEntityLegallyRegisteredName:'',
            hideConfirmBtn:false
        }

    }

    componentDidMount() {
        let id = this.FsnetUtil.getLpFundId();
        this.setState({
            subscriptionId: id
        })
        this.getSubscriptionDetails(id);
    }


    getSubscriptionDetails(id) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        if (id) {
            this.open();
            this.Fsnethttp.getLpSubscriptionDetails(id, headers).then(result => {
                this.close();
                if (result.data) {
                    this.setState({
                        investorType: result.data.data.investorType? result.data.data.investorType:'LLC',
                    })
                    if(result.data.data.investorType === 'Individual') {
                        this.updateIndividualData(this.FsnetUtil.decodeObj(result.data.data));
                    } else if(result.data.data.investorType === 'LLC') {
                        this.updateLLCData(this.FsnetUtil.decodeObj(result.data.data));
                    } else if(result.data.data.investorType === 'Trust') {
                        this.updateTrustData(this.FsnetUtil.decodeObj(result.data.data));
                    }
                }
            })
            .catch(error => {
                this.close();
            });
        }
    }

    updateIndividualData(data) {
        let obj = data;
        obj['currentInvestorInfoPageNumber'] = 1;
        obj['currentPageCount'] = 4;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        PubSub.publish('investorData',obj );
        this.setState({
            lpObj: data,
        }, () => {
            this.getAllCountires();
        })
    }

    updateLLCData(data) {
        let obj = data;
        obj['currentInvestorInfoPageNumber'] = 1;
        obj['currentPageCount'] = 8;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        PubSub.publish('investorData',obj );
        this.setState({
            lpObj: data,
        },()=>{
            if (this.state.lpObj.otherInvestorSubType !== null && this.state.lpObj.otherInvestorSubType !== undefined) {
                this.jurisdictionTypes(1, 'otherEntity' )
            } else {
                this.investorSubTypes();
            }
            this.getAllCountires();
        })
    }

    updateTrustData(data) {
        let obj = data;
        obj['currentInvestorInfoPageNumber'] = 1;
        obj['currentPageCount'] = 6;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        PubSub.publish('investorData',obj );
        this.setState({
            lpObj: data,
        },()=>{
            this.investorTrustSubTypes();
            this.getAllCountires();
        })
    }

    proceedToBack() {
        if(this.state.lpObj.investorType === 'Individual') {
            this.props.history.push('/lp/qualifiedPurchaser/'+this.state.lpObj.id);
        }else if(this.state.lpObj.investorType === 'LLC') {
            this.props.history.push('/lp/erisa/'+this.state.lpObj.id);
        }
    }

    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    //Call investor sub types
    investorSubTypes() {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        this.Fsnethttp.getInvestorSubTypes(headers).then(result => {
            this.close();
            let id = parseInt(this.state.lpObj.investorSubType);
            if (result.data) {
                for(let index of result.data) {
                    if(index['id'] === id) {
                        this.setState({
                            investorSubTypeName: index['name']
                        })
                        this.jurisdictionTypes(index['isUS'],index['id'] )
                    }
                }
            }
        })
        .catch(error => {
            this.close();
        });
    }

    investorTrustSubTypes() {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        this.Fsnethttp.getInvestorTrustSubTypes(headers).then(result => {
            this.close();
            let id = parseInt(this.state.lpObj.investorSubType);
            if (result.data) {
                for(let index of result.data) {
                    if(index['id'] === id) {
                        this.setState({
                            investorSubTypeName: index['name']
                        })
                    }
                }
            }
        })
            .catch(error => {
                this.close();
            });
    }

    //Call investor sub types for trust
    getAllCountires() {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        this.Fsnethttp.getAllCountires(headers).then(result => {
            this.close();
            if (result.data) {
                let id = parseInt(this.state.lpObj.mailingAddressCountry);
                let domiciledId = parseInt(this.state.lpObj.trustLegallyDomiciled);
                let jurisdictionEntityLegallyRegisteredId = parseInt(this.state.lpObj.jurisdictionEntityLegallyRegistered);
                for(let index of result.data) {
                    if(this.state.lpObj.investorType == 'LLC') {
                        if(index['id'] == jurisdictionEntityLegallyRegisteredId) {
                            this.getStatesByCountry(jurisdictionEntityLegallyRegisteredId, 'trust');
                        }
                    }
                    if(index['id'] === id) {
                        this.setState({
                            mailingAddressCountryName: index['name']
                        }, () => {
                            this.getStatesByCountry(id, 'mailing');
                        })
                    }
                    if(index['id'] === domiciledId) {
                        this.setState({
                            trustLegallyDomiciledName: index['name']
                        }, () => {
                            this.getStatesByCountry(domiciledId, 'trust');
                        })
                    }
                }
            }
        })
            .catch(error => {
                this.close();
            });
    }

    getStatesByCountry(value, isUS) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        return this.Fsnethttp.getStates(value, headers).then(result => {
            this.close();
            if (result.data) {
                if(isUS == 'trust' && value == 231) {
                    let stateId = parseInt(this.state.lpObj.selectState);
                    for(let index of result.data) {
                        if(index['id'] == stateId) {
                            // if(isUS && value == 231) {
                                this.setState({
                                    selectStateName: index['name']
                                })
                            // }                           
                        }
                    }
                }  else {
                    let Id = parseInt(this.state.lpObj.mailingAddressState);
                    for(let index of result.data) {
                        if(index['id'] == Id) {
                            // if(isUS && value == 231) {
                                this.setState({
                                    mailingAddressStateName: index['name']
                                })
                            // }                           
                        }
                    }
                }
            }
        })
            .catch(error => {
                this.close();
            });
    }


    //Get countries or states based on sub types selection
    //ISUS value is taken to check whether investor sub type belongs to US or  nonUS
    jurisdictionTypes(isUs, value) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let url = 'getAllCountires'
        if(value === 'otherEntity') {
            // url = 'getAllCountires/1'
            url = 'getAllCountires'
        }
        if(isUs == 0) {
            url = 'getUSStates'
        }
        this.Fsnethttp.getJurisdictionTypes(headers,url).then(result => {
            if (result.data) {
                let id = parseInt(this.state.lpObj.jurisdictionEntityLegallyRegistered);
                for(let index of result.data) {
                    if(index['id'] === id) {
                        this.setState({
                            jurisdictionEntityLegallyRegisteredName: index['name']
                        })
                    }
                }
            }
        })
        .catch(error => {
            this.close();
        });
    }

    submitSubscription() {
        this.setState({
            hideConfirmBtn:true
        })
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        this.Fsnethttp.submitSubscription(this.state.subscriptionId, headers).then(result => {
            this.close();
            if (result.data) {
                console.log('this.state.subscriptionId::', result.data);
                window.open(result.data.url, '_blank', 'width = 1000px, height = 600px')
            }
        })
        .catch(error => {
            this.close();
        });
        
    }

    render() {
        return (
            <div className="accreditedInvestor width100" id="subscriptionReview">
                <div className="step6ClassAboveFooter">
                    <div className="staticContent">
                        <h2 className="title marginBottom2">Review & Confirm</h2>
                        <h4 className="subtext marginBottom30">Verify that everything looks correct before signing your Fund</h4>
                    </div>

                    <div hidden={this.state.investorType !== 'Individual'}>
                        {/* <Row id="step6-row1" >
                            <Col md={2} sm={2} xs={6} className="step6-col-pad">
                                <span className="col1">Investor Information</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <div className="col2">Investor Type: {this.state.lpObj.investorType}</div>
                                <div className="col2">your name: {this.state.lpObj.name}</div>
                                <div className="col2" hidden={!this.state.lpObj.areYouSubscribingAsJointIndividual}>Are you subscribing as joint individuals with your spouse, such as community property or tenants in comment? : Yes</div>
                                <div className="col2" hidden={this.state.lpObj.areYouSubscribingAsJointIndividual}>Are you subscribing as joint individuals with your spouse, such as community property or tenants in comment? : No</div>
                                <div className="col2" hidden={this.state.lpObj.areYouSubscribingAsJointIndividual === false}>Spouse’s Name: {this.state.lpObj.spouseName}</div>
                                <div className="col2">Indicate The Type of Legal Ownership Desired: {this.state.lpObj.typeOfLegalOwnership}</div>
                                <div className="col2">Street: {this.state.lpObj.mailingAddressStreet}</div>
                                <div className="col2">City: {this.state.lpObj.mailingAddressCity}</div>
                                <div className="col2">State: {this.state.lpObj.mailingAddressState}</div>
                                <div className="col2">Zip: {this.state.lpObj.mailingAddressZip}</div>
                                <div className="col2">Phone Number: {this.state.lpObj.mailingAddressPhoneNumber}</div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/investorInfo/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row> */}

                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Investor Information</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Investor Type:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.investorType}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Email Address:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.email}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Name:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.name}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Are you subscribing as joint individuals with your spouse, such as community property or tenants in common:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.areYouSubscribingAsJointIndividual != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                {/* <div hidden={this.state.lpObj.areYouSubscribingAsJointIndividual === false}>
                                    <span className="col2">Spouse’s Name:</span>
                                    <span className="lightContent">{this.state.lpObj.spouseName}</span>
                                </div> */}
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Indicate The Type of Legal Ownership Desired:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.typeOfLegalOwnership == 'communityProperty' ? 'Community Property' : ''}</span>
                                            <span className="lightContent">{this.state.lpObj.typeOfLegalOwnership == 'tenantsInCommon' ? 'Tenants in Common' : ''}</span>
                                            <span className="lightContent">{this.state.lpObj.typeOfLegalOwnership == 'jointTenants' ? 'Joint Tenants' : ''}</span>
                                            <span className="lightContent">{this.state.lpObj.typeOfLegalOwnership == 'Other' ? 'Other' : ''}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Disqualifying Event:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.isSubjectToDisqualifyingEvent != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row  hidden={this.state.lpObj.fundManagerInfo == null}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">The Investor has other information to disclose to the Fund Manager in connection with the investment:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.fundManagerInfo}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Country:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.mailingAddressCountryName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">State:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.mailingAddressStateName}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Street:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                             
                                            <span className="lightContent">{this.state.lpObj.mailingAddressStreet}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">City:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.mailingAddressCity}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Zip:</span>
                                       
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                       
                                        <span className="lightContent">{this.state.lpObj.mailingAddressZip}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Primary Business Telephone:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.mailingAddressPhoneNumber}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/investorInfo/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>
                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Capital Commitment</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Offer to subscribe for Capital Commitment of:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.lpCapitalCommitment ? this.FsnetUtil.convertToCurrency(this.state.lpObj.lpCapitalCommitment) : ''}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/capitalCommitment/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Accredited Investor</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Accredited Investor:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.areYouAccreditedInvestor != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Qualified Purchaser</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Qualified Purchaser:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.areYouQualifiedPurchaser != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" hidden={this.state.lpObj.areYouQualifiedPurchaser}>
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1 step-col-pad1">
                                <span className="col1">Qualified Client</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Qualified Client:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.areYouQualifiedClient != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                       
                    </div>



                    <div hidden={this.state.investorType !== 'LLC'}>
                        {/* <Row id="step6-row1" >
                            <Col md={2} sm={2} xs={6} className="step6-col-pad">
                                <span className="col1">Investor Information (1/2)</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <div className="col2">Investor Type:  {this.state.lpObj.investorType}</div>
                                <div className="col2" hidden={this.state.investorSubTypeName === ''}>Investor Sub Type: {this.state.investorSubTypeName}</div>

                                <div className="col2" hidden={this.state.lpObj.otherInvestorSubType === null}>Investor Sub Type: Other Entity</div>
                                <div className="col2" hidden={this.state.lpObj.otherInvestorSubType === null}>Enter the Entity Type: {this.state.lpObj.otherInvestorSubType}</div>
                                <div className="col2">Email Address: {this.state.lpObj.email}</div>
                                <div className="col2">Entity’s Name: {this.state.lpObj.entityName}</div>
                                <div className="col2">In what jurisdiction is the Entity legally registered: {this.state.jurisdictionEntityLegallyRegisteredName}</div>
                                <div className="col2" hidden={this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true}>Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes: Yes</div>
                                <div className="col2" hidden={this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== false}>Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes: No</div>
                                <div className="col2" hidden={this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true || this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true}>Is the Entity a U.S. 501(c)(3): Yes</div>
                                <div className="col2" hidden={(this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true || this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== false)}>Is the Entity a U.S. 501(c)(3): No</div>
                                <div className="col2" hidden={this.state.lpObj.releaseInvestmentEntityRequired !== true}>Is the Entity required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act ("FOIA”) or any similar statues anywhere else worldwide: Yes</div>
                                <div className="col2" hidden={this.state.lpObj.releaseInvestmentEntityRequired !== false}>Is the Entity required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act ("FOIA”) or any similar statues anywhere else worldwide: No</div>
                                <div className="col2">Street: {this.state.lpObj.mailingAddressStreet}</div>
                                <div className="col2">City: {this.state.lpObj.mailingAddressCity}</div>
                                <div className="col2">State: {this.state.lpObj.mailingAddressState}</div>
                                <div className="col2">Zip: {this.state.lpObj.mailingAddressZip}</div>
                                <div className="col2">Phone Number: {this.state.lpObj.mailingAddressPhoneNumber}</div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/investorInfo/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row> */}

                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Investor Information</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">

                                    </Col>
                                    <Col md={5} sm={5} xs={5}>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Investor Type:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                        
                                        <span className="lightContent">Entity</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row hidden={this.state.investorSubTypeName === ''}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div >
                                        <span className="col2">Investor Sub Type:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                        
                                        <span className="lightContent">{this.state.investorSubTypeName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row hidden={this.state.lpObj.otherInvestorSubType === null}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Investor Sub Type:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            <span className="lightContent">Other Entity</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row hidden={this.state.lpObj.otherInvestorSubType === null}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                    <div >
                                    <span className="col2">Enter the Entity Type:</span>
                                    
                                    </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                    <div>
                                    
                                    <span className="lightContent">{this.state.lpObj.otherInvestorSubType}</span>
                                    </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Email Address:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                       
                                        <span className="lightContent">{this.state.lpObj.email}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Entity’s Name:</span>
                                       
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.entityName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Entity's Jurisdiction:</span>
                                       
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                        
                                        <span className="lightContent">{this.state.jurisdictionEntityLegallyRegisteredName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row  hidden={this.state.lpObj.jurisdictionEntityLegallyRegistered != 231}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Select State:</span>
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            <span className="lightContent">{this.state.selectStateName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Tax Exempt:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row hidden={this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Is the Entity a U.S. 501(c)(3):</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                        <span className="lightContent">{this.state.lpObj.isEntityUS501c3 != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">FOIA sensitive:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                       
                                        <span className="lightContent">{this.state.lpObj.releaseInvestmentEntityRequired != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Disqualifying Event:</span>
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            <span className="lightContent">{this.state.lpObj.isSubjectToDisqualifyingEvent != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row hidden={this.state.lpObj.fundManagerInfo == null}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">The Investor has other information to disclose to the Fund Manager in connection with the investment:</span>
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            <span className="lightContent">{this.state.lpObj.fundManagerInfo}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row hidden={this.state.lpObj.fundManagerInfo == null}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Other Investor Attributes:</span>
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            <span className="lightContent">{this.state.lpObj.otherInvestorAttributes ? this.state.lpObj.otherInvestorAttributes.join(', ') : null}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Country:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                        <span className="lightContent">{this.state.mailingAddressCountryName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">State:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                        
                                        <span className="lightContent">{this.state.mailingAddressStateName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Street:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.mailingAddressStreet}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                    <div>
                                    <span className="col2">City:</span>
                                    
                                    </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                    <div>
                                    
                                    <span className="lightContent">{this.state.lpObj.mailingAddressCity}</span>
                                    </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Zip:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.mailingAddressZip}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Primary Business Telephone:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                        <span className="lightContent">{this.state.lpObj.mailingAddressPhoneNumber}</span>
                                        </div>
                                    </Col>
                                </Row>                                 
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/investorInfo/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>
                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Capital Commitment</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                            <Row>
                            <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                <div>
                                    <span className="col2">Offer to subscribe for Capital Commitment of:</span>
                                    
                                </div>
                            </Col>
                            <Col md={5} sm={5} xs={5} className="answerYesNo">
                                <div>
                                    
                                    <span className="lightContent">{this.state.lpObj.lpCapitalCommitment ? this.FsnetUtil.convertToCurrency(this.state.lpObj.lpCapitalCommitment) : ''}</span>
                                </div>
                            </Col>
                            </Row>
                               
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/capitalCommitment/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>
                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Accredited Investor</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Accredited Investor:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                        <span className="lightContent">{this.state.lpObj.areYouAccreditedInvestor != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>    
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/AccreditedInvestor/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Qualified Purchaser</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Qualified Purchaser:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.areYouQualifiedPurchaser != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" hidden={this.state.lpObj.areYouQualifiedPurchaser}>
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Qualified Client</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Qualified Client:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.areYouQualifiedClient != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>
                        
                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Companies Act</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Status under Companies Act:</span>
                                        {/* <span className="lightContent">{this.state.lpObj.areYouAccreditedInvestor != true ? 'No' : 'Yes'}</span> */}
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerText">
                                        <div>
                                        
                                        {/* <span className="lightContent">{this.state.lpObj.areYouAccreditedInvestor != true ? 'No' : 'Yes'}</span> */}
                                        <span className="lightContent" hidden={this.state.lpObj.companiesAct != 1}>The Entity is not an "investment company” and does not rely on Section 3(c)(1) or Section 3(c)(7) of the Companies Act in order to be deemed excluded from being treated as an "investment company".</span>
                                        <span className="lightContent" hidden={this.state.lpObj.companiesAct != 2}>The Entity would be an "investment company” but it is not treated as such because it relies on Section 3(c)(1) of the Companies Act to avoid such treatment.</span>
                                        <span className="lightContent" hidden={this.state.lpObj.companiesAct != 3}>The Entity would be an "investment company” but it is not treated as such because it relies on Section 3(c)(7) of the Companies Act to avoid such treatment.</span>
                                        <span className="lightContent" hidden={this.state.lpObj.companiesAct != 4}>The Entity is an "investment company” pursuant to the Companies Act, not relying on any exemption from treatment as such.</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                            <span className="col4 colm"><Link to={"/lp/companiesAct/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Equity Owners</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row className="step-row-borderBottom firstQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Number of direct equity owners:</span>
                                       
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.numberOfDirectEquityOwners}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Control or common control with other investors:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                       
                                        <span className="lightContent">{this.state.lpObj.existingOrProspectiveInvestorsOfTheFund != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row hidden={this.state.lpObj.existingOrProspectiveInvestorsOfTheFund !== true} className="step-row-borderTop remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Existing or prospective investors:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.numberOfexistingOrProspectives}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/equityOwners/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Look-Through Issues</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row className="step-row-borderBottom firstQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Not organized for the purpose of acquiring the investment:</span>
                                       
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.entityProposingAcquiringInvestment != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="step-row-borderBottom remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">No control with any other investor in the fund:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.anyOtherInvestorInTheFund != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="step-row-borderBottom remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Beneficial owners share underlying investments in same proportions:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                         
                                        <span className="lightContent">{this.state.lpObj.entityHasMadeInvestmentsPriorToThedate != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="step-row-borderBottom remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Investment in the Fund will not constitute more than the Entity’s assets:</span>
                                       
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.partnershipWillNotConstituteMoreThanFortyPercent != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>    
                                <Row className="remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">No ability of beneficial owners to vary profits participation of underlying investments:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                       
                                        <span className="lightContent">{this.state.lpObj.beneficialInvestmentMadeByTheEntity != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>   
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/entityProposing/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">ERISA</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row className="step-row-borderBottom firstQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">"Employee benefit plan,” as defined in Section 3(3) of ERISA:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.employeeBenefitPlan != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="step-row-borderBottom remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">"Plan," as defined in Section 4975(e)(1) of the Code:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.planAsDefinedInSection4975e1 != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                        <span className="col2">Deemed to be a "benefit plan investor” under the Plan Asset Regulation:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.benefitPlanInvestor != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row hidden={this.state.lpObj.benefitPlanInvestor !== true} className="step-row-borderTop remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div >
                                        <span className="col2">Total value of equity interests held by "benefit plan investors”:</span>
                                        
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                        
                                        <span className="lightContent">{this.state.lpObj.totalValueOfEquityInterests}%</span>
                                        </div>
                                    </Col>
                                </Row>   
                                { 
                                    this.state.lpObj.employeeBenefitPlan == true || this.state.lpObj.planAsDefinedInSection4975e1 == true 
                                ? 
                                    <div hidden={this.state.lpObj.fiduciaryEntityIvestment === false && this.state.lpObj.entityDecisionToInvestInFund === false}>
                                        <Row className="step-row-borderTop remainingQuesitionPadding" hidden={(this.state.lpObj.fiduciaryEntityIvestment === false || this.state.lpObj.fiduciaryEntityIvestment === null) && (this.state.lpObj.entityDecisionToInvestInFund === false || this.state.lpObj.entityDecisionToInvestInFund === null)}>
                                            <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                <div>
                                                    <div className="col2">Please confirm the following representations to continue:</div>
                                                    
                                                </div>
                                            </Col>
                                            <Col md={5} sm={5} xs={5} className="answerText">
                                                <div>
                                                    
                                                    {/* <div className="lightContent" hidden={this.state.lpObj.fiduciaryEntityIvestment !== true}>The person executing this agreement is a fiduciary of the Entity making the investment.</div> */}
                                                    <div className="lightContent" hidden={this.state.lpObj.fiduciaryEntityIvestment !== true}>The person executing this agreement is a fiduciary of the Investor.</div>
                                                    {/* <div className="lightContent" hidden={this.state.lpObj.entityDecisionToInvestInFund !== true}>The Entity’s decision to invest in the Fund was made by the person executing this agreement and such person (i) is a fiduciary under ERISA or Section 4975 of the Code, or both, with respect to the Entity’s decision to invest in the Fund; (ii) is responsible for exercising independent judgment in evaluating the investment in the Fund; (iii) is independent of the Fund, its general partner or similar manager and any and all affiliates of the preceding; and (iv) is capable of evaluating investment risks independently, both in general and with regard to particular transactions and investment strategies, including the decision on behalf of the Entity to invest in the Fund.</div> */}
                                                    <div className="lightContent" hidden={this.state.lpObj.entityDecisionToInvestInFund !== true}>The decision to invest in the Fund was made by the Signatory hereto.</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row className="step-row-borderTop remainingQuesitionPadding">
                                            <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                <div>
                                                    <div>
                                                        <div className="col2">The person executing this agreement is one of the following:</div>
                                                         
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={5} sm={5} xs={5} className="answerText">
                                                <div>
                                                    <div>
                                                        
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 1}>An independent fiduciary that holds, or has under management or control, total assets of at least $50,000,000.</div>
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 2}>A bank as defined in Section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency.</div>
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 3}>An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan.</div>
                                                        {/* <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 4}>An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business.</div> */}
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 4}>An investment adviser.</div>
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 5}>A broker-dealer that is registered under the Exchange Act.</div>
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                        
                                    </div>
                                : 
                                    null
                                }
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/erisa/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>
                    </div>




                    <div hidden={this.state.investorType !== 'Trust'}>
                        <Row id="step6-row1" >
                            <Col md={2} sm={2} xs={6} className="step6-col-pad">
                                <span className="col1">Investor Information</span>
                            </Col>
                            {/* <Col md={9} sm={9} xs={6} className="step-col-pad2"> */}
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Investor Type:</span>
                                           
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.investorType}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row  hidden={this.state.investorSubTypeName === ''}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Investor Sub Type:</span>
                                           
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.investorSubTypeName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                {/* {this.state.lpObj.investorSubType == 9 
                                ? 
                                    <div>
                                        <span className="col2">Number of Grantors of the Trust:</span>
                                        <span className="lightContent">{this.state.lpObj.numberOfGrantorsOfTheTrust}</span>
                                    </div>
                                :
                                    <div>
                                        <span className="col2">Trust’s name:</span>
                                        <span className="lightContent">{this.state.lpObj.trustName}</span>
                                    </div>
                                } */}
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Email Address:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                             
                                            <span className="lightContent">{this.state.lpObj.email}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Trust’s name:</span>
                                             
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                             
                                            <span className="lightContent">{this.state.lpObj.trustName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Trust legally domiciled:</span>
                                             
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                             
                                            <span className="lightContent">{this.state.trustLegallyDomiciledName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row  hidden={this.state.lpObj.trustLegallyDomiciled != 231}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Select State:</span>
                                             
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            <span className="lightContent">{this.state.selectStateName}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                
                                { this.state.lpObj.investorSubType == 9 
                                ?
                                    <Row>
                                        <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                            <div>
                                            <span className="col2">Tax Exempt:</span>
                                            
                                            </div>
                                        </Col>
                                        <Col md={5} sm={5} xs={5}>
                                            <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true ? 'No' : 'Yes'}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                :
                                    <Row>
                                        <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                            <div>
                                            <span className="col2">Tax Exempt:</span>
                                            
                                            </div>
                                        </Col>
                                        <Col md={5} sm={5} xs={5}>
                                            <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true ? 'No' : 'Yes'}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    
                                }
                                { this.state.lpObj.investorSubType == 9 
                                ?
                                    <div hidden={this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true}>
                                        {/* <div>
                                            <span className="col2">Is the Entity a U.S. 501(c)(3):</span>
                                            <span className="lightContent">{this.state.lpObj.isEntityUS501c3 !== true ? 'No' : 'Yes'}</span>
                                        </div> */}
                                        <Row>
                                            <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                <div>
                                                    <span className="col2">Is the Trust a 501(c)(3):</span>
                                                    
                                                </div>
                                            </Col>
                                            <Col md={5} sm={5} xs={5}>
                                                <div>
                                                    
                                                    <span className="lightContent">{this.state.lpObj.isTrust501c3 !== true ? 'No' : 'Yes'}</span>
                                                </div>
                                            </Col>
                                        </Row>   
                                    </div>
                                :
                                    <div hidden={this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true}>
                                        {/* <div>
                                            <span className="col2">Is the Entity a U.S. 501(c)(3):</span>
                                            <span className="lightContent">{this.state.lpObj.isEntityUS501c3 !== true ? 'No' : 'Yes'}</span>
                                        </div> */}
                                        <Row>
                                            <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                <div>
                                                    <span className="col2">Is the Trust a 501(c)(3):</span>
                                                    
                                                </div>
                                            </Col>
                                            <Col md={5} sm={5} xs={5}>
                                                <div>
                                                    
                                                    <span className="lightContent">{this.state.lpObj.isTrust501c3 !== true ? 'No' : 'Yes'}</span>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">FOIA sensitive:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.releaseInvestmentEntityRequired !== true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Disqualifying Event:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.isSubjectToDisqualifyingEvent != true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row  hidden={this.state.lpObj.fundManagerInfo == null}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">The Investor has other information to disclose to the Fund Manager in connection with the investment:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.fundManagerInfo}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row  hidden={this.state.lpObj.fundManagerInfo == null}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Other Investor Attributes:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.otherInvestorAttributes ? this.state.lpObj.otherInvestorAttributes.join(', ') : null}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Country:</span>
                                             
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                             
                                            <span className="lightContent">{this.state.mailingAddressCountryName}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">State:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.mailingAddressStateName}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Street:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.mailingAddressStreet}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">City:</span>
                                             
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                             
                                            <span className="lightContent">{this.state.lpObj.mailingAddressCity}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Zip:</span>
                                             
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                             
                                            <span className="lightContent">{this.state.lpObj.mailingAddressZip}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row  hidden={this.state.lpObj.investorSubType != 10}>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">The exact legal title designation you would like used by the fund to hold the Trust’s interest:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.legalTitleDesignation}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Primary Business Telephone:</span>
                                             
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5}>
                                        <div>
                                             
                                            <span className="lightContent">{this.state.lpObj.mailingAddressPhoneNumber}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/investorInfo/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>
                        <Row className="step6-row">
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Capital Commitment</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Offer to subscribe for Capital Commitment of:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.lpCapitalCommitment ? this.FsnetUtil.convertToCurrency(this.state.lpObj.lpCapitalCommitment) : ''}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/capitalCommitment/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>
    
                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Accredited Investor</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Accredited Investor:</span>
                                             
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                             
                                            <span className="lightContent">{this.state.lpObj.areYouAccreditedInvestor !== true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>   
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/AccreditedInvestor/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Qualified Purchaser</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Qualified Purchaser:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.areYouQualifiedPurchaser !== true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>    
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" hidden={this.state.lpObj.areYouQualifiedPurchaser}>
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Qualified Client</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row>
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Qualified Client:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.areYouQualifiedClient !== true ? 'No' : 'Yes'}</span>
                                        </div>
                                    </Col>
                                </Row>    
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>


                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Companies Act</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row className=" firstQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Status under Companies Act:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerText">
                                        <div>
                                           
                                            <span className="lightContent" hidden={this.state.lpObj.companiesAct != 1}>The Trust is not an investment company and does not rely on Section 3(c)(1) or Section 3(c)(7) of the Companies Act in order to be deemed excluded from being treated as an investment company.</span>
                                            <span className="lightContent" hidden={this.state.lpObj.companiesAct != 2}>The Trust would be an investment company but it is not treated as such because it relies on Section 3(c)(1) of the Companies Act to avoid such treatment.</span>
                                            <span className="lightContent" hidden={this.state.lpObj.companiesAct != 3}>The Trust would be an investment company but it is not treated as such because it relies on Section 3(c)(7) of the Companies Act to avoid such treatment.</span>
                                            <span className="lightContent" hidden={this.state.lpObj.companiesAct != 4}>The Trust is an investment company pursuant to the Companies Act, not relying on any exemption from treatment as such.</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                {(this.state.lpObj.companiesAct == 2 || this.state.lpObj.companiesAct == 3)
                                ?
                                    <div>
                                        {this.state.lpObj.investorSubType == 9 
                                        ?
                                            <Row className="step-row-borderBottom step-row-borderTop remainingQuesitionPadding">
                                                <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                    <div>
                                                        <span className="col2">Please specify the number of Grantors of the Trust:</span>
                                                        
                                                    </div>
                                                </Col>
                                                <Col md={5} sm={5} xs={5} className="answerYesNo">
                                                    <div>
                                                        
                                                        <span className="lightContent">{this.state.lpObj.numberOfDirectEquityOwners}</span>
                                                    </div>
                                                </Col>
                                            </Row>
                                            
                                        :
                                            <Row className="step-row-borderBottom step-row-borderTop remainingQuesitionPadding">
                                                <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                    <div>
                                                        <span className="col2">Please specify the number of Beneficiaries of the Trust:</span>
                                                        
                                                    </div>
                                                </Col>
                                                <Col md={5} sm={5} xs={5} className="answerYesNo">
                                                    <div>
                                                        
                                                        <span className="lightContent">{this.state.lpObj.numberOfDirectEquityOwners}</span>
                                                    </div>
                                                </Col>
                                            </Row>
                                            
                                        }
                                        <Row className="remainingQuesitionPadding">
                                            <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                <div>
                                                    <span className="col2">Are there any existing or prospective investors of the fund as to which the Trust proposes to subscribe that control, are controlled by, or are under common control with the Trust:</span>
                                                     
                                                </div>
                                            </Col>
                                            <Col md={5} sm={5} xs={5} className="answerYesNo">
                                                <div>
                                                     
                                                    <span className="lightContent">{this.state.lpObj.existingOrProspectiveInvestorsOfTheFund != true ? 'No' : 'Yes'}</span>
                                                </div>
                                            </Col>
                                        </Row>
                                       
                                        <Row hidden={this.state.lpObj.existingOrProspectiveInvestorsOfTheFund != true} className="step-row-borderTop remainingQuesitionPadding">
                                            <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                <div>
                                                    <span className="col2">How many such existing or prospective investors are there (please enter the number):</span>
                                                    
                                                </div>
                                            </Col>
                                            <Col md={5} sm={5} xs={5} className="answerYesNo">
                                                <div>
                                                    
                                                    <span className="lightContent">{this.state.lpObj.numberOfexistingOrProspectives}</span>
                                                </div>
                                            </Col>
                                        </Row>
                                        
                                    </div>
                                :
                                    null
                                }


                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/companiesAct/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">ERISA</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <Row className="step-row-borderBottom firstQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">"Employee benefit plan," as defined in Section 3(3) of ERISA:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.employeeBenefitPlan != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>
                               
                                <Row className="step-row-borderBottom remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">"Plan," as defined in Section 4975(e)(1) of the Code:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.planAsDefinedInSection4975e1 != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row className="remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Deemed to be a "benefit plan investor" under the Plan Asset Regulation:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.benefitPlanInvestor != true ? 'False' : 'True'}</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                <Row  hidden={this.state.lpObj.benefitPlanInvestor !== true} className="step-row-borderTop remainingQuesitionPadding">
                                    <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                        <div>
                                            <span className="col2">Total value of equity interests held by "benefit plan investors”:</span>
                                            
                                        </div>
                                    </Col>
                                    <Col md={5} sm={5} xs={5} className="answerYesNo">
                                        <div>
                                            
                                            <span className="lightContent">{this.state.lpObj.totalValueOfEquityInterests}%</span>
                                        </div>
                                    </Col>
                                </Row>
                                
                                { 
                                    this.state.lpObj.employeeBenefitPlan == true || this.state.lpObj.planAsDefinedInSection4975e1 == true 
                                ? 
                                    <div>
                                        <Row className="step-row-borderTop remainingQuesitionPadding" hidden={(this.state.lpObj.fiduciaryEntityIvestment === false || this.state.lpObj.fiduciaryEntityIvestment === null) && (this.state.lpObj.entityDecisionToInvestInFund === false || this.state.lpObj.entityDecisionToInvestInFund === null)}>
                                            <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                <div>
                                                    <div className="col2">Please confirm the following representations to continue:</div>
                                                    
                                                </div>
                                            </Col>
                                            <Col md={5} sm={5} xs={5} className="answerText">
                                                <div>
                                                   
                                                    {/* <div className="lightContent" hidden={this.state.lpObj.fiduciaryEntityIvestment !== true}>The person executing this agreement is a fiduciary of the Trust making the investment.</div> */}
                                                    <div className="lightContent" hidden={this.state.lpObj.fiduciaryEntityIvestment !== true}>The person executing this agreement is a fiduciary of the Investor.</div>
                                                    {/* <div className="lightContent" hidden={this.state.lpObj.entityDecisionToInvestInFund !== true}>The Trust’s decision to invest in the fund was made by the person executing this agreement and such person (i) is a fiduciary under ERISA or Section 4975 of the Code, or both, with respect to the Trust’s decision to invest in the fund; (ii) is responsible for exercising independent judgment in evaluating the investment in the fund; (iii) is independent of the fund, its general partner or similar manager and any and all affiliates of the preceding; and (iv) is capable of evaluating investment risks independently, both in general and with regard to particular transactions and investment strategies, including the decision on behalf of the Trust to invest in the fund.</div> */}
                                                    <div className="lightContent" hidden={this.state.lpObj.entityDecisionToInvestInFund !== true}>The decision to invest in the Fund was made by the Signatory hereto.</div>
                                                </div>
                                            </Col>
                                        </Row>
                                        
                                        <div>
                                            <Row className="remainingQuesitionPadding step-row-borderTop">
                                                <Col md={7} sm={7} xs={7} className="step-col-pad3">
                                                    <div>
                                                        <div className="col2">The person executing this agreement is one of the following:</div>
                                                        
                                                    </div>
                                                </Col>
                                                <Col md={5} sm={5} xs={5} className="answerText">
                                                    <div>
                                                        
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 1}>An independent fiduciary that holds, or has under management or control, total assets of at least $50,000,000.</div>
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 2}>A bank as defined in Section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency.</div>
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 3}>An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan.</div>
                                                        {/* <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 4}>An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business.</div> */}
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 4}>An investment adviser.</div>
                                                        <div className="lightContent" hidden={this.state.lpObj.aggrement1 != 5}>A broker-dealer that is registered under the Exchange Act.</div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            
                                        </div>
                                    </div>
                                : 
                                    null
                                }
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"/lp/erisa/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        
                    </div>






                    <div hidden={this.state.investorType !== 'revocableTrust'}>
                        <Row id="step6-row1" >
                            <Col md={2} sm={2} xs={6} className="step6-col-pad">
                                <span className="col1">Investor Information (1/2)</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <div className="col2">Investor Type:  Trust</div>
                                <div className="col2">Investor Sub Type: Revocable Trust</div>
                                <div className="col2">Number of Grantors of the Trust: </div>
                                <div className="col2">Email Address:</div>
                                <div className="col2">Entity’s Name:</div>
                                <div className="col2">Trust legally domiciled:</div>
                                <div className="col2">Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes: </div>
                                <div className="col2">Is the Entity a U.S. 501(c)(3): </div>
                                <div className="col2">Is the Entity a Fund-of-Funds or a similar type vehicle: </div>
                                <div className="col2">Is the Entity required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act ("FOIA”) or any similar statues anywhere else worldwide: </div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"investorInfo"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Investor Information (2/2)</span>
                            </Col>
                            <Col md={7} sm={7} sx={6}>
                                <div className="col2">Street:</div>
                                <div className="col2">City:</div>
                                <div className="col2">State:</div>
                                <div className="col2">Zip:</div>
                                <div className="col2">Phone Number:</div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"investorInfo"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Accredited Investor</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <span className="col2">Is the Trust an "accredited investor” within the meaning of Rule 501 under the Securities Act:</span>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"AccreditedInvestor"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Qualified Purchaser/Qualified Client</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <span className="col2">Is the Trust a "qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act:</span>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"qualifiedPurchaser"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Companies Act</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <div className="col2">The Trust is an "investment company” pursuant to the Companies Act</div>
                                <div className="col2">The number of direct equity owners of the Entity</div>
                                <div className="col2">Are there any existing or prospective investors of the Fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?</div>
                                <div className="col2">existing or prospective investors</div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"companiesAct"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Erisa</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <div className="col2">The Trust is an "employee benefit plan,” as defined in Section 3(3) of ERISA, that is subject to the provisions of Part 4 of Title I of ERISA:</div>
                                <div className="col2">The Trust is a "plan,” as defined in Section 4975(e)(1) of the Code, that is subject to Section 4975 of the Code (including, by way of example only, an individual retirement account):</div>
                                <div className="col2">The Trust is an entity that is deemed to be a "benefit plan investor” under the Plan Asset Regulation, as amended and as modified by Section 3(42) of ERISA, because its underlying assets include "plan assets” by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity: (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more "employee benefit plans” or "plans” described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of ERISA, and (B) that does not qualify as a "venture capital operating company” or "real estate operating company” under the Plan Asset Regulation):</div>
                                <div className="col2">The person executing the agreement:</div>
                                <div className="col2">The person executing the agreement:</div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"erisa"}>Change</Link></span>
                            </Col>
                        </Row>
                    </div>

                    <div hidden={this.state.investorType !== 'iRevocableTrust'}>
                        <Row id="step6-row1" >
                            <Col md={2} sm={2} xs={6} className="step6-col-pad">
                                <span className="col1">Investor Information (1/2)</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <div className="col2">Investor Type:  Trust</div>
                                <div className="col2">Investor Sub Type: Irevocable Trust:</div>
                                <div className="col2">Trust’s name:</div>
                                <div className="col2">Email Address:</div>
                                <div className="col2">Entity’s Name:</div>
                                <div className="col2">Trust legally domiciled:</div>
                                <div className="col2">Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes: </div>
                                <div className="col2">Is the Entity a U.S. 501(c)(3): </div>
                                <div className="col2">Is the Entity required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act ("FOIA”) or any similar statues anywhere else worldwide: </div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"investorInfo"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Investor Information (2/2)</span>
                            </Col>
                            <Col md={7} sm={7} sx={6}>
                                <div className="col2">Street:</div>
                                <div className="col2">City:</div>
                                <div className="col2">State:</div>
                                <div className="col2">Zip:</div>
                                <div className="col2">The exact legal title designation you would like used by the Fund to hold the Trust’s interest:</div>
                                <div className="col2">Phone Number:</div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"investorInfo"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Accredited Invesestor</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <span className="col2">Is the Trust an "accredited investor” within the meaning of Rule 501 under the Securities Act:</span>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"AccreditedInvestor"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Qualified Purchaser/Qualified Client</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <span className="col2">Is the Trust a "qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act:</span>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"qualifiedPurchaser"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Companies Act</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <div className="col2">The Trust is an "investment company” pursuant to the Companies Act</div>
                                <div className="col2">The number of direct equity owners of the Entity</div>
                                <div className="col2">Are there any existing or prospective investors of the Fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?</div>
                                <div className="col2">existing or prospective investors</div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"companiesAct"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={2} sm={2} xs={6} className="step-col-pad step-col-pad1">
                                <span className="col1">Erisa</span>
                            </Col>
                            <Col md={9} sm={9} xs={6} className="step-col-pad2">
                                <div className="col2">The Trust is an "employee benefit plan,” as defined in Section 3(3) of ERISA, that is subject to the provisions of Part 4 of Title I of ERISA:</div>
                                <div className="col2">The Trust is a "plan,” as defined in Section 4975(e)(1) of the Code, that is subject to Section 4975 of the Code (including, by way of example only, an individual retirement account):</div>
                                <div className="col2">The Trust is an entity that is deemed to be a "benefit plan investor” under the Plan Asset Regulation, as amended and as modified by Section 3(42) of ERISA, because its underlying assets include "plan assets” by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity: (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more "employee benefit plans” or "plans” described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of ERISA, and (B) that does not qualify as a "venture capital operating company” or "real estate operating company” under the Plan Asset Regulation):</div>
                                <div className="col2">The person executing the agreement:</div>
                                <div className="col2">The person executing the agreement:</div>
                            </Col>
                            <Col md={1} sm={1} xs={6} className="step-col-pad4">
                                <span className="col4 colm"><Link to={"erisa"}>Change</Link></span>
                            </Col>
                        </Row>
                    </div>

                    <div className="staticTextBelowTable staticTextBelowTablePadding text-center">
                        {/*<div className="staticTextBelowText">
                            Once everything is confirmed correct, click the "Partnership Agreement” button in the sidebar.
                            </div>*/}
                        <Button className="confirmSubmitReview" hidden={this.state.lpObj.status !== 2 || this.state.hideConfirmBtn} onClick={this.submitSubscription}>Confirm & Submit</Button>
                    </div>

                </div>

                {/* <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right disabled" aria-hidden="true"></i>
                </div> */}
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default reviewComponent;

