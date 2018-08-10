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
        this.state = {
            showModal: false,
            investorType: '',
            erisaPageValid:false,
            getInvestorObj:{},
            employeeBenefitPlan:'',
            planAsDefinedInSection4975e1:'',
            benefitPlanInvestor:'',
            aggrement1: '',
            aggrement2: '',
            fiduciaryEntityIvestment:'',
            entityDecisionToInvestInFund:'',
            totalValueOfEquityInterests: '',
            totalValueOfEquityInterestsValid:false,
            totalValueOfEquityInterestsMsz: '',
            totalValueOfEquityInterestsBorder:false,
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
                    obj['currentPageCount'] = 7;
                    obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
                    PubSub.publish('investorData',obj );
                    this.setState({
                        getInvestorObj: result.data.data,
                        investorType: result.data.data.investorType,
                        employeeBenefitPlan:result.data.data.employeeBenefitPlan,
                        planAsDefinedInSection4975e1:result.data.data.planAsDefinedInSection4975e1,
                        benefitPlanInvestor:result.data.data.benefitPlanInvestor,
                        aggrement1: result.data.data.aggrement1,
                        aggrement2: result.data.data.aggrement2,
                        fiduciaryEntityIvestment:result.data.data.fiduciaryEntityIvestment,
                        entityDecisionToInvestInFund:result.data.data.entityDecisionToInvestInFund,
                        totalValueOfEquityInterests: result.data.data.totalValueOfEquityInterests,
                        
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
       
    }

    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    erisaChangeEvent(event, type, radioTypeName, blur) {
        let key = type;
        let value = event.target.value.trim()
        let dataObj = {};
        switch(type) {
            case 'totalValueOfEquityInterests':
                if(value === '' || value === undefined) {
                    this.setState({
                        [key+'Msz']: this.Constants[radioTypeName],
                        [key+'Valid']: false,
                        [key+'Border']: true,
                        [key]: ''
                    })
                    // let name = key+'Valid'
                    // dataObj ={
                    //     [name] :false
                    // };
                    // this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        [key+'Msz']: '',
                        [key+'Valid']: true,
                        [key+'Border']: false,
                        [key]: value
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
        status = (this.state.employeeBenefitPlan !==null) ? true : false;
        this.setState({
            erisaPageValid : status,
        });
    }

    proceedToNext() {
        let postobj = {investorType:this.state.investorType,subscriptonId:this.state.getInvestorObj.id, step:8,employeeBenefitPlan:this.state.employeeBenefitPlan, planAsDefinedInSection4975e1:this.state.planAsDefinedInSection4975e1,benefitPlanInvestor:this.state.benefitPlanInvestor, fiduciaryEntityIvestment:this.state.fiduciaryEntityIvestment,entityDecisionToInvestInFund:this.state.entityDecisionToInvestInFund}
        if(this.state.benefitPlanInvestor) {
            postobj['totalValueOfEquityInterests'] = this.state.totalValueOfEquityInterests;
        }
        if(this.state.employeeBenefitPlan) {
            postobj['aggrement1'] = this.state.aggrement1;
        }
        if(this.state.planAsDefinedInSection4975e1) {
            postobj['aggrement2'] = this.state.aggrement2;
        }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                this.props.history.push('/lp/review/'+this.state.getInvestorObj.id);
            }
        })
        .catch(error => {
            this.close();
            this.props.history.push('/lp/review/'+this.state.getInvestorObj.id);
        });
        
    }

    proceedToBack () {
        this.props.history.push('/lp/entityProposing/'+this.state.getInvestorObj.id);
    }

    render() {
        return (
            <div className="accreditedInvestor width100">
                <div className="formGridDivMargins min-height-400">
                    {/* llc investor type block starts */}
                    <div className="title">Erisa (7/7)</div>
                    <Row className="" hidden={this.state.investorType !== 'LLC'}>
                        <Col xs={12} md={12}>
                            <label className="subtext margin18">Please check the appropriate true or false response to the following statements regarding the Entity proposing to subscribe for an investment in the fund:</label>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Entity is an “employee benefit plan,” as defined in Section 3(3) of ERISA, that is subject to the provisions of Part 4 of Title I of ERISA.    </label>
                            <div className="checkBoxText">
                                <Radio name="employeeBenefitPlan" inline checked={this.state.employeeBenefitPlan === true} onChange={(e) => this.erisaChangeEvent(e, 'radio', true, 'employeeBenefitPlan')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="employeeBenefitPlan" inline checked={this.state.employeeBenefitPlan === false} onChange={(e) => this.erisaChangeEvent(e, 'radio', false, 'employeeBenefitPlan')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100"> The Entity is a “plan,” as defined in Section 4975(e)(1) of the Code, that is subject to Section 4975 of the Code (including, by way of example only, an individual retirement account).</label>
                            <div className="checkBoxText">
                                <Radio name="planAsDefinedInSection4975e1" inline checked={this.state.planAsDefinedInSection4975e1 === true} onChange={(e) => this.erisaChangeEvent(e, 'radio', true, 'planAsDefinedInSection4975e1')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="planAsDefinedInSection4975e1" inline checked={this.state.planAsDefinedInSection4975e1 === false} onChange={(e) => this.erisaChangeEvent(e, 'radio', false, 'planAsDefinedInSection4975e1')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Investor is an entity that is deemed to be a “benefit plan investor” under the Plan Asset Regulation, as amended and as modified by Section 3(42) of ERISA, because its underlying assets include “plan assets” by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity:  (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more “employee benefit plans” or “plans” described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of ERISA, and (B) that does not qualify as a “venture capital operating company” or “real estate operating company” under the Plan Asset Regulation).  </label>
                            <div className="checkBoxText">
                                <Radio name="benefitPlanInvestor" inline checked={this.state.benefitPlanInvestor === true} onChange={(e) => this.erisaChangeEvent(e, 'radio', true, 'benefitPlanInvestor')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">True</div>
                                </Radio>
                                <Radio name="benefitPlanInvestor" inline checked={this.state.benefitPlanInvestor === false} onChange={(e) => this.erisaChangeEvent(e, 'radio', false, 'benefitPlanInvestor')}>
                                    <span className="radio-checkmark"></span>
                                    <div className="radioText">False</div>
                                </Radio>
                            </div>
                        </Col>

                        <div hidden={this.state.benefitPlanInvestor !== true}>
                            <Col xs={12} md={12}>
                                <label className="subtext">Please input the total value of equity interests in the Trust is held by “benefit plan investors”</label>
                            </Col>
                            <Col xs={12} md={12}>
                                <FormControl type="text" placeholder="Enter number" className={"inputFormControl inputWidth290 marginForInput " + (this.state.totalValueOfEquityInterestsBorder ? 'inputError' : '')} value= {this.state.totalValueOfEquityInterests}  onChange={(e) => this.erisaChangeEvent(e,'totalValueOfEquityInterests', 'TOTAL_VALUE_REQUIRED')} onBlur={(e) => this.erisaChangeEvent(e,'totalValueOfEquityInterests','TOTAL_VALUE_REQUIRED')}/>
                                <span className="error marginleft25">{this.state.totalValueOfEquityInterestsMsz}</span>
                            </Col>
                        </div>

                        <Col xs={12} md={12} className="marginTop10">
                            <label className="subtext width100">Please confirm the following representations to continue:</label>
                            <CBox inline className="cBoxFullAlign" checked={this.state.fiduciaryEntityIvestment === true} onChange={(e) => this.erisaChangeEvent(e, 'fiduciaryEntityIvestment', 1)}>
                                <span className="checkbox-checkmark checkmark"></span>
                                <div className="marginLeft6">The person executing this agreement is a fiduciary of the Entity making the investment.</div>
                            </CBox>
                            <CBox inline className="cBoxFullAlign" checked={this.state.entityDecisionToInvestInFund === true} onChange={(e) => this.erisaChangeEvent(e, 'entityDecisionToInvestInFund', 2)}>
                                <span className="checkbox-checkmark checkmark"></span>
                                <div className="marginLeft6">The Entity’s decision to invest in the fund was made by the person executing this agreement and such person (i) is a fiduciary under ERISA or Section 4975 of the Code, or both, with respect to the Entity’s decision to invest in the fund; (ii) is responsible for exercising independent judgment in evaluating the investment in the fund; (iii) is independent of the fund, its general partner or similar manager and any and all affiliates of the preceding; and (iv) is capable of evaluating investment risks independently, both in general and with regard to particular transactions and investment strategies, including the decision on behalf of the Entity to invest in the fund.</div>
                            </CBox>
                        </Col>

                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row" hidden={this.state.employeeBenefitPlan !== true}>
                                <label className="title width100">The person executing this agreement is one of the following:</label>
                                <div className="checkBoxText">
                                    <Radio name="aggrement1" className="width100" inline checked={this.state.aggrement1 === 1} onChange={(e) => this.erisaChangeEvent(e, 'radio',  1, 'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">An independent fiduciary that holds, or has under management or control, total assets of at least $50,000,000;</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement1" className="width100" inline checked={this.state.aggrement1 === 2} onChange={(e) => this.erisaChangeEvent(e, 'radio', 2, 'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">A bank as defined in section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency;</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement1" className="width100" inline checked={this.state.aggrement1 === 3} onChange={(e) => this.erisaChangeEvent(e,'radio', 3, 'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement1" className="width100" inline checked={this.state.aggrement1 === 4} onChange={(e) => this.erisaChangeEvent(e,'radio', 4,'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business; or</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement1"  className="width100" inline checked={this.state.aggrement1 === 5} onChange={(e) => this.erisaChangeEvent(e,'radio', 5,'aggrement1')}>
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">A broker-dealer that is registered under the Exchange Act.</div>
                                    </Radio>
                                </div>
                            </Col>
                        {/* </Row> */}
                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row" hidden={this.state.planAsDefinedInSection4975e1 !== true}>
                                <label className="title width100">The person executing this agreement is one of the following:</label>      
                                <div className="checkBoxText">
                                    <Radio name="aggrement2" className="width100" inline checked={this.state.aggrement2 === 1} onChange={(e) => this.erisaChangeEvent(e,'radio', 1,'aggrement2')} >
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">A bank as defined in section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency;</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement2" className="width100" inline checked={this.state.aggrement2 === 2} onChange={(e) => this.erisaChangeEvent(e, 'radio',2,'aggrement2')} >
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement2" className="width100" inline checked={this.state.aggrement2 === 3} onChange={(e) => this.erisaChangeEvent(e,'radio',3, 'aggrement2')} >
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business; or</div>
                                    </Radio>
                                </div>
                                <div className="checkBoxText">
                                    <Radio name="aggrement2" className="width100" inline checked={this.state.aggrement2 === 4} onChange={(e) => this.erisaChangeEvent(e, 'radio',4,'aggrement2')} >
                                        <span className="radio-checkmark"></span>
                                        <div className="radioText">A broker-dealer that is registered under the Exchange Act.</div>
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
                            <label className="subtext margin18">Please check the appropriate true or false response to the following statements regarding the Entity proposing to subscribe for an investment in the fund:</label>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Trust is an “employee benefit plan,” as defined in Section 3(3) of ERISA, that is subject to the provisions of Part 4 of Title I of ERISA.    </label>
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
                            <label className="form-label width100"> The Trust is a “plan,” as defined in Section 4975(e)(1) of the Code, that is subject to Section 4975 of the Code (including, by way of example only, an individual retirement account).</label>
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
                            <label className="form-label width100">The Trust is an entity that is deemed to be a “benefit plan investor” under the Plan Asset Regulation, as amended and as modified by Section 3(42) of ERISA, because its underlying assets include “plan assets” by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity:  (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more “employee benefit plans” or “plans” described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of ERISA, and (B) that does not qualify as a “venture capital operating company” or “real estate operating company” under the Plan Asset Regulation).</label>
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
                            <label className="subtext">Please input the total value of equity interests in the Trust is held by “benefit plan investors”</label>
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
                                   <div className="checkBoxText">A bank as defined in section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business; or</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A broker-dealer that is registered under the Exchange Act.</div>
                                </CBox>
                            </Col>
                        {/* </Row> */}
                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row">
                                <label className="title width100">The person executing this agreement is one of the following:</label>
                                <CBox inline className="cBoxFullAlign">
                                    <span className="checkbox-checkmark checkmark"></span>
                                    <div className="checkBoxText">A bank as defined in section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign"> 
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign"> 
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business; or</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A broker-dealer that is registered under the Exchange Act.</div>
                                </CBox>
                            </Col>
                        {/* </Row> */}
                        
                    </Row>
                    {/* revocableTrust investor type block ends */}
                    {/* iRevocableTrust investor type block starts */}
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'iRevocableTrust'}>
                    <div className="col-md-12 col-xs-12 title"></div>
                        <Col xs={12} md={12}>
                            <label className="subtext margin18">Please check the appropriate true or false response to the following statements regarding the Entity proposing to subscribe for an investment in the fund:</label>
                        </Col>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">The Trust is an “employee benefit plan,” as defined in Section 3(3) of ERISA, that is subject to the provisions of Part 4 of Title I of ERISA.     </label>
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
                            <label className="form-label width100">  The Trust is a “plan,” as defined in Section 4975(e)(1) of the Code, that is subject to Section 4975 of the Code (including, by way of example only, an individual retirement account).</label>
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
                            <label className="form-label width100">The Trust is an entity that is deemed to be a “benefit plan investor” under the Plan Asset Regulation, as amended and as modified by Section 3(42) of ERISA, because its underlying assets include “plan assets” by reason of a plan’s investment in the entity (including, by way of example only, a partnership or other entity:  (A) in which twenty-five percent (25%) or more of each class of equity interests is owned by one or more “employee benefit plans” or “plans” described above or by one or more other entities described in this paragraph, applying for this purpose the proportional ownership rule set forth in the final sentence of Section 3(42) of ERISA, and (B) that does not qualify as a “venture capital operating company” or “real estate operating company” under the Plan Asset Regulation).</label>
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
                            <label className="form-label width100">Please input the total value of equity interests in the Trust is held by “benefit plan investors”</label>
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
                                   <div className="checkBoxText">A bank as defined in section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business; or</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A broker-dealer that is registered under the Exchange Act.</div>
                                </CBox>
                            </Col>
                        {/* </Row> */}
                        {/* <Row className="step1Form-row"> */}
                            <Col xs={12} md={12} className="step1Form-row">
                                <label className="title width100">The person executing this agreement is one of the following:</label>
                                <CBox inline className="cBoxFullAlign">
                                    <span className="checkbox-checkmark checkmark"></span>
                                    <div className="checkBoxText">A bank as defined in section 202 of the Advisers Act or similar institution that is regulated and supervised and subject to periodic examination by a State or Federal agency;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign"> 
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An insurance carrier which is qualified under the laws of more than one state to perform the services of managing, acquiring or disposing of assets of a plan;</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign"> 
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">An investment adviser that is registered under the Advisers Act or, if not registered under the Advisers Act by reason of paragraph (1) of section 203A of such Act, that is registered as an investment adviser under the laws of the State in which it maintains its principal office and place of business; or</div>
                                </CBox>
                                <CBox inline className="cBoxFullAlign">
                                   <span className="checkbox-checkmark checkmark"></span>
                                   <div className="checkBoxText">A broker-dealer that is registered under the Exchange Act.</div>
                                </CBox>
                            </Col>
                        {/* </Row> */}
                        
                    </Row>
                    {/* iRevocableTrust investor type block ends */}
                   
                </div>

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

