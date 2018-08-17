import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Radio, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { FsnetUtil } from '../../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';
import { PubSub } from 'pubsub-js';

class QualifiedClientComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.FsnetUtil = new FsnetUtil();
        this.qualifiedClientChangeEvent = this.qualifiedClientChangeEvent.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.state = {
            showModal: false,
            investorType: 'LLC',
            investorObj: {},
            areYouQualifiedClient: null,
            qualifiedClientPageValid: false
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
                        investorType: result.data.data.investorType,
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
        if(this.state.areYouQualifiedClient) {
            this.setState({
                qualifiedClientPageValid: true
            })
        } else {
            this.setState({
                qualifiedClientPageValid: true
            })
        }
    }

    qualifiedClientChangeEvent(event, type, value) {
        this.setState({
            [type]:value,
            qualifiedClientPageValid: true,
        })
    }

    proceedToNext() {
        let postobj = {investorType:this.state.investorType,lpId:this.state.investorObj.id, step:4,areYouQualifiedClient:this.state.areYouQualifiedClient }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                this.props.history.push('/lp/review/'+this.state.investorObj.id);
            }
        })
        .catch(error => {
            this.close();
            this.props.history.push('/lp/review/'+this.state.investorObj.id);
        });
    }

    proceedToBack () {
        this.props.history.push('/lp/qualifiedPurchaser/'+this.state.investorObj.id);
    }

    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    render() {
        function LinkWithTooltip({ id, children, href, tooltip }) {
            return (
              <OverlayTrigger
                overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
                placement="right"
                delayShow={300}
                delayHide={150}
              >
                <a href={href}>{children}</a>
              </OverlayTrigger>
            );
        }
        return (
            <div className="qualifiedPurchaser width100">
                <div className="form-grid formGridDivMargin min-height-400">
                        <Row className="step1Form-row">
                            {/* <Col xs={12} md={12}>
                                <label className="form-label width100">Are you a “qualified client” within the meaning of Rule 205-3 under the Advisers Act?</label>
                                <Radio name="qualifiedClient" inline id="yesCheckbox">&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="qualifiedClient" inline id="yesCheckbox">&nbsp; No
                                    <span className="radio-checkmark"></span>
                                </Radio>
                            </Col> */}
                            <Col xs={12} md={12}>
                                <label className="form-label width100">Are you a 
                                &nbsp; 
                                <LinkWithTooltip tooltip={<span>
                                    <strong>The Entity is a “qualified client” if it is either making a capital commitment to the investment fund for which it proposes to subscribe of USD 
                                        $1,000,000 or greater or is a Entity with investments that are valued at more than $2,100,000.</strong>
                                    </span>} href="#" id="tooltip-1">
                                <span><strong>“qualified client” </strong></span>
                                </LinkWithTooltip> &nbsp; within the meaning of Rule 205-3 under the Advisers Act?</label>
                                <Radio name="qualifiedClient" inline checked={this.state.areYouQualifiedClient === 'Yes'} onChange={(e) => this.qualifiedClientChangeEvent(e, 'areYouQualifiedClient', 'Yes')}>&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="qualifiedClient" inline checked={this.state.areYouQualifiedClient === 'No'} onChange={(e) => this.qualifiedClientChangeEvent(e, 'areYouQualifiedClient', 'No')}>&nbsp; No
                                    <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                </div>

                <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" aria-hidden="true" onClick={this.proceedToBack}></i>
                    <i className={"fa fa-chevron-right " + (!this.state.qualifiedClientPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default QualifiedClientComponent;

