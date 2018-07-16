import React, { Component } from 'react';
import '../createfund.component.css';
import fundDefaultImage from '../../../images/profilePic.jpg';
import { Button, Radio, Row, Col, FormControl } from 'react-bootstrap';
import Loader from '../../../widgets/loader/loader.component';
import {Fsnethttp} from '../../../services/fsnethttp';
import {Constants} from '../../../constants/constants';
import { reactLocalStorage } from 'reactjs-localstorage';

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
        this.state = {
            isAllDelegateSignNeeded: 0,
            fundImageName: 'fund_Pic.jpg',
            currentFundImage : fundDefaultImage,
            fundPicFile: {},

        }
    }

    //Fund details input change event
    fundDetailsInputHandleEvent(event,type) {
        switch(type) {
            case 'legalEntity':
                break;
            case 'fundHardCap':
                break;
            case 'fundManagerLegalEntityName':
                break;
            case 'fundTargetCommitment':
                break;
            case 'capitalCommitmentByGP':
                break;
            case 'isAllDelegateSignNeededYes':
                this.setState({
                    isAllDelegateSignNeeded: 1  
                })
                break;
            case 'isAllDelegateSignNeededNo':
                this.setState({
                    isAllDelegateSignNeeded: 0  
                })
                break;
            default:
                // do nothing
        }
    }


    //Clear the image when user click on remove button
    //Clear the image name from state
    //Clear the input file value
    removeImageBtn() {
        this.setState({
            fundImageName: 'fund_Pic.jpg',
            currentFundImage : fundDefaultImage,
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
        var formData = new FormData();
        formData.append("vcfirmId", 2);
        formData.append("fundHardCap", this.fundHardCap.value);
        formData.append("fundManagerLegalEntityName", this.fundManagerLegalEntityName.value);
        formData.append("fundTargetCommitment", this.fundTargetCommitment.value);
        formData.append("capitalCommitmentByGP", this.capitalCommitmentByGP.value);
        formData.append("isAllDelegateSignNeeded", this.state.isAllDelegateSignNeeded);
        formData.append("fundImage", this.state.fundPicFile);
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        console.log(headers);
        this.Fsnethttp.fundStore(formData, headers).then(result=>{
            this.close();
            this.props.history.push('/createfund/step2');
        })
        .catch(error=>{
            this.close();
            if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                // this.setState({
                //     errorMessage: error.response.data.errors[0].msg,
                // });
            } else {
                // this.setState({
                //     errorMessage: this.Constants.INTERNAL_SERVER_ERROR,
                // });

            }
        });
        //this.props.history.push('/createfund/step2');
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/step1');
    }


    render(){
        return(
            <div className="step1FormClass">
                <div className="form-grid">
                    <h2>Fund Details</h2>
                    <h4>Enter the details for the fund below. Fields marked with an * are mandatory.</h4>
                   
                    <div id="step1Form">
                        <Row className="step1Form-row">
                            <Col xs={6} md={6} sm={6} xs={12}>
                                <label className="form-label">Legal Entity*</label>
                                {/* <input type="text" className= "inputFormControl" placeholder="Helios" /> */}
                                <FormControl type="text" placeholder="Helios" className="inputFormControl" inputRef={(input)=>{this.legalEntity = input}} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'legalEntity')} autoComplete="off"/>
                            </Col>
                            <Col xs={6} md={6} sm={6} xs={12}>
                                <label className="form-label">Hard cap</label>
                                {/* <input type="text" className= "inputFormControl" placeholder="$15,000,000.00" /> */}
                                <FormControl type="text" placeholder="$15,000,000.00" className="inputFormControl" inputRef={(input)=>{this.fundHardCap = input}} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'fundHardCap')} autoComplete="off"/>
                            </Col>
                        </Row>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">Fund Manager (GP) Legal Entity Name*</label>
                                {/* <input type="text" className= "inputFormControl" placeholder="Helios GP I,LLC" />    */}
                                <FormControl type="text" placeholder="Helios GP I,LLC" className="inputFormControl" inputRef={(input)=>{this.fundManagerLegalEntityName = input}} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'fundManagerLegalEntityName')} autoComplete="off"/>
                            </Col>
                            <Col xs={6} md={6}>
                                <label className="form-label">Fund Target Commitment</label>
                                {/* <input type="text" className= "inputFormControl" placeholder="$20,000,000" /> */}
                                <FormControl type="text" placeholder="$20,000,000" className="inputFormControl" inputRef={(input)=>{this.fundTargetCommitment = input}} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'fundTargetCommitment')} autoComplete="off"/>
                            </Col>
                        </Row>
                        <Row className="step1Form-row">
                            <Col xs={6} md={6}>
                                <label className="form-label">All delegates must sign fund:</label>
                                <Radio name="radioGroup" inline id="yesCheckbox" onChange={(e) => this.fundDetailsInputHandleEvent(e,'isAllDelegateSignNeededYes')}>&nbsp; Yes </Radio>
                                <Radio name="radioGroup" inline id="noCheckbox" onChange={(e) => this.fundDetailsInputHandleEvent(e,'isAllDelegateSignNeededNo')}>&nbsp; No </Radio>
                            </Col>
                            <Col xs={6} md={6}>
                                <label className="form-label">Capital commitment by fund manager*</label>
                                {/* <input type="text" className= "inputFormControl" placeholder="$12,000.00" /> */}
                                <FormControl type="text" placeholder="$12,000.00" className="inputFormControl" inputRef={(input)=>{this.capitalCommitmentByGP = input}} onChange={(e)=> this.fundDetailsInputHandleEvent(e,'capitalCommitmentByGP')} autoComplete="off"/>
                            </Col>
                           
                        </Row>
                        <label className="profile-text">Fund Image:(Image must not exceed 96x96)</label>
                        <Row className="profile-Row profileMargin">
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
                        
                    </div>
                </div>
                
                <div className="footer-nav">        
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default Step1Component;



