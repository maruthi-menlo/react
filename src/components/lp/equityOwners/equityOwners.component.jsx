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

class equityOwnersComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.FsnetUtil = new FsnetUtil();
        this.equityOwnersChangeEvent = this.equityOwnersChangeEvent.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.state = {
            showModal: false,
            investorType: 'LLC',
            equityOwnersPageValid:false,
            getInvestorObj:{},
            numberOfDirectEquityOwners:'',
            numberOfDirectEquityOwnersValid:false,
            numberOfDirectEquityOwnersBorder:false,
            numberOfDirectEquityOwnersMsz:'',
            existingOrProspectiveInvestorsOfTheFund:'',
            existingOrProspectiveInvestorsOfTheFundValid:false,
            numberOfexistingOrProspectives:'',
            numberOfexistingOrProspectivesValid:false,
            numberOfexistingOrProspectivesMsz:'',
            numberOfexistingOrProspectivesBorder:false,
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
                    obj['currentPageCount'] = 5;
                    obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
                    PubSub.publish('investorData',obj );
                    this.setState({
                        getInvestorObj: result.data.data,
                        investorType: result.data.data.investorType,
                        numberOfDirectEquityOwners: result.data.data.numberOfDirectEquityOwners,
                        existingOrProspectiveInvestorsOfTheFund: result.data.data.existingOrProspectiveInvestorsOfTheFund,
                        numberOfexistingOrProspectives: result.data.data.numberOfexistingOrProspectives,
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
        if(this.state.numberOfDirectEquityOwners && (this.state.existingOrProspectiveInvestorsOfTheFund === false || (this.state.existingOrProspectiveInvestorsOfTheFund === true && this.state.numberOfexistingOrProspectives))) {
            this.setState({
                equityOwnersPageValid: true
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

    equityOwnersChangeEvent(event, type, radioTypeName, blur) {
        let key = type;
        let value = event.target.value.trim();
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
            case key:
                
                if(value === '' || value === undefined) {
                    this.setState({
                        [key+'Msz']: this.Constants[radioTypeName],
                        [key+'Valid']: false,
                        [key+'Border']: true,
                        [key]: ''
                    })
                    let name = key+'Valid'
                    dataObj ={
                        [name] :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    const re = /^[0-9\b]+$/;
                    if (!re.test(value.trim())) {
                        this.setState({
                            [key]: ''
                        })
                    } else {
                        if(parseInt(value) < 0 || parseInt(value) >1000) {
                            return true;
                        }
                        this.setState({
                            [key+'Msz']: '',
                            [key+'Valid']: true,
                            [key+'Border']: false,
                            [key]: value
                        })
                        let name = key+'Valid'
                        dataObj ={
                            [name] :true
                        };
                        this.updateStateParams(dataObj);
                    }
                }
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
        status = (this.state.numberOfDirectEquityOwners && this.state.existingOrProspectiveInvestorsOfTheFund) ? true : false;
        this.setState({
            equityOwnersPageValid : status,
        });
    }

    proceedToNext() {
        if(this.state.existingOrProspectiveInvestorsOfTheFund === true && (this.state.numberOfexistingOrProspectives === '' || this.state.numberOfexistingOrProspectives === null)) {
            let key = 'numberOfexistingOrProspectives'
            this.setState({
                [key+'Msz']: this.Constants.EXISTING_INVESTORS_REQUIRED,
                [key+'Valid']: false,
                [key+'Border']: true,
            })
            return true;
        }
        let postobj = {investorType:this.state.investorType,subscriptonId:this.state.getInvestorObj.id, step:6,numberOfDirectEquityOwners:this.state.numberOfDirectEquityOwners, existingOrProspectiveInvestorsOfTheFund:this.state.existingOrProspectiveInvestorsOfTheFund }
        if(this.state.existingOrProspectiveInvestorsOfTheFund === true) {
            postobj['numberOfexistingOrProspectives'] = this.state.numberOfexistingOrProspectives;
        }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                this.props.history.push('/lp/entityProposing/'+result.data.data.id);
            }
        })
        .catch(error => {
            this.close();
            this.props.history.push('/lp/entityProposing/'+this.state.getInvestorObj.id);
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
                    <div className="title">Equity Owners (5/7)</div>
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'LLC'}>
                        <Col xs={12} md={12}>
                            <label className="form-label width100">Please specify the number of direct equity owners of the Entity.</label>
                            <FormControl type="text" placeholder="Enter number" className={"inputFormControl inputWidth290 " + (this.state.numberOfDirectEquityOwnersBorder ? 'inputError' : '')} value= {this.state.numberOfDirectEquityOwners}  onChange={(e) => this.equityOwnersChangeEvent(e,'numberOfDirectEquityOwners', 'EQUITY_OWNERS_REQUIRED')} onBlur={(e) => this.equityOwnersChangeEvent(e,'numberOfDirectEquityOwners','EQUITY_OWNERS_REQUIRED')}/>
                            <span className="error">{this.state.numberOfDirectEquityOwnersMsz}</span>
                        </Col>
                        <Col xs={12} md={12} className="marginTop24">
                            <label className="form-label width100">Are there any existing or prospective investors of the fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?</label>
                            <Radio name="existingOrProspectiveInvestorsOfTheFund" inline checked={this.state.existingOrProspectiveInvestorsOfTheFund === true} onChange={(e) => this.equityOwnersChangeEvent(e, 'radio', true, 'existingOrProspectiveInvestorsOfTheFund')}>&nbsp; Yes
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="existingOrProspectiveInvestorsOfTheFund" inline checked={this.state.existingOrProspectiveInvestorsOfTheFund === false} onChange={(e) => this.equityOwnersChangeEvent(e, 'radio', false, 'existingOrProspectiveInvestorsOfTheFund')}>&nbsp; No
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                        <Col xs={12} md={12} className="marginTop24" hidden={this.state.existingOrProspectiveInvestorsOfTheFund !== true}>
                            <label className="form-label width100">How many such existing or prospective investors are there (please enter the number)?</label>
                            <FormControl type="text" placeholder="Enter number" className={"inputFormControl inputWidth290 " + (this.state.numberOfexistingOrProspectivesBorder ? 'inputError' : '')} value= {this.state.numberOfexistingOrProspectives}  onChange={(e) => this.equityOwnersChangeEvent(e,'numberOfexistingOrProspectives', 'EQUITY_OWNERS_REQUIRED')} onBlur={(e) => this.equityOwnersChangeEvent(e,'numberOfexistingOrProspectives','EQUITY_OWNERS_REQUIRED')}/>
                            <span className="error">{this.state.numberOfexistingOrProspectivesMsz}</span>
                        </Col>
                    </Row>
                    {/* llc investor type block ends */}
                    {/* revocableTrust investor type block starts */}
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'revocableTrust'}>
                        <Col xs={12} md={12}>
                            <label className="title">Please specify the number of direct equity owners of the Entity.</label>
                        </Col>
                        <Col xs={12} md={12} className="marginTop24">
                            <label className="form-label width100">Are there any existing or prospective investors of the fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?</label>
                            <Radio name="rule501" inline id="yesCheckbox">&nbsp; Yes
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="rule501" inline id="yesCheckbox">&nbsp; No
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                        <Col xs={12} md={12} className="marginTop24">
                            <label className="form-label width100">How many such existing or prospective investors are there (please enter the number)?</label>
                            <FormControl type="text" placeholder="Enter number" className="inputFormControl inputWidth290" />
                        <span className="error"></span>
                        </Col>
                    </Row>
                    {/* revocableTrust investor type block ends */}
                    {/* iRevocableTrust investor type block starts */}
                    <Row className="step1Form-row" hidden={this.state.investorType !== 'iRevocableTrust'}>
                        <Col xs={12} md={12}>
                            <label className="title">Please specify the number of direct equity owners of the Entity.</label>
                        </Col>
                        <Col xs={12} md={12} className="marginTop24">
                            <label className="form-label width100">Are there any existing or prospective investors of the fund as to which the Entity proposes to subscribe that control, are controlled by, or are under common control with the Entity?</label>
                            <Radio name="rule501" inline id="yesCheckbox">&nbsp; Yes
                                <span className="radio-checkmark"></span>
                            </Radio>
                            <Radio name="rule501" inline id="yesCheckbox">&nbsp; No
                                <span className="radio-checkmark"></span>
                            </Radio>
                        </Col>
                        <Col xs={12} md={12} className="marginTop24">
                            <label className="form-label width100">How many such existing or prospective investors are there (please enter the number)?</label>
                        <FormControl type="text" placeholder="Enter number" className="inputFormControl inputWidth290" />
                            <span className="error"></span>
                        </Col>
                    </Row>
                    {/* iRevocableTrust investor type block ends */}
                </div>

               <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.equityOwnersPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default equityOwnersComponent;

