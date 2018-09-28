import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Radio, Row, Col, FormControl, Checkbox as CBox } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { PubSub } from 'pubsub-js';
import { FsnetUtil } from '../../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';

class ERISAComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.FsnetUtil = new FsnetUtil();
        this.erisaChangeEvent = this.erisaChangeEvent.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.openErisaModal = this.openErisaModal.bind(this);
        this.openAdviserModal = this.openAdviserModal.bind(this);
        this.openExchangeModal = this.openExchangeModal.bind(this);
        this.openCodeModal = this.openCodeModal.bind(this);
        this.openPlanRegulationModal = this.openPlanRegulationModal.bind(this);
        this.state = {
            showModal: false,
            investorType: 'LLC',
            investorSubType: 0,
            erisaPageValid:false,
            getInvestorObj:{},
            employeeBenefitPlan:false,
            planAsDefinedInSection4975e1:false,
            benefitPlanInvestor:false,
            aggrement1: '',
            fiduciaryEntityIvestment:'',
            entityDecisionToInvestInFund:'',
            totalValueOfEquityInterests: '',
            totalValueOfEquityInterestsValid:false,
            totalValueOfEquityInterestsMsz: '',
            totalValueOfEquityInterestsBorder:false,
            erisaErrorMsz:'',
            showErisaNextStep: false
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
                    obj['currentPageCount'] = result.data.data.investorType == 'Trust' ? 5 : 7;
                    obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
                    PubSub.publish('investorData',obj );
                    this.setState({
                        getInvestorObj: result.data.data,
                        investorType: result.data.data.investorType?result.data.data.investorType:'LLC',
                        investorSubType: result.data.data.investorSubType ? result.data.data.investorSubType : (result.data.data.investorType == 'Trust' ? 9 : 0),
                        employeeBenefitPlan:result.data.data.employeeBenefitPlan?result.data.data.employeeBenefitPlan:false,
                        planAsDefinedInSection4975e1:result.data.data.planAsDefinedInSection4975e1?result.data.data.planAsDefinedInSection4975e1:false,
                        benefitPlanInvestor:result.data.data.benefitPlanInvestor?result.data.data.benefitPlanInvestor:false,
                        aggrement1: result.data.data.aggrement1,
                        fiduciaryEntityIvestment:result.data.data.fiduciaryEntityIvestment,
                        entityDecisionToInvestInFund:result.data.data.entityDecisionToInvestInFund,
                        totalValueOfEquityInterests: result.data.data.totalValueOfEquityInterests,
                        
                    },()=>{
                        this.enableDisableErisaDetailsButton()
                    })
                }
            })
            .catch(error => {
                this.close();
            });
        }
    }


    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    openErisaModal(e) {
        if(e) {
            e.preventDefault();
        }
        PubSub.publish('openModal', {investorType: this.state.investorType, modalType: 'actModalWindow', type: 'erisa'});
    }

    openCodeModal(e) {
        if(e) {
            e.preventDefault();
        }
        PubSub.publish('openModal', {investorType: this.state.investorType, modalType: 'actModalWindow', type: 'code'});
    }

    openAdviserModal(e) {
        if(e) {
            e.preventDefault();
        }
        PubSub.publish('openModal', {investorType: this.state.investorType, modalType: 'actModalWindow', type: 'adviser'});
    }

    openExchangeModal(e) {
        if(e) {
            e.preventDefault();
        }
        PubSub.publish('openModal', {investorType: this.state.investorType, modalType: 'actModalWindow', type: 'exchange'});
    }

    openPlanRegulationModal() {
        PubSub.publish('openModal', {investorType: this.state.investorType, modalType: 'actModalWindow', type: 'planAssetRegulation'});
    }

    erisaChangeEvent(event, type, radioTypeName, blur) {
        this.setState({
            erisaErrorMsz: ''
        });
        let key = type;
        let value = event.target.value.trim()
        let dataObj = {};
        switch(type) {
            case 'totalValueOfEquityInterests':
                const re = /^[0-9]{0,3}\.?[0-9]{0,2}$/;
                if (!re.test(value.trim())) {
                    this.setState({
                        [key]:this.state.totalValueOfEquityInterests ? this.state.totalValueOfEquityInterests : ''
                    })
                    return true;
                } else {
                    if((parseInt(value) < 0 || parseInt(value) > 100 || parseFloat(value) > 100)) {
                        return true;
                    }
                }
                if(value === '' || value === undefined) {
                    this.setState({
                        [key+'Msz']: this.Constants[radioTypeName],
                        [key+'Valid']: false,
                        [key+'Border']: true,
                        [key]: ''
                    },()=>{
                        if(this.state.showErisaNextStep) {
                            this.enableDisableNextStepButton();
                        } else {
                            this.enableDisableErisaDetailsButton();
                        }
                    })
                } else {
                    this.setState({
                        [key+'Msz']: '',
                        [key+'Valid']: true,
                        [key+'Border']: false,
                        [key]: value
                    },()=>{
                        if(this.state.showErisaNextStep) {
                            this.enableDisableNextStepButton();
                        } else {
                            this.enableDisableErisaDetailsButton();
                        }
                    })
                    // let name = key+'Valid'
                    // dataObj ={
                    //     [name] :true
                    // };
                    // this.updateStateParams(dataObj);
                }
                break;
            case 'fiduciaryEntityIvestment':
                this.setState({
                    fiduciaryEntityIvestment : event.target.checked
                });
                break;
            case 'entityDecisionToInvestInFund':
                this.setState({
                    entityDecisionToInvestInFund : event.target.checked
                });
                break;
            case 'radio':
                this.setState({
                    [blur]: radioTypeName,
                },()=>{
                    if(this.state.showErisaNextStep) {
                        this.enableDisableNextStepButton();
                    } else {
                        this.enableDisableErisaDetailsButton();
                    }
                })
                break;
           
            default:
                break;
        }
    }

    isEmpty(value){
        return (value == null || value.length === 0);
    }

    // Enable / Disble functionality of Erisa Details next Button
    enableDisableErisaDetailsButton(){
        if(!this.isEmpty(this.state.employeeBenefitPlan) || !this.isEmpty(this.state.planAsDefinedInSection4975e1) || !this.isEmpty(this.state.benefitPlanInvestor)) {
            this.setState({
                erisaPageValid : true,
            });
        } else {
            this.setState({
                erisaPageValid : false,
            });
        }
    }

    //Enable/Disable Erisa next steps next button
    enableDisableNextStepButton() {
        if(this.state.benefitPlanInvestor) {
            if(this.state.totalValueOfEquityInterests !== '' && this.state.totalValueOfEquityInterests !== null && this.state.totalValueOfEquityInterests !== undefined) {
                this.setState({
                    erisaPageValid : true,
                });
            } else {
                this.setState({
                    erisaPageValid : false,
                });
            }
        } else if(this.state.employeeBenefitPlan || this.state.planAsDefinedInSection4975e1) {
            if(this.state.aggrement1 !== '' && this.state.aggrement1 !== null && this.state.aggrement1 !== undefined) {
                this.setState({
                    erisaPageValid : true,
                });
            } else {
                this.setState({
                    erisaPageValid : false,
                });
            }
        } 
    }

    proceedToNext() {
        if(this.state.benefitPlanInvestor || this.state.employeeBenefitPlan || this.state.planAsDefinedInSection4975e1) {
            if(!this.state.showErisaNextStep) {
                console.log(' go to next page');
                this.setState({
                    showErisaNextStep: true
                },()=>{
                    if(this.state.showErisaNextStep) {
                        this.enableDisableNextStepButton();
                    } else {
                        this.enableDisableErisaDetailsButton();
                    }
                })
            } else {
                console.log('submit form');
                this.submitErisaDetails();
            }
        } else {
            console.log('submit form');
            this.submitErisaDetails();
        }
    }

    submitErisaDetails() {
        let postobj = {investorType:this.state.investorType,investorSubType: this.state.investorSubType, subscriptonId:this.state.getInvestorObj.id, step:this.state.investorType == 'Trust' ? 6 : 8,employeeBenefitPlan:this.state.employeeBenefitPlan, planAsDefinedInSection4975e1:this.state.planAsDefinedInSection4975e1,benefitPlanInvestor:this.state.benefitPlanInvestor}
        console.log('hskdgtajsdf a:::', postobj);
        if(this.state.benefitPlanInvestor) {
            // postobj['totalValueOfEquityInterests'] = this.state.totalValueOfEquityInterests ? (this.state.totalValueOfEquityInterests == '.' ? '' :this.state.totalValueOfEquityInterests) : '';
            postobj['totalValueOfEquityInterests'] = this.state.totalValueOfEquityInterests;
            postobj['aggrement1'] = null;
            postobj['fiduciaryEntityIvestment'] = null;
            postobj['entityDecisionToInvestInFund'] = null;
        }
        if(this.state.employeeBenefitPlan || this.state.planAsDefinedInSection4975e1) {
            postobj['aggrement1'] = this.state.aggrement1;
            postobj['fiduciaryEntityIvestment'] = this.state.fiduciaryEntityIvestment;
            postobj['entityDecisionToInvestInFund'] = this.state.entityDecisionToInvestInFund;
            postobj['totalValueOfEquityInterests'] = null;
        }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                let obj = result.data.data;
                obj['currentInvestorInfoPageNumber'] = 1;
                obj['currentPageCount'] = result.data.data.investorType == 'Trust' ? 5 : 7;
                obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
                PubSub.publish('investorData',obj);
                this.props.history.push('/lp/capitalCommitment/'+this.state.getInvestorObj.id);
            }
        })
        .catch(error => {
            this.close();
            if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                this.setState({
                    erisaErrorMsz: error.response.data.errors[0].msg,
                });
            } else {
                this.setState({
                    erisaErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                });
            }
        });
    }

    // proceedToNextX() {
    //     if(!this.state.showErisaNextStep) {
    //         this.setState({
    //             showErisaNextStep: true
    //         },()=>{
    //             if(this.state.showErisaNextStep) {
    //                 this.enableDisableNextStepButton();
    //             } else {
    //                 this.enableDisableErisaDetailsButton();
    //             }
    //         })
    //     } else{
    //         let postobj = {investorType:this.state.investorType,investorSubType: this.state.investorSubType, subscriptonId:this.state.getInvestorObj.id, step:this.state.investorType == 'Trust' ? 6 : 8,employeeBenefitPlan:this.state.employeeBenefitPlan, planAsDefinedInSection4975e1:this.state.planAsDefinedInSection4975e1,benefitPlanInvestor:this.state.benefitPlanInvestor}
    //         if(this.state.benefitPlanInvestor) {
    //             // postobj['totalValueOfEquityInterests'] = this.state.totalValueOfEquityInterests ? (this.state.totalValueOfEquityInterests == '.' ? '' :this.state.totalValueOfEquityInterests) : '';
    //             postobj['totalValueOfEquityInterests'] = this.state.totalValueOfEquityInterests;
    //             postobj['aggrement1'] = null;
    //             postobj['fiduciaryEntityIvestment'] = null;
    //             postobj['entityDecisionToInvestInFund'] = null;
    //         }
    //         if(this.state.employeeBenefitPlan || this.state.planAsDefinedInSection4975e1) {
    //             postobj['aggrement1'] = this.state.aggrement1;
    //             postobj['fiduciaryEntityIvestment'] = this.state.fiduciaryEntityIvestment;
    //             postobj['entityDecisionToInvestInFund'] = this.state.entityDecisionToInvestInFund;
    //             postobj['totalValueOfEquityInterests'] = null;
    //         }
    //         this.open();
    //         let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
    //         this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
    //             this.close();
    //             if (result.data) {
    //                 let obj = result.data.data;
    //                 obj['currentInvestorInfoPageNumber'] = 1;
    //                 obj['currentPageCount'] = result.data.data.investorType == 'Trust' ? 5 : 7;
    //                 obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
    //                 PubSub.publish('investorData',obj);
    //                 this.props.history.push('/lp/capitalCommitment/'+this.state.getInvestorObj.id);
    //             }
    //         })
    //         .catch(error => {
    //             this.close();
    //             if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
    //                 this.setState({
    //                     erisaErrorMsz: error.response.data.errors[0].msg,
    //                 });
    //             } else {
    //                 this.setState({
    //                     erisaErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
    //                 });
    //             }
    //         });
    //     }
        
    // }

    proceedToBack () {
        if(this.state.showErisaNextStep) {
            this.setState({
                showErisaNextStep: false
            })
            this.enableDisableErisaDetailsButton();
        } else {
            let url = this.state.investorType == 'LLC' ? '/lp/entityProposing/' : '/lp/companiesAct/'
            this.props.history.push(url+this.state.getInvestorObj.id);
        }
    }

    render() {
        return (
            <div className="accreditedInvestor width100">
                <div className="formGridDivMargins min-height-400">
                    {/* llc investor type block starts */}
                    <div className="title">ERISA</div>
                    <Row className="step1Form-row" hidden={this.state.showErisaNextStep !== false}>
                        <Col xs={12} md={12}>
                            {
                                this.state.investorType == 'Trust'
                                ?
                                    <label className="form-label width100">Please check the appropriate true or false response to the following statements regarding the Entity proposing to subscribe for an investment in the fund:</label>
                                :
                                    <label className="form-label width100">Please check the appropriate true or false responses to the following statements regarding the Look-Through Issues to subscribe for an investment in the Fund:</label>
                            }
                        </Col>
                        <Col xs={12} md={12}>
                            {
                                this.state.investorType == 'Trust'
                                ?
                                    <label className="form-label width100">The Trust is an employee benefit plan, as defined in Section 3(3) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, that is subject to the provisions of Part 4 of Title I of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>.</label>
                                :
                                    <label className="form-label width100">The Entity is an employee benefit plan, as defined in Section 3(3) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, that is subject to the provisions of Part 4 of Title I of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>.</label>
                            }
                            <div className="checkBoxText">
                                <Radio name="employeeBenefitPlan" disabled={this.state.planAsDefinedInSection4975e1 === true || this.state.benefitPlanInvestor === true} inline checked={this.state.employeeBenefitPlan === true} onChange={(e) => this.erisaChangeEvent(e, 'radio', true, 'employeeBenefitPlan')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="employeeBenefitPlan" disabled={this.state.planAsDefinedInSection4975e1 === true || this.state.benefitPlanInvestor === true} inline checked={this.state.employeeBenefitPlan === false} onChange={(e) => this.erisaChangeEvent(e, 'radio', false, 'employeeBenefitPlan')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                        <Col xs={12} md={12}>
                            {
                                this.state.investorType == 'Trust'
                                ?
                                    <label className="form-label width100">The Trust is a plan, as defined in Section 4975(e)(1) of the <span className="helpWord" onClick={this.openCodeModal}>Code</span>, that is subject to Section 4975 of the <span className="helpWord" onClick={this.openCodeModal}>Code</span> (including, by way of example only, an individual retirement account).</label>
                                :
                                    <label className="form-label width100">The Entity is a plan, as defined in Section 4975(e)(1) of the <span className="helpWord" onClick={this.openCodeModal}>Code</span>, that is subject to Section 4975 of the <span className="helpWord" onClick={this.openCodeModal}>Code</span> (including, by way of example only, an individual retirement account).</label>
                            }
                            <div className="checkBoxText">
                                <Radio name="planAsDefinedInSection4975e1" disabled={this.state.employeeBenefitPlan === true || this.state.benefitPlanInvestor === true} inline checked={this.state.planAsDefinedInSection4975e1 === true} onChange={(e) => this.erisaChangeEvent(e, 'radio', true, 'planAsDefinedInSection4975e1')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="planAsDefinedInSection4975e1" disabled={this.state.employeeBenefitPlan === true || this.state.benefitPlanInvestor === true} inline checked={this.state.planAsDefinedInSection4975e1 === false} onChange={(e) => this.erisaChangeEvent(e, 'radio', false, 'planAsDefinedInSection4975e1')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                        <Col xs={12} md={12}>
                            {
                                this.state.investorType == 'Trust'
                                ?
                                    <label className="form-label width100">The Trust is an entity that is deemed to be a benefit plan investor under the <span className="helpWord" onClick={this.openPlanRegulationModal}>Plan Asset Regulation</span>, as amended and as modified by Section 3(42) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, because its underlying assets include plan assets by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity:  (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more employee benefit plans or plans described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, and (B) that does not qualify as a venture capital operating company or real estate operating company under the <span className="helpWord" onClick={this.openPlanRegulationModal}>Plan Asset Regulation</span>).</label>
                                :
                                    <label className="form-label width100">The Investor is an Entity that is deemed to be a benefit plan investor under the <span className="helpWord" onClick={this.openPlanRegulationModal}>Plan Asset Regulation</span>, as amended and as modified by Section 3(42) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, because its underlying assets include plan assets by reason of a plan’s investment in the Entity (including, by way of example only, an Entity: (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more employee benefit plans or plans described in the questions above or by one or more other entities described in such questions, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, and (B) that does not qualify as a venture capital operating company or real estate operating company under the <span className="helpWord" onClick={this.openPlanRegulationModal}>Plan Asset Regulation</span>).</label>
                            }
                            <div className="checkBoxText">
                                <Radio name="benefitPlanInvestor" inline disabled={this.state.planAsDefinedInSection4975e1 === true || this.state.employeeBenefitPlan === true} checked={this.state.benefitPlanInvestor === true} onChange={(e) => this.erisaChangeEvent(e, 'radio', true, 'benefitPlanInvestor')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="benefitPlanInvestor" inline disabled={this.state.planAsDefinedInSection4975e1 === true || this.state.employeeBenefitPlan === true} checked={this.state.benefitPlanInvestor === false} onChange={(e) => this.erisaChangeEvent(e, 'radio', false, 'benefitPlanInvestor')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                    </Row>
                    <Row hidden={this.state.showErisaNextStep !== true}>
                        <div hidden={this.state.benefitPlanInvestor !== true}>
                            <Col xs={12} md={12}>
                                <label className="form-label width100 erisa-heading">Please input the total value of equity interests in the Trust is held by benefit plan investors</label>
                            </Col>
                            <Col xs={12} md={12}>
                                <FormControl type="text" placeholder="Enter number" className={"inputFormControl inputWidth290 marginForInput " + (this.state.totalValueOfEquityInterestsBorder ? 'inputError' : '')} value= {this.state.totalValueOfEquityInterests}  onChange={(e) => this.erisaChangeEvent(e,'totalValueOfEquityInterests', 'TOTAL_VALUE_REQUIRED')} onBlur={(e) => this.erisaChangeEvent(e,'totalValueOfEquityInterests','TOTAL_VALUE_REQUIRED')}/>
                                <span className="error marginleft25">{this.state.totalValueOfEquityInterestsMsz}</span>
                            </Col>
                        </div>
                            
                        <Col xs={12} md={12} className="marginTop10" hidden={this.state.benefitPlanInvestor !== false}>
                            <label className="form-label width100 erisa-heading">Please confirm the following representations to continue:</label>
                            <CBox inline className="cBoxFullAlign" checked={this.state.fiduciaryEntityIvestment === true} onChange={(e) => this.erisaChangeEvent(e, 'fiduciaryEntityIvestment', 1)}>
                                <span className="checkbox-checkmark checkmark"></span>
                                {
                                    this.state.investorType == 'Trust'
                                ?
                                    // <div className="marginLeft6">The person executing this agreement is a fiduciary of the Trust making the investment.</div>
                                    <div className="marginLeft6">The person executing this agreement is a fiduciary of the Investor.</div>
                                :
                                    // <div className="marginLeft6">The person executing this agreement is a fiduciary of the Entity making the investment.</div>
                                    <div className="marginLeft6">The person executing this agreement is a fiduciary of the Investor.</div>
                                }
                                {/* <div className="marginLeft6">The person executing this agreement is a fiduciary of the Entity making the investment.</div> */}
                            </CBox>
                            <CBox inline className="cBoxFullAlign" checked={this.state.entityDecisionToInvestInFund === true} onChange={(e) => this.erisaChangeEvent(e, 'entityDecisionToInvestInFund', 2)}>
                                <span className="checkbox-checkmark checkmark"></span>
                                {
                                    this.state.investorType == 'Trust'
                                ?
                                    // <div className="marginLeft6">The Trust’s decision to invest in the fund was made by the person executing this agreement and such person (i) is a fiduciary under <span className="helpWord" onClick={(e) => {this.openErisaModal(e)}}>ERISA</span> or Section 4975 of the <span className="helpWord" onClick={(e) => {this.openCodeModal(e)}}>Code</span>, or both, with respect to the Trust’s decision to invest in the fund; (ii) is responsible for exercising independent judgment in evaluating the investment in the fund; (iii) is independent of the fund, its general partner or similar manager and any and all affiliates of the preceding; and (iv) is capable of evaluating investment risks independently, both in general and with regard to particular transactions and investment strategies, including the decision on behalf of the Trust to invest in the fund.</div>
                                    <div className="marginLeft6">The Investor’s decision to invest in the fund was made by the person executing this agreement and such person (i) is a fiduciary under <span className="helpWord" onClick={(e) => {this.openErisaModal(e)}}>ERISA</span> or Section 4975 of the <span className="helpWord" onClick={(e) => {this.openCodeModal(e)}}>Code</span>, or both, with respect to the Investor’s decision to invest in the fund; (ii) is responsible for exercising independent judgment in evaluating the investment in the fund; (iii) is independent of the fund, its general partner or similar manager and any and all affiliates of the preceding; and (iv) is capable of evaluating investment risks independently, both in general and with regard to particular transactions and investment strategies, including the decision on behalf of the Investor to invest in the fund.</div>
                                :
                                    // <div className="marginLeft6">The Entity’s decision to invest in the fund was made by the person executing this agreement and such person (i) is a fiduciary under <span className="helpWord" onClick={(e) => {this.openErisaModal(e)}}>ERISA</span> or Section 4975 of the <span className="helpWord" onClick={(e) => {this.openCodeModal(e)}}>Code</span>, or both, with respect to the Entity’s decision to invest in the fund; (ii) is responsible for exercising independent judgment in evaluating the investment in the fund; (iii) is independent of the fund, its general partner or similar manager and any and all affiliates of the preceding; and (iv) is capable of evaluating investment risks independently, both in general and with regard to particular transactions and investment strategies, including the decision on behalf of the Entity to invest in the fund.</div>
                                    <div className="marginLeft6">The Investor’s decision to invest in the fund was made by the person executing this agreement and such person (i) is a fiduciary under <span className="helpWord" onClick={(e) => {this.openErisaModal(e)}}>ERISA</span> or Section 4975 of the <span className="helpWord" onClick={(e) => {this.openCodeModal(e)}}>Code</span>, or both, with respect to the Investor’s decision to invest in the fund; (ii) is responsible for exercising independent judgment in evaluating the investment in the fund; (iii) is independent of the fund, its general partner or similar manager and any and all affiliates of the preceding; and (iv) is capable of evaluating investment risks independently, both in general and with regard to particular transactions and investment strategies, including the decision on behalf of the Investor to invest in the fund.</div>
                                }
                                {/* <div className="marginLeft6">The Entity’s decision to invest in the fund was made by the person executing this agreement and such person (i) is a fiduciary under <span className="helpWord" onClick={this.openErisaModal}>ERISA</span> or Section 4975 of the <span className="helpWord" onClick={this.openCodeModal}>Code</span>, or both, with respect to the Entity’s decision to invest in the fund; (ii) is responsible for exercising independent judgment in evaluating the investment in the fund; (iii) is independent of the fund, its general partner or similar manager and any and all affiliates of the preceding; and (iv) is capable of evaluating investment risks independently, both in general and with regard to particular transactions and investment strategies, including the decision on behalf of the Entity to invest in the fund.</div> */}
                            </CBox>
                        </Col>

                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row" hidden={this.state.benefitPlanInvestor !== false}>
                                <label className="form-label width100 erisa-heading">The person executing this agreement is one of the following:</label>
                                <div className="checkBoxText" hidden={this.state.employeeBenefitPlan !== true}>
                                    <Radio name="aggrement1" className="width100 left-gap" inline checked={this.state.aggrement1 === 1} onChange={(e) => this.erisaChangeEvent(e, 'radio',  1, 'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">An independent fiduciary that holds, or has under management or control, total assets of at least $50,000,000;</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement1" className="width100 left-gap" inline checked={this.state.aggrement1 === 2} onChange={(e) => this.erisaChangeEvent(e, 'radio', 2, 'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">A bank as defined in Section 202 of the <span className="helpWord" onClick={(e) => {this.openAdviserModal(e)}}>Advisers Act</span> or similar institution that is regulated and supervised and subject to periodic examination by a U.S. State or Federal agency;</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement1" className="width100 left-gap" inline checked={this.state.aggrement1 === 3} onChange={(e) => this.erisaChangeEvent(e,'radio', 3, 'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">An insurance carrier which is qualified under the laws of more than one U.S. State to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement1" className="width100 left-gap" inline checked={this.state.aggrement1 === 4} onChange={(e) => this.erisaChangeEvent(e,'radio', 4,'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">An investment adviser that is registered under the <span className="helpWord" onClick={(e) => {this.openAdviserModal(e)}}>Advisers Act</span> or, if not registered under the <span className="helpWord" onClick={(e) => {this.openAdviserModal(e)}}>Advisers Act</span> by reason of paragraph (1) of Section 203A of such Act, that is registered as an investment adviser under the laws of the U.S. State in which it maintains its principal office and place of business; or</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement1"  className="width100 left-gap" inline checked={this.state.aggrement1 === 5} onChange={(e) => this.erisaChangeEvent(e,'radio', 5,'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">A broker-dealer that is registered under the <span className="helpWord" onClick={(e) => {this.openExchangeModal(e)}}>Exchange Act</span>.</div>
                                    </Radio>
                                </div>
                            </Col>
                        {/* </Row> */}
                    </Row>
                    {/* llc investor type block ends */}
                    {/* revocableTrust investor type block starts */}
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'revocableTrust'}>
                    <div className="col-md-12 col-xs-12 title"></div>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">Please check the appropriate true or false responses to the following statements regarding the Look-Through Issues to subscribe for an investment in the fund:</label>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Trust is an employee benefit plan, as defined in Section 3(3) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, that is subject to the provisions of Part 4 of Title I of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>.    </label>
                            <div className="checkBoxText">
                                <Radio name="benefitPlan" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="benefitPlan" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>    
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100"> The Trust is a plan, as defined in Section 4975(e)(1) of the <span className="helpWord" onClick={this.openCodeModal}>Code</span>, that is subject to Section 4975 of the <span className="helpWord" onClick={this.openCodeModal}>Code</span> (including, by way of example only, an individual retirement account).</label>
                            <div className="checkBoxText">
                                <Radio name="section4975" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="section4975" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Trust is an entity that is deemed to be a benefit plan investor under the <span className="helpWord" onClick={this.openPlanRegulationModal}>Plan Asset Regulation</span>, as amended and as modified by Section 3(42) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, because its underlying assets include plan assets by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity:  (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more employee benefit plans or plans described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, and (B) that does not qualify as a venture capital operating company or real estate operating company under the <span className="helpWord" onClick={this.openPlanRegulationModal}>Plan Asset Regulation</span>).</label>
                            <div className="checkBoxText">
                                <Radio name="benefitPlanInvestor" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="benefitPlanInvestor" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="subtext">Please input the total value of equity interests in the Trust is held by benefit plan investors</label>
                        </Col>
                        <Col xs={12} md={12}>
                            <FormControl type="text" placeholder="Enter number" className="inputFormControl inputWidth290 marginForInput" />
                            <span className="error"></span>
                        </Col>

                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row">
                                <label className="title width100">The person executing this agreement is one of the following:</label>
                                <CBox inline className="cBoxFullAlign"> 
                                    <span className="checkbox-checkmark checkmark"></span>
                                    <div className="checkBoxText">An independent fiduciary that holds, or has under management or control, total assets of at least $50,000,000;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A bank as defined in Section 202 of the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> or similar institution that is regulated and supervised and subject to periodic examination by a U.S. State or Federal agency;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An insurance carrier which is qualified under the laws of more than one U.S. State to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An investment adviser that is registered under the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> or, if not registered under the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> by reason of paragraph (1) of Section 203A of such Act, that is registered as an investment adviser under the laws of the U.S. State in which it maintains its principal office and place of business; or</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A broker-dealer that is registered under the <span className="helpWord" onClick={this.openExchangeModal}>Exchange Act</span>.</div>
                                </CBox>
                            </Col>
                        {/* </Row> */}
                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row">
                                <label className="title width100">The person executing this agreement is one of the following:</label>
                                <CBox inline className="cBoxFullAlign">
                                    <span className="checkbox-checkmark checkmark"></span>
                                    <div className="checkBoxText">A bank as defined in Section 202 of the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> or similar institution that is regulated and supervised and subject to periodic examination by a U.S. State or Federal agency;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign"> 
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An insurance carrier which is qualified under the laws of more than one U.S. State to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign"> 
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An investment adviser that is registered under the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> or, if not registered under the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> by reason of paragraph (1) of Section 203A of such Act, that is registered as an investment adviser under the laws of the U.S. State in which it maintains its principal office and place of business; or</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A broker-dealer that is registered under the <span className="helpWord" onClick={this.openExchangeModal}>Exchange Act</span>.</div>
                                </CBox>
                            </Col>
                        {/* </Row> */}
                        
                    </Row>
                    {/* revocableTrust investor type block ends */}
                    {/* iRevocableTrust investor type block starts */}
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'iRevocableTrust'}>
                    <div className="col-md-12 col-xs-12 title"></div>
                        <Col xs={12} md={12}>
                            <label className="subtext margin18">Please check the appropriate true or false responses to the following statements regarding the Look-Through Issues to subscribe for an investment in the fund:</label>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Trust is an employee benefit plan, as defined in Section 3(3) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, that is subject to the provisions of Part 4 of Title I of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>.     </label>
                            <div className="checkBoxText">
                                <Radio name="benefitPlan" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="benefitPlan" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">  The Trust is a plan, as defined in Section 4975(e)(1) of the <span className="helpWord" onClick={this.openCodeModal}>Code</span>, that is subject to Section 4975 of the <span className="helpWord" onClick={this.openCodeModal}>Code</span> (including, by way of example only, an individual retirement account).</label>
                            <div className="checkBoxText">
                                <Radio name="section4975" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="section4975" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Trust is an entity that is deemed to be a benefit plan investor under the <span className="helpWord" onClick={this.openPlanRegulationModal}>Plan Asset Regulation</span>, as amended and as modified by Section 3(42) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, because its underlying assets include plan assets by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity:  (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more employee benefit plans or plans described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of <span className="helpWord" onClick={this.openErisaModal}>ERISA</span>, and (B) that does not qualify as a venture capital operating company or real estate operating company under the <span className="helpWord" onClick={this.openPlanRegulationModal}>Plan Asset Regulation</span>).</label>
                            <div className="checkBoxText">
                                <Radio name="benefitPlanInvestor" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="benefitPlanInvestor" inline id="yesCheckbox">
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">Please input the total value of equity interests in the Trust is held by benefit plan investors</label>
                        </Col>
                        <Col xs={12} md={12}>
                            <FormControl type="text" placeholder="Enter number" className="inputFormControl inputWidth290 marginForInput" />
                            <span className="error"></span>
                        </Col>


                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row">
                                <label className="title width100">The person executing this agreement is one of the following:</label>
                                <CBox inline className="cBoxFullAlign"> 
                                    <span className="checkbox-checkmark checkmark"></span>
                                    <div className="checkBoxText">An independent fiduciary that holds, or has under management or control, total assets of at least $50,000,000;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A bank as defined in Section 202 of the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> or similar institution that is regulated and supervised and subject to periodic examination by a U.S. State or Federal agency;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An insurance carrier which is qualified under the laws of more than one U.S. State to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An investment adviser that is registered under the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> or, if not registered under the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> by reason of paragraph (1) of Section 203A of such Act, that is registered as an investment adviser under the laws of the U.S. State in which it maintains its principal office and place of business; or</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A broker-dealer that is registered under the <span className="helpWord" onClick={this.openExchangeModal}>Exchange Act</span>.</div>
                                </CBox>
                            </Col>
                        {/* </Row> */}
                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row">
                                <label className="title width100">The person executing this agreement is one of the following:</label>
                                <CBox inline className="cBoxFullAlign">
                                    <span className="checkbox-checkmark checkmark"></span>
                                    <div className="checkBoxText">A bank as defined in Section 202 of the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> or similar institution that is regulated and supervised and subject to periodic examination by a U.S. State or Federal agency;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign"> 
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An insurance carrier which is qualified under the laws of more than one U.S. State to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign"> 
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An investment adviser that is registered under the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> or, if not registered under the <span className="helpWord" onClick={this.openAdviserModal}>Advisers Act</span> by reason of paragraph (1) of Section 203A of such Act, that is registered as an investment adviser under the laws of the U.S. State in which it maintains its principal office and place of business; or</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A broker-dealer that is registered under the <span className="helpWord" onClick={this.openExchangeModal}>Exchange Act</span>.</div>
                                </CBox>
                            </Col>
                        {/* </Row> */}
                        
                    </Row>
                    {/* iRevocableTrust investor type block ends */}
                   
                </div>
                <div className="margin30 error">{this.state.erisaErrorMsz}</div>
                <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.erisaPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default ERISAComponent;

