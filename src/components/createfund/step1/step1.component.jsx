
import React, { Component } from 'react';
import '../createfund.component.css';
import { Button, Radio, Row, Col, FormControl } from 'react-bootstrap';
import Loader from '../../../widgets/loader/loader.component';
import {Fsnethttp} from '../../../services/fsnethttp';
import {Constants} from '../../../constants/constants';
import { reactLocalStorage } from 'reactjs-localstorage';
import { PubSub } from 'pubsub-js';
import FundImage from '../../../images/fund-default@2x.png';

class Step1Component extends Component{

    constructor(props){
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.fundDetailsInputHandleEvent = this.fundDetailsInputHandleEvent.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadBtnClick = this.uploadBtnClick.bind(this);
        this.removeImageBtn = this.removeImageBtn.bind(this);
        this.addCurrencyValueToInput = this.addCurrencyValueToInput.bind(this);
        this.handleinputFocus = this.handleinputFocus.bind(this);
        this.state = {
            isAllDelegateSignNeeded: true,
            fundImageName: 'fund_Pic.jpg',
            currentFundImage : FundImage,
            fundPicFile: {},
            fundDetailsPageValid: false,
            legalEntity:'',
            legalEntityValid:false,
            legalEntityBorder: false,
            legalEntityMsz:'',
            fundManagerLegalEntityName:'',
            fundManagerLegalEntityNameBorder:false,
            fundManagerLegalEntityNameMsz:'',
            fundManagerLegalEntityNameValid: false,
            fundHardCap:'',
            fundTargetCommitment:'',
            capitalCommitmentByGP:'',
            percentageOfLPCommitment:'',
            percentageOfLPAndGPAggregateCommitment:'',
            aTextBoxDisabled: false,
            bTextBoxDisabled: false,
            cTextBoxDisabled: false,
            fundDetailspageError:'',
            createdFundData:{},
            fundId:'',
            firmId: null,
            fundHardCapCurrencyValue:'',
            fundTargetCommitmentCurrencyValue: '',
            capitalCommitmentByGPCurrencyValue: '',
            fundTargetCommitmentValid: true,
            fundTargetCommitmentBorder: false,
            fundTargetCommitmentMsz: '',
            fundHardCapValid: true,
            fundHardCapBorder: false,
            fundHardCapMsz: '',
        }
    }


    componentDidMount() {
        let firmId = reactLocalStorage.getObject('firmId');
        this.setState({
            firmId:firmId
        })
        var url = window.location.href;
        var parts = url.split("/");
        var urlSplitFundId = parts[parts.length - 1];
        let fundId = urlSplitFundId;
        PubSub.publish('pageNumber', {type:'sideNav', page: 'funddetails'});
        if(fundId !== undefined && fundId !== 'funddetails') {
            this.open();
            this.setState({
                fundId: fundId
            })
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            this.Fsnethttp.getFund(fundId, headers).then(result=>{
                this.close();
                if(result.data) {
                    this.updateFundDetails(result.data.data)
                } else {
                    this.setState({
                        createdFundData: {},
                    })
                }
            })
            .catch(error=>{
                this.close();
                this.setState({
                    createdFundData: {}
                })
            });
        }
    }

    updateFundDetails(data) {
        this.setState({ createdFundData: data, fundId: data.id, firmId:reactLocalStorage.getObject('firmId') }, () => this.updateInputValues());
        let dataObj = {};
        dataObj ={
            fundManagerLegalEntityNameValid : true,
            legalEntityValid: true,
        };
        this.updateStateParams(dataObj);
    }

    targetCommitmentValidation(value) {
        let targetValue = value;
        let hardCapValue = this.state.fundHardCap;
        if(parseInt(targetValue) > parseInt(hardCapValue)) {
            return true;
        }
        return false;
    }

    hardCardValidation(value) {
        let hardCapValue = value;
        let tragetValue = this.state.fundTargetCommitment;
        if(parseInt(hardCapValue) < parseInt(tragetValue)) {
            return true;
        }
        return false;

    }


    updateInputValues() {
        let obj = this.state.createdFundData;
        this.setState({ 
            legalEntity: obj.legalEntity || '',
            fundHardCap: obj.fundHardCap &&  parseInt(obj.fundHardCap) !== 0 ? obj.fundHardCap : '',
            fundHardCapCurrencyValue: obj.fundHardCap &&  parseInt(obj.fundHardCap) !== 0 ? this.convertToCurrency(obj.fundHardCap) : '',
            fundTargetCommitmentCurrencyValue: obj.fundTargetCommitment &&  parseInt(obj.fundTargetCommitment) !== 0 ? this.convertToCurrency(obj.fundTargetCommitment) : '',
            capitalCommitmentByGPCurrencyValue: obj.capitalCommitmentByFundManager && parseInt(obj.capitalCommitmentByFundManager) !==0 ? this.convertToCurrency(obj.capitalCommitmentByFundManager) : '',
            fundManagerLegalEntityName: obj.fundManagerLegalEntityName || '',
            capitalCommitmentByGP: obj.capitalCommitmentByFundManager && parseInt(obj.capitalCommitmentByFundManager) !==0 ? obj.capitalCommitmentByFundManager: '',
            percentageOfLPCommitment: obj.percentageOfLPCommitment && parseInt(obj.percentageOfLPCommitment) !==0 ? obj.percentageOfLPCommitment : '',
            fundTargetCommitment: obj.fundTargetCommitment || '',
            percentageOfLPAndGPAggregateCommitment: obj.percentageOfLPAndGPAggregateCommitment &&parseInt(obj.percentageOfLPAndGPAggregateCommitment) !==0 ? obj.percentageOfLPAndGPAggregateCommitment : '',
            currentFundImage: obj.fundImage? obj.fundImage.url: FundImage,
            fundImageName: obj.fundImage? obj.fundImage.originalname: 'fund_Pic.jpg',
            isAllDelegateSignNeeded: obj.isAllDelegateSignNeeded
         }, () => this.disableFundParticipationFields());
    }

    disableFundParticipationFields() {
        if(this.state.percentageOfLPCommitment === '' && this.state.percentageOfLPAndGPAggregateCommitment === '' && this.state.capitalCommitmentByGP === '') {
            this.enableAllTextBoxes()
        } else if(this.state.percentageOfLPCommitment !== '') {
            this.disableBandCTextFields();
        } else if(this.state.percentageOfLPAndGPAggregateCommitment !== '') {
            this.disableAandEnableBTextFields();
        } else if(this.state.capitalCommitmentByGP !== '') {
            this.disableAandCTextFields();
        }
    }

    // Update state params values and login button visibility

    updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableFundDetailsButton();
        });
    }

    // Enable / Disble functionality of Login Button

    enableDisableFundDetailsButton(){
        let status = (this.state.legalEntityValid && this.state.fundManagerLegalEntityNameValid && this.state.fundTargetCommitmentValid && this.state.fundHardCapValid ) ? true : false;
        this.setState({
            fundDetailsPageValid : status
        });
    }

    addCurrencyValueToInput(event, type) {
        let dataObj = {};
        switch(type) {
            case 'fundHardCap':
                if(event.target.value !== '') {
                    let error = this.hardCardValidation(event.target.value);
                    let value = this.convertToCurrency(event.target.value);
                    if(error) {
                        this.setState({
                            fundHardCapCurrencyValue: value,
                            fundHardCapValid: false,
                            fundHardCapBorder: true,
                            fundHardCapMsz: this.Constants.FUND_HARD_CAP_MSZ
                        })
                        dataObj ={
                            fundHardCapValid :false
                        };
                        this.updateStateParams(dataObj);
                    } else {
                        this.setState({
                            fundHardCapCurrencyValue: value,
                            fundHardCapValid: true,
                            fundHardCapBorder: '',
                            fundHardCapMsz: false,
                            fundTargetCommitmentValid: true,
                            fundTargetCommitmentMsz: '',
                            fundTargetCommitmentBorder: false
                        })
                        dataObj ={
                            fundHardCapValid :true,
                            fundTargetCommitmentValid: true
                        };
                        this.updateStateParams(dataObj);
                    }
                }
                break;
            case 'fundTargetCommitment':
                if(event.target.value !== '') {
                    let error = this.targetCommitmentValidation(event.target.value);
                    let value = this.convertToCurrency(event.target.value);
                    if(error) {
                        this.setState({
                            fundTargetCommitmentCurrencyValue: value,
                            fundTargetCommitmentValid: false,
                            fundTargetCommitmentBorder: true,
                            fundTargetCommitmentMsz: this.Constants.FUND_TARGET_COMMITMENT_MSZ
                        })
                        dataObj ={
                            fundTargetCommitmentValid :false
                        };
                        this.updateStateParams(dataObj);
                    } else {
                        this.setState({
                            fundTargetCommitmentCurrencyValue: value,
                            fundTargetCommitmentValid: true,
                            fundTargetCommitmentMsz: '',
                            fundTargetCommitmentBorder: false,
                            fundHardCapValid: true,
                            fundHardCapBorder: '',
                            fundHardCapMsz: false,
                        })
                        dataObj ={
                            fundTargetCommitmentValid :true,
                            fundHardCapValid: true
                        };
                        this.updateStateParams(dataObj);
                    }
                }
                break;
            case 'capitalCommitmentByGP':
                if(event.target.value !== '') {
                    let value = this.convertToCurrency(event.target.value);
                    this.setState({
                        capitalCommitmentByGPCurrencyValue: value
                    })
                }
                break;
            default:
                break;
        }

    }

    handleinputFocus(event, type) {
        switch(type) {
            case 'fundHardCap':
                if(event.target.value !== '') {
                    this.setState({
                        fundHardCapCurrencyValue: this.state.fundHardCap
                    })
                }
                break;
            case 'fundTargetCommitment':
                if(event.target.value !== '') {
                    this.setState({
                        fundTargetCommitmentCurrencyValue: this.state.fundTargetCommitment
                    })
                }
                break;
            case 'capitalCommitmentByGP':
                if(event.target.value !== '') {
                    this.setState({
                        capitalCommitmentByGPCurrencyValue: this.state.capitalCommitmentByGP
                    })
                }
                break;
            default:
                break;
        }

    }
 
    //Fund details input change event
    fundDetailsInputHandleEvent(event,type) {
        let dataObj={};
        const allowNumberRegex = /^[0-9\b]+$/;
        switch(type) {
            case 'legalEntity':
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined) {
                    this.setState({
                        legalEntityMsz: this.Constants.LEGAL_ENTITY_REQUIRED,
                        legalEntityValid: false,
                        legalEntityBorder: true,
                        legalEntity: ''
                    })
                    dataObj ={
                        legalEntityValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        legalEntityMsz: '',
                        legalEntityValid: true,
                        legalEntityBorder: false,
                        legalEntity: event.target.value
                    })
                    dataObj ={
                        legalEntityValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'fundHardCap':
                // if value is not blank, then test the regex
                if (event.target.value.trim() === '' || allowNumberRegex.test(event.target.value)) {
                    this.setState({
                        fundHardCap: event.target.value,
                        fundHardCapCurrencyValue: event.target.value
                    })
                }
                break;
            case 'fundTargetCommitment':
                if (event.target.value.trim() === '' || allowNumberRegex.test(event.target.value)) {
                    this.setState({
                        fundTargetCommitment: event.target.value,
                        fundTargetCommitmentCurrencyValue: event.target.value
                    })
                }
                break;
            case 'fundManagerLegalEntityName':
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined) {
                    this.setState({
                        fundManagerLegalEntityNameMsz: this.Constants.LEGAL_ENTITY_NAME_REQUIRED,
                        fundManagerLegalEntityNameValid: false,
                        fundManagerLegalEntityNameBorder: true,
                        fundManagerLegalEntityName: ''
                    })
                    dataObj ={
                        fundManagerLegalEntityNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        fundManagerLegalEntityNameMsz: '',
                        fundManagerLegalEntityNameValid: true,
                        fundManagerLegalEntityNameBorder: false,
                        fundManagerLegalEntityName: event.target.value
                    })
                    dataObj ={
                        fundManagerLegalEntityNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                this.setState({
                    fundManagerLegalEntityName: event.target.value
                })
                break;
            case 'percentageOfLPCommitment':
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined) {
                    this.setState({
                        percentageOfLPCommitment: ''
                    })
                    this.enableAllTextBoxes()
                } else {
                    if ((event.target.value.trim() === '' || allowNumberRegex.test(event.target.value)) && (parseInt(event.target.value) >0 && parseInt(event.target.value) <=100)) {
                        this.setState({
                            percentageOfLPCommitment: event.target.value
                        })
                        this.disableBandCTextFields();
                    }
                }
                break;
            case 'percentageOfLPAndGPAggregateCommitment':
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined) {
                    this.setState({
                        percentageOfLPAndGPAggregateCommitment: '',
                        percentageOfLPAndGPAggregateCommitmentCurrencyValue: ''
                    })
                    if(this.state.capitalCommitmentByGP === '') {
                        this.enableAllTextBoxes()
                    }
                } else {
                    if ((event.target.value.trim() === '' || allowNumberRegex.test(event.target.value)) && ((parseInt(event.target.value) >0 && parseInt(event.target.value) <=100))) {
                        this.setState({
                            percentageOfLPAndGPAggregateCommitment: event.target.value,
                            percentageOfLPAndGPAggregateCommitmentCurrencyValue: event.target.value
                        })
                        this.disableAandEnableBTextFields();
                    }
                }
                break;
            case 'capitalCommitmentByGP':
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined) {
                    this.setState({
                        capitalCommitmentByGP: '',
                        capitalCommitmentByGPCurrencyValue: ''
                    })
                    if(this.state.percentageOfLPAndGPAggregateCommitment === '') {
                        this.enableAllTextBoxes()
                    } 
                    
                } else {
                    if (event.target.value.trim() === '' || allowNumberRegex.test(event.target.value)) {
                        this.setState({
                            capitalCommitmentByGP: event.target.value,
                            capitalCommitmentByGPCurrencyValue: event.target.value
                        })
                        if(this.state.percentageOfLPAndGPAggregateCommitment === '') {
                            this.disableAandCTextFields();
                        } else {
                            this.disableAFiled();
                        }
                    }
                }
                break;
            case 'isAllDelegateSignNeededYes':
                this.setState({
                    isAllDelegateSignNeeded: true  
                })
                break;
            case 'isAllDelegateSignNeededNo':
                this.setState({
                    isAllDelegateSignNeeded: false  
                })
                break;
            default:
                // do nothing
        }
    }

    disableBandCTextFields() {
        this.setState({
            bTextBoxDisabled: true,
            cTextBoxDisabled: true,
            fundDetailspageError:''
        })
    }

    disableAandCTextFields() {
        this.setState({
            aTextBoxDisabled: true,
            cTextBoxDisabled: true,
            fundDetailspageError:''
        })
    }

    disableAFiled() {
        this.setState({
            aTextBoxDisabled: true,
            cTextBoxDisabled: false,
            bTextBoxDisabled: false,
            fundDetailspageError:''
        })
    }

    disableAandEnableBTextFields() {
        this.setState({
            aTextBoxDisabled: true,
            bTextBoxDisabled: false,
            fundDetailspageError:''
        })
    }

    enableAllTextBoxes() {
        this.setState({
            aTextBoxDisabled: false,
            bTextBoxDisabled: false,
            cTextBoxDisabled: false,
            fundDetailspageError:''
        })
    }

    //Clear the image when user click on remove button
    //Clear the image name from state
    //Clear the input file value
    removeImageBtn() {
        this.setState({
            fundImageName: 'fund_Pic.jpg',
            currentFundImage : FundImage,
            fundPicFile: {}
        });
        document.getElementById('uploadBtn').value = "";
    }

    uploadBtnClick() {
        document.getElementById('uploadBtn').click();
    }

    //USer profile pic upload.
    handleChange(event) {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            this.imageFile = event.target.files[0];
            //Change user profile image size limit here.
            if(this.imageFile.size <=1600000) {
                    this.setState({
                        fundPicFile : event.target.files[0],
                    });
                reader.readAsDataURL(this.imageFile);
                this.setState({
                    fundImageName: event.target.files[0].name
                });
                reader.onload = () => {
                    this.setState({
                        currentFundImage : reader.result,
                    });
                }
            } else {
               alert('Please upload image Maximum file size : 512X512')
            }
        }
    }


    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    proceedToNext() {
        let error = false;
        if(this.state.capitalCommitmentByGP === '' && this.state.percentageOfLPCommitment === '' && this.state.percentageOfLPAndGPAggregateCommitment === '') {
            error = true;
            this.setState({
                fundDetailspageError: 'Please enter one minimum fund participation amount.'
            })
        } 
        if(this.state.capitalCommitmentByGP === '' && this.state.percentageOfLPAndGPAggregateCommitment !== '') {
            error = true;
            this.setState({
                fundDetailspageError: 'Please enter Capital commitment by Fund manager.'
            })
        }
        if(!error) {
            this.open()
            var formData = new FormData();
            formData.append("vcfirmId", this.state.firmId);
            formData.append("legalEntity", this.state.legalEntity);
            formData.append("fundHardCap", this.state.fundHardCap? this.state.fundHardCap : 0);
            formData.append("fundTargetCommitment", this.state.fundTargetCommitment? this.state.fundTargetCommitment : 0);
            formData.append("fundManagerLegalEntityName", this.state.fundManagerLegalEntityName);
            formData.append("isAllDelegateSignNeeded", this.state.isAllDelegateSignNeeded);
            formData.append("fundImage", this.state.fundPicFile);
            if(this.state.fundId !== '') {
                formData.append("fundId", this.state.fundId)
            }
            formData.append("capitalCommitmentByFundManager", this.state.capitalCommitmentByGP?this.state.capitalCommitmentByGP:0);
            formData.append("percentageOfLPCommitment", this.state.percentageOfLPCommitment?this.state.percentageOfLPCommitment:0);
            formData.append("percentageOfLPAndGPAggregateCommitment", this.state.percentageOfLPAndGPAggregateCommitment ? this.state.percentageOfLPAndGPAggregateCommitment : 0);
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            this.Fsnethttp.fundStore(formData, headers).then(result=>{
                this.close();
                this.setState({
                    fundDetailsPageValid: true,
                    createdFundData: result.data.data
                })
                this.props.history.push('/createfund/gpDelegate/'+result.data.data.id);
            })
            .catch(error=>{
                this.close();
                if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        fundDetailspageError: error.response.data.errors[0].msg,
                    });
                } else {
                    this.setState({
                        fundDetailspageError: this.Constants.INTERNAL_SERVER_ERROR,
                    });
                }
            });
        }
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/funddetails');
           
    }

    convertToCurrency(value) {
        let amount = value;
        if(amount !== '') {
            // Create our number formatter.
            var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                // the default value for minimumFractionDigits depends on the currency
                // and is usually already 2
            });
            return formatter.format(amount); 
        }
    }

 


    render(){
        return(
            <div className="step1FormClass">
                <div className="form-grid formGridDivMargin">
                    <h2 className="title">Fund Details</h2>
                    <h4 className="subtext">Enter the details for the fund below. Fields marked with an * are mandatory.</h4>
                   
                    <div id="step1Form">
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">Legal Entity*</label>
                                <FormControl type="text" name="legalEntity" placeholder="Helios" className={"inputFormControl " + (this.state.legalEntityBorder ? 'inputError' : '')} value= {this.state.legalEntity}  onChange={(e) => this.fundDetailsInputHandleEvent(e,'legalEntity')} onBlur={(e) => this.fundDetailsInputHandleEvent(e,'legalEntity')} />
                                <span className="error">{this.state.legalEntityMsz}</span>
                            </Col>
                            <Col xs={6} md={6}>
                                <label className="form-label">Hard Cap</label>
                                <FormControl type="text" value= {this.state.fundHardCapCurrencyValue} placeholder="$15,000,000.00" className={"inputFormControl " + (this.state.fundHardCapBorder ? 'inputError' : '')} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'fundHardCap')} onBlur={(e)=>{this.addCurrencyValueToInput(e,'fundHardCap')}} onFocus={(e)=>{this.handleinputFocus(e,'fundHardCap')}} />
                                <span className="error">{this.state.fundHardCapMsz}</span>
                            </Col>
                        </Row>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">Fund Manager (GP) Legal Entity Name*</label>                                
                                <FormControl type="text" placeholder="Helios GP I,LLC" className={"inputFormControl " + (this.state.fundManagerLegalEntityNameBorder ? 'inputError' : '')} value= {this.state.fundManagerLegalEntityName}  onChange={(e) => this.fundDetailsInputHandleEvent(e,'fundManagerLegalEntityName')} onBlur={(e) => this.fundDetailsInputHandleEvent(e,'fundManagerLegalEntityName')} />
                                <span className="error">{this.state.fundManagerLegalEntityNameMsz}</span>
                            </Col>
                            <Col xs={6} md={6}>
                                <label className="form-label">Fund Target Commitment</label>
                                <FormControl type="text" placeholder="$15,000.00" className={"inputFormControl " + (this.state.fundTargetCommitmentBorder ? 'inputError' : '')} value= {this.state.fundTargetCommitmentCurrencyValue}  onChange={(e) => this.fundDetailsInputHandleEvent(e,'fundTargetCommitment')} onBlur={(e)=>{this.addCurrencyValueToInput(e,'fundTargetCommitment')}} onFocus={(e)=>{this.handleinputFocus(e,'fundTargetCommitment')}} />
                                <span className="error">{this.state.fundTargetCommitmentMsz}</span>
                            </Col>
                        </Row>
                        <h2 className="title marginTop40">Minimum Fund Participation Amount or Minimum Fund Participation Percentage</h2>
                        <h4 className="subtext">Fill in one. Minimum fund participation can be calculated based on percentage participation.</h4>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">% of LP Commitment </label>
                                <FormControl type="text" placeholder="100.00%" className="inputFormControl" value={this.state.percentageOfLPCommitment} disabled={this.state.aTextBoxDisabled} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'percentageOfLPCommitment')}  />
                            </Col>
                            <Col xs={6} md={6}>
                                <label className="form-label">Capital commitment by Fund manager  </label>
                                <FormControl type="text" placeholder="$15,000.00" className="inputFormControl" disabled={this.state.bTextBoxDisabled} value={this.state.capitalCommitmentByGPCurrencyValue}  onChange={(e)=> this.fundDetailsInputHandleEvent(e,'capitalCommitmentByGP')}  onBlur={(e)=>{this.addCurrencyValueToInput(e,'capitalCommitmentByGP')}} onFocus={(e)=>{this.handleinputFocus(e,'capitalCommitmentByGP')}} />
                            </Col>
                        </Row>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">% of LP + GP Aggregate Commitment</label>
                                <FormControl type="text" placeholder="100.00%" className="inputFormControl" disabled={this.state.cTextBoxDisabled} value={this.state.percentageOfLPAndGPAggregateCommitment} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'percentageOfLPAndGPAggregateCommitment')} />
                            </Col>
                            <Col xs={6} md={6}>
                                <label className="form-label">All delegates must sign fund:</label>
                                <Radio name="radioGroup" checked={this.state.isAllDelegateSignNeeded === true} inline id="yesCheckbox" onChange={(e) => this.fundDetailsInputHandleEvent(e,'isAllDelegateSignNeededYes')}>&nbsp; Yes 
                                <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="radioGroup" inline id="noCheckbox" checked={this.state.isAllDelegateSignNeeded === false} onChange={(e) => this.fundDetailsInputHandleEvent(e,'isAllDelegateSignNeededNo')}>&nbsp; No 
                                <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                        <label className="profile-text">Fund Image: (Image must not exceed 512x512)</label>
                        <Row className="profile-Row profileMargin marginBottom30">
                            <Col lg={6} md={6} sm={6} xs={12} >
                                <img src={this.state.currentFundImage} alt="profile-pic" className="profile-pic"/>
                                <span className="profilePicName">{this.state.fundImageName}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <input type="file" id="uploadBtn" className="hide" onChange={ (e) => this.handleChange(e) } />
                                <Button className="uploadFile" onClick={this.uploadBtnClick}>Upload File</Button> <br/>
                                <label className="removeBtn" onClick={this.removeImageBtn}>Remove</label>
                            </Col>
                        </Row>
                        <div className="marginTop20 error">{this.state.fundDetailspageError}</div>
                    </div>
                </div>
                
                <div className="footer-nav">        
                    <i className="fa fa-chevron-left disabled" aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.fundDetailsPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default Step1Component;



