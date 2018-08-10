
import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import { PubSub } from 'pubsub-js';
import { Button, Modal,Row, Col, FormControl } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import { Constants } from '../../../constants/constants';
import { Fsnethttp } from '../../../services/fsnethttp';
import { reactLocalStorage } from 'reactjs-localstorage';
import Loader from '../../../widgets/loader/loader.component';

class LpModalComponent extends Component {

    constructor(props) {
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.handleShow = this.handleShow.bind(this);
        this.handleLpDelShow = this.handleLpDelShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleLpDelClose = this.handleLpDelClose.bind(this);
        this.handleGpDelClose = this.handleGpDelClose.bind(this);
        this.addLpFn = this.addLpFn.bind(this);
        this.addDelegateFn = this.addDelegateFn.bind(this);
        this.deleteLp = this.deleteLp.bind(this);
        this.deleteGp = this.deleteGp.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.state = {
            show: false,
            LPDelshow : false,
            
        }

        PubSub.subscribe('openModal', (msg, data) => {
            this.handleShow();
            this.setState({ show: true });
        });
      
        PubSub.subscribe('openLpDelModal', (msg, data) => {
            this.setState({
                fundId: data.data.id,
                fundObj: data.data,
                lpDelegateId: data.delegateId
            },()=>{
                this.handleLpDelShow();
            })
        });
       
    }

    deleteLp() {
        let lpId = this.state.lpDelegateId;
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let postObj = {fundId:this.state.fundId, lpId: lpId}
        this.open()
        this.Fsnethttp.removeLp(postObj,headers).then(result=>{
            this.close();
            if(result) {
                this.updateDeletedLpUserInFundObj(lpId)
            }
        })
        .catch(error=>{
            this.close();
        });
    }

    deleteGp() {
        let gpDelegateId = this.state.gpDelegateId
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let postObj = {fundId:this.state.fundId, delegateId: gpDelegateId}
        this.open()
        this.Fsnethttp.removeGp(postObj,headers).then(result=>{
            this.close();
            if(result) {
                this.updateDeletedGpUserInFundObj(gpDelegateId)
            }
        })
        .catch(error=>{
            this.close();
        });
    }

    updateDeletedGpUserInFundObj(id) {
        let obj = this.state.fundObj;
        let deletedId = id;
        for(let index of obj.gpDelegates) {
            if(index['id'] === deletedId) {
                index['selected'] = false
                this.setState({
                    fundObj: obj
                },()=>{
                    PubSub.publish('fundData', this.state.fundObj);
                    this.handleGpDelClose();
                })
            }
        }
    }


    updateDeletedLpUserInFundObj(id) {
        let obj = this.state.fundObj;
        let deletedId = id;
        for(let index of obj.lps) {
            if(index['id'] === deletedId) {
                index['selected'] = false
                this.setState({
                    fundObj: obj
                },()=>{
                    PubSub.publish('fundData', this.state.fundObj);
                    this.handleLpDelClose();
                })
            }
        }
    }



    handleClose() {
        this.clearFormFileds();
        this.setState({ show: false });
    }

    handleShow() {
        this.setState({ show: true });
    }

    handleGpClose() {
        this.clearFormFileds();
        this.setState({ GPshow: false });
    }

    handleGpShow() {
        this.setState({ GPshow: true });
    }
    handleLpDelShow() {
        this.setState({ LPDelshow: true });
    }
    handleLpDelClose() {
        this.setState({ LPDelshow: false });
    }

    handleGpDelShow() {
        this.setState({ GPDelshow: true });
    }
    handleGpDelClose() {
        this.setState({ GPDelshow: false });
    }

    //Clear the fileds
    clearFormFileds() {
        this.setState({
            lpErrorMsz: '',
            firstName: '',
            lastName: '',
            email:'',
            orgName: '',
            cellNumber:'',
            gpDelegateErrorMsz:''
        });
    }
    updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableSubmitButtion();
        });
    }
    enableDisableSubmitButtion(){
        let status = (this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.cellNumberValid) ? true : false;
        this.setState({
            isLpFormValid : status
        });
    }

    //Onchange event for all input text boxes.
    handleInputChangeEvent(event,type, obj) {
        let dataObj = {}; 
        this.setState({
            lpErrorMsz: ''
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
                        firstNameValid: true,
                        firstNameBorder: false,
                        firstNameMsz: ''
                        
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
            case 'orgName':
                this.setState({
                    orgName: event.target.value.trim()
                })
                break;
            case 'cellNumber':
                if(event === '' || event === undefined) {
                    this.setState({
                        cellNumberMsz: this.Constants.CELL_NUMBER_VALID,
                        cellNumberValid: false,
                        cellNumberBorder: true,
                        cellNumber: ''
                    })
                    dataObj ={
                        cellNumberValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        cellNumber: event,
                        cellNumberMsz: '',
                        cellNumberValid: true,
                        cellNumberBorder: false,
                    })
                    dataObj ={
                        cellNumberValid :true
                    };
                this.updateStateParams(dataObj);
                }
                break;
            default:
                // do nothing
                break;
        }
    }

    clearFormFileds() {
        this.setState({
            gpDelegateErrorMsz: '',
            firstName: '',
            lastName: '',
            email:'',
            orgName:'',
            cellNumber:'',
            firstNameMsz: '',
            firstNameBorder: false,
            lastNameBorder: false,
            lastNameMsz: '',
            emailBorder: false,
            emailMsz: '',
			cellNumberBorder: false,
            cellNumberMsz: '',
        });
    }


    // Update state params values and login button visibility

    updateGPStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableGPDisableSubmitButtion();
        });
    }

    // Enable / Disble functionality of Submit Button
    enableGPDisableSubmitButtion(){
        let status = (this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid) ? true : false;
        this.setState({
            isGpDelgateFormValid : status
        });
    }

    addLpFn() {
        let firstName = this.state.firstName;
        let lastName = this.state.lastName;
        let email = this.state.email;
        let cellNumber = this.state.cellNumber;
        let error = false;
        let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if(email !== '' && !emailRegex.test(email)) {
            this.setState({
                emailMsz: this.Constants.VALID_EMAIL,
                emailBorder: true,
            })
            error = true;
        } 

        if(cellNumber.length <12 || cellNumber.length>13) {
            this.setState({
                cellNumberMsz: this.Constants.CELL_NUMBER_VALID,
                cellNumberBorder: true,
            })
            error = true;
        }
        
        if(!error) {
            let postObj = {firstName:firstName, lastName:lastName, email:email,cellNumber:cellNumber, fundId: this.state.fundId, organizationName:this.state.orgName};
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            this.open()
            this.Fsnethttp.addLp(postObj,headers).then(result=>{
                this.close();
                if(result.data) {
                    let lpObj = result.data.data;
                    lpObj['selected'] = true;
                    lpObj['profilePic'] = null;
                    let getFundObj = this.state.fundObj;
                    getFundObj.lps.push(lpObj);
                    this.setState({
                        fundObj: getFundObj
                    },()=>{
                        console.log(this.state.fundObj)
                        PubSub.publish('fundData', this.state.fundObj);
                        this.handleClose();
                    })
                    // PubSub.publish('fundData', {id:this.state.fundId});
                }
            })
            .catch(error=>{
                this.close();
                if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        lpErrorMsz: error.response.data.errors[0].msg,
                    });
                } else {
                    this.setState({
                        lpErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                    });
                }
            });
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
                    let gpObj = result.data.data;
                    gpObj['selected'] = true;
                    gpObj['profilePic'] = null;
                    let getFundObj = this.state.fundObj;
                    getFundObj.gpDelegates.push(gpObj);
                    this.setState({
                        fundObj: getFundObj
                    },()=>{
                        console.log(this.state.fundObj)
                        PubSub.publish('fundData', this.state.fundObj);
                        this.handleGpClose();
                    })
                    
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


    render() {
        return (
            <div>
                <Modal id="LPModal" show={this.state.show} onHide={this.handleClose} dialogClassName="LPModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Add LP Delegate</Modal.Title>     
                    <Modal.Body>
                        <div className="subtext modal-subtext">Fill in the form below to add a new LP Delegate to the Fund. Fields marked with an * are required.</div>
                        <div className="form-main-div">
                        <form>               
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
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Organization Name</label>
                                    <FormControl type="text" name="orgName" placeholder="Organization Name" className="inputFormControl" value= {this.state.orgName} onChange={(e) => this.handleInputChangeEvent(e,'orgName')}/>   
                                </Col>
                            </Row>
                            <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Phone Number (Cell)*</label>
                                    <PhoneInput className={(this.state.cellNumberBorder ? 'inputError' : '')} maxLength="14" placeholder="(123) 456-7890" value={ this.state.cellNumber } country="US" onChange={phone => this.handleInputChangeEvent(phone,'cellNumber')} />
                                    <span className="error">{this.state.cellNumberMsz}</span>
                                </Col>
                            </Row>
                        </form>
                        <div className="error">{this.state.lpErrorMsz}</div>
                        </div> 
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton" onClick={this.handleClose}>Cancel</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button className={"fsnetSubmitButton "+ (this.state.isLpFormValid ? 'btnEnabled' : '') } disabled={!this.state.isLpFormValid} onClick={this.addLpFn}>Submit</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>

                <Modal id="LPDelModal" show={this.state.LPDelshow} onHide={this.handleLpDelClose} dialogClassName="LPDelModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Delete LP Delegate</Modal.Title>                                        
                    <Modal.Body>
                        <div className="subtext modal-subtext">Are you sure you want to delete LP Delegate?</div>         
                        <div className="form-main-div">
                        </div> 
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton" onClick={this.handleLpDelClose}>Cancel</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton btnEnabled" onClick={this.deleteLp}>Delete</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default LpModalComponent;

