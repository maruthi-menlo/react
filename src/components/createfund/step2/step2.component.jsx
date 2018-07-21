import React, { Component } from 'react';
import '../createfund.component.css';
import { Button, Checkbox as CBox, Row, Col, FormControl } from 'react-bootstrap';
import userDefaultImage from '../../../images/default_user.png';
import { Fsnethttp } from '../../../services/fsnethttp';
import {Constants} from '../../../constants/constants';
import Loader from '../../../widgets/loader/loader.component';
import { reactLocalStorage } from 'reactjs-localstorage';


class Step2Component extends Component {

    constructor(props) {
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.addGpDelegateBtn = this.addGpDelegateBtn.bind(this);
        this.closeGpDelegateModal = this.closeGpDelegateModal.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.addDelegateFn = this.addDelegateFn.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.state = {
            showAddGpDelegateModal: false,
            getGpDelegatesList: [],
            firmId:null,
            fundId:null,
            isGpDelgateFormValid: false,
            firstNameBorder: false,
            firstNameMsz: '',
            firstName: '',
            firstNameValid: false,
            lastNameBorder: false,
            lastNameMsz: '',
            lastName: '',
            lastNameValid: false,
            emailBorder: false,
            emailMsz: '',
            email: '',
            emailValid: false,
            gpDelegateErrorMsz: '',
            gpDelegatesSelectedList:[],
            gpDelegateScreenError:''
        }
    }


    //Onchange event for all input text boxes.
    handleInputChangeEvent(event,type, obj) {
        let dataObj = {}; 
        this.setState({
            gpDelegateErrorMsz: ''
        })
        switch(type) {
            case 'firstName':
                if(event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        firstNameMsz: this.Constants.FIRST_NAME_REQUIRED,
                        firstNameValid: false,
                        firstNameBorder: true,
                        firstName: ''
                    })
                    dataObj ={
                        firstNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        firstName: event.target.value,
                        firstNameMsz: '',
                        firstNameValid: true,
                        firstNameBorder: false,
                    })
                    dataObj ={
                        firstNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'lastName':
                if(event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        lastNameMsz: this.Constants.LAST_NAME_REQUIRED,
                        lastNameValid: false,
                        lastNameBorder: true,
                        lastName: ''
                    })
                    dataObj ={
                        lastNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        lastName: event.target.value,
                        lastNameMsz: '',
                        lastNameValid: true,
                        lastNameBorder: false,
                    })
                    dataObj ={
                        lastNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'email':
                if(event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        emailMsz: this.Constants.VALID_EMAIL,
                        emailValid: false,
                        emailBorder: true,
                        email: ''
                    })
                    dataObj ={
                        emailValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        email: event.target.value,
                        emailMsz: '',
                        emailValid: true,
                        emailBorder: false,
                    })
                    dataObj ={
                        emailValid :true
                    };
                this.updateStateParams(dataObj);
                }
                break;
            case 'user':
                let getSelectedList = this.state.gpDelegatesSelectedList;
                let selectedId = obj.record.id
                if(event.target.checked) {
                    if(getSelectedList.indexOf(selectedId) === -1) {
                        getSelectedList.push(selectedId);
                    }
                } else {
                    var index = getSelectedList.indexOf(selectedId);
                    if (index !== -1) {
                        getSelectedList.splice(index, 1);
                    }
                }
                this.updateSelectedValueToList(obj.record.id,event.target.checked)
                this.setState({
                    gpDelegatesSelectedList: getSelectedList,
                    gpDelegateScreenError:''
                })
                break;
            default:
                // do nothing
                break;
        }
    }

    addDelegateFn() {
        let firstName = this.state.firstName;
        let lastName = this.state.lastName;
        let email = this.state.email;
        let error = false;
        let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if(email !== '' && !emailRegex.test(email)) {
            this.setState({
                emailMsz: this.Constants.VALID_EMAIL,
                emailBorder: true,
            
            })
            error = true;
        } 
        
        if(!error) {
            let postObj = {firstName:firstName, lastName:lastName, email:email, fundId: this.state.fundId};
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            this.open()
            this.Fsnethttp.addGpDelegate(postObj,headers).then(result=>{
                this.close();
                if(result.data) {
                    //Get list of delegates
                    let gpDelegateList = this.state.getGpDelegatesList;
                    let data = result.data.data;
                    //Add checked as true to auto select the user
                    data['selected'] = true;
                    gpDelegateList.push(data);
                    //Get list of selected list of users
                    let selectedList = this.state.gpDelegatesSelectedList;
                    //Push the newly created gp delegate id to selected list of users
                    selectedList.push(data.id);
                    this.setState({
                        getGpDelegatesList:gpDelegateList,
                        showAddGpDelegateModal: false,
                        gpDelegatesSelectedList: selectedList
                    });
                    this.clearFormFileds();
                }
            })
            .catch(error=>{
                this.close();
                if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        gpDelegateErrorMsz: error.response.data.errors[0].msg,
                    });
                } else {
                    this.setState({
                        gpDelegateErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                    });
                }
            });
        }
    }

    //Clear the fileds
    clearFormFileds() {
        this.setState({
            gpDelegateErrorMsz: '',
            firstName: '',
            lastName: '',
            email:''
        });
    }


    // Update state params values and login button visibility

    updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableSubmitButtion();
        });
    }

    // Enable / Disble functionality of Submit Button
    enableDisableSubmitButtion(){
        let status = (this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid) ? true : false;
        this.setState({
            isGpDelgateFormValid : status
        });
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
        this.open();
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let delegateObj = {fundId:this.state.fundId, vcfirmId:this.state.firmId, gpDelegates:this.state.gpDelegatesSelectedList }
        this.Fsnethttp.assignDelegatesToFund(delegateObj, headers).then(result=>{
            this.close();
            this.props.history.push('/createfund/upload/'+this.state.fundId);
        })
        .catch(error=>{
            this.close();
            this.props.history.push('/createfund/upload/'+this.state.fundId);
        });
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/funddetails/'+this.state.fundId);
    }

    addGpDelegateBtn() {
        // let userObj = {name:'Maruthi', type: 'GP'};
        // this.props.gpData();
        this.setState({
            showAddGpDelegateModal: true
        })
    }

    closeGpDelegateModal() {
        this.setState({
            showAddGpDelegateModal: false
        })
        this.clearFormFileds();
    }

    selectedMembersPushToList() {
        if(this.state.getGpDelegatesList.length >0) {
            let list = this.state.gpDelegatesSelectedList;
            for(let index of this.state.getGpDelegatesList) {
                if(index['selected'] === true) {
                    list.push(index['id'])
                }
                this.setState({
                    gpDelegatesSelectedList: list
                })
            }
        }
    }

    updateSelectedValueToList(id, value) {
        if(this.state.getGpDelegatesList.length >0) {
            let getList = this.state.getGpDelegatesList
            for(let index of getList) {
                if(index['id'] === id) {
                    index['selected'] = value
                }
                this.setState({
                    gpDelegatesSelectedList: getList
                })
            }
        }
    }

    componentDidMount() { 
        let firmId = reactLocalStorage.getObject('firmId');
        var url = window.location.href;
        var parts = url.split("/");
        var urlSplitFundId = parts[parts.length - 1];
        let fundId = urlSplitFundId;
        this.setState({
            fundId: fundId,
            firmId: firmId
        })
        this.open();
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        this.Fsnethttp.getGpDelegates(firmId, fundId, headers).then(result=>{
            this.close();
            if(result.data && result.data.data.length >0) {
                this.setState({ getGpDelegatesList: result.data.data }, () => this.selectedMembersPushToList());
            } else {
                this.setState({
                    getGpDelegatesList: []
                })
            }
        })
        .catch(error=>{
                this.close();
                this.setState({
                    getGpDelegatesList: []
                })
           
        });
    }

    render() {
        return (
            <div className="step2Class marginTop15">
            <div className="GpDelegatesContainer" >
                <h1 className="title">Assign GP Delegates</h1>
                <p className="subtext">Select GP Delegate(s) from the list below or add a new one.</p>
                <Button className="fsnetButton" onClick={this.addGpDelegateBtn}><i className="fa fa-plus"></i>GP Delegate</Button>
                <div className={"userContainer " + (this.state.getGpDelegatesList.length ===0 ? 'borderNone' : '')} >
                    {this.state.getGpDelegatesList.length >0 ?
                        this.state.getGpDelegatesList.map((record, index)=>{
                            return(
                                <div className="userRow" key={index}>
                                    {
                                        record['profilePic']  ?
                                        <img src={record['profilePic']} alt="user_image" className="user-image" />
                                         : <img src={userDefaultImage} alt="user_image" className="user-image" />
                                    }
                                    
                                    <div className="fund-user-name">{record['firstName']}&nbsp;{record['lastName']}</div>
                                    <CBox checked={record['selected']} onChange={(e) => this.handleInputChangeEvent(e,'user',{record})}>
                                        <span className="checkmark"></span>
                                    </CBox>
                                </div>
                            );
                        })
                        :
                        <div className="title margin20 text-center">You haven’t added any GP Delegates to this fund yet.</div>
                    } 
                </div>
                <div className="error">{this.state.gpDelegateScreenError}</div>
                <div className="addRoleModal" hidden={!this.state.showAddGpDelegateModal}>
                    <div>
                        <div className="croosMarkStyle"><span className="cursor-pointer" onClick={this.closeGpDelegateModal}>x</span></div>
                        <h3 className="title">Add GP Delegate</h3>
                    </div>
                    <div className="subtext modal-subtext">Fill in the form below to add a new GP Delegate to the fund. Fields marked with an * are required.</div>         <div className="form-main-div">                  
                        <Row className="marginBot20">
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <label className="form-label">First Name*</label>
                                <FormControl type="text" name="firstName" placeholder="Charles" className={"inputFormControl " + (this.state.firstNameBorder ? 'inputError' : '')} value= {this.state.firstName} onChange={(e) => this.handleInputChangeEvent(e,'firstName')} onBlur={(e) => this.handleInputChangeEvent(e,'firstName')}/>   
                                <span className="error">{this.state.firstNameMsz}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <label className="form-label">Last Name*</label>
                                <FormControl type="text" name="lastName" placeholder="Xavier" className={"inputFormControl " + (this.state.lastNameBorder ? 'inputError' : '')} value= {this.state.lastName} onChange={(e) => this.handleInputChangeEvent(e,'lastName')} onBlur={(e) => this.handleInputChangeEvent(e,'lastName')}/>   
                                <span className="error">{this.state.lastNameMsz}</span>
                            </Col>
                        </Row> 
                        <Row className="marginBot20">
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <label className="form-label">Email Address*</label>
                                <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className={"inputFormControl " + (this.state.emailBorder ? 'inputError' : '')} value= {this.state.email} onChange={(e) => this.handleInputChangeEvent(e,'email')} onBlur={(e) => this.handleInputChangeEvent(e,'email')}/>   
                                <span className="error">{this.state.emailMsz}</span>            
                            </Col>
                        </Row> 
                        <div className="error">{this.state.gpDelegateErrorMsz}</div>
                    </div>
                    <Row>
                        <Col lg={6} md={6} sm={6} xs={12}>
                        <Button type="button" className="fsnetCancelButton" onClick={this.closeGpDelegateModal}>Cancel</Button>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12}>
                        <Button className={"fsnetSubmitButton "+ (this.state.isGpDelgateFormValid ? 'btnEnabled' : '') } disabled={!this.state.isGpDelgateFormValid} onClick={this.addDelegateFn}>Submit</Button>
                        </Col>
                    </Row> 
                </div>
                <div className="footer-nav footerNavStep2">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
            </div>
        );
    }
}

export default Step2Component;



