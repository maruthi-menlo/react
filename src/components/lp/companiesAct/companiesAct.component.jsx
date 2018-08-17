import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Radio, Row, Col, FormControl, OverlayTrigger, Tooltip,Modal } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { reactLocalStorage } from 'reactjs-localstorage';
import { PubSub } from 'pubsub-js';
import { FsnetUtil } from '../../../util/util';

class companiesActComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.FsnetUtil = new FsnetUtil();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.companiesActChangeEvent = this.companiesActChangeEvent.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.openTooltip = this.openTooltip.bind(this);
        this.closeTooltipModal = this.closeTooltipModal.bind(this);
        this.state = {
            showModal: false,
            investorType: 'LLC',
            companyActPageValid: false,
            investorObj: {},
            companiesAct:'',
            showTooltipModal: false,
            companiesActErrorMsz:''
        }

    }

    //Show Modal
    openTooltip() {
        this.setState({ showTooltipModal: true });
    }
    //Close  Modal
    closeTooltipModal() {
        this.setState({ showTooltipModal: false });
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
                    obj['currentPageCount'] = 4;
                    obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
                    PubSub.publish('investorData',obj );
                    this.setState({
                        investorObj: result.data.data,
                        investorType: result.data.data.investorType?result.data.data.investorType:'LLC',
                        companiesAct: result.data.data.companiesAct
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
        if(this.state.companiesAct) {
            this.setState({
                companyActPageValid: true
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

    companiesActChangeEvent(event, type, value) {
        this.setState({
            [type]:value,
            companyActPageValid: true
        })
    }

    proceedToNext() {
        let postobj = {investorType:this.state.investorType,subscriptonId:this.state.investorObj.id, step:5,companiesAct:this.state.companiesAct }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                this.props.history.push('/lp/equityOwners/'+this.state.investorObj.id);
            }
        })
        .catch(error => {
            this.close();
            if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                this.setState({
                    companiesActErrorMsz: error.response.data.errors[0].msg,
                });
            } else {
                this.setState({
                    companiesActErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                });
            }
        });
    }

    proceedToBack () {
        this.props.history.push('/lp/qualifiedPurchaser/'+this.state.investorObj.id);
    }

    render() {
        function LinkWithTooltip({ id, children, href, tooltip }) {
            return (
                <OverlayTrigger
                trigger={['click', 'hover', 'focus']}
                overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
                placement='left'
                delayShow={300}
                delayHide={150}
              >
                <span >{children}</span>
              </OverlayTrigger>
            );
        }
        return (
            <div className="accreditedInvestor width100">
                <div className="formGridDivMargins min-height-400">
                    {/* llc investor type block starts */}
                    <div className="title">Companies Act</div>
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'LLC'}>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">Please respond in one of the ways below regarding whether the Entity is an<span className="helpWord" onClick={this.openTooltip}>investment company</span>pursuant to the <span className="helpWord" onClick={this.openTooltip}>Companies Act</span>.</label>
                            <Radio name="companiesAct" inline className="companiesActRadio" checked={this.state.companiesAct === '1'} onChange={(e) => this.companiesActChangeEvent(e, 'companiesAct', '1')}>
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Entity is not an investment company and does not rely on Section 3(c)(1) or Section 3(c)(7) of the Companies Act in order to be deemed excluded from being treated as an investment company.</div>
                            </Radio>

                            <Radio name="companiesAct" inline className="companiesActRadio" checked={this.state.companiesAct === '2'} onChange={(e) => this.companiesActChangeEvent(e, 'companiesAct', '2')}>
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Entity would be an investment company but it is not treated as such because it relies on Section 3(c)(1) of the Companies Act to avoid such treatment.</div>
                            </Radio>

                            <Radio name="companiesAct" inline className="companiesActRadio" checked={this.state.companiesAct === '3'} onChange={(e) => this.companiesActChangeEvent(e, 'companiesAct', '3')}>
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Entity would be an investment company but it is not treated as such because it relies on Section 3(c)(7) of the Companies Act to avoid such treatment.</div>
                            </Radio>

                            <Radio name="companiesAct" inline className="companiesActRadio" checked={this.state.companiesAct === '4'} onChange={(e) => this.companiesActChangeEvent(e, 'companiesAct', '4')}>
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Entity is an investment company pursuant to the Companies Act, not relying on any exemption from treatment as such.</div>
                            </Radio>
                        </Col>
                    </Row>
                    {/* llc investor type block ends */}
                    {/* revocableTrust investor type block starts */}
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'revocableTrust'}>
                        <Col xs={12} md={12}>
                            {/* <label className="form-label width100"> Please respond in one of the ways below regarding whether the Trust is an investment company pursuant to the Companies Act.*</label> */}                             
                            <label className="title width100"> Please respond in one of the ways below regarding whether the Trust is an                                 
                            &nbsp; 
                            <LinkWithTooltip tooltip={<span>
                                "Investment company data:<br/>
                                investment company means any entity which either:<br/>
                                (1) Is or holds itself out as being engaged primarily, or proposes to engage primarily, in the business of investing, reinvesting, or trading in securities;<br/>
                                (2) Is engaged or proposes to engage in the business of issuing face-amount certificates of the installment type, or has been engaged in such business and has any such certificate outstanding; or<br/>
                                (3) Is engaged or proposes to engage in the business of investing, reinvesting, owning, holding, or trading in securities, and owns or proposes to acquire investment securities having a value exceeding 40 per centum of the value of such issuer’s total assets (exclusive of Government securities and cash items) on an unconsolidated basis.
                                Section 3(c)(1) data:<br/>
                                None of the following persons is an investment company …Any issuer whose outstanding securities (other than short-term paper) are beneficially owned by not more than one hundred persons and which is not making and does not presently propose to make a public offering of its securities…For purposes of the preceding, beneficial ownership by a company shall be deemed to be beneficial ownership by one person, except that, if the company owns 10 per centum or more of the outstanding voting securities of the issuer and is or, but for the exception provided for in this paragraph or under Section 3(c)(7) of the Companies Act, would be an investment company, the beneficial ownership shall be deemed to be that of the holders of such company’s outstanding securities (other than short-term paper).<br/>
                                Section 3(c)(7) data:<br/>
                                None of the following persons is an investment company…Any issuer, the outstanding securities of which are owned exclusively by persons who, at the time of acquisition of such securities, are qualified purchasers, and which is not making and does not at the time propose to make a public offering of such securities.  Securities that are owned by persons who received the securities from a qualified purchaser as a gift or bequest, or in a case in which the transfer was caused by legal separation, divorce, death, or other involuntary event, shall be deemed to be owned by a qualified purchaser, subject to such rules, regulations, and orders as the United States Securities and Exchange Commission may prescribe as necessary or appropriate in the public interest or for the protection of investors. 
                                "<br/>
                                </span>} href="#" id="tooltip-2">
                            <span className="helpWord"><strong>investment company</strong></span>
                            </LinkWithTooltip> pursuant to the &nbsp;
                            <LinkWithTooltip tooltip="" href="#" id="tooltip-1">
                                <span className="helpWord"><strong>Companies Act.*</strong></span>
                            </LinkWithTooltip>
                            </label>
                            <Radio name="companiesAct" inline className="companiesActRadio" id="yesCheckbox">
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Trust is not an investment company and does not rely on Section 3(c)(1) or Section 3(c)(7) of the Companies Act in order to be deemed excluded from being treated as an investment company.</div>
                            </Radio>
                            <Radio name="companiesAct" inline className="companiesActRadio" id="yesCheckbox">
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Trust would be an investment company but it is not treated as such because it relies on Section 3(c)(1) of the Companies Act to avoid such treatment. *</div>
                            </Radio>
                            <Radio name="companiesAct" inline className="companiesActRadio" id="yesCheckbox">
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Trust would be an investment company but it is not treated as such because it relies on Section 3(c)(7) of the Companies Act to avoid such treatment.  *</div>
                            </Radio>
                            <Radio name="companiesAct" inline className="companiesActRadio" id="yesCheckbox">
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Trust is an investment company pursuant to the Companies Act, not relying on any exemption from treatment as such.</div>
                            </Radio>
                        </Col>
                        
                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row">
                                <label className="form-label width100">Please specify the number of direct equity owners of the Entity.</label>
                                <FormControl type="text" placeholder="Enter number" className="inputFormControl inputWidth290" />
                                <span className="error"></span>
                            </Col>
                            <Col xs={12} md={12} className="marginTop24">
                                <label className="form-label width100">Are there any existing or prospective investors of the fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?</label>
                                <Radio name="rule501" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">Yes</div>
                                </Radio>
                                <Radio name="rule501" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">No</div>
                                </Radio>
                            </Col>
                            <Col xs={12} md={12} className="marginTop24">
                                <label className="form-label width100">How many such existing or prospective investors are there (please enter the number)?</label>
                                <FormControl type="text" placeholder="Enter number" className="inputFormControl inputWidth290" />
                                <span className="error"></span>
                            </Col>
                        {/* </Row> */}
                    </Row>
                    {/* revocableTrust investor type block ends */}
                    {/* iRevocableTrust investor type block starts */}
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'iRevocableTrust'}>
                        <Col xs={12} md={12}>
                            <label className="title width100"> Please respond in one of the ways below regarding whether the Trust is an                                 
                            &nbsp; 
                            <LinkWithTooltip tooltip={<span>
                                "Investment company data:<br/>
                                investment company means any entity which either:<br/>
                                (1) Is or holds itself out as being engaged primarily, or proposes to engage primarily, in the business of investing, reinvesting, or trading in securities;<br/>
                                (2) Is engaged or proposes to engage in the business of issuing face-amount certificates of the installment type, or has been engaged in such business and has any such certificate outstanding; or<br/>
                                (3) Is engaged or proposes to engage in the business of investing, reinvesting, owning, holding, or trading in securities, and owns or proposes to acquire investment securities having a value exceeding 40 per centum of the value of such issuer’s total assets (exclusive of Government securities and cash items) on an unconsolidated basis.<br/>
                                Section 3(c)(1) data:<br/>
                                None of the following persons is an investment company …Any issuer whose outstanding securities (other than short-term paper) are beneficially owned by not more than one hundred persons and which is not making and does not presently propose to make a public offering of its securities…For purposes of the preceding, beneficial ownership by a company shall be deemed to be beneficial ownership by one person, except that, if the company owns 10 per centum or more of the outstanding voting securities of the issuer and is or, but for the exception provided for in this paragraph or under Section 3(c)(7) of the Companies Act, would be an investment company, the beneficial ownership shall be deemed to be that of the holders of such company’s outstanding securities (other than short-term paper).<br/>
                                Section 3(c)(7) data:<br/>
                                None of the following persons is an investment company…Any issuer, the outstanding securities of which are owned exclusively by persons who, at the time of acquisition of such securities, are qualified purchasers, and which is not making and does not at the time propose to make a public offering of such securities.  Securities that are owned by persons who received the securities from a qualified purchaser as a gift or bequest, or in a case in which the transfer was caused by legal separation, divorce, death, or other involuntary event, shall be deemed to be owned by a qualified purchaser, subject to such rules, regulations, and orders as the United States Securities and Exchange Commission may prescribe as necessary or appropriate in the public interest or for the protection of investors. <br/>
                                "
                                </span>} href="#" id="tooltip-2">
                            <span className="helpWord"><strong>investment company</strong></span>
                            </LinkWithTooltip> pursuant to the 
                            <LinkWithTooltip tooltip="" href="#" id="tooltip-1">
                                <span className="helpWord"><strong>Companies Act.*</strong></span>
                            </LinkWithTooltip>
                            </label>
                            <Radio name="companiesAct" inline className="companiesActRadio" id="yesCheckbox">
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Trust is not an investment company and does not rely on Section 3(c)(1) or Section 3(c)(7) of the Companies Act in order to be deemed excluded from being treated as an investment company.</div>
                            </Radio>
                            <Radio name="companiesAct" inline className="companiesActRadio" id="yesCheckbox">
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Trust would be an investment company but it is not treated as such because it relies on Section 3(c)(1) of the Companies Act to avoid such treatment. *</div>
                            </Radio>
                            <Radio name="companiesAct" inline className="companiesActRadio" id="yesCheckbox">
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Trust would be an investment company but it is not treated as such because it relies on Section 3(c)(7) of the Companies Act to avoid such treatment.  *</div>
                            </Radio>
                            <Radio name="companiesAct" inline className="companiesActRadio" id="yesCheckbox">
                                <span className="radio-checkmark"></span>
                                <div className="radioText">The Trust is an investment company pursuant to the Companies Act, not relying on any exemption from treatment as such.</div>
                            </Radio>
                        </Col>

                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row">
                                <label className="form-label width100">Please specify the number of direct equity owners of the Entity.</label>
                                <FormControl type="text" placeholder="Enter number" className="inputFormControl inputWidth290" />
                                <span className="error"></span>
                            </Col>
                            <Col xs={12} md={12} className="marginTop24">
                                <label className="form-label width100">Are there any existing or prospective investors of the fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?</label>
                                <Radio name="rule501" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">Yes</div>
                                </Radio>
                                <Radio name="rule501" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">No</div>
                                </Radio>
                            </Col>
                            <Col xs={12} md={12} className="marginTop24">
                                <label className="form-label width100">How many such existing or prospective investors are there (please enter the number)?</label>
                                <FormControl type="text" placeholder="Enter number" className="inputFormControl inputWidth290" />
                                <span className="error"></span>
                            </Col>
                        {/* </Row> */}
                    </Row>
                    {/* iRevocableTrust investor type block ends */}
                </div>
                <div className="margin30 error">{this.state.companiesActErrorMsz}</div>
                <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.companyActPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
                <Modal id="confirmInvestorModal" className="ttModalAlign" dialogClassName="tooltipDialog" show={this.state.showTooltipModal} onHide={this.closeTooltipModal}>
                    <Modal.Header className="TtModalHeaderAlign" closeButton>
                        <h1>Investment Company</h1>
                    </Modal.Header>
                    <Modal.Body className="TtModalBody">
                        <div hidden={this.state.investorType !== 'LLC'}>
                        Investment company data:<br/>
                        investment company means any entity which either:<br/>
                        (1) Is or holds itself out as being engaged primarily, or proposes to engage primarily, in the business of investing, reinvesting, or trading in securities;<br/>
                        (2) Is engaged or proposes to engage in the business of issuing face-amount certificates of the installment type, or has been engaged in such business and has any such certificate outstanding; or<br/>
                        (3) Is engaged or proposes to engage in the business of investing, reinvesting, owning, holding, or trading in securities, and owns or proposes to acquire investment securities having a value exceeding 40 per centum of the value of such issuer’s total assets (exclusive of Government securities and cash items) on an unconsolidated basis.<br/>
                        Section 3(c)(1) data:<br/>
                        None of the following persons is an investment company …Any issuer whose outstanding securities (other than short-term paper) are beneficially owned by not more than one hundred persons and which is not making and does not presently propose to make a public offering of its securities…For purposes of the preceding, beneficial ownership by a company shall be deemed to be beneficial ownership by one person, except that, if the company owns 10 per centum or more of the outstanding voting securities of the issuer and is or, but for the exception provided for in this paragraph or under Section 3(c)(7) of the Companies Act, would be an investment company, the beneficial ownership shall be deemed to be that of the holders of such company’s outstanding securities (other than short-term paper).<br/>
                        Section 3(c)(7) data:<br/>
                        None of the following persons is an investment company…Any issuer, the outstanding securities of which are owned exclusively by persons who, at the time of acquisition of such securities, are qualified purchasers, and which is not making and does not at the time propose to make a public offering of such securities.  Securities that are owned by persons who received the securities from a qualified purchaser as a gift or bequest, or in a case in which the transfer was caused by legal separation, divorce, death, or other involuntary event, shall be deemed to be owned by a qualified purchaser, subject to such rules, regulations, and orders as the United States Securities and Exchange Commission may prescribe as necessary or appropriate in the public interest or for the protection of investors.<br/>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default companiesActComponent;

