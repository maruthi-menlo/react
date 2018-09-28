import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Radio, Row, Col, FormControl, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { FsnetUtil } from '../../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';
import { PubSub } from 'pubsub-js';

class AccreditedInvestorComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.FsnetUtil = new FsnetUtil();
        this.accreditedInvestorChangeEvent = this.accreditedInvestorChangeEvent.bind(this);
        this.openTooltip = this.openTooltip.bind(this);
        this.closeTooltipModal = this.closeTooltipModal.bind(this);
        this.closeSecurityTooltipModal = this.closeSecurityTooltipModal.bind(this);
        this.openSecurityTooltipModal = this.openSecurityTooltipModal.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.state = {
            showModal: false,
            investorType: 'LLC',
            investorSubType: 0,
            areYouAccreditedInvestor: false,
            accreditedInvestorPageValid: false,
            getInvestorObj: {},
            showTooltipModal: false,
            accreditedInvestorErrorMsz:'',
            showSecurityTooltipModal:false
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
                    obj['currentPageCount'] = 2;
                    obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
                    PubSub.publish('investorData', obj);
                    this.setState({
                        getInvestorObj: result.data.data,
                        investorType: result.data.data.investorType?result.data.data.investorType:'LLC',
                        investorSubType: result.data.data.investorSubType ? result.data.data.investorSubType : (result.data.data.investorType == 'Trust' ? 9 : 0),
                        areYouAccreditedInvestor: result.data.data.areYouAccreditedInvestor || false
                    }, () => {
                        console.log('jdfjhsd');
                        this.updateInvestorInputFields(this.state.getInvestorObj)
                    })
                }
            })
                .catch(error => {
                    this.close();
                });
        }
    }

    updateInvestorInputFields(data) {
        if (this.state.areYouAccreditedInvestor !== null && this.state.areYouAccreditedInvestor !== undefined) {
            this.setState({
                accreditedInvestorPageValid: true
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

    // //Show Tooltip Modal
    openTooltip() {
        PubSub.publish('openModal', {investorType: this.state.investorType, investorSubType: this.state.investorSubType, modalType: 'accredited', type: 'accreditedModal'});
        // this.setState({ showTooltipModal: true });
    }

    //Close Tooltip Modal
    closeTooltipModal() {
        this.setState({ showTooltipModal: false });
    }

    // //Show Tooltip Modal
    openSecurityTooltipModal() {
        PubSub.publish('openModal', {investorType: this.state.investorType, investorSubType: this.state.investorSubType, modalType: 'actModalWindow', type: 'security'});
        // this.setState({ showSecurityTooltipModal: true });
    }

    //Close Tooltip Modal
    closeSecurityTooltipModal() {
        this.setState({ showSecurityTooltipModal: false });
    }

    accreditedInvestorChangeEvent(event, type, value) {
        this.setState({
            [type]: value,
            accreditedInvestorPageValid: true
        })
    }

    proceedToNext() {
        let postobj = { investorType: this.state.investorType, investorSubType: this.state.investorSubType, subscriptonId: this.state.getInvestorObj.id, step: 3, areYouAccreditedInvestor: this.state.areYouAccreditedInvestor }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                this.props.history.push('/lp/qualifiedPurchaser/' + this.state.getInvestorObj.id);
            }
        })
        .catch(error => {
            this.close();
            if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                this.setState({
                    accreditedInvestorErrorMsz: error.response.data.errors[0].msg,
                });
            } else {
                this.setState({
                    accreditedInvestorErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                });
            }
        });

    }

    proceedToBack() {
        this.props.history.push('/lp/investorInfo/' + this.state.getInvestorObj.id);
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
            <div className="accreditedInvestor width100">
                <div className="formGridDivMargins min-height-400">
                    {/* individual investor type block starts */}
                    <div className="title">Accredited Investor</div>
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'Individual'}>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">Are you  an <span className="helpWord" onClick={this.openTooltip}>Accredited Investor</span> within the meaning of Rule 501 under the <span className="helpWord" onClick={this.openSecurityTooltipModal}>Securities Act</span>?
                            </label>
                            <Radio name="individualAccredited" inline checked={this.state.areYouAccreditedInvestor === true} onChange={(e) => this.accreditedInvestorChangeEvent(e, 'areYouAccreditedInvestor', true)}>&nbsp; Yes
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="individualAccredited" inline checked={this.state.areYouAccreditedInvestor === false} onChange={(e) => this.accreditedInvestorChangeEvent(e, 'areYouAccreditedInvestor', false)}>&nbsp; No
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                    </Row>
                    {/* individual investor type block ends */}
                    {/* llc investor type block starts */}
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'LLC'}>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">Is the Entity an <span className="helpWord" onClick={this.openTooltip}>Accredited Investor</span> within the meaning of Rule 501 under the <span className="helpWord" onClick={this.openSecurityTooltipModal}>Securities Act</span>?</label>
                            <Radio name="llcAccredited" inline checked={this.state.areYouAccreditedInvestor === true} onChange={(e) => this.accreditedInvestorChangeEvent(e, 'areYouAccreditedInvestor', true)}>&nbsp; Yes
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="llcAccredited" inline checked={this.state.areYouAccreditedInvestor === false} onChange={(e) => this.accreditedInvestorChangeEvent(e, 'areYouAccreditedInvestor', false)}>&nbsp; No
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                    </Row>
                    {/* llc investor type block ends */}
                    
                    { this.state.investorType == 'Trust' 
                    ? 
                       /* (
                            this.state.investorSubType == 9 
                        ? */
                            //revocableTrust investor type block starts
                            <Row className="step1Form-row">
                                <Col xs={12} md={12}>
                                    <label className="form-label width100">Is the Trust an <span className="helpWord" onClick={this.openTooltip}>Accredited Investor</span> within the meaning of Rule 501 under the <span className="helpWord" onClick={this.openSecurityTooltipModal}>Securities Act</span>?</label>
                                    <Radio name="trustAccredited" inline checked={this.state.areYouAccreditedInvestor === true} onChange={(e) => this.accreditedInvestorChangeEvent(e, 'areYouAccreditedInvestor', true)}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                    </Radio>
                                    <Radio name="trustAccredited" inline checked={this.state.areYouAccreditedInvestor === false} onChange={(e) => this.accreditedInvestorChangeEvent(e, 'areYouAccreditedInvestor', false)}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                    </Radio>
                                </Col>
                            </Row>
                            //revocableTrust investor type block ends
                       /* :
                            //IrrevocableTrust investor type block starts
                            <Row className="step1Form-row">
                                <Col xs={12} md={12}>
                                    <label className="form-label width100">Is the Trust an<span className="helpWord" onClick={this.openTooltip}>Accredited Investor</span>within the meaning of Rule 501 under the<span className="helpWord" onClick={this.openSecurityTooltipModal}>Securities Act</span>?</label>
                                    <Radio name="trustAccredited" inline checked={this.state.areYouAccreditedInvestor === true} onChange={(e) => this.accreditedInvestorChangeEvent(e, 'areYouAccreditedInvestor', true)}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                    </Radio>
                                    <Radio name="llcAccredited" inline checked={this.state.areYouAccreditedInvestor === false} onChange={(e) => this.accreditedInvestorChangeEvent(e, 'areYouAccreditedInvestor', false)}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                    </Radio>
                                </Col>
                            </Row>
                            //IrrevocableTrust investor type block ends
                        ) */
                    :
                        null
                    }
                    
                    
                    {/* <Row className="step1Form-row" hidden={this.state.investorType !== 'Trust'}>
                        <Col xs={12} md={12}>
                            <label className="form-label width100"> Is the Entity an &nbsp;
                            <LinkWithTooltip tooltip={<span>If any one of the three options below apply, the Trust is considered an Accredited Investor and if none of the three options below apply, the Trust is not an Accredited Investor:<br/>
                                    (1)  [MOST COMMON] The Trust is a living trust or other revocable trust in which all of the grantors and trustees either (A) qualify under options (2), (3) or (4) below, or (B) either (x) have a net worth either individually or upon a joint basis with such person’s spouse of at least USD $1,000,000, or (y) have had an individual income in excess of USD $200,000 for each of the two most recent fully completed calendar years, or a joint income with such person’s spouse in excess of USD $300,000 in each of those years, and have a reasonable expectation of reaching the same income level in the current calendar year.
                                    OR<br/>
                                    (3)  The Trust is a business trust, not formed for the purpose of acquiring the investment in the fund as to which the Trust proposes to subscribe, or an organization described in Section 501(c)(3) of the Code, in each case with total assets in excess of USD $5,000,000.
                                    OR<br/>
                                    (4)  The Trust is a bank, insurance company, investment company registered under the Companies Act, a broker or dealer registered pursuant to Section 15 of the Securities Exchange Act, a business development company, a Small Business Investment Company licensed by the United States Small Business Administration, a plan with total assets in excess of USD $5,000,000 established and maintained by a state for the benefit of its employees, or a private business development company as defined in Section 202(a)(22) of the Advisers Act<br/>
                                </span>} href="#" id="tooltip-1">
                                    <span>Accredited Investor</span>
                                </LinkWithTooltip> &nbsp; within the meaning of Rule 501 under the &nbsp;
                                <span>Securities Act?</span></label>
                            <Radio name="rule501" inline id="yesCheckbox">&nbsp; Yes
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="rule501" inline id="yesCheckbox">&nbsp; No
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                    </Row> */}
                    {/* revocableTrust investor type block ends */}
                    {/* iRevocableTrust investor type block starts */}
                    {/* <Row className="step1Form-row" hidden={this.state.investorType !== 'iRevocableTrust'}>
                        <Col xs={12} md={12}>
                            <label className="form-label width100"> Is the Entity an &nbsp;
                            <LinkWithTooltip tooltip={<span>If any one of the three options below apply, the Trust is considered an Accredited Investor and if none of the three options below apply, the Trust is not an Accredited Investor:<br/>
                                    (1)  [MOST COMMON] The Trust is a living trust or other revocable trust in which all of the grantors and trustees either (A) qualify under options (2), (3) or (4) below, or (B) either (x) have a net worth either individually or upon a joint basis with such person’s spouse of at least USD $1,000,000, or (y) have had an individual income in excess of USD $200,000 for each of the two most recent fully completed calendar years, or a joint income with such person’s spouse in excess of USD $300,000 in each of those years, and have a reasonable expectation of reaching the same income level in the current calendar year.
                                    OR<br/>
                                    (3)  The Trust is a business trust, not formed for the purpose of acquiring the investment in the fund as to which the Trust proposes to subscribe, or an organization described in Section 501(c)(3) of the Code, in each case with total assets in excess of USD $5,000,000.
                                    OR<br/>
                                    (4)  The Trust is a bank, insurance company, investment company registered under the Companies Act, a broker or dealer registered pursuant to Section 15 of the Securities Exchange Act, a business development company, a Small Business Investment Company licensed by the United States Small Business Administration, a plan with total assets in excess of USD $5,000,000 established and maintained by a state for the benefit of its employees, or a private business development company as defined in Section 202(a)(22) of the Advisers Act<br/>
                                </span>} href="#" id="tooltip-1">
                                    <span>Accredited Investor</span>
                                </LinkWithTooltip> &nbsp; within the meaning of Rule 501 under the &nbsp;
                            <LinkWithTooltip tooltip="" href="#" id="tooltip-1">
                                    <span>Securities Act?</span>
                                </LinkWithTooltip></label>
                            <Radio name="rule501" inline id="yesCheckbox">&nbsp; Yes
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="rule501" inline id="yesCheckbox">&nbsp; No
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                    </Row> */}
                    {/* iRevocableTrust investor type block ends */}
                    <div className="vanilla-note" hidden={this.state.showModal || this.state.areYouAccreditedInvestor !== false}>
                        Please note, in almost all cases it will not be possible to subscribe to the Fund unless you are able to make an affirmative representation as to Accredited Investor status.  If you are unable to make this representation, please contact the issuer or the issuer’s legal counsel immediately before proceeding further.
                    </div>
                </div>
                <div className="margin30 error">{this.state.accreditedInvestorErrorMsz}</div>
                <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.accreditedInvestorPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default AccreditedInvestorComponent;

