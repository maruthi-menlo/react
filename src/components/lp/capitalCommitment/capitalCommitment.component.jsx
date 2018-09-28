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

class capitalCommitmentComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.FsnetUtil = new FsnetUtil();
        this.onChangeEvent = this.onChangeEvent.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.state = {
            showModal: false,
            investorType: 'LLC',
            investorSubType: 0,
            lpCapitalCommitment: '',
            showTooltipModal: false,
            showSecurityTooltipModal:false
        }

    }


    //ProgressLoader : Close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loader
    open() {
        this.setState({ showModal: true });
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
                    obj['currentPageCount'] = result.data.data.investorType == 'Trust' ? 6 : (result.data.data.investorType == 'LLC' ? 8 : 4);
                    obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
                    PubSub.publish('investorData', obj);
                    this.setState({
                        getInvestorObj: result.data.data,
                        investorType: result.data.data.investorType?result.data.data.investorType:'LLC',
                        investorSubType: result.data.data.investorSubType ? result.data.data.investorSubType : (result.data.data.investorType == 'Trust' ? 9 : 0),
                        lpCapitalCommitment: result.data.data.lpCapitalCommitment,
                        lpCapitalCommitmentStr: result.data.data.lpCapitalCommitment ? this.FsnetUtil.convertToCurrency(result.data.data.lpCapitalCommitment) : ''
                    }, () => {
                        console.log('jdfjhsd');
                        // this.updateInvestorInputFields(this.state.getInvestorObj)
                    })
                }
            })
                .catch(error => {
                    this.close();
                });
        }
    }

    proceedToNext() {
        let postobj = { investorType: this.state.investorType, investorSubType: this.state.investorSubType, subscriptonId: this.state.getInvestorObj.id, step: this.state.investorType == 'Trust' ? 7 : (this.state.investorType == 'LLC' ? 9 : 5), lpCapitalCommitment: this.state.lpCapitalCommitment.toString() }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                this.props.history.push('/lp/review/' + this.state.getInvestorObj.id);
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
        console.log('id:::', this.state.getInvestorObj);
        if(this.state.investorType == 'LLC' || this.state.investorType == 'Trust') {
            this.props.history.push('/lp/erisa/'+this.state.getInvestorObj.id);
        } else {
            this.props.history.push('/lp/qualifiedPurchaser/'+this.state.getInvestorObj.id);
        }
    }

    numbersOnly(event) {
        if (((event.which != 46 || (event.which == 46 && event.target.value == '')) ||
            event.target.value.indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    }

    formChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name] : value
        })
    }
    

    onChangeEvent(e) {
        let name = e.target.name;
        let value = e.target.value;
        const re = /^[1-9]*$/;
        if (re.test(value.trim())) {
            this.setState({
                [name]: value ? parseInt(value) : '',
                lpCapitalCommitment: value ? parseInt(value) : '',
                [name + 'Valid']: true,
                [name + 'Touched']: true
            })
            return true;
        } else {
            if (parseInt(value) < 0) {
                this.setState({
                    [name + 'Valid']: false,
                    [name + 'Touched']: true
                })
                return true;
            }
        }
        // this.setState({
        //     [name]: value
        // })
        // return true;
    }

    valueTouched(e) {
        let name = e.target.name;
        let capitalValue = e.target.value ? Number(e.target.value.replace(/[^0-9.-]+/g,"")) : '';
        let value = capitalValue ? this.FsnetUtil.convertToCurrency(capitalValue) : '';
        let intValue = value ? Number(value.replace(/[^0-9.-]+/g,"")) : '';
        this.setState({
            [name]: value,
            lpCapitalCommitment: intValue,
            [name+'Touched']: true
        })
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
                    <div className="title">Capital Commitment</div>
                    <Row className="step1Form-row">
                        <Col xs={12} md={12}>
                            <label className="form-label width100 erisa-heading">Please indicate the amount of the Capital Commitment you are offering to subscribe for:</label>
                        </Col>
                        <Col xs={12} md={12}>
                            <FormControl type="text" name='lpCapitalCommitmentStr' placeholder="Enter the capital amount" value={this.state.lpCapitalCommitmentStr} className={"inputFormControl inputWidth290 " + (this.state.lpCapitalCommitmentTouched && !this.state.lpCapitalCommitment ? 'inputError' : '')} onChange={(e) => {this.formChange(e)}} onKeyPress={(e) => {this.numbersOnly(e)}} onBlur={(e)=> {this.valueTouched(e)}} />
                            {this.state.lpCapitalCommitmentTouched && !this.state.lpCapitalCommitment ? <span className="error">{this.Constants.TRUST_NAME_REQUIRED}</span> : null}
                        </Col>
                    </Row>
                    {/* individual investor type block ends */}
                </div>
                <div className="margin30 error">{this.state.accreditedInvestorErrorMsz}</div>
                <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.lpCapitalCommitment ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default capitalCommitmentComponent;

