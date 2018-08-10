import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Radio, Row, Col, FormControl } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { PubSub } from 'pubsub-js';
import { FsnetUtil } from '../../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';

class entityProposingComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.FsnetUtil = new FsnetUtil();
        this.equityProposingChangeEvent = this.equityProposingChangeEvent.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.state = {
            showModal: false,
            investorType: 'LLC',
            equityProposingPageValid:false,
            getInvestorObj:{},
            entityProposingAcquiringInvestment: '',
            anyOtherInvestorInTheFund: '',
            entityHasMadeInvestmentsPriorToThedate: '',
            partnershipWillNotConstituteMoreThanFortyPercent: '',
            beneficialInvestmentMadeByTheEntity: '',
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
                    obj['currentPageCount'] = 6;
                    obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
                    PubSub.publish('investorData',obj );
                    this.setState({
                        getInvestorObj: result.data.data,
                        investorType: result.data.data.investorType,
                        entityProposingAcquiringInvestment: result.data.data.entityProposingAcquiringInvestment,
                        anyOtherInvestorInTheFund: result.data.data.anyOtherInvestorInTheFund,
                        entityHasMadeInvestmentsPriorToThedate: result.data.data.entityHasMadeInvestmentsPriorToThedate,
                        partnershipWillNotConstituteMoreThanFortyPercent: result.data.data.partnershipWillNotConstituteMoreThanFortyPercent,
                        beneficialInvestmentMadeByTheEntity: result.data.data.beneficialInvestmentMadeByTheEntity,
                    },()=>{
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
        if(this.state.entityProposingAcquiringInvestment !== null  && this.state.anyOtherInvestorInTheFund !== null && this.state.entityHasMadeInvestmentsPriorToThedate !== null && this.state.partnershipWillNotConstituteMoreThanFortyPercent !== null && this.state.beneficialInvestmentMadeByTheEntity !== null) {
            this.setState({
                equityProposingPageValid: true
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

    equityProposingChangeEvent(event, type, radioTypeName, blur) {
        let key = type;
        let dataObj = {};
        switch(type) {
            case 'radio':
                this.setState({
                    [blur]: radioTypeName,
                })
                let name = blur+'Valid'
                dataObj ={
                    [name] :true
                };
                this.updateStateParams(dataObj);
                break;
           
            default:
                break;
        }
    }

    // Update state params values and login button visibility

    updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableInvestorDetailsButton();
        });
    }

    // Enable / Disble functionality of Investor Details next Button
    enableDisableInvestorDetailsButton(){
        let status;
        status = (this.state.entityProposingAcquiringInvestment !==null && this.state.anyOtherInvestorInTheFund !==null && this.state.entityHasMadeInvestmentsPriorToThedate !==null && this.state.partnershipWillNotConstituteMoreThanFortyPercent !==null && this.state.beneficialInvestmentMadeByTheEntity !==null) ? true : false;
        this.setState({
            equityProposingPageValid : status,
        });
    }

    proceedToNext() {
        let postobj = {investorType:this.state.investorType,subscriptonId:this.state.getInvestorObj.id, step:7,entityProposingAcquiringInvestment:this.state.entityProposingAcquiringInvestment, anyOtherInvestorInTheFund:this.state.anyOtherInvestorInTheFund,entityHasMadeInvestmentsPriorToThedate:this.state.entityHasMadeInvestmentsPriorToThedate, partnershipWillNotConstituteMoreThanFortyPercent:this.state.partnershipWillNotConstituteMoreThanFortyPercent, beneficialInvestmentMadeByTheEntity:this.state.beneficialInvestmentMadeByTheEntity }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                this.props.history.push('/lp/erisa/'+this.state.getInvestorObj.id);
            }
        })
        .catch(error => {
            this.close();
            this.props.history.push('/lp/erisa/'+this.state.getInvestorObj.id);
        });
        
    }

    proceedToBack () {
        this.props.history.push('/lp/equityOwners/'+this.state.getInvestorObj.id);
    }

    render() {
        return (
            <div className="accreditedInvestor width100">
                <div className="formGridDivMargins min-height-400">
                    {/* llc investor type block starts */}
                    <div className="title">Entity Proposing (6/7)</div>
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'LLC'}>
                        <Col xs={12} md={12}>
                            <label className="title">Please check the appropriate true or false response to the following statements regarding the Entity proposing to subscribe for an investment in the fund:</label>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Entity was not organized for the purpose of acquiring the investment.</label>
                            <Radio name="entityProposingAcquiringInvestment" inline checked={this.state.entityProposingAcquiringInvestment === true} onChange={(e) => this.equityProposingChangeEvent(e, 'radio', true, 'entityProposingAcquiringInvestment')}>&nbsp; True
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="entityProposingAcquiringInvestment" inline checked={this.state.entityProposingAcquiringInvestment === false} onChange={(e) => this.equityProposingChangeEvent(e, 'radio', false, 'entityProposingAcquiringInvestment')}>&nbsp; False
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100"> To the best of the Entity’s knowledge, the Entity does not control, nor is it controlled by, or under common control with, any other investor in the fund.  </label>
                            <Radio name="anyOtherInvestorInTheFund" inline checked={this.state.anyOtherInvestorInTheFund === true} onChange={(e) => this.equityProposingChangeEvent(e, 'radio',true, 'anyOtherInvestorInTheFund')}>&nbsp; True
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="anyOtherInvestorInTheFund" inline checked={this.state.anyOtherInvestorInTheFund === false} onChange={(e) => this.equityProposingChangeEvent(e, 'radio', false, 'anyOtherInvestorInTheFund')}>&nbsp; False
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Entity has made investments prior to the date hereof or intends to make investments in the near future and each beneficial owner of interests in the Entity has and will share in the same proportion to each such investment.</label>
                            <Radio name="entityHasMadeInvestmentsPriorToThedate" inline checked={this.state.entityHasMadeInvestmentsPriorToThedate === true} onChange={(e) => this.equityProposingChangeEvent(e, 'radio',true, 'entityHasMadeInvestmentsPriorToThedate')}>&nbsp; True
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="entityHasMadeInvestmentsPriorToThedate" inline checked={this.state.entityHasMadeInvestmentsPriorToThedate === false} onChange={(e) => this.equityProposingChangeEvent(e, 'radio',false, 'entityHasMadeInvestmentsPriorToThedate')}>&nbsp; False
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Entity’s investment in the Partnership will not constitute more than forty percent (40%) of the Entity’s assets (including for this purpose any committed capital for an Entity that is an investment fund).</label>
                            <Radio name="partnershipWillNotConstituteMoreThanFortyPercent" inline checked={this.state.partnershipWillNotConstituteMoreThanFortyPercent === true} onChange={(e) => this.equityProposingChangeEvent(e, 'radio',true, 'partnershipWillNotConstituteMoreThanFortyPercent')}>&nbsp; True
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="partnershipWillNotConstituteMoreThanFortyPercent" inline checked={this.state.partnershipWillNotConstituteMoreThanFortyPercent === false} onChange={(e) => this.equityProposingChangeEvent(e, 'radio',false, 'partnershipWillNotConstituteMoreThanFortyPercent')}>&nbsp; False
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The governing documents of the Entity require that each beneficial owner of the Entity, including, but not limited to, shareholders, partners and beneficiaries, participate through such beneficial owner’s interest in the Entity in all of the Entity’s investments and that the profits and losses from each such investment are shared among such beneficial owners in the same proportions as all other investments of the Entity.  No such beneficial owner may vary such beneficial owner’s share of the profits and losses or the amount of such beneficial owner’s contribution for any investment made by the Entity. </label>
                            <Radio name="beneficialInvestmentMadeByTheEntity" inline checked={this.state.beneficialInvestmentMadeByTheEntity === true} onChange={(e) => this.equityProposingChangeEvent(e, 'radio',true, 'beneficialInvestmentMadeByTheEntity')}>&nbsp; True
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="beneficialInvestmentMadeByTheEntity" inline checked={this.state.beneficialInvestmentMadeByTheEntity === false} onChange={(e) => this.equityProposingChangeEvent(e, 'radio',false, 'beneficialInvestmentMadeByTheEntity')}>&nbsp; False
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                        
                    </Row>
                    {/* llc investor type block ends */}
                   
                </div>

                <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.equityProposingPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default entityProposingComponent;

