
import React, { Component } from 'react';
import '../createfund.component.css';
import { PubSub } from 'pubsub-js';
import { Button, Modal,Row, Col,Checkbox as CBox, FormControl } from 'react-bootstrap';
import PhoneInput from 'react-phone-number-input';
import { Constants } from '../../../constants/constants';
import { Fsnethttp } from '../../../services/fsnethttp';
import { reactLocalStorage } from 'reactjs-localstorage';
import Loader from '../../../widgets/loader/loader.component';
import LpTableComponent from '../../editfund/lptable/lptable.component';
import userDefaultImage from '../../../images/default_user.png';
import documentImage from '../../../images/documentsWhite.svg';

class ModalComponent extends Component {

    constructor(props) {
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.handleShow = this.handleShow.bind(this);
        this.handleGpShow = this.handleGpShow.bind(this);
        this.handleLpDelShow = this.handleLpDelShow.bind(this);
        this.handleGpDelShow = this.handleGpDelShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleGpClose = this.handleGpClose.bind(this);
        this.handleLpDelClose = this.handleLpDelClose.bind(this);
        this.handleGpDelClose = this.handleGpDelClose.bind(this);
        // this.handlefundDelShow = this.handlefundDelShow.bind(this);
        this.handlefundDelClose = this.handlefundDelClose.bind(this);
        this.handlefundClose = this.handlefundClose.bind(this);
        this.handleCloseFundClose = this.handleCloseFundClose.bind(this);
        this.addLpFn = this.addLpFn.bind(this);
        this.addDelegateFn = this.addDelegateFn.bind(this);
        this.deleteLp = this.deleteLp.bind(this);
        this.deleteGp = this.deleteGp.bind(this);
        this.deactivateFund = this.deactivateFund.bind(this);
        this.deactivateFundStatus = this.deactivateFundStatus.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.closeFundBtn = this.closeFundBtn.bind(this);
        this.handleCloseFund = this.handleCloseFund.bind(this);
        this.state = {
            show: false,
            GPshow : false,
            LPDelshow : false,
            GPDelshow : false,
            isLpFormValid: false,
            firstNameBorder: false,
            fundDeactivateModal: false,
            fundCloseModal: false,
            firstNameMsz: '',
            firstName: '',
            reason: '',
            firstNameValid: false,
            lastNameBorder: false,
            lastNameMsz: '',
            lastName: '',
            lastNameValid: false,
            emailBorder: false,
            emailMsz: '',
            email: '',
            emailValid: false,
            cellNumberBorder: false,
            cellNumberMsz: '',
            cellNumber: '',
            isNew: true,
            reasonValid: true,
            isValidated: false,
            cellNumberValid: false,
            lpErrorMsz: '',
            lpSelectedList:[],
            lpScreenError:'',
            orgName:'',
            fundId: null,
            fundName: '',
            gpDelegateErrorMsz:'',
            isGpDelgateFormValid:false,
            lpDelegateId:'',
            gpDelegateId: '',
            fundObj: {}
        }

        PubSub.subscribe('openLpModal', (msg, data) => {
            this.setState({
                fundId: data.id,
                fundObj: data
            },()=>{
                this.handleShow();
            })
        });
       PubSub.subscribe('openGpModal', (msg, data) => {
            this.setState({
                fundId: data.id,
                fundObj: data
            }, ()=>{
                this.handleGpShow();
            })
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
        PubSub.subscribe('openGpDelModal', (msg, data) => {
            this.setState({
                fundId: data.data.id,
                fundObj: data.data,
                gpDelegateId: data.delegateId
            },()=>{
                this.handleGpDelShow();
            })
        });

        PubSub.subscribe('openfundDelModal', (msg, data) => {
            if(!this.state.fundDeactivateModal) {
                this.setState({
                    fundId: data.fundId,
                    fundName: data.fundName,
                    fundStatus: data.fundStatus
                },()=>{
                    this.handlefundDelShow();
                })
            }
        });

        PubSub.subscribe('openfundDetailModal', (msg, data) => {
            if(!this.state.fundDeactivateModal) {
                this.setState({
                    fundId: data.fundId,
                    fundName: data.fundName,
                    fundStatus: data.fundStatus
                },()=>{
                    this.handlefundShow();
                })
            }
        });
        PubSub.subscribe('openCloseFundModal', (msg, data) => {
            if(!this.state.fundCloseModal) {
                this.setState({
                    fundId: data.fundId
                },()=>{
                    this.handlefundCloseShow();
                })
            }
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

    deactivateFund() {
        if(this.state.fundStatus != 'New-Draft') {
            if(this.state.reason == null || this.state.reason == undefined || this.state.reason == '' ) {
                this.setState({
                    reasonValid: false
                }, () => {
                    this.deactivateFundStatus();
                })
            } else {
                this.setState({
                    reasonValid: true
                }, () => {
                    this.deactivateFundStatus();
                })    
            }
        } else {
            this.setState({
                reasonValid: true
            }, () => {
                this.deactivateFundStatus();
            })
        }
    }

    closeFundBtn() {

    }

    handleCloseFund(e, value) {
        if(e.target.value > value) {
            alert('Close target commitment should be less than target commitment.')
        }
    }

    deactivateFundStatus() {
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let postObj = {fundId:this.state.fundId, deactivateReason: this.state.reason};
        if(this.state.reasonValid) {
            this.open()
            this.Fsnethttp.deactivateFund(postObj,headers).then(result=>{
                this.close();
                if(result) {
                    this.handlefundClose(true);
                    // this.updateDeletedGpUserInFundObj(gpDelegateId)
                }
            })
            .catch(error=>{
                this.close();
                // this.handlefundClose(true);
            });
        }
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
        this.setState({ show: false }, () => {
            let touchedArr = ['firstName', 'lastName', 'cellNumber', 'orgName', 'email'];
            touchedArr.forEach(key => {
                this.setState({
                    [key+'Touched']: false
                })
            })
        });
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
    handlefundShow() {
        this.setState({ lpFundModal: true });
    }
    handleCloseFundClose() {
        this.setState({ fundCloseModal: false });
    }
    handlefundClose(redirect) {
        this.setState({ lpFundModal: false }, () => {
            if(redirect) {
                PubSub.publish('goToDashboard');
                // this.props.history.push('/dashboard');
            }
        });
    }

    handleLpDelClose(redirect) {
        this.setState({ LPDelshow: false });
    }

    handleGpDelShow() {
        this.setState({ GPDelshow: true });
    }
    handlefundDelShow() {
        this.setState({ fundDeactivateModal: true });
    }
    handlefundCloseShow() {
        this.setState({ fundCloseModal: true });
    }
    handleGpDelClose() {
        this.setState({ GPDelshow: false });
    }
    handlefundDelClose() {
        this.setState({ reasonTouched: false, reasonValid: true, fundDeactivateModal: false });
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
    handleInputChangeEvent(event,type, obj, eventType) {
        window.scrollTo(0,0);
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
                    let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
                    if(event.target.value !== '' && emailRegex.test(event.target.value)) {
                        this.setState({
                            email: event.target.value,
                            emailMsz: '',
                            emailValid: true,
                            emailBorder: false,
                        
                        }, () => {
                            console.log('make call');
                            if(eventType != 'blur') {
                                this.checkEmail('lp');
                            }
                        })
                        dataObj ={
                            emailValid :true
                        };
                    } else {
                        this.setState({
                            email: event.target.value,
                            emailMsz: '',
                            isValidated: false,
                            emailValid: true,
                            emailBorder: false,
                        })
                        dataObj ={
                            emailValid :true
                        };
                    } 
                this.updateStateParams(dataObj);
                }
                break;
            case 'orgName':
                if(event.target.value.trim() === '') {
                    this.setState({
                        orgName: event.target.value.trim()
                    })
                } else {
                    this.setState({
                        orgName: event.target.value
                    })
                }
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

    handleInputEventChange(e) {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name] : value,
            [name+'Touched'] : true
        })
    }

    handleInputChangeEventGP(event,type, obj, eventType) {
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
                    this.updateGPStateParams(dataObj);
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
                    this.updateGPStateParams(dataObj);
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
                    this.updateGPStateParams(dataObj);
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
                    this.updateGPStateParams(dataObj);
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
                    this.updateGPStateParams(dataObj);
                } else {
                    let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
                    if(event.target.value !== '' && emailRegex.test(event.target.value)) {
                        this.setState({
                            email: event.target.value,
                            emailMsz: '',
                            emailValid: true,
                            emailBorder: false,
                        
                        }, () => {
                            console.log('make call');
                            if(eventType != 'blur'){
                                this.checkEmail('gpDelegate');
                            }
                        })
                        dataObj ={
                            emailValid :true
                        };
                    } else {
                        this.setState({
                            email: event.target.value,
                            isValidated: false,
                            emailMsz: '',
                            emailValid: true,
                            emailBorder: false,
                        })
                        dataObj ={
                            emailValid :true
                        };
                    } 
                    
                    this.updateGPStateParams(dataObj);
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

    checkEmail(type) {
        let postObj = {email:this.state.email, fundId: this.state.fundId};
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        this.open()
        let url = type == 'gpDelegate' ? 'delegate/gp/check' : (type == 'lpDelegate' ? 'delegate/lp/check' : 'lp/check');
        this.Fsnethttp.checkEmail(url, postObj,headers).then(result=>{
            this.close();
            if(result.data) {
                console.log('data::::', result.data);
                this.setState({
                    isNew: result.data.isNew,
                    isValidated: true,
                    firstName:  result.data.firstName,
                    lastName:  result.data.lastName,
                    cellNumber:  result.data.cellNumber,
                    orgName:  result.data.organizationName ? result.data.organizationName : ''
                }, () => {
                    Object.keys(result.data).forEach(key => {
                        // console.log(key, obj[data])
                        if(key != 'email') {
                            if(type == 'gpDelegate') {
                                if(key == 'cellNumber') {
                                    this.handleInputChangeEventGP(result.data[key], key);    
                                } else {
                                    this.handleInputChangeEventGP({target: {value : result.data[key]}}, key);
                                }
                            } else {
                                if(key == 'cellNumber') {
                                    this.handleInputChangeEvent(result.data[key], key);    
                                } else {
                                    this.handleInputChangeEvent({target: {value : result.data[key]}}, key);
                                }
                            }
                        } else {
                            // this.setState({
                            //     email: result.data.email,
                            //     isValidated: false,
                            //     emailMsz: '',
                            //     emailValid: true,
                            //     emailBorder: false,
                            // })
                            // let dataObj ={
                            //     emailValid :true
                            // };
                            // this.updateGPStateParams(dataObj);
                        }
                    })
                    console.log('this.state::::', this.state);
                })
            }
        })
        .catch(error=>{
            this.close();
            if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                if(type == 'gpDelegate') {
                    this.setState({
                        gpDelegateErrorMsz: error.response.data.errors[0].msg,
                        isNew: true
                    });
                } else {
                    this.setState({
                        lpErrorMsz: error.response.data.errors[0].msg,
                        isNew: true
                    }); 
                }
            } else {
                if(type == 'gpDelegate') {
                    this.setState({
                        gpDelegateErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                        isNew: true
                    });
                } else {
                    this.setState({
                        lpErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                        isNew: true
                    });
                }
                
            }
        });
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
                    gpObj['gPDelegateRequiredConsentHoldClosing'] = true;
                    gpObj['gPDelegateRequiredDocuSignBehalfGP'] = false;
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
    
    handleFocus(key) {
        this.setState({
            [key+'Touched']: true
        })
    }


    render() {
        return (
            <div>
                <Modal id="LPModal" show={this.state.show} onHide={this.handleClose} dialogClassName="LPModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Add LP</Modal.Title>                                        
                    <Modal.Body>
                        <div className="subtext modal-subtext">Fill in the form below to add a new LP to the Fund. Fields marked with an * are required.</div>         
                        <div className="form-main-div add-delegate">
                        <form>
                            <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Email Address*</label>
                                    <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className={"inputFormControl " + (this.state.emailBorder ? 'inputError' : '')} value= {this.state.email} onChange={(e) => this.handleInputChangeEvent(e,'email')} onBlur={(e) => this.handleInputChangeEvent(e,'email', null, 'blur')} onFocus={(e) => this.handleFocus('email')}/>   
                                    <span className="error">{this.state.emailMsz}</span>            
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12} hidden={!this.state.isValidated || !this.state.email}>
                                    <label className="form-label">First Name*</label>
                                    <FormControl type="text" name="firstName" placeholder="Charles" className={"inputFormControl " + (this.state.firstNameTouched && this.state.firstNameBorder ? 'inputError' : '')} value= {this.state.firstName} disabled={!this.state.isNew && this.state.firstName} onChange={(e) => this.handleInputChangeEvent(e,'firstName')} onBlur={(e) => this.handleInputChangeEvent(e,'firstName')} onFocus={(e) => this.handleFocus('firstName')}/>   
                                    <span className="error" hidden={!this.state.firstNameTouched}>{this.state.firstNameMsz}</span>
                                </Col>
                                
                            </Row>               
                            <Row className="marginBot20" hidden={!this.state.isValidated || !this.state.email}>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Last Name*</label>
                                    <FormControl type="text" name="lastName" placeholder="Xavier" className={"inputFormControl " + (this.state.lastNameTouched && this.state.lastNameBorder ? 'inputError' : '')} value= {this.state.lastName} disabled={!this.state.isNew && this.state.lastName} onChange={(e) => this.handleInputChangeEvent(e,'lastName')} onBlur={(e) => this.handleInputChangeEvent(e,'lastName')} onFocus={(e) => this.handleFocus('lastName')}/>   
                                    <span className="error" hidden={!this.state.lastNameTouched}>{this.state.lastNameMsz}</span>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Organization Name</label>
                                    <FormControl type="text" name="orgName" placeholder="Organization Name" className="inputFormControl" value= {this.state.orgName} disabled={!this.state.isNew && this.state.orgName} onChange={(e) => this.handleInputChangeEvent(e,'orgName')} onFocus={(e) => this.handleFocus('orgName')}/>   
                                </Col>
                            </Row> 
                            {/* <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Email Address*</label>
                                    <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className={"inputFormControl " + (this.state.emailBorder ? 'inputError' : '')} value= {this.state.email} onChange={(e) => this.handleInputChangeEvent(e,'email')} onBlur={(e) => this.handleInputChangeEvent(e,'email')}/>   
                                    <span className="error">{this.state.emailMsz}</span>            
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Organization Name</label>
                                    <FormControl type="text" name="orgName" placeholder="Organization Name" className="inputFormControl" value= {this.state.orgName} disabled={!this.state.isNew && this.state.orgName} onChange={(e) => this.handleInputChangeEvent(e,'orgName')}/>   
                                </Col>
                            </Row> */}
                            <Row className="marginBot20" hidden={!this.state.isValidated || !this.state.email}>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Phone Number (Cell)*</label>
                                    <PhoneInput className={(this.state.cellNumberTouched && this.state.cellNumberBorder ? 'inputError' : '')} maxLength="14" placeholder="(123) 456-7890" value={ this.state.cellNumber } disabled={!this.state.isNew && this.state.cellNumber} country="US" onChange={phone => this.handleInputChangeEvent(phone,'cellNumber')} onFocus={(e) => this.handleFocus('cellNumber')}/>
                                    <span className="error" hidden={!this.state.cellNumberTouched}>{this.state.cellNumberMsz}</span>
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

                <Modal id="GPModal" show={this.state.GPshow} onHide={this.handleGpClose} dialogClassName="GPModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Add GP Delegate</Modal.Title>                                        
                    <Modal.Body>
                    <div className="subtext modal-subtext">Fill in the form below to add a new GP Delegate to the Fund. Fields marked with an * are required.</div>
                        <div className="form-main-div add-delegate">
                        <form>  
                            <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Email Address*</label>
                                    <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className={"inputFormControl " + (this.state.emailBorder ? 'inputError' : '')} value= {this.state.email} onChange={(e) => this.handleInputChangeEventGP(e,'email')} onBlur={(e) => this.handleInputChangeEventGP(e,'email', null, 'blur')}/>   
                                    <span className="error">{this.state.emailMsz}</span>            
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12} hidden={!this.state.isValidated || !this.state.email}>
                                    <label className="form-label">First Name*</label>
                                    <FormControl type="text" name="firstName" placeholder="Charles" className={"inputFormControl " + (this.state.firstNameTouched && this.state.firstNameBorder ? 'inputError' : '')} value= {this.state.firstName} disabled={!this.state.isNew && this.state.firstName} onChange={(e) => this.handleInputChangeEventGP(e,'firstName')} onBlur={(e) => this.handleInputChangeEventGP(e,'firstName')} onFocus={(e) => this.handleFocus('firstName')}/>   
                                    <span className="error" hidden={!this.state.firstNameTouched}>{this.state.firstNameMsz}</span>
                                </Col>
                            </Row>             
                            <Row className="marginBot20" hidden={!this.state.isValidated || !this.state.email}>
                                {/* <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">First Name*</label>
                                    <FormControl type="text" name="firstName" placeholder="Charles" className={"inputFormControl " + (this.state.firstNameBorder ? 'inputError' : '')} value= {this.state.firstName} disabled={!this.state.isNew && this.state.firstName} onChange={(e) => this.handleInputChangeEventGP(e,'firstName')} onBlur={(e) => this.handleInputChangeEventGP(e,'firstName')}/>   
                                    <span className="error">{this.state.firstNameMsz}</span>
                                </Col> */}
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Last Name*</label>
                                    <FormControl type="text" name="lastName" placeholder="Xavier" className={"inputFormControl " + (this.state.lastNameTouched && this.state.lastNameBorder ? 'inputError' : '')} value= {this.state.lastName} disabled={!this.state.isNew && this.state.lastName} onChange={(e) => this.handleInputChangeEventGP(e,'lastName')} onBlur={(e) => this.handleInputChangeEventGP(e,'lastName')} onFocus={(e) => this.handleFocus('lastName')}/>   
                                    <span className="error" hidden={!this.state.lastNameTouched}>{this.state.lastNameMsz}</span>
                                </Col>
                            </Row> 
                            {/* <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Email Address*</label>
                                    <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className={"inputFormControl " + (this.state.emailBorder ? 'inputError' : '')} value= {this.state.email} onChange={(e) => this.handleInputChangeEventGP(e,'email')} onBlur={(e) => this.handleInputChangeEventGP(e,'email')}/>   
                                    <span className="error">{this.state.emailMsz}</span>            
                                </Col>
                            </Row> */}
                        </form>
                        <div className="error">{this.state.gpDelegateErrorMsz}</div>
                        </div> 
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton" onClick={this.handleGpClose}>Cancel</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button className={"fsnetSubmitButton "+ (this.state.isGpDelgateFormValid ? 'btnEnabled' : '') } disabled={!this.state.isGpDelgateFormValid} onClick={this.addDelegateFn}>Submit</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>

                <Modal id="LPDelModal" show={this.state.LPDelshow} onHide={this.handleLpDelClose} dialogClassName="LPDelModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Delete LP</Modal.Title>                                        
                    <Modal.Body>
                        <div className="subtext modal-subtext">Are you sure you want to delete LP?</div>         
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

                <Modal id="GPDelModal" show={this.state.GPDelshow} onHide={this.handleGpDelClose} dialogClassName="GPDelModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Delete GP Delegate</Modal.Title>                                        
                    <Modal.Body>
                        <div className="subtext modal-subtext">Are you sure you want to delete GP Delegate?</div>         
                        <div className="form-main-div">
                        </div> 
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton" onClick={this.handleGpDelClose}>Cancel</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton btnEnabled" onClick={this.deleteGp}>Delete</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>

                <Modal id="GPDelModal" className="GPDelModalDeactivate" show={this.state.fundDeactivateModal} onHide={this.handlefundDelClose} dialogClassName="GPDelModalDialog fundModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Deactivate {this.state.fundName}</Modal.Title>                                        
                    <Modal.Body>
                        <div className="subtext modal-subtext">Are you sure you want to deactivate {this.state.fundName}?</div>         
                        <div className="form-main-div">
                            {/* { this.state.fundStatus != 'Open' && this.state.fundStatus != 'Open-Ready'
                            ? */}
                            <form>
                                <div className="marginBot20">
                                    <label className="form-label">Reason*:</label>
                                    <FormControl componentClass="textarea" placeholder="Reason For Deactivate Fund" name="reason" value={this.state.reason} className={"inputFormControl textarea col-md-11 " + (!this.state.reasonValid ? 'inputError' : '')} onChange={(e) => this.handleInputEventChange(e)} onFocus={(e) => { this.setState({ reasonValid : true }) }} />
                                    {!this.state.reasonValid ? <span className="error">{this.Constants.REASON_REQUIRED}</span> : null}            
                                </div>
                            </form>
                            {/* :
                                null
                            } */}
                        
                        </div> 
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton" onClick={this.handlefundDelClose}>Cancel</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton btnEnabled" onClick={this.deactivateFund}>Deactivate</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>
                <Modal id="GPDelModal"  show={this.state.fundCloseModal} onHide={this.handleCloseFundClose} dialogClassName="GPDelModalDialog fundModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>Close Fund</Modal.Title>                                        
                    <Modal.Body>
                        <div className="subtext modal-subtext">Are you sure you want to close Fund?</div>         
                        <div className="form-main-div">
                            <Row className="full-width marginTop20 marginLeft61">
                                <div className="name-heading marginLeft75" >
                                    Name
                                            <i className="fa fa-sort-asc" aria-hidden="true"  ></i>
                                </div>
                                
                                <div className="name-heading" >
                                    Target Commitment
                                        <i className="fa fa-sort-asc" aria-hidden="true"></i>
                                </div>
                                <div className="name-heading" >
                                    Close Target Commitment
                                        <i className="fa fa-sort-asc" aria-hidden="true"></i>
                                </div>                                
                            </Row> 
                            <div className="userAddendumContainer marginTop10" >                    
                                <div className="userRow">
                                    <label className="userImageAlt paddingBottom8">
                                    {
                                        <img src={userDefaultImage} alt="img" className="user-image" />
                                    }
                                    </label>
                                    <div className="lp-name">Name</div>
                                    <div className="lp-name lp-name-width lp-name-pad lp-name-pad-5">$10,000</div>
                                    <FormControl type="text" name="firmName" className="inputFormControl inputFormControlCloseFund " placeholder="$10,000" onBlur={(e) => this.handleCloseFund(e, 10)}/>   
                                    <CBox className="marginLeft8 marginLeft20">
                                        <span className="checkmark"></span>
                                    </CBox>
                                </div>                        
                                <div className="userRow">
                                    <label className="userImageAlt paddingBottom8">
                                    {
                                        <img src={userDefaultImage} alt="img" className="user-image" />
                                    }
                                    </label>
                                    <div className="lp-name">Maruthi prasad</div>
                                    <div className="lp-name lp-name-width lp-name-pad lp-name-pad-5">$10,000</div>
                                    <FormControl type="text" name="firmName" className="inputFormControl inputFormControlCloseFund " placeholder="$10,000" onBlur={(e) => this.handleCloseFund(e, 10)}/>   
                                    <CBox className="marginLeft8 marginLeft20">
                                        <span className="checkmark"></span>
                                    </CBox>
                                </div>     
                                <div className="userRow">
                                    <label className="userImageAlt paddingBottom8">
                                    {
                                        <img src={userDefaultImage} alt="img" className="user-image" />
                                    }
                                    </label>
                                    <div className="lp-name">Sarah Douglas</div>
                                    <div className="lp-name lp-name-width lp-name-pad lp-name-pad-5">$10,000</div>
                                    <FormControl type="text" name="firmName" className="inputFormControl inputFormControlCloseFund " placeholder="$10,000" onBlur={(e) => this.handleCloseFund(e, 10)}/>   
                                    <CBox className="marginLeft8 marginLeft20">
                                        <span className="checkmark"></span>
                                    </CBox>
                                </div>     
                                <div className="title margin20 text-center">{this.state.noDelegatesMsz}</div>                   
                            </div>                       
                        </div> 
                        <Row>
                            <Col lg={8} md={8} sm={8} xs={12} className="paddingZero">
                            <Button type="button" className="fsnetCancelButton buttonFloat" onClick={this.handleCloseFundClose}>Cancel</Button>
                            </Col>
                            <Col lg={4} md={4} sm={4} xs={12} className="paddingZero">
                            <Button type="button" className="fsnetCancelButton btnEnabled buttonFloat" onClick={this.closeFundBtn}>Close Fund</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>


                <Modal id="lpFundModal" show={this.state.lpFundModal} onHide={() => {this.handlefundClose(null)}} dialogClassName="GPDelModalDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Title>{this.state.fundName}</Modal.Title>                                        
                    <Modal.Body>
                        <div className="viewFund">
                            <LpTableComponent fundId={this.state.fundId}></LpTableComponent> 
                        </div>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton" onClick={this.handlefundClose}>Cancel</Button>
                            </Col>
                            {/* <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton btnEnabled" onClick={this.handlefundClose}>Deactivate</Button>
                            </Col> */}
                        </Row>   
                    </Modal.Body>
                </Modal>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default ModalComponent;

