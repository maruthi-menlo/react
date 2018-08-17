import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Row, Col} from 'react-bootstrap';
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
        this.state = {
            showModal: false,
            investorType: 'LLC',
            lpObj:{},
            investorSubTypeName:'',
            jurisdictionEntityLegallyRegisteredName:''
        }

    }

    componentDidMount() {
        let id = this.FsnetUtil.getLpFundId();
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
                        this.updateIndividualData(result.data.data);
                    } else if(result.data.data.investorType === 'LLC') {
                        this.updateLLCData(result.data.data);
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
        obj['currentPageCount'] = 3;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        PubSub.publish('investorData',obj );
        this.setState({
            lpObj: data,
        })
    }

    updateLLCData(data) {
        let obj = data;
        obj['currentInvestorInfoPageNumber'] = 1;
        obj['currentPageCount'] = 7;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        PubSub.publish('investorData',obj );
        this.setState({
            lpObj: data,
        },()=>{
            this.investorSubTypes();
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

    //Get countries or states based on sub types selection
    //ISUS value is taken to check whether investor sub type belongs to US or  nonUS
    jurisdictionTypes(isUs, value) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let url = 'getAllCountires'
        if(value === 'otherEntity') {
            url = 'getAllCountires/1'
        }
        if(isUs === '0') {
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

    render() {
        return (
            <div className="accreditedInvestor width100" id="subscriptionReview">
                <div className="step6ClassAboveFooter">
                    <div className="staticContent">
                        <h2 className="title marginBottom2">Review & Confirm</h2>
                        <h4 className="subtext marginBottom30">Verify that everything looks correct before signing your Fund</h4>
                    </div>

                    <div hidden={this.state.investorType !== 'Individual'}>
                        <Row id="step6-row1" >
                            <Col md={3} sm={3} xs={6} className="step6-col-pad">
                                <span className="col1">Investor Information</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
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
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/personaldetails/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Accredited Investor</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouAccreditedInvestor === true}>
                                <span className="col2">Are you  an “accredited investor” within the meaning of Rule 501 under the Securities Act?: Yes</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouAccreditedInvestor === false}>
                                <span className="col2">Are you  an “accredited investor” within the meaning of Rule 501 under the Securities Act?: No</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/AccreditedInvestor/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Qualified Purchaser</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouQualifiedPurchaser === true}>
                                <span className="col2">Are you an “qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act, as amended?: Yes</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouQualifiedPurchaser === false}>
                                <span className="col2">Are you an “qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act, as amended?: No</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" hidden={this.state.lpObj.areYouQualifiedPurchaser === false}>
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Qualified Client</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouQualifiedClient}>
                                <span className="col2">Are you a “qualified client” within the meaning of Rule 205-3 under the Advisers Act?: Yes</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={!this.state.lpObj.areYouQualifiedClient}>
                                <span className="col2">Are you a “qualified client” within the meaning of Rule 205-3 under the Advisers Act?: No</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>
                    </div>

                    <div hidden={this.state.investorType !== 'LLC'}>
                        <Row id="step6-row1" >
                            <Col md={3} sm={3} xs={6} className="step6-col-pad">
                                <span className="col1">Investor Information (1/2)</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2">Investor Type:  {this.state.lpObj.investorType}</div>
                                <div className="col2" hidden={this.state.investorSubTypeName === ''}>Investor Sub Type: {this.state.investorSubTypeName}</div>
                                <div className="col2" hidden={this.state.lpObj.otherInvestorSubType === null}>Investor Sub Type: Other Entity</div>
                                <div className="col2" hidden={this.state.lpObj.otherInvestorSubType === null}>Enter the Entity Type: {this.state.lpObj.otherInvestorSubType}</div>
                                <div className="col2">Email Address: {this.state.lpObj.email}</div>
                                <div className="col2">Entity’s Name: {this.state.lpObj.entityName}</div>
                                <div className="col2">In what jurisdiction is the Entity legally registered?: {this.state.jurisdictionEntityLegallyRegisteredName}</div>
                                <div className="col2" hidden={this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true}>Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes?: Yes</div>
                                <div className="col2" hidden={this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== false}>Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes?: No</div>
                                <div className="col2" hidden={this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true || this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true}>Is the Entity a U.S. 501(c)(3)?: Yes</div>
                                <div className="col2" hidden={(this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== true || this.state.lpObj.isEntityTaxExemptForUSFederalIncomeTax !== false)}>Is the Entity a U.S. 501(c)(3)?: No</div>
                                <div className="col2" hidden={this.state.lpObj.releaseInvestmentEntityRequired !== true}>Is the Entity required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?: Yes</div>
                                <div className="col2" hidden={this.state.lpObj.releaseInvestmentEntityRequired !== false}>Is the Entity required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?: No</div>
                                <div className="col2">Street: {this.state.lpObj.mailingAddressStreet}</div>
                                <div className="col2">City: {this.state.lpObj.mailingAddressCity}</div>
                                <div className="col2">State: {this.state.lpObj.mailingAddressState}</div>
                                <div className="col2">Zip: {this.state.lpObj.mailingAddressZip}</div>
                                <div className="col2">Phone Number: {this.state.lpObj.mailingAddressPhoneNumber}</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/personaldetails/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Accredited Investor</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouAccreditedInvestor !== true}>
                                <span className="col2"> Is the Entity an “accredited investor” within the meaning of Rule 501 under the Securities Act?: Yes</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouAccreditedInvestor !== false}>
                                <span className="col2"> Is the Entity an “accredited investor” within the meaning of Rule 501 under the Securities Act?: No</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/AccreditedInvestor/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Qualified Purchaser</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouQualifiedPurchaser !== true}>
                                <span className="col2">Are you an “qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act, as amended?: Yes</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouQualifiedPurchaser !== false}>
                                <span className="col2">Are you an “qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act, as amended?: No</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" hidden={this.state.lpObj.areYouQualifiedPurchaser}>
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Qualified Client</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouQualifiedClient !== true}>
                                <span className="col2">Is your Entity considered a “qualified client” within the meaning of Rule 205-3 under the Advisers Act?: Yes</span>
                            </Col>
                            <Col md={7} sm={7} xs={6} hidden={this.state.lpObj.areYouQualifiedClient !== false}>
                                <span className="col2">Is your Entity considered a “qualified client” within the meaning of Rule 205-3 under the Advisers Act?: No</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/qualifiedPurchaser/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Companies Act</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2" hidden={this.state.lpObj.companiesAct !== '1'}>Please respond in one of the ways below regarding whether the Entity is an  “investment company” pursuant to the Companies Act.*: The Entity is not an “investment company” and does not rely on Section 3(c)(1) or Section 3(c)(7) of the Companies Act in order to be deemed excluded from being treated as an “investment company".</div>
                                <div className="col2" hidden={this.state.lpObj.companiesAct !== '2'}>Please respond in one of the ways below regarding whether the Entity is an  “investment company” pursuant to the Companies Act.*: The Entity would be an “investment company” but it is not treated as such because it relies on Section 3(c)(1) of the Companies Act to avoid such treatment.</div>
                                <div className="col2" hidden={this.state.lpObj.companiesAct !== '3'}>Please respond in one of the ways below regarding whether the Entity is an  “investment company” pursuant to the Companies Act.*: The Entity would be an “investment company” but it is not treated as such because it relies on Section 3(c)(7) of the Companies Act to avoid such treatment.</div>
                                <div className="col2" hidden={this.state.lpObj.companiesAct !== '4'}>Please respond in one of the ways below regarding whether the Entity is an  “investment company” pursuant to the Companies Act.*: The Entity is an “investment company” pursuant to the Companies Act, not relying on any exemption from treatment as such.</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/companiesAct/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Equity owners</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2">Number of direct equity owners of the Entity: {this.state.lpObj.numberOfDirectEquityOwners}</div>
                                <div className="col2" hidden={this.state.lpObj.existingOrProspectiveInvestorsOfTheFund !== true}>Are there any existing or prospective investors of the fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?: Yes</div>
                                <div className="col2" hidden={this.state.lpObj.existingOrProspectiveInvestorsOfTheFund !== false}>Are there any existing or prospective investors of the fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?: No</div>
                                <div className="col2" hidden={this.state.lpObj.existingOrProspectiveInvestorsOfTheFund !== true}>Existing or prospective investors: {this.state.lpObj.numberOfexistingOrProspectives}</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/equityOwners/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Look-Through Issues</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2" hidden={this.state.lpObj.entityProposingAcquiringInvestment !== true}>The Entity was not organized for the purpose of acquiring the investment: True</div>
                                <div className="col2" hidden={this.state.lpObj.entityProposingAcquiringInvestment !== false}>The Entity was not organized for the purpose of acquiring the investment: False</div>
                                <div className="col2" hidden={this.state.lpObj.anyOtherInvestorInTheFund !== true}>To the best of the Entity’s knowledge, the Entity does not control, nor is it controlled by, or under common control with, any other investor in the fund: True</div>
                                <div className="col2" hidden={this.state.lpObj.anyOtherInvestorInTheFund !== false}>To the best of the Entity’s knowledge, the Entity does not control, nor is it controlled by, or under common control with, any other investor in the fund: False</div>
                                <div className="col2" hidden={this.state.lpObj.entityHasMadeInvestmentsPriorToThedate !== true}>The Entity has made investments prior to the date hereof or intends to make investments in the near future and each beneficial owner of interests in the Entity has and will share in the same proportion to each such investment: True</div>
                                <div className="col2" hidden={this.state.lpObj.entityHasMadeInvestmentsPriorToThedate !== false}>The Entity has made investments prior to the date hereof or intends to make investments in the near future and each beneficial owner of interests in the Entity has and will share in the same proportion to each such investment: False</div>
                                <div className="col2" hidden={this.state.lpObj.partnershipWillNotConstituteMoreThanFortyPercent !== true}>The Entity’s investment in the Partnership will not constitute more than forty percent (40%) of the Entity’s assets (including for this purpose any committed capital for an Entity that is an investment fund): True</div>
                                <div className="col2" hidden={this.state.lpObj.partnershipWillNotConstituteMoreThanFortyPercent !== false}>The Entity’s investment in the Partnership will not constitute more than forty percent (40%) of the Entity’s assets (including for this purpose any committed capital for an Entity that is an investment fund): False</div>
                                <div className="col2" hidden={this.state.lpObj.beneficialInvestmentMadeByTheEntity !== true}>The governing documents of the Entity require that each beneficial owner of the Entity, including, but not limited to, shareholders, partners and beneficiaries, participate through such beneficial owner’s interest in the Entity in all of the Entity’s investments and that the profits and losses from each such investment are shared among such beneficial owners in the same proportions as all other investments of the Entity. No such beneficial owner may vary such beneficial owner’s share of the profits and losses or the amount of such beneficial owner’s contribution for any investment made by the Entity: True</div>
                                <div className="col2" hidden={this.state.lpObj.beneficialInvestmentMadeByTheEntity !== false}>The governing documents of the Entity require that each beneficial owner of the Entity, including, but not limited to, shareholders, partners and beneficiaries, participate through such beneficial owner’s interest in the Entity in all of the Entity’s investments and that the profits and losses from each such investment are shared among such beneficial owners in the same proportions as all other investments of the Entity. No such beneficial owner may vary such beneficial owner’s share of the profits and losses or the amount of such beneficial owner’s contribution for any investment made by the Entity: False</div>
                                
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/entityProposing/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">ERISA</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2" hidden={this.state.lpObj.employeeBenefitPlan !== true}>The Entity is an “employee benefit plan,” as defined in Section 3(3) of ERISA, that is subject to the provisions of Part 4 of Title I of ERISA: True</div>
                                <div className="col2" hidden={this.state.lpObj.employeeBenefitPlan !== false}>The Entity is an “employee benefit plan,” as defined in Section 3(3) of ERISA, that is subject to the provisions of Part 4 of Title I of ERISA: False</div><br/>
                                <div className="col2" hidden={this.state.lpObj.planAsDefinedInSection4975e1 !== true}>The Entity is a “plan,” as defined in Section 4975(e)(1) of the Code, that is subject to Section 4975 of the Code (including, by way of example only, an individual retirement account): True</div>
                                <div className="col2" hidden={this.state.lpObj.planAsDefinedInSection4975e1 !== false}>The Entity is a “plan,” as defined in Section 4975(e)(1) of the Code, that is subject to Section 4975 of the Code (including, by way of example only, an individual retirement account): False</div><br/>
                                <div className="col2" hidden={this.state.lpObj.benefitPlanInvestor !== true}>The Investor is an entity that is deemed to be a “benefit plan investor” under the Plan Asset Regulation, as amended and as modified by Section 3(42) of ERISA, because its underlying assets include “plan assets” by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity: (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more “employee benefit plans” or “plans” described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of ERISA, and (B) that does not qualify as a “venture capital operating company” or “real estate operating company” under the Plan Asset Regulation): True</div>
                                <div className="col2" hidden={this.state.lpObj.benefitPlanInvestor !== false}>The Investor is an entity that is deemed to be a “benefit plan investor” under the Plan Asset Regulation, as amended and as modified by Section 3(42) of ERISA, because its underlying assets include “plan assets” by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity: (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more “employee benefit plans” or “plans” described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of ERISA, and (B) that does not qualify as a “venture capital operating company” or “real estate operating company” under the Plan Asset Regulation): False</div><br/>
                                <div className="col2" hidden={this.state.lpObj.benefitPlanInvestor !== true}>Please input the total value of equity interests in the Trust is held by “benefit plan investors”: {this.state.lpObj.totalValueOfEquityInterests}</div><br/>
                                <div className="col2" hidden={this.state.lpObj.fiduciaryEntityIvestment === false && this.state.lpObj.entityDecisionToInvestInFund === false}>Please confirm the following representations to continue:</div>
                                <div className="col2" hidden={this.state.lpObj.fiduciaryEntityIvestment !== true}>The person executing this agreement is a fiduciary of the Entity making the investment.</div>
                                <div className="col2" hidden={this.state.lpObj.entityDecisionToInvestInFund !== true}>The Entity’s decision to invest in the fund was made by the person executing this agreement and such person (i) is a fiduciary under ERISA or Section 4975 of the Code, or both, with respect to the Entity’s decision to invest in the fund; (ii) is responsible for exercising independent judgment in evaluating the investment in the fund; (iii) is independent of the fund, its general partner or similar manager and any and all affiliates of the preceding; and (iv) is capable of evaluating investment risks independently, both in general and with regard to particular transactions and investment strategies, including the decision on behalf of the Entity to invest in the fund.</div><br/>
                                <div className="col2" hidden={this.state.lpObj.aggrement1 ===null}>The person executing this agreement is one of the following:</div>
                                <div className="col2" hidden={this.state.lpObj.aggrement1 !==1}>An independent fiduciary that holds, or has under management or control, total assets of at least $50,000,000;</div>
                                <div className="col2" hidden={this.state.lpObj.aggrement1 !==2}>A bank as defined in section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency;</div>
                                <div className="col2" hidden={this.state.lpObj.aggrement1 !==3}>An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                <div className="col2" hidden={this.state.lpObj.aggrement1 !==4}>An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business; or</div>
                                <div className="col2" hidden={this.state.lpObj.aggrement1 !==5}>A broker-dealer that is registered under the Exchange Act.</div><br/>
                                <div className="col2" hidden={this.state.lpObj.aggrement2 ===null}>The person executing this agreement is one of the following:</div>
                                <div className="col2" hidden={this.state.lpObj.aggrement2 !==1}>A bank as defined in section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency;</div>
                                <div className="col2" hidden={this.state.lpObj.aggrement2 !==2}>An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                <div className="col2" hidden={this.state.lpObj.aggrement2 !==3}>An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business; or</div>
                                <div className="col2" hidden={this.state.lpObj.aggrement2 !==4}>A broker-dealer that is registered under the Exchange Act.</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"/lp/erisa/"+this.state.lpObj.id}>Change</Link></span>
                            </Col>
                        </Row>


                    </div>

                    <div hidden={this.state.investorType !== 'revocableTrust'}>
                        <Row id="step6-row1" >
                            <Col md={3} sm={3} xs={6} className="step6-col-pad">
                                <span className="col1">Investor Information (1/2)</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2">Investor Type:  Trust</div>
                                <div className="col2">Investor Sub Type: Revocable Trust</div>
                                <div className="col2">Number of Grantors of the Trust: </div>
                                <div className="col2">Email Address:</div>
                                <div className="col2">Entity’s Name:</div>
                                <div className="col2">Trust legally domiciled:</div>
                                <div className="col2">Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes?: </div>
                                <div className="col2">Is the Entity a U.S. 501(c)(3)?: </div>
                                <div className="col2">Is the Entity a fund-of-funds or a similar type vehicle?: </div>
                                <div className="col2">Is the Entity required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?: </div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"personaldetails"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Investor Information (2/2)</span>
                            </Col>
                            <Col md={7} sm={7} sx={6}>
                                <div className="col2">Street:</div>
                                <div className="col2">City:</div>
                                <div className="col2">State:</div>
                                <div className="col2">Zip:</div>
                                <div className="col2">Phone Number:</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"personaldetails"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Accredited Investor</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <span className="col2">Is the Trust an “accredited investor” within the meaning of Rule 501 under the Securities Act?:</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"AccreditedInvestor"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Qualified Purchaser/Qualified Client</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <span className="col2">Is the Trust a “qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act?:</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"qualifiedPurchaser"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Companies Act</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2">The Trust is an “investment company” pursuant to the Companies Act</div>
                                <div className="col2">The number of direct equity owners of the Entity</div>
                                <div className="col2">Are there any existing or prospective investors of the fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?</div>
                                <div className="col2">existing or prospective investors</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"companiesAct"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Erisa</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2">The Trust is an “employee benefit plan,” as defined in Section 3(3) of ERISA, that is subject to the provisions of Part 4 of Title I of ERISA:</div>
                                <div className="col2">The Trust is a “plan,” as defined in Section 4975(e)(1) of the Code, that is subject to Section 4975 of the Code (including, by way of example only, an individual retirement account):</div>
                                <div className="col2">The Trust is an entity that is deemed to be a “benefit plan investor” under the Plan Asset Regulation, as amended and as modified by Section 3(42) of ERISA, because its underlying assets include “plan assets” by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity: (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more “employee benefit plans” or “plans” described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of ERISA, and (B) that does not qualify as a “venture capital operating company” or “real estate operating company” under the Plan Asset Regulation):</div>
                                <div className="col2">The person executing the agreement:</div>
                                <div className="col2">The person executing the agreement:</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"erisa"}>Change</Link></span>
                            </Col>
                        </Row>
                    </div>

                    <div hidden={this.state.investorType !== 'iRevocableTrust'}>
                        <Row id="step6-row1" >
                            <Col md={3} sm={3} xs={6} className="step6-col-pad">
                                <span className="col1">Investor Information (1/2)</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2">Investor Type:  Trust</div>
                                <div className="col2">Investor Sub Type: Irevocable Trust:</div>
                                <div className="col2">Trust’s name:</div>
                                <div className="col2">Email Address:</div>
                                <div className="col2">Entity’s Name:</div>
                                <div className="col2">Trust legally domiciled:</div>
                                <div className="col2">Is the Entity Tax Exempt for U.S. Federal Income Tax Purposes?: </div>
                                <div className="col2">Is the Entity a U.S. 501(c)(3)?: </div>
                                <div className="col2">Is the Entity required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?: </div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"personaldetails"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Investor Information (2/2)</span>
                            </Col>
                            <Col md={7} sm={7} sx={6}>
                                <div className="col2">Street:</div>
                                <div className="col2">City:</div>
                                <div className="col2">State:</div>
                                <div className="col2">Zip:</div>
                                <div className="col2">The exact legal title designation you would like used by the fund to hold the Trust’s interest:</div>
                                <div className="col2">Phone Number:</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"personaldetails"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Accredited Invesestor</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <span className="col2">Is the Trust an “accredited investor” within the meaning of Rule 501 under the Securities Act?:</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"AccreditedInvestor"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Qualified Purchaser/Qualified Client</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <span className="col2">Is the Trust a “qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act?:</span>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"qualifiedPurchaser"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Companies Act</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2">The Trust is an “investment company” pursuant to the Companies Act</div>
                                <div className="col2">The number of direct equity owners of the Entity</div>
                                <div className="col2">Are there any existing or prospective investors of the fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?</div>
                                <div className="col2">existing or prospective investors</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"companiesAct"}>Change</Link></span>
                            </Col>
                        </Row>

                        <Row className="step6-row" >
                            <Col md={3} sm={3} xs={6} className="step-col-pad">
                                <span className="col1">Erisa</span>
                            </Col>
                            <Col md={7} sm={7} xs={6}>
                                <div className="col2">The Trust is an “employee benefit plan,” as defined in Section 3(3) of ERISA, that is subject to the provisions of Part 4 of Title I of ERISA:</div>
                                <div className="col2">The Trust is a “plan,” as defined in Section 4975(e)(1) of the Code, that is subject to Section 4975 of the Code (including, by way of example only, an individual retirement account):</div>
                                <div className="col2">The Trust is an entity that is deemed to be a “benefit plan investor” under the Plan Asset Regulation, as amended and as modified by Section 3(42) of ERISA, because its underlying assets include “plan assets” by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity: (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more “employee benefit plans” or “plans” described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of ERISA, and (B) that does not qualify as a “venture capital operating company” or “real estate operating company” under the Plan Asset Regulation):</div>
                                <div className="col2">The person executing the agreement:</div>
                                <div className="col2">The person executing the agreement:</div>
                            </Col>
                            <Col md={2} sm={2} xs={6}>
                                <span className="col4"><Link to={"erisa"}>Change</Link></span>
                            </Col>
                        </Row>
                    </div>

                    <div className="staticTextBelowTable">
                        <div className="staticTextBelowText">
                            Once everything is confirmed correct, click the “Partnership Agreement” button in the sidebar.
                        </div>
                    </div>

                </div>

                <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right disabled" aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default reviewComponent;

