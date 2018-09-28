
import React, { Component } from 'react';
import '../createfund.component.css';
import { Button, Radio, Row, Col, FormControl,Tooltip,OverlayTrigger } from 'react-bootstrap';
import Loader from '../../../widgets/loader/loader.component';
import {Fsnethttp} from '../../../services/fsnethttp';
import {Constants} from '../../../constants/constants';
import { reactLocalStorage } from 'reactjs-localstorage';
import { PubSub } from 'pubsub-js';
import { FsnetUtil } from '../../../util/util';
import FundImage from '../../../images/fund-default@2x.png';

class Step1Component extends Component{

    constructor(props){
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.fundDetailsInputHandleEvent = this.fundDetailsInputHandleEvent.bind(this);
        this.addPercentageToInput = this.addPercentageToInput.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadBtnClick = this.uploadBtnClick.bind(this);
        this.removeImageBtn = this.removeImageBtn.bind(this);
        this.addCurrencyValueToInput = this.addCurrencyValueToInput.bind(this);
        this.handleinputFocus = this.handleinputFocus.bind(this);
        this.state = {
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
            imageRemoved: true,
            percentageOfLPAndGPAggregateCommitmentPer:'',
            percentageOfLPCommitmentPer:'',
            generalPartnersCapitalCommitmentindicated:'',
            generalPartnersCapitalCommitmentindicatedValid:false,
            generalPartnersCapitalCommitmentindicatedMsz:''
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
        console.log('data::::', data);
        dataObj ={
            fundManagerLegalEntityNameValid : true,
            legalEntityValid: true,
            fundTypeValid: true,
            generalPartnersCapitalCommitmentindicatedValid:true
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
            fundHardCapCurrencyValue: obj.fundHardCap &&  parseInt(obj.fundHardCap) !== 0 ? this.FsnetUtil.convertToCurrency(obj.fundHardCap) : '',
            fundTargetCommitmentCurrencyValue: obj.fundTargetCommitment &&  parseInt(obj.fundTargetCommitment) !== 0 ? this.FsnetUtil.convertToCurrency(obj.fundTargetCommitment) : '',
            capitalCommitmentByGPCurrencyValue: obj.capitalCommitmentByFundManager && parseInt(obj.capitalCommitmentByFundManager) !==0 ? this.FsnetUtil.convertToCurrency(obj.capitalCommitmentByFundManager) : '',
            fundType: obj.fundType || 0,
            fundManagerLegalEntityName: obj.fundManagerLegalEntityName || '',
            capitalCommitmentByGP: obj.capitalCommitmentByFundManager && parseInt(obj.capitalCommitmentByFundManager) !==0 ? obj.capitalCommitmentByFundManager: '',
            percentageOfLPCommitment: obj.percentageOfLPCommitment && parseInt(obj.percentageOfLPCommitment) !==0 ? obj.percentageOfLPCommitment : '',
            percentageOfLPCommitmentPer: obj.percentageOfLPCommitment && parseInt(obj.percentageOfLPCommitment) !==0 ? obj.percentageOfLPCommitment+'%' : '',
            fundTargetCommitment: obj.fundTargetCommitment || '',
            percentageOfLPAndGPAggregateCommitment: obj.percentageOfLPAndGPAggregateCommitment &&parseInt(obj.percentageOfLPAndGPAggregateCommitment) !==0 ? obj.percentageOfLPAndGPAggregateCommitment : '',
            percentageOfLPAndGPAggregateCommitmentPer: obj.percentageOfLPAndGPAggregateCommitment &&parseInt(obj.percentageOfLPAndGPAggregateCommitment) !==0 ? obj.percentageOfLPAndGPAggregateCommitment+'%' : '',
            currentFundImage: obj.fundImage? obj.fundImage.url: FundImage,
            generalPartnersCapitalCommitmentindicated: obj.generalPartnersCapitalCommitmentindicated? obj.generalPartnersCapitalCommitmentindicated: '',
            fundImageName: obj.fundImage? obj.fundImage.originalname: 'fund_Pic.jpg',
         }, () => this.disableFundParticipationFields());
    }

    disableFundParticipationFields() {
        if(this.state.percentageOfLPCommitment === '' && this.state.percentageOfLPAndGPAggregateCommitment === '' && this.state.capitalCommitmentByGP === '') {
            this.enableAllTextBoxes()
        } else if(this.state.percentageOfLPCommitment !== '') {
            this.enableATextField();
        } else if(this.state.percentageOfLPAndGPAggregateCommitment !== '') {
            this.enableCTextField();
        } else if(this.state.capitalCommitmentByGP !== '') {
            this.enableBTextField();
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
        let status = (this.state.legalEntityValid && this.state.fundManagerLegalEntityNameValid && this.state.fundTargetCommitmentValid && this.state.fundHardCapValid && this.state.generalPartnersCapitalCommitmentindicatedValid && this.state.fundTypeValid ) ? true : false;
        this.setState({
            fundDetailsPageValid : status
        });
    }

    numbersOnly(event) {
        if (((event.which != 46 || (event.which == 46 && event.target.value == '')) ||
            event.target.value.indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
    }

    addCurrencyValueToInput(event, type) {
        let dataObj = {};
        switch(type) {
            case 'fundHardCap':
                if(event.target.value !== '') {
                    let error = this.hardCardValidation(event.target.value);
                    let value = this.FsnetUtil.convertToCurrency(event.target.value);
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
                    let value = this.FsnetUtil.convertToCurrency(event.target.value);
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
                    let value = this.FsnetUtil.convertToCurrency(event.target.value);
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
            case 'fundType':
                if(event.target.value !== '') {
                    this.setState({
                        fundType: this.state.fundType
                    })
                }
                break;
            case type:
                if(event.target.value !== '') {
                    this.setState({
                        [type+'Per']: this.state[type]
                    })
                }
                break;
            default:
                break;
        }

    }

    //Add Percentage to % input fields.
    addPercentageToInput(event, type) {
        switch(type) {
            case type:
                if(event.target.value !== '') {
                    this.setState({
                        [type+'Per']:parseFloat(event.target.value)+'%',
                        [type]:parseFloat(event.target.value) //This is for float conversion if we have more than two dots
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
        const allowNumberRegex = /^[0-9]*[.]{0,1}[0-9]/;
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
                        fundHardCap: parseFloat(event.target.value),
                        fundHardCapCurrencyValue: event.target.value
                    })
                }
                break;
            case 'fundType':
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined || event.target.value.trim() == 0) {
                    this.setState({
                        fundTypeMsz: this.Constants.FUND_TYPE_REQUIRED,
                        fundTypeValid: false,
                        fundTypeBorder: true,
                        fundType: ''
                    })
                    dataObj ={
                        fundTypeValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        fundTypeMsz: '',
                        fundTypeValid: true,
                        fundTypeBorder: false,
                        fundType: event.target.value
                    })
                    dataObj ={
                        fundTypeValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                this.setState({
                    fundType: event.target.value
                })
                break;
            case 'fundTargetCommitment':
                if (event.target.value.trim() === '' || allowNumberRegex.test(event.target.value)) {
                    this.setState({
                        fundTargetCommitment: parseFloat(event.target.value),
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
                        percentageOfLPCommitment: '',
                        percentageOfLPCommitmentPer: ''
                    })
                    this.enableAllTextBoxes()
                } else {
                    if ((event.target.value.trim() === '' || allowNumberRegex.test(event.target.value)) && (parseInt(event.target.value) >0 && parseInt(event.target.value) <=100)) {
                        this.setState({
                            percentageOfLPCommitment: event.target.value,
                            percentageOfLPCommitmentPer: event.target.value
                        })
                        this.enableATextField();
                    }
                }
                break;
            case 'percentageOfLPAndGPAggregateCommitment':
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined) {
                    this.setState({
                        percentageOfLPAndGPAggregateCommitment: '',
                        percentageOfLPAndGPAggregateCommitmentPer: ''
                    })
                    this.enableAllTextBoxes()
                } else {
                    if ((event.target.value.trim() === '' || allowNumberRegex.test(event.target.value)) && ((parseInt(event.target.value) >0 && parseInt(event.target.value) <=100))) {
                        this.setState({
                            percentageOfLPAndGPAggregateCommitment: event.target.value,
                            percentageOfLPAndGPAggregateCommitmentPer: event.target.value
                        })
                        this.enableCTextField();
                    }
                }
                break;
            case 'capitalCommitmentByGP':
                if(event.target.value.trim() === '' || event.target.value.trim() === undefined) {
                    this.setState({
                        capitalCommitmentByGP: '',
                        capitalCommitmentByGPCurrencyValue: '',
                    })
                    this.enableAllTextBoxes()
                    
                } else {
                    if (event.target.value.trim() === '' || allowNumberRegex.test(event.target.value)) {
                        this.setState({
                            capitalCommitmentByGP: parseFloat(event.target.value),
                            capitalCommitmentByGPCurrencyValue: event.target.value
                        })
                        this.enableBTextField();
                        
                    }
                }
                break;
            case 'generalPartnersCapitalCommitmentindicated1':
                this.setState({
                    generalPartnersCapitalCommitmentindicated: 1  
                })
                dataObj ={
                    generalPartnersCapitalCommitmentindicatedValid :true
                };
                this.updateStateParams(dataObj);
                break;
            case 'generalPartnersCapitalCommitmentindicated2':
                this.setState({
                    generalPartnersCapitalCommitmentindicated: 2  
                })
                dataObj ={
                    generalPartnersCapitalCommitmentindicatedValid :true
                };
                this.updateStateParams(dataObj);
                break;
            default:
                // do nothing
        }
    }

    enableATextField() {
        this.setState({
            aTextBoxDisabled: false,
            bTextBoxDisabled: true,
            cTextBoxDisabled: true,
            fundDetailspageError:''
        })
    }

    enableBTextField() {
        this.setState({
            aTextBoxDisabled: true,
            bTextBoxDisabled: false,
            cTextBoxDisabled: true,
            fundDetailspageError:''
        })
    }

    enableCTextField() {
        this.setState({
            aTextBoxDisabled: true,
            bTextBoxDisabled: true,
            cTextBoxDisabled: false,
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
            fundPicFile: {},
            imageRemoved: true
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
            let imageName = event.target.files[0].name
            var sFileExtension = imageName.split('.')[imageName.split('.').length - 1].toLowerCase();
            const imageFormats = ['png','jpg','jpeg','gif','tif','svg'];
            if(imageFormats.indexOf(sFileExtension) === -1) {
                document.getElementById('uploadBtn').value = "";
                alert('Please upload valid image.')
                return true;
            }
            //Change user profile image size limit here.
            if(this.imageFile.size <=1600000) {
                    this.setState({
                        fundPicFile : event.target.files[0],
                    });
                reader.readAsDataURL(this.imageFile);
                this.setState({
                    fundImageName: event.target.files[0].name,
                    imageRemoved: false
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
                fundDetailspageError: 'Please enter one General Partner’s Capital Commitment.'
            })
        } 
        if(!error) {
            this.open()
            var formData = new FormData();
            formData.append("vcfirmId", this.state.firmId);
            formData.append("legalEntity", this.state.legalEntity);
            formData.append("fundHardCap", this.state.fundHardCap? this.state.fundHardCap : 0);
            formData.append("fundType", this.state.fundType ? this.state.fundType : 0);
            formData.append("fundTargetCommitment", this.state.fundTargetCommitment? this.state.fundTargetCommitment : 0);
            formData.append("fundManagerLegalEntityName", this.state.fundManagerLegalEntityName);
            formData.append("generalPartnersCapitalCommitmentindicated", this.state.generalPartnersCapitalCommitmentindicated);
            if(Object.keys(this.state.fundPicFile).length === 0 && this.state.fundPicFile.constructor === Object && this.state.imageRemoved){
                formData.append("requestContainImage", false);
            } else {
                formData.append("requestContainImage", true);
            }
            formData.append("fundImage", this.state.fundPicFile);
            if(this.state.fundId !== '') {
                formData.append("fundId", this.state.fundId)
            }
            formData.append("percentageOfLPCommitment", this.state.percentageOfLPCommitment?this.state.percentageOfLPCommitment:0);
            formData.append("capitalCommitmentByFundManager", this.state.capitalCommitmentByGP?this.state.capitalCommitmentByGP:0);
            formData.append("percentageOfLPAndGPAggregateCommitment", this.state.percentageOfLPAndGPAggregateCommitment ? this.state.percentageOfLPAndGPAggregateCommitment : 0);
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            // console.log('this.fundType:::', this.state.fundType);
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

    render(){
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
                                <FormControl type="text" value= {this.state.fundHardCapCurrencyValue} placeholder="$15,000,000.00" className={"inputFormControl " + (this.state.fundHardCapBorder ? 'inputError' : '')} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'fundHardCap')} onKeyPress={(e) => {this.numbersOnly(e)}} onBlur={(e)=>{this.addCurrencyValueToInput(e,'fundHardCap')}} onFocus={(e)=>{this.handleinputFocus(e,'fundHardCap')}} />
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
                                <FormControl type="text" placeholder="$15,000.00" className={"inputFormControl " + (this.state.fundTargetCommitmentBorder ? 'inputError' : '')} value= {this.state.fundTargetCommitmentCurrencyValue}  onChange={(e) => this.fundDetailsInputHandleEvent(e,'fundTargetCommitment')} onKeyPress={(e) => {this.numbersOnly(e)}} onBlur={(e)=>{this.addCurrencyValueToInput(e,'fundTargetCommitment')}} onFocus={(e)=>{this.handleinputFocus(e,'fundTargetCommitment')}} />
                                <span className="error">{this.state.fundTargetCommitmentMsz}</span>
                            </Col>
                        </Row>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">Fund Type*</label>
                                <FormControl defaultValue={0} className={"selectFormControl " + (this.state.fundTypeBorder ? 'inputError' : '')}  componentClass="select" placeholder="Select Fund Type" value= {this.state.fundType} onChange={(e) => this.fundDetailsInputHandleEvent(e,'fundType')} onBlur={(e) => this.fundDetailsInputHandleEvent(e,'fundType')} onFocus={(e)=>{this.handleinputFocus(e,'fundType')}}>
                                        <option value="0">Select Fund Type</option>
                                        <option value="1">U.S. Fund</option>
                                        <option value="2">Non-U.S. Fund</option>
                                </FormControl>
                                <span className="error">{this.state.fundTypeMsz}</span>
                            </Col>
                            {/* <Col lg={6} md={6} sm={6} xs={12}>
                                <label className="form-label">Fund Type*</label>
                                <FormControl name='selectState' defaultValue={''} value={this.state.fundType} className={"selectFormControl " + (this.state.fundTypeBorder ? 'inputError' : '')} componentClass="select" placeholder="Select Fund Type" onChange={(e) => this.fundDetailsInputHandleEvent(e, 'fundType')} onBlur={(e) => this.fundDetailsInputHandleEvent(e, 'fundType')}>
                                    <option value=''>Select Fund Type</option>
                                    <option value="UsCCorp">U.S.Entity</option>
                                    <option value="UsSCorp">Non U.S.Entity</option>
                                </FormControl>
                                {this.state.selectStateTouched && this.state.trustLegallyDomiciled == 231 && this.state.selectState == 0 ? <span className="error">{this.Constants.STATE_REQUIRED}</span> : null}
                            </Col> */}
                        </Row>
                        <h2 className="title marginTop40">General Partner’s Capital Commitment</h2>
                        <h4 className="subtext">Specify the General Partner’s Capital Commitment to the Fund by filling in one of the parameters. Click on any parameter for more information.</h4>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">% of LP Commitments
                                        &nbsp;
                                        <span>
                                            <LinkWithTooltip tooltip="The indicated percentage will establish a GP Capital Commitment based upon a percentage of the aggregate Limited Partner Capital Commitments, without reference to the General Partner’s Capital Commitment itself.  For example, if the aggregate Limited Partner Capital Commitments are $1,000,000 and 1% is selected, the General Partner’s Capital  Commitment will be $10,000." id="tooltip-1">
                                            <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                            </LinkWithTooltip>
                                        </span>    
                                </label>
                                <FormControl type="text" placeholder="100.00%" className="inputFormControl" value={this.state.percentageOfLPCommitmentPer} disabled={this.state.aTextBoxDisabled} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'percentageOfLPCommitment')} onBlur={(e)=>{this.addPercentageToInput(e,'percentageOfLPCommitment')}} onFocus={(e)=>{this.handleinputFocus(e,'percentageOfLPCommitment')}}/>
                            </Col>
                            <Col xs={6} md={6}>
                                <label className="form-label">Fixed Commitment in Dollars
                                        &nbsp;
                                        <span>
                                            <LinkWithTooltip tooltip="Permits entry of a specific, fixed dollar amount in whole dollars or with increments of cents, as preferred." id="tooltip-1">
                                            <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                            </LinkWithTooltip>
                                        </span> 
                                </label>
                                <FormControl type="text" placeholder="$15,000.00" className="inputFormControl" disabled={this.state.bTextBoxDisabled} value={this.state.capitalCommitmentByGPCurrencyValue}  onChange={(e)=> this.fundDetailsInputHandleEvent(e,'capitalCommitmentByGP')}  onKeyPress={(e) => {this.numbersOnly(e)}} onBlur={(e)=>{this.addCurrencyValueToInput(e,'capitalCommitmentByGP')}} onFocus={(e)=>{this.handleinputFocus(e,'capitalCommitmentByGP')}} />
                            </Col>
                        </Row>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">% of LP + GP Commitments
                                    &nbsp;
                                    <span>
                                        <LinkWithTooltip tooltip="The indicated percentage will establish a GP Capital Commitment based upon a percentage of the sum of (x) the aggregate Limited Partner Capital Commitments plus (y) the General Partner’s Capital Commitment itself.  For example, if the aggregate Limited Partner Capital Commitments are $1,000,000 and 1% is selected, the General Partner’s Capital  Commitment will be $10,101.01 (such that aggregate Capital Commitments of both the Limited Partners and General Partner are $1,010,101.01, of which $10,101.01 is precisely 1%)." id="tooltip-1">
                                        <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                        </LinkWithTooltip>
                                    </span> 
                                </label>
                                <FormControl type="text" placeholder="100.00%" className="inputFormControl" disabled={this.state.cTextBoxDisabled} value={this.state.percentageOfLPAndGPAggregateCommitmentPer} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'percentageOfLPAndGPAggregateCommitment')} onBlur={(e)=>{this.addPercentageToInput(e,'percentageOfLPAndGPAggregateCommitment')}} onFocus={(e)=>{this.handleinputFocus(e,'percentageOfLPAndGPAggregateCommitment')}} />
                            </Col>
                        </Row>
                        <h2 className="title marginTop40">The General Partner’s Capital Commitment indicated is:</h2>
                        <Row className="step1Form-row">
                            <Col xs={12} md={12} className="marginLeft15">
                                <Radio name="generalPartnersCapitalCommitmentindicated" checked={this.state.generalPartnersCapitalCommitmentindicated === 1} onChange={(e) => this.fundDetailsInputHandleEvent(e,'generalPartnersCapitalCommitmentindicated1')}>
                                    <span className="radio-checkmark custom"></span>
                                    <div className="radioText alignRadioText">A minimum amount only, but not a cap.  If this option is selected, the General Partner’s Capital Commitment may be increased above the required minimum level through the final closing date on later screens.</div>
                                </Radio>
                                <Radio name="generalPartnersCapitalCommitmentindicated" checked={this.state.generalPartnersCapitalCommitmentindicated === 2} onChange={(e) => this.fundDetailsInputHandleEvent(e,'generalPartnersCapitalCommitmentindicated2')}>
                                    <span className="radio-checkmark custom"></span>
                                    <div className="radioText alignRadioText">An exact amount to be adhered to.  If this option is selected, there will be no option to increase the General Partner’s Capital Commitment on later screens, though you may return here to revise this setting at any time.</div>
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



