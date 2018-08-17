import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Radio, Row, Col, FormControl, OverlayTrigger, Tooltip, Modal } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { FsnetUtil } from '../../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';
import { PubSub } from 'pubsub-js';

class QualifiedPurchaserComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.FsnetUtil = new FsnetUtil();
        this.qualifiedPurchaserChangeEvent = this.qualifiedPurchaserChangeEvent.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.closeCompanyModal = this.closeCompanyModal.bind(this);
        this.openCompanyModal = this.openCompanyModal.bind(this);
        this.openTooltip = this.openTooltip.bind(this);
        this.closeTooltipModal = this.closeTooltipModal.bind(this);
        this.closeQualifiedClientTooltip = this.closeQualifiedClientTooltip.bind(this);
        this.qualifiedClientTooltip = this.qualifiedClientTooltip.bind(this);
        this.state = {
            showModal: false,
            investorType: 'LLC',
            areYouQualifiedPurchaser: null,
            areYouQualifiedClient: null,
            qualifiedPurchaserPageValid: false,
            showQualifiedClient: false,
            showQualifiedClientIndividual: false,
            investorObj: {},
            showTooltipModal: false,
            showQualifiedClientModal: false,
            qualifiedPurchaserErrorMsz:'',
            showCompanyModal: false
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
                    let obj = result.data.data;
                    obj['currentInvestorInfoPageNumber'] = 1;
                    obj['currentPageCount'] = 3;
                    obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
                    PubSub.publish('investorData',obj );
                    this.setState({
                        investorObj: result.data.data,
                        investorType: result.data.data.investorType?result.data.data.investorType:'LLC',
                        areYouQualifiedPurchaser: result.data.data.areYouQualifiedPurchaser,
                        areYouQualifiedClient: result.data.data.areYouQualifiedClient
                    },()=>{
                        this.updateInvestorInputFields(this.state.investorObj)
                    })
                }
            })
            .catch(error => {
                this.close();
            });
        }
    }

    updateInvestorInputFields(data) {
        if(this.state.areYouQualifiedPurchaser === true) {
            this.setState({
                showQualifiedClient: false,
                qualifiedPurchaserPageValid: true,
            })
        } else if(!this.state.areYouQualifiedPurchaser || (this.state.areYouQualifiedPurchaser === false && this.state.areYouQualifiedClient !== null)) {
            this.setState({
                qualifiedPurchaserPageValid: true,
                showQualifiedClient: true,
            })
        }else {
            this.setState({
                showQualifiedClient: false,
                qualifiedPurchaserPageValid: false
            })
        }
    }

    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    //Show Purchaser Modal
    openTooltip() {
        this.setState({ showTooltipModal: true });
    }
    //Close Purchaser Modal
    closeTooltipModal() {
        this.setState({ showTooltipModal: false });
    }

    //Show Company Act Modal
    openCompanyModal() {
        this.setState({ showCompanyModal: true });
    }

    //Close Company Act Modal
    closeCompanyModal() {
        this.setState({ showCompanyModal: false });
    }

    //Show Qualified client Modal
    qualifiedClientTooltip() {
        this.setState({ showQualifiedClientModal: true });
    }

    //Show Qualified client Modal
    closeQualifiedClientTooltip() {
        this.setState({ showQualifiedClientModal: false });
    }


    qualifiedPurchaserChangeEvent(event, type, value) {
        this.setState({
            [type]:value,
        })

        if(type === 'areYouQualifiedPurchaser') {
            if(value === false) {
                this.setState({
                    qualifiedPurchaserPageValid: false,
                    showQualifiedClient: true,
                    areYouQualifiedClient: null
                }) 
            } else {
                this.setState({
                    qualifiedPurchaserPageValid: true,
                    showQualifiedClient: false,
                    areYouQualifiedClient: null
                }) 
            }
        }

        if(type === 'areYouQualifiedClient') {
            this.setState({
                qualifiedPurchaserPageValid: true,
            }) 
        }
    }

    proceedToNext() {
        let postobj = {investorType:this.state.investorType,subscriptonId:this.state.investorObj.id, step:4,areYouQualifiedPurchaser:this.state.areYouQualifiedPurchaser }
        this.state.areYouQualifiedPurchaser === false ? postobj['areYouQualifiedClient'] = this.state.areYouQualifiedClient:postobj
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                if(this.state.investorType === 'Individual') {
                    this.props.history.push('/lp/review/'+this.state.investorObj.id);
                } else {
                    this.props.history.push('/lp/companiesAct/'+this.state.investorObj.id);
                }
            }
        })
        .catch(error => {
            this.close();
            if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                this.setState({
                    qualifiedPurchaserErrorMsz: error.response.data.errors[0].msg,
                });
            } else {
                this.setState({
                    qualifiedPurchaserErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                });
            }
        });
    }

    proceedToBack () {
        this.props.history.push('/lp/AccreditedInvestor/'+this.state.investorObj.id);
    }


    render() {
        function LinkWithTooltip({ id, children, href, tooltip }) {
            return (
              <OverlayTrigger
                trigger={['click', 'hover', 'focus']}
                overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
                placement="right"
                delayShow={300}
                delayHide={150}
              >
                <span>{children}</span>
              </OverlayTrigger>
            );
          }
        return (
            <div className="qualifiedPurchaser width100">
                <div className="form-grid formGridDivMargin min-height-400">
                        <div className="title">Qualified Purchaser</div>
                        <Row className="step1Form-row">
                            <Col xs={12} md={12}>
                                <label className="form-label width100" hidden={this.state.investorType !== 'Individual'}>Are you an 
                                <span className="helpWord" onClick={this.openTooltip}>qualified purchaser</span>within the meaning of Section 2(a)(51) under the<span className="helpWord" onClick={this.openCompanyModal}>Companies Act</span>?
                                </label>
                                <label className="form-label width100" hidden={this.state.investorType !== 'LLC'}>Are you an 
                                <span className="helpWord" onClick={this.openTooltip}>qualified purchaser</span> within the meaning of Section 2(a)(51) under the<span className="helpWord" onClick={this.openCompanyModal}>Companies Act</span>?
                                </label>
                                <Radio name="qualifiedPurchaser" inline checked={this.state.areYouQualifiedPurchaser === true} onChange={(e) => this.qualifiedPurchaserChangeEvent(e, 'areYouQualifiedPurchaser', true)}>&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="qualifiedPurchaser" inline checked={this.state.areYouQualifiedPurchaser === false} onChange={(e) => this.qualifiedPurchaserChangeEvent(e, 'areYouQualifiedPurchaser', false)}>&nbsp; No
                                    <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                        {/* Qualified Client starts for individual investor type*/}
                        <Row className="step1Form-row" hidden={!this.state.showQualifiedClient}>
                            <Col xs={12} md={12}>
                                <label className="form-label width100" hidden={this.state.investorType !== 'Individual'}>Are you a <span className="helpWord" onClick={this.openTooltip}>qualified client</span>within the meaning of Rule 205-3 under the <span className="helpWord" onClick={this.openTooltip}>Advisers Act</span>?</label>
                                <label className="form-label width100" hidden={this.state.investorType !== 'LLC'}>Is your Entity considered a<span className="helpWord" onClick={this.qualifiedClientTooltip}>qualified client</span> within the meaning of Rule 205-3 under the<span className="helpWord" onClick={this.openTooltip}>Advisers Act</span>?
                                </label>
                                <Radio name="qualifiedClient" inline checked={this.state.areYouQualifiedClient === true} onChange={(e) => this.qualifiedPurchaserChangeEvent(e, 'areYouQualifiedClient', true)}>&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="qualifiedClient" inline checked={this.state.areYouQualifiedClient === false} onChange={(e) => this.qualifiedPurchaserChangeEvent(e, 'areYouQualifiedClient', false)}>&nbsp; No
                                    <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                        {/* Qualified Client ends for llc investor type*/}
                        <Row className="step1Form-row" hidden={this.state.investorType !== 'revocableTrust'}>
                            <Col xs={12} md={12}>
                                {/* <label className="form-label width100">Is the Trust a “qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act?</label> */}
                                <label className="form-label width100">Is the Trust a &nbsp;
                                <LinkWithTooltip tooltip={<span>"
                                    "If any one of the four options below apply, the Trust is considered a “qualified purchaser” and if none of the four options below apply, the Trust is not a “qualified purchaser”:<br/>
                                    (1)  [MOST COMMON] The Trust is acting for its own account or the accounts of others described in clauses (2), (3) or (4) below, and in the aggregate owns and invests on a discretionary basis investments that are valued at not less than USD $25,000,000.
                                    OR<br/>
                                    (2)  [MOST COMMON] The Trust owns investments that are valued at not less than $5,000,000 and is owned directly or indirectly by two (2) or more natural persons related as siblings, spouses (including former spouses) or direct lineal descendants by birth or adoption, spouses of such persons, the estates of such persons, or foundations, charitable organizations or trusts established by or for the benefit of such persons.
                                    OR<br/>
                                    (3)  The Trust  is a “qualified institutional buyer” as defined in paragraph (a) of Rule 144A under the Securities Act, acting for its own account, the account of another “qualified institutional buyer”, or the account of a “qualified purchaser”; provided that 
                                    (i) a dealer described in paragraph (a)(1)(ii) of Rule 144A must own and invest on a discretionary basis at least USD $25,000,000 in securities of issuers that are not affiliated persons of the dealer and (ii) a plan referred to in paragraph (a)(1)(i)(D) or (a)(1)(i)(E) of Rule 144A, or a trust fund referred to in paragraph (a)(1)(i)(F) of Rule 144A that holds the assets of such a plan, will not be deemed to be acting for its own account if investment decisions with respect to the plan are made by the beneficiaries of the plan, except with respect to investment decisions made solely by the fiduciary, trustee or sponsor of such plan.
                                    OR<br/>
                                    (4)  The Trust is not covered by clauses (1), (2) or (3) above, is not formed for the specific purpose of acquiring the investment in the fund as to which the Trust proposes to subscribe, as to which the trustee or other person authorized to make decisions with respect to the Trust and each settlor or other person who has contributed assets to the Trust is a person described as an individual (including any person who is acquiring such investment with his or her spouse in a joint capacity, as community property or similar shared interest) who either individually or together with a spouse, owns investments that are valued at not less than USD $5,000,000.<br/>

                                    “Investments” shall mean any of the following:<br/>
                                    (1) “Securities” as such term is defined by Section 2(a)(1) of the Securities Act. <br/> 
                                    (2) Real estate held for investment purposes (i.e., not used by you for personal purposes or as a place of business or in connection with your trade or business).<br/>
                                    (3) Commodities futures contracts, options on such contracts or options on commodities that are traded on or subject to the rules of (i) any contract market designated for trading under the Exchange Act and rules thereunder or (ii) any board of trade or exchange outside the United States, as contemplated in Part 30 of the rules under the Exchange Act) held for investment purposes.<br/>
                                    (4) Physical commodities (with respect to which a Commodity Interest is traded on a market specified in paragraph 3 above) held for investment purposes.<br/>
                                    (5) Financial contracts within the meaning of Section 3(c)(2)(B)(ii) of the Companies Act, which are held for investment purposes.<br/>
                                    (6) Cash and cash equivalents (including bank deposits, certificates of deposit, bankers acceptances and similar bank instruments held for investment purposes and the net cash surrender value of insurance policies).<br/>
                                    Valued data:<br/>
                                    “Valued” shall mean either the fair market value or cost of Investments net of the amount of any outstanding indebtedness incurred to acquire such Investments.
                                    "
                                    "<br/></span>} id="tooltip-1">
                                    <span className="helpWord">“qualified purchaser”</span>
                                </LinkWithTooltip> &nbsp; within the meaning of Section 2(a)(51) under the &nbsp;
                                <LinkWithTooltip tooltip="" href="#" id="tooltip-1">
                                    <span className="helpWord">Companies Act,</span>
                                </LinkWithTooltip>
                                </label>
                                <Radio name="qualifiedPurchaser" inline id="yesCheckbox"
                                onChange={(e) => this.investorHandleChangeEvent(e, 'investorType', 'revocableTrust', true)}>&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="qualifiedPurchaser" inline id="yesCheckbox"
                                onChange={(e) => this.investorHandleChangeEvent(e, 'investorType', 'revocableTrust', false)}>&nbsp; No
                                    <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                        {/* Qualified Client starts for revocableTrust investor type*/}
                        <Row className="step1Form-row" hidden={!this.state.showQualifiedClient || this.state.investorType !== 'revocableTrust'}>
                            <Col xs={12} md={12}>
                                {/* <label className="form-label width100">Is your Trust considered a qualified client within the meaning of Rule 205-3 under the Advisers Act?</label> */}
                                <label className="form-label width100">Is your Trust considered a &nbsp;
                                <LinkWithTooltip tooltip={<span>"
                                The Trust is a qualified client if it is either making a capital commitment to the investment fund for which it proposes to subscribe of USD $1,000,000 or greater or is a Trust with investments that are valued at more than $2,100,000.
                                    "</span>} id="tooltip-1">
                                    <span className="helpWord">qualified client</span>
                                </LinkWithTooltip> &nbsp; within the meaning of Rule 205-3 under the &nbsp;
                                <LinkWithTooltip tooltip="" href="#" id="tooltip-1">
                                    <span className="helpWord">Advisers Act?</span>
                                </LinkWithTooltip>
                                </label>
                                <Radio name="qualifiedClient" inline id="yesCheckbox">&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="qualifiedClient" inline id="yesCheckbox">&nbsp; No
                                    <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                        {/* Qualified Client ends for revocableTrust investor type*/}
                        <Row className="step1Form-row" hidden={this.state.investorType !== 'iRevocableTrust'}>
                            <Col xs={12} md={12}>
                                {/* <label className="form-label width100">Is the Trust a “qualified purchaser” within the meaning of Section 2(a)(51) under the Companies Act?</label> */}                 
                                <label className="form-label width100">Is the Trust a &nbsp;
                                <LinkWithTooltip tooltip={<span>"
                                    "If any one of the four options below apply, the Trust is considered a “qualified purchaser” and if none of the four options below apply, the Trust is not a “qualified purchaser”:<br/>
                                    (1)  [MOST COMMON] The Trust is acting for its own account or the accounts of others described in clauses (2), (3) or (4) below, and in the aggregate owns and invests on a discretionary basis investments that are valued at not less than USD $25,000,000.
                                    OR<br/>
                                    (2)  [MOST COMMON] The Trust owns investments that are valued at not less than $5,000,000 and is owned directly or indirectly by two (2) or more natural persons related as siblings, spouses (including former spouses) or direct lineal descendants by birth or adoption, spouses of such persons, the estates of such persons, or foundations, charitable organizations or trusts established by or for the benefit of such persons.
                                    OR<br/>
                                    (3)  The Trust  is a “qualified institutional buyer” as defined in paragraph (a) of Rule 144A under the Securities Act, acting for its own account, the account of another “qualified institutional buyer”, or the account of a “qualified purchaser”; provided that (i) a dealer described in paragraph (a)(1)(ii) of Rule 144A must own and invest on a discretionary basis at least USD $25,000,000 in securities of issuers that are not affiliated persons of the dealer and (ii) a plan referred to in paragraph (a)(1)(i)(D) or (a)(1)(i)(E) of Rule 144A, or a trust fund referred to in paragraph (a)(1)(i)(F) of Rule 144A that holds the assets of such a plan, will not be deemed to be acting for its own account if investment decisions with respect to the plan are made by the beneficiaries of the plan, except with respect to investment decisions made solely by the fiduciary, trustee or sponsor of such plan.
                                    OR<br/>
                                    (4)  The Trust is not covered by clauses (1), (2) or (3) above, is not formed for the specific purpose of acquiring the investment in the fund as to which the Trust proposes to subscribe, as to which the trustee or other person authorized to make decisions with respect to the Trust and each settlor or other person who has contributed assets to the Trust is a person described as an individual (including any person who is acquiring such investment with his or her spouse in a joint capacity, as community property or similar shared interest) who either individually or together with a spouse, owns investments that are valued at not less than USD $5,000,000.<br/>

                                    “Investments” shall mean any of the following:<br/>
                                    (1) “Securities” as such term is defined by Section 2(a)(1) of the Securities Act.<br/>  
                                    (2) Real estate held for investment purposes (i.e., not used by you for personal purposes or as a place of business or in connection with your trade or business).<br/>
                                    (3) Commodities futures contracts, options on such contracts or options on commodities that are traded on or subject to the rules of (i) any contract market designated for trading under the Exchange Act and rules thereunder or (ii) any board of trade or exchange outside the United States, as contemplated in Part 30 of the rules under the Exchange Act) held for investment purposes.<br/>
                                    (4) Physical commodities (with respect to which a Commodity Interest is traded on a market specified in paragraph 3 above) held for investment purposes.<br/>
                                    (5) Financial contracts within the meaning of Section 3(c)(2)(B)(ii) of the Companies Act, which are held for investment purposes.<br/>
                                    (6) Cash and cash equivalents (including bank deposits, certificates of deposit, bankers acceptances and similar bank instruments held for investment purposes and the net cash surrender value of insurance policies).<br/>
                                    Valued data:<br/>
                                    “Valued” shall mean either the fair market value or cost of Investments net of the amount of any outstanding indebtedness incurred to acquire such Investments.
                                    "
                                    "<br/></span>} id="tooltip-1">
                                    <span className="helpWord">“qualified purchaser”</span>
                                </LinkWithTooltip> &nbsp; within the meaning of Section 2(a)(51) under the &nbsp;
                                <LinkWithTooltip tooltip="" href="#" id="tooltip-1">
                                    <span className="helpWord">Companies Act,</span>
                                </LinkWithTooltip>
                                </label>
                                <Radio name="qualifiedPurchaser" inline id="yesCheckbox"
                                onChange={(e) => this.investorHandleChangeEvent(e, 'investorType', 'iRevocableTrust', true)}>&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="qualifiedPurchaser" inline id="yesCheckbox"
                                onChange={(e) => this.investorHandleChangeEvent(e, 'investorType', 'iRevocableTrust', false)}>&nbsp; No
                                    <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                         {/* Qualified Client starts for iRevocableTrust investor type*/}
                         <Row className="step1Form-row" hidden={!this.state.showQualifiedClient || this.state.investorType !== 'iRevocableTrust'}>
                            <Col xs={12} md={12}>
                                {/* <label className="form-label width100">Is your Trust considered a qualified client within the meaning of Rule 205-3 under the Advisers Act?</label> */}
                                <label className="form-label width100">Is your Trust considered a &nbsp;
                                <LinkWithTooltip tooltip={<span>"
                                The Trust is a qualified client if it is either making a capital commitment to the investment fund for which it proposes to subscribe of USD $1,000,000 or greater or is a Trust with investments that are valued at more than $2,100,000.
                                    "</span>} id="tooltip-1">
                                    <span className="helpWord">qualified client</span>
                                </LinkWithTooltip> &nbsp; within the meaning of Rule 205-3 under the &nbsp;
                                <LinkWithTooltip tooltip="" href="#" id="tooltip-1">
                                    <span className="helpWord">Advisers Act?</span>
                                </LinkWithTooltip>
                                </label>
                                <Radio name="qualifiedClient" inline id="yesCheckbox">&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="qualifiedClient" inline id="yesCheckbox">&nbsp; No
                                    <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                        {/* Qualified Client ends for iRevocableTrust investor type*/}
                </div>
                <div className="margin30 error">{this.state.qualifiedPurchaserErrorMsz}</div>
                <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" aria-hidden="true" onClick={this.proceedToBack}></i>
                    <i className={"fa fa-chevron-right " + (!this.state.qualifiedPurchaserPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
                <Modal id="confirmInvestorModal" className="ttModalAlign" dialogClassName="tooltipDialog" show={this.state.showTooltipModal} onHide={this.closeTooltipModal}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Qualified Purchaser</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody">
                        <div hidden={this.state.investorType !== 'Individual'}>
                        You are an “qualified purchaser” if you own investments that are valued at not less than USD $5,000,000.  If you propose to acquire the interest in the investment fund as to which you propose to subscribe in a joint capacity with your spouse, such as community property or a similar shared interest, then you may include in this determination investments owned by your spouse.<br/>
                        “Investments” shall mean any of the following:<br/>
                        (1) “Securities” as such term is defined by Section 2(a)(1) of the Securities Act.<br/>
                        (2) Real estate held for investment purposes (i.e., not used by you for personal purposes or as a place of business or in connection with your trade or business).<br/>
                        (3) Commodities futures contracts, options on such contracts or options on commodities that are traded on or subject to the rules of (i) any contract market designated for trading under the Exchange Act and rules thereunder or (ii) any board of trade or exchange outside the United States, as contemplated in Part 30 of the rules under the Exchange Act) held for investment purposes.<br/>
                        (4) Physical commodities (with respect to which a Commodity Interest is traded on a market specified in paragraph 3 above) held for investment purposes.<br/>
                        (5) Financial contracts within the meaning of Section 3(c)(2)(B)(ii) of the Companies Act, which are held for investment purposes.<br/>
                        (6) Cash and cash equivalents (including bank deposits, certificates of deposit, bankers acceptances and similar bank instruments held for investment purposes and the net cash surrender value of insurance policies).
                        Valued data:
                        “Valued” shall mean either the fair market value or cost of Investments net of the amount of any outstanding indebtedness incurred to acquire such Investments."<br/>
                        </div>
                        <div hidden={this.state.investorType !== 'LLC'}>
                        If any one of the four options below apply, the Entity is considered a “qualified purchaser” and if none of the four options below apply, the Entity is not a “qualified purchaser”:<br/>
                        (1)  [MOST COMMON] The Entity is acting for its own account or the accounts of others described in clauses (2), (3) or (4) below, and in the aggregate owns and invests on a discretionary basis investments that are valued at not less than USD $25,000,000.
                        OR<br/>
                        (2)  [MOST COMMON] The Entity owns investments that are valued at not less than $5,000,000 and is owned directly or indirectly by two (2) or more natural persons related as siblings, spouses (including former spouses) or direct lineal descendants by birth or adoption, spouses of such persons, the estates of such persons, or foundations, charitable organizations or trusts established by or for the benefit of such persons.
                        OR<br/>
                        (3)  The Entity  is a “qualified institutional buyer” as defined in paragraph (a) of Rule 144A under the Securities Act, acting for its own account, the account of another “qualified institutional buyer”, or the account of a “qualified purchaser”; provided that (i) a dealer described in paragraph (a)(1)(ii) of Rule 144A must own and invest on a discretionary basis at least USD $25,000,000 in securities of issuers that are not affiliated persons of the dealer and (ii) a plan referred to in paragraph (a)(1)(i)(D) or (a)(1)(i)(E) of Rule 144A, or a trust fund referred to in paragraph (a)(1)(i)(F) of Rule 144A that holds the assets of such a plan, will not be deemed to be acting for its own account if investment decisions with respect to the plan are made by the beneficiaries of the plan, except with respect to investment decisions made solely by the fiduciary, trustee or sponsor of such plan.
                        OR<br/>
                        (4)  The Entity is not covered by clauses (1), (2) or (3) above, is not formed for the specific purpose of acquiring the investment in the fund as to which the Entity proposes to subscribe, and each equity owner of the Entity is an individual (including any person who is acquiring such investment with his or her spouse in a joint capacity, as community property or similar shared interest) who either individually or together with a spouse, owns investments that are valued at not less than USD $5,000,000.
                        <br/>
                        Investments data:<br/>
                            “Investments” shall mean any of the following:<br/>
                            (1) “Securities” as such term is defined by Section 2(a)(1) of the Securities Act.  <br/>
                            (2) Real estate held for investment purposes (i.e., not used by you for personal purposes or as a place of business or in connection with your trade or business).<br/>
                            (3) Commodities futures contracts, options on such contracts or options on commodities that are traded on or subject to the rules of (i) any contract market designated for trading under the Exchange Act and rules thereunder or (ii) any board of trade or exchange outside the United States, as contemplated in Part 30 of the rules under the Exchange Act) held for investment purposes.<br/>
                            (4) Physical commodities (with respect to which a Commodity Interest is traded on a market specified in paragraph 3 above) held for investment purposes.<br/>
                            (5) Financial contracts within the meaning of Section 3(c)(2)(B)(ii) of the Companies Act, which are held for investment purposes.<br/>
                            (6) Cash and cash equivalents (including bank deposits, certificates of deposit, bankers acceptances and similar bank instruments held for investment purposes and the net cash surrender value of insurance policies).<br/>
                            Valued data:<br/>
                        “Valued” shall mean either the fair market value or cost of Investments net of the amount of any outstanding indebtedness incurred to acquire such Investments.
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal id="confirmInvestorModal" className="ttModalAlign" dialogClassName="tooltipDialog top150" show={this.state.showQualifiedClientModal} onHide={this.closeQualifiedClientTooltip}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Qualified Client</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody">
                        <div>
                        The Entity is a qualified client if it is either making a capital commitment to the investment fund for which it proposes to subscribe of USD $1,000,000 or greater or is a Entity with investments that are valued at more than $2,100,000.
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal id="confirmInvestorModal" className="ttModalAlign" dialogClassName="tooltipDialog top150" show={this.state.showCompanyModal} onHide={this.closeCompanyModal}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Companies Act</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody">
                        <div>
                            United Stated Investment Company Act of 1940, as amended
                        </div>
                        
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default QualifiedPurchaserComponent;

