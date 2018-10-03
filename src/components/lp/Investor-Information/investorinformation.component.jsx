import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Button, Radio, Row, Col, FormControl, Modal, OverlayTrigger, Tooltip, Checkbox as CBox } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { FsnetUtil } from '../../../util/util';
import PhoneInput from 'react-phone-number-input';
import { PubSub } from 'pubsub-js';
import { reactLocalStorage } from 'reactjs-localstorage';


// var getLpSubscription = {};
class InvestorInformationComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.investorHandleChangeEvent = this.investorHandleChangeEvent.bind(this);
        this.openStartConfirmationModal = this.openStartConfirmationModal.bind(this);
        this.closeConfirmationModal = this.closeConfirmationModal.bind(this);
        this.submitInvestorInfoStep1Details = this.submitInvestorInfoStep1Details.bind(this);
        this.submitLLCInfoStep1Details = this.submitLLCInfoStep1Details.bind(this);
        this.confirmSubmit = this.confirmSubmit.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.trustOnChangeForm = this.trustOnChangeForm.bind(this);
        this.openSecurityTooltipModal = this.openSecurityTooltipModal.bind(this);
        this.openDisqualifingEventModal = this.openDisqualifingEventModal.bind(this);
        this.state = {
            showModal: false,
            showConfirmationModal: false,
            email: '',
            investorType: 'LLC',
            mailingAddressPhoneNumber: JSON.parse(reactLocalStorage.get('userData')).cellNumber,
            cellNumberBorder: false,
            cellNumberMsz: '',
            mailingAddressPhoneNumberValid: false,
            areYouSubscribingAsJointIndividual: false,
            investorPageValid: false,
            name: '',
            nameBorder: false,
            nameMsz: '',
            nameValid: false,
            otherInvestorAttributes: [],
            mailingAddressStreet: '',
            streetBorder: false,
            streetMsz: '',
            mailingAddressStreetValid: false,
            mailingAddressCity: '',
            cityBorder: false,
            cityMsz: '',
            selectState: 0,
            trustLegallyDomiciled: 0,
            numberOfGrantorsOfTheTrust: '',
            mailingAddressCityValid: false,
            mailingAddressCountry: '',
            mailingAddressState: '',
            stateBorder: false,
            stateMsz: '',
            mailingAddressStateValid: false,
            mailingAddressZip: '',
            zipBorder: false,
            zipMsz: '',
            mailingAddressZipValid: false,
            typeOfLegalOwnership: '',
            showIndividualStep1: true,
            lpsubscriptionTotalObj: {},
            typeOfLegalOwnershipValid: false,
            areYouSubscribingAsJointIndividualValid: false,
            enableLeftIcon: false,
            typeOfLegalOwnershipName: '',
            showLLCInvestorInfoPage1: true,
            showTrustRevocableInvestorPage1: true,
            showTrustIrrevocableInvestorPage1: true,
            showInvestorType: true,
            investorSubTypes: [],
            investorTrustSubTypes: [],
            countriesList: [],
            usStatesList: [],
            statesList: [],
            IstheEntityRequiredFOIAWorldwide: false,
            IstheEntityRequiredFOIAWorldwideValid: true,
            isEntityTaxExemptForUSFederalIncomeTax: false,
            isEntityTaxExemptForUSFederalIncomeTaxValid: true,
            isSubjectToDisqualifyingEvent: false,
            isSubjectToDisqualifyingEventValid: true,
            isEntityUS501c3: false,
            isTrust501c3: false,
            isEntityUS501c3Valid: false,
            releaseInvestmentEntityRequired: false,
            releaseInvestmentEntityRequiredValid: true,
            istheEntityFundOfFundsOrSimilarTypeVehicle: '',
            istheEntityFundOfFundsOrSimilarTypeVehicleValid: false,
            entityName: '',
            trustName: '',
            legalTitleDesignation: '',
            numberOfGrantorsOfTheTrust: '',
            entityNameBorder: false,
            entityNameMsz: '',
            entityNameValid: false,
            investorSubType: 0,
            investorSubTypeBorder: false,
            investorSubTypeMsz: '',
            investorSubTypeValid: false,
            otherInvestorSubType: '',
            otherInvestorSubTypeBorder: false,
            otherInvestorSubTypeMsz: '',
            otherInvestorSubTypeValid: false,
            jurisdictionEntityLegallyRegistered: '',
            jurisdictionEntityLegallyRegisteredBorder: false,
            jurisdictionEntityLegallyRegisteredValid: false,
            jurisdictionEntityLegallyRegisteredMsz: '',
            indirectBeneficialOwnersSubjectFOIAStatutes: '',
            indirectBeneficialOwnersSubjectFOIAStatutesBorder: false,
            indirectBeneficialOwnersSubjectFOIAStatutesValid: false,
            indirectBeneficialOwnersSubjectFOIAStatutesMsz: '',
            investorJurisdictionTypes: [],
            isEntityUS501c3Msz: '',
            isEntityTaxExemptForUSFederalIncomeTaxMsz: '',
            investorInfoErrorMsz: '',
            selectState: 0,
            selectStateBorder: false,
            selectStateMsz: '',
        }
    }

    //Get the id from the url
    //Get the investor sub types
    componentDidMount() {
        let id = this.FsnetUtil.getLpFundId();
        this.investorSubTypes();
        this.investorTrustSubTypes();
        this.getAllCountires();
        this.getUSStates();
        this.getSubscriptionDetails(id);
    }

    //Call investor sub types
    investorSubTypes() {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        this.Fsnethttp.getInvestorSubTypes(headers).then(result => {
            this.close();
            if (result.data) {
                this.setState({
                    investorSubTypes: result.data
                })
            }
        })
            .catch(error => {
                this.close();
            });
    }

    //Call investor sub types for trust
    investorTrustSubTypes() {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        this.Fsnethttp.getInvestorTrustSubTypes(headers).then(result => {
            this.close();
            if (result.data) {
                this.setState({
                    investorTrustSubTypes: result.data
                })
            }
        })
            .catch(error => {
                this.close();
            });
    }

    //Call investor sub types for trust
    getAllCountires() {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        this.Fsnethttp.getAllCountires(headers).then(result => {
            this.close();
            if (result.data) {
                this.setState({
                    countriesList: result.data
                })
            }
        })
            .catch(error => {
                this.close();
            });
    }

    //Call investor sub types for trust
    getUSStates() {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        this.Fsnethttp.getUSStates(headers).then(result => {
            this.close();
            if (result.data) {
                this.setState({
                    usStatesList: result.data
                })
            }
        })
            .catch(error => {
                this.close();
            });
    }

    getStatesByCountry(value) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.open();
        return this.Fsnethttp.getStates(value, headers).then(result => {
            this.close();
            if (result.data) {
                this.setState({
                    statesList: result.data
                })
            }
        })
            .catch(error => {
                this.close();
            });
    }


    //Get countries or states based on sub types selection
    //ISUS value is taken to check whether investor sub type belongs to US or  nonUS
    jurisdictionTypes(isUs, value) {

        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let url = 'getAllCountires'
        if (value === 'otherEntity') {
            // url = 'getAllCountires/1'
            url = 'getAllCountires'
        }
        if (isUs == 0) {
            url = 'getUSStates'
        }
        this.Fsnethttp.getJurisdictionTypes(headers, url).then(result => {
            if (result.data) {
                this.setState({
                    investorJurisdictionTypes: result.data
                })
            }
        })
            .catch(error => {
                this.close();
            });
    }

    //Get the fund data
    getSubscriptionDetails(id) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        if (id) {
            this.open();
            this.Fsnethttp.getLpSubscriptionDetails(id, headers).then(result => {
                this.close();
                if (result.data) {
                    this.setState({
                        lpsubscriptionTotalObj: this.FsnetUtil.decodeObj(result.data.data),
                        email: result.data.data.email,
                        investorType: result.data.data.investorType ? result.data.data.investorType : 'LLC',
                        investorSubType: result.data.data.investorSubType ? result.data.data.investorSubType : 0,
                    })
                    if (result.data.data.investorType === 'Individual') {
                        this.updateIndividualData(this.FsnetUtil.decodeObj(result.data.data))
                    } else if (result.data.data.investorType === 'LLC') {
                        this.updateLLCData(this.FsnetUtil.decodeObj(result.data.data))
                    } else if (result.data.data.investorType === 'Trust') {
                        this.updateTrustData(this.FsnetUtil.decodeObj(result.data.data))
                    }
                }
            })
                .catch(error => {
                    this.close();
                    //this.props.history.push('/dashboard');
                });
        }
    }

    //Update Trust data when investor type is LLC
    updateTrustData(data) {
        this.investorTrustSubTypes();
        let obj = data;
        obj['currentInvestorInfoPageNumber'] = 1;
        obj['currentPageCount'] = 1;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        PubSub.publish('investorData', obj);
        this.setState({
            lpsubscriptionTotalObj: data,
        }, () => {
            if (this.state.investorType == 'Trust') {
                if (this.state.lpsubscriptionTotalObj.mailingAddressCountry) {
                    this.getStatesByCountry(this.state.lpsubscriptionTotalObj.mailingAddressCountry);
                }
            }
            // this.checkInvestorSubType(this.state.lpsubscriptionTotalObj)
            this.updateInvestorInputFields(this.state.lpsubscriptionTotalObj)
        })
    }

    //Update individual data when investor type is individual
    updateIndividualData(data) {
        let obj = data;
        obj['currentInvestorInfoPageNumber'] = 1;
        obj['currentPageCount'] = 1;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        //This is for to send data to left nav component
        PubSub.publish('investorData', obj);
        this.setState({
            lpsubscriptionTotalObj: data,
        }, () => {
            if (this.state.lpsubscriptionTotalObj.mailingAddressCountry) {
                this.getStatesByCountry(this.state.lpsubscriptionTotalObj.mailingAddressCountry);
            }
            this.checkInvestorSubType(this.state.lpsubscriptionTotalObj)
            this.updateInvestorInputFields(this.state.lpsubscriptionTotalObj)
        })
    }

    //Update LLC data when investor type is LLC
    updateLLCData(data) {
        this.investorSubTypes();
        let obj = data;
        obj['currentInvestorInfoPageNumber'] = 1;
        obj['currentPageCount'] = 1;
        obj['currentPage'] = this.FsnetUtil.getCurrentPageForLP();
        PubSub.publish('investorData', obj);
        this.setState({
            lpsubscriptionTotalObj: data,
        }, () => {
            if (this.state.lpsubscriptionTotalObj.mailingAddressCountry) {
                this.getStatesByCountry(this.state.lpsubscriptionTotalObj.mailingAddressCountry);
            }
            this.checkInvestorSubType(this.state.lpsubscriptionTotalObj)
            this.updateInvestorInputFields(this.state.lpsubscriptionTotalObj)
        })
    }

    //Call Jurisdiction types for the first time when investorSubTypes value is exists
    checkInvestorSubType(data) {
        if (data.investorSubType !== null) {
            if (this.state.investorSubTypes.length > 0) {
                for (let index of this.state.investorSubTypes) {
                    if (index['id'] === this.state.lpsubscriptionTotalObj.investorSubType) {
                        let isUS = index['isUS'];
                        this.jurisdictionTypes(isUS, this.state.lpsubscriptionTotalObj.investorSubType);
                    }
                }
            }
        } else if (this.state.lpsubscriptionTotalObj.otherInvestorSubType !== null && this.state.lpsubscriptionTotalObj.otherInvestorSubType !== undefined) {
            this.jurisdictionTypes(1, 'otherEntity');
        }
    }

    //Update all fileds to state 
    updateInvestorInputFields(data) {
        if (data) {
            let keys = [];
            for (let index in data) {
                keys.push(index);
            }
            if (keys) {
                for (let idx of keys) {
                    if (idx === 'typeOfLegalOwnership') {
                        this.getOwnerShipName(data[idx])
                    }
                    this.setState({
                        [idx]: data[idx]
                    }, () => {
                        if (this.state.otherInvestorSubType !== null && this.state.otherInvestorSubType !== undefined) {
                            this.setState({
                                investorSubType: 'otherEntity'
                            }, () => {
                                if (this.state.investorSubType == 'otherEntity' && this.state.investorType == 'Trust') {
                                    this.setState({
                                        investorSubType: this.state.investorTrustSubTypes[0].id
                                    }, () => {
                                        this.validateTrustPages();
                                    })
                                }
                            })
                        }
                        if (idx == 'mailingAddressPhoneNumber' && data['mailingAddressPhoneNumber'] == null || data['mailingAddressPhoneNumber'] == undefined || data['mailingAddressPhoneNumber'] == '') {
                            this.setState({
                                mailingAddressPhoneNumber: JSON.parse(reactLocalStorage.get('userData')).cellNumber
                            })
                        }

                        if (this.state.investorType == 'Trust' || this.state.investorType == 'LLC') {
                            if (idx == 'isEntityTaxExemptForUSFederalIncomeTax' || idx == 'isTrust501c3' || idx == 'IstheEntityRequiredFOIAWorldwide' || idx == 'releaseInvestmentEntityRequired' || idx == 'isSubjectToDisqualifyingEvent') {
                                if (data[idx] == null || data[idx] == undefined || data[idx] == '') {
                                    this.setState({
                                        [idx]: false,
                                        [idx + 'Valid']: true
                                    }, () => {
                                        this.validateTrustPages();
                                    })
                                }
                            }
                            if(idx == 'otherInvestorAttributes' && data[idx] && data[idx].length > 0) {
                                if(this.state.investorType == 'LLC') {
                                    if(data[idx] && data[idx].length > 0) {
                                        this.setState({
                                            [idx]: data[idx],
                                            [idx + 'Valid']: true
                                        }, () => {
                                            let name = 'otherInvestorAttributes' + 'Valid'
                                            let dataObj = {
                                                [name]: true
                                            };
                                            this.updateStateParams(dataObj);    
                                        })
                                        // let name = 'otherInvestorAttributes' + 'Valid'
                                        // let dataObj = {
                                        //     [name]: true
                                        // };
                                        // this.updateStateParams(dataObj);    
                                    } else {
                                        this.setState({
                                            [idx]: data[idx],
                                            otherInvestorAttributesValid: false
                                        }, () => {
                                            let name = 'otherInvestorAttributes' + 'Valid'
                                            let dataObj = {
                                                [name]: false
                                            };
                                            this.updateStateParams(dataObj);
                                        })
                                    }
                                } else {
                                    this.setState({
                                        [idx]: data[idx],
                                        [idx + 'Valid']: true
                                    }, () => {
                                        this.validateTrustPages();
                                    })
                                }
                            }
                        }

                        if (this.state.investorType == 'Trust') {
                            this.validateTrustPages();
                        } else {
                            this.enableNextButtonStep1();
                        }
                    })
                }
                console.log('this.state::::', this.state);
            }
        }
    }

    //Enable next icon based on mandatory fileds.
    //Mandatory fields will be changed for investor type is individual and LLC
    enableNextButtonStep1() {
        let mandatoryFileds = [];
        if (this.state.investorType === 'Individual') {
            mandatoryFileds = ['investorType', 'name', 'areYouSubscribingAsJointIndividual', 'isSubjectToDisqualifyingEvent'];
        } else if (this.state.investorType === 'LLC') {
            mandatoryFileds = ['investorType', 'investorSubType', 'jurisdictionEntityLegallyRegistered', 'entityName', 'isEntityTaxExemptForUSFederalIncomeTax', 'releaseInvestmentEntityRequired', 'isSubjectToDisqualifyingEvent'];
        }
        let validCount = 0;
        for (let field of mandatoryFileds) {
            if (this.state[field] === null || this.state[field] === '' || this.state[field] === undefined) {
                this.setState({
                    investorPageValid: false,
                    [field + 'Valid']: false
                })
                // break;
            } else if (field == 'areYouSubscribingAsJointIndividual' && this.state['areYouSubscribingAsJointIndividual'] == true && !this.state['typeOfLegalOwnership']) {
                this.setState({
                    investorPageValid: false,
                    [field + 'Valid']: false
                })
            } else {
                this.setState({
                    investorPageValid: true,
                    [field + 'Valid']: true
                })
                validCount++;
            }
        }
        // console.log('valid count::::', validCount, mandatoryFileds.length);
        if (validCount != mandatoryFileds.length) {
            this.setState({
                investorPageValid: false
            })
        }
    }

    //Enable next icon based on mandatory fileds for investor information2 page.
    //Mandatory fields will be changed for investor type is individual and LLC
    enableNextButtonStep2() {
        let mandatoryFileds = ['mailingAddressStreet', 'mailingAddressCity', 'mailingAddressState', 'mailingAddressZip', 'mailingAddressPhoneNumber'];
        for (let field of mandatoryFileds) {
            if (this.state[field] === null && this.state[field] === '' && this.state[field] === undefined) {
                this.setState({
                    investorPageValid: false,
                    [field + 'Valid']: false
                })
                break;
            } else {
                this.setState({
                    investorPageValid: true,
                    [field + 'Valid']: true
                })
            }
        }
    }

    //Update owner name based on the typeOfLegalOwnershipName
    getOwnerShipName(name) {
        if (name === 'tenantsInCommon') {
            this.setState({
                typeOfLegalOwnershipName: 'Tenants in Common'
            })
        } else if (name === 'jointTenants') {
            this.setState({
                typeOfLegalOwnershipName: 'Joint Tenants'
            })
        } else if (name === 'communityProperty') {
            this.setState({
                typeOfLegalOwnershipName: 'Community Property'
            })
        } else if (name === 'Other') {
            this.setState({
                typeOfLegalOwnershipName: 'Other'
            })
        }
    }

    //ProgressLoader : Close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loader
    open() {
        this.setState({ showModal: true });
    }

    //Open modal
    openStartConfirmationModal() {
        this.setState({ showConfirmationModal: true });
    }

    //Close modal
    closeConfirmationModal() {
        this.setState({ showConfirmationModal: false });
    }

    //On change event for all input fileds
    investorHandleChangeEvent(event, type, radioTypeName, blur) {
        let key = type;
        let value;
        if (type === 'mailingAddressZip') {
            const re = /^[0-9\b]+$/;
            // if value is not blank, then test the regex
            if (event.target.value.trim() !== '') {
                if (!re.test(event.target.value.trim()) || event.target.value.trim().length > 10) {
                    return true
                }
            }
        }

        if (blur !== 'cellNumberBlur') {
            if (key === 'mailingAddressPhoneNumber') {
                value = event
            } else {
                if (event.target.value.trim() === '') {
                    value = event.target.value.trim()
                } else {
                    value = event.target.value
                }
            }
        } else {
            value = event.target.value
        }
        let dataObj = {};
        switch (type) {
            case 'radio':
                if (blur === 'investorType') {
                    let obj = this.state.lpsubscriptionTotalObj;
                    obj['investorType'] = radioTypeName;
                    obj['currentInvestorInfoPageNumber'] = 1;
                    obj['currentPage'] = 'investorInfo';
                    obj['currentPageCount'] = 1;
                    PubSub.publish('investorData', obj);
                    if (radioTypeName == 'Trust') {
                        this.setState({
                            investorSubType: this.state.investorTrustSubTypes.length ? this.state.investorTrustSubTypes[0].id : 0
                        }, () => {
                            this.validateTrustPages();
                        })
                    } else {
                        this.setState({
                            investorSubType: this.state.lpsubscriptionTotalObj.investorSubType
                        })
                    }
                }
                if (blur === 'typeOfLegalOwnership') {
                    this.getOwnerShipName(radioTypeName)
                }
                if (blur === 'isEntityUS501c3') {
                    this.setState({
                        isEntityUS501c3Msz: ''
                    })
                }
                if (blur === 'isEntityTaxExemptForUSFederalIncomeTax') {
                    this.setState({
                        isEntityTaxExemptForUSFederalIncomeTaxMsz: ''
                    })
                }
                this.setState({
                    [blur]: radioTypeName,
                }, () => {
                    if (blur === 'investorType') {
                        this.enableNextButtonStep1();
                        this.enableDisableInvestorDetailsButton();
                        let name = blur + 'Valid'
                        dataObj = {
                            [name]: true
                        };
                        this.updateStateParams(dataObj);
                    }
                })
                if (blur !== 'investorType') {
                    let name = blur + 'Valid'
                    dataObj = {
                        [name]: true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case key:
                if (type === 'investorSubType' || type === 'jurisdictionEntityLegallyRegistered') {
                    if (value === '0') {
                        value = ''
                    } else {
                        if (type === 'investorSubType') {
                            let isUs = event.target[event.target.selectedIndex].getAttribute('isUS');
                            this.jurisdictionTypes(isUs, event.target.value);
                            this.setState({
                                jurisdictionEntityLegallyRegistered: 0,
                                jurisdictionEntityLegallyRegisteredValid: false,
                                selectState: '',
                                selectStateValid: false
                            }, () => {
                                this.updateStateParams(dataObj);
                            })
                        }
                    }
                }
                if (value === '' || value === undefined) {
                    this.setState({
                        [key + 'Msz']: this.Constants[radioTypeName],
                        [key + 'Valid']: false,
                        [key + 'Border']: true,
                        [key]: ''
                    })
                    let name = key + 'Valid'
                    dataObj = {
                        [name]: false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        [key + 'Msz']: '',
                        [key + 'Valid']: true,
                        [key + 'Border']: false,
                        [key]: value
                    })
                    let name = key + 'Valid'
                    dataObj = {
                        [name]: true
                    };
                    this.updateStateParams(dataObj);
                }
                break;

            default:
                break;
        }
    }

    //Show investor information step1 page
    proceedToBack() {
        if (this.state.investorType === 'Individual') {
            let obj = this.state.lpsubscriptionTotalObj;
            obj['currentInvestorInfoPageNumber'] = 1;
            obj['currentPage'] = 'investorInfo';
            obj['currentPageCount'] = 1;
            PubSub.publish('investorData', obj);
            this.setState({
                showIndividualStep1: true,
                enableLeftIcon: false,
                investorPageValid: true,
                showInvestorType: true
            })
        } else if (this.state.investorType === 'LLC') {
            this.setState({
                showLLCInvestorInfoPage1: true,
                enableLeftIcon: false,
                investorPageValid: true,
                showInvestorType: true
            })
        } else if (this.state.investorType === 'Trust') {
            let obj = this.state.lpsubscriptionTotalObj;
            obj['currentInvestorInfoPageNumber'] = 1;
            obj['currentPage'] = 'investorInfo';
            obj['currentPageCount'] = 1;
            PubSub.publish('investorData', obj);
            if (this.state.investorSubType == 9) {
                this.setState({
                    showTrustRevocableInvestorPage1: true,
                    enableLeftIcon: false,
                    investorPageValid: true,
                    showInvestorType: true
                })
            } else {
                this.setState({
                    showTrustIrrevocableInvestorPage1: true,
                    enableLeftIcon: false,
                    investorPageValid: true,
                    showInvestorType: true
                })
            }

        }
    }

    //Proceed to next for all investor types
    proceedToNext() {
        if (this.state.investorType === 'Individual') {
            this.invidualNextStep();
        } else if (this.state.investorType === 'LLC') {
            this.LLCNextStep();
        } else if (this.state.investorType === 'Trust') {
            this.trustNextStep();
        }
    }

    //Open modal if investor type is individual  in investor information step1
    //For step2 call the submitStep2Details method.
    invidualNextStep() {
        if (this.state.showIndividualStep1) {
            this.openStartConfirmationModal();
        } else {
            this.submitStep2Details()
        }
    }

    //Submit investor info step2 details.
    submitStep2Details() {
        // if (this.state.mailingAddressPhoneNumber.length < 12 || this.state.mailingAddressPhoneNumber.length > 13) {
        //     this.setState({
        //         cellNumberMsz: this.Constants.CELL_NUMBER_VALID
        //     })
        // } else {
        let postobj = { investorType: this.state.investorType, subscriptonId: this.state.lpsubscriptionTotalObj.id, step: 2, mailingAddressStreet: this.state.mailingAddressStreet, mailingAddressCountry: this.state.mailingAddressCountry, mailingAddressCity: this.state.mailingAddressCity, mailingAddressState: this.state.mailingAddressState, mailingAddressZip: this.state.mailingAddressZip, mailingAddressPhoneNumber: this.state.mailingAddressPhoneNumber }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postobj, headers).then(result => {
            this.close();
            if (result.data) {
                this.props.history.push('/lp/AccreditedInvestor/' + this.state.lpsubscriptionTotalObj.id);
            }
        })
            .catch(error => {
                this.close();
                if (error.response !== undefined && error.response.data !== undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        investorInfoErrorMsz: error.response.data.errors[0].msg,
                    });
                } else {
                    this.setState({
                        investorInfoErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                    });
                }
            });

        // }
    }

    //For llc call LLC step 1 and step2 methods.
    LLCNextStep() {
        if (this.state.showLLCInvestorInfoPage1) {
            let value = this.llcStep1Validations();
            if (!value) {
                this.openStartConfirmationModal();
            }
        } else {
            this.submitStep2Details()
        }
    }

    submitTrustForm(stepType) {
        let postInvestorObj;
        console.log('step type::::', stepType);
        // if(thi.state.investorSubType == 9) {
        postInvestorObj = {
            subscriptonId: this.state.lpsubscriptionTotalObj.id,
            step: this.state[stepType] ? 1 : 2,
            fundId: this.state.fundId,
            investorType: this.state.investorType,
            investorSubType: this.state.investorSubType,
            numberOfGrantorsOfTheTrust: this.state.numberOfGrantorsOfTheTrust ? this.state.numberOfGrantorsOfTheTrust : 0,
            trustLegallyDomiciled: this.state.trustLegallyDomiciled ? this.state.trustLegallyDomiciled : 0,
            selectState: this.state.selectState ? this.state.selectState : 0,
            trustName: this.state.trustName,
            entityName: this.state.entityName,
            isEntityTaxExemptForUSFederalIncomeTax: this.state.isEntityTaxExemptForUSFederalIncomeTax || false,
            releaseInvestmentEntityRequired: this.state.releaseInvestmentEntityRequired || false,
            isSubjectToDisqualifyingEvent: this.state.isSubjectToDisqualifyingEvent || false,
            fundManagerInfo: this.state.fundManagerInfo,
            isEntityUS501c3: this.state.isEntityUS501c3 || false,
            isTrust501c3: this.state.isTrust501c3 || false,
            otherInvestorAttributes: this.state.otherInvestorAttributes.join(','),
            // istheEntityFundOfFundsOrSimilarTypeVehicle: this.state.istheEntityFundOfFundsOrSimilarTypeVehicle || false,
            mailingAddressStreet: this.state.mailingAddressStreet,
            mailingAddressCity: this.state.mailingAddressCity,
            mailingAddressCountry: this.state.mailingAddressCountry,
            mailingAddressState: this.state.mailingAddressState,
            mailingAddressZip: this.state.mailingAddressZip,
            legalTitleDesignation: this.state.legalTitleDesignation,
            mailingAddressPhoneNumber: this.state.mailingAddressPhoneNumber,
        }
        // }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postInvestorObj, headers).then(result => {
            this.close();
            if (result.data) {
                this.setState({
                    lpsubscriptionTotalObj: this.FsnetUtil.decodeObj(result.data.data)
                }, () => {
                    if (this.state[stepType] == 1) {
                        let obj = this.state.lpsubscriptionTotalObj;
                        obj['currentInvestorInfoPageNumber'] = 2;
                        obj['currentPage'] = 'investorInfo';
                        obj['currentPageCount'] = 1;
                        obj['mailingAddressCountry'] = !obj.mailingAddressCountry ? obj.trustLegallyDomiciled : obj.mailingAddressCountry;
                        obj['mailingAddressState'] = !obj.mailingAddressState ? obj.selectState : obj.mailingAddressState;
                        PubSub.publish('investorData', obj);
                        if (obj.mailingAddressCountry) {
                            this.getStatesByCountry(obj.mailingAddressCountry);
                        }
                        this.setState({
                            showInvestorType: false,
                            enableLeftIcon: true,
                            investorPageValid: false,
                            [stepType]: !this.state[stepType],
                            investorInfoErrorMsz: ''
                        }, () => {

                            this.validateTrustPages();
                        });
                        // this.enableNextButtonStep2()
                        this.updateInvestorInputFields(this.state.lpsubscriptionTotalObj);
                    }
                    else {
                        this.props.history.push('/lp/AccreditedInvestor/' + this.state.lpsubscriptionTotalObj.id);
                    }
                });
                this.closeConfirmationModal();
            }
        })
            .catch(error => {
                this.close();
                this.closeConfirmationModal();
                if (error.response !== undefined && error.response.data !== undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        investorInfoErrorMsz: error.response.data.errors[0].msg,
                    });
                } else {
                    this.setState({
                        investorInfoErrorMsz: this.Constants.INTERNAL_SERVER_ERROR,
                    });
                }
            });
        // let obj = this.state.lpsubscriptionTotalObj;
        // obj['currentInvestorInfoPageNumber'] = 2;
        // obj['currentPage'] = 'investorInfo';
        // obj['currentPageCount'] = 1;
        // PubSub.publish('investorData', obj);
        // this.setState({
        //     showInvestorType: false,
        //     enableLeftIcon: true,
        //     investorPageValid: false,
        //     [stepType] : !this.state[stepType]
        // }, () => {
        //     this.validateTrustPages();
        // });
    }

    //For trust call LLC step 1 and step2 methods.
    trustNextStep() {
        if (this.state.investorSubType == 9) {
            if (this.state.showTrustRevocableInvestorPage1) {
                this.setState({
                    showConfirmationModal: true
                });
                // this.submitTrustForm('showTrustRevocableInvestorPage1');
            } else {
                this.submitTrustForm('showTrustRevocableInvestorPage1');
                // this.submitStep2Details();
            }
        } else {
            if (this.state.showTrustIrrevocableInvestorPage1) {
                this.setState({
                    showConfirmationModal: true
                });
                // this.submitTrustForm('showTrustIrrevocableInvestorPage1');
            } else {
                this.submitTrustForm('showTrustIrrevocableInvestorPage1');
            }
        }

    }


    confirmSubmit() {
        if (this.state.investorType && this.state.investorType.toLowerCase() == 'individual') {
            this.submitInvestorInfoStep1Details();
        }
        if (this.state.investorType && this.state.investorType.toLowerCase() == 'llc') {
            this.submitLLCInfoStep1Details();
        }
        if (this.state.investorType && this.state.investorType.toLowerCase() == 'trust') {
            this.submitTrustForm(this.state.investorSubType == 9 ? 'showTrustRevocableInvestorPage1' : 'showTrustIrrevocableInvestorPage1');
        }
        // this.closeConfirmationModal();
    }

    llcStep1Validations() {
        if (this.state.investorSubType === 'otherEntity') {
            if (this.state.otherInvestorSubType === '' || this.state.otherInvestorSubType === null) {
                this.setState({
                    otherInvestorSubTypeBorder: true,
                    otherInvestorSubTypeMsz: this.Constants.ENTITY_TYPE_REQUIRED
                })
                return true;
            }
        }

        if (this.state.isEntityTaxExemptForUSFederalIncomeTax === true) {
            if (this.state.isEntityUS501c3 === '' || this.state.isEntityUS501c3 === null) {
                this.setState({
                    isEntityUS501c3Msz: this.Constants.ENTITY_US_501_REQUIRED
                })
                return true;
            }
        }
        if (this.state.istheEntityFundOfFundsOrSimilarTypeVehicle === true) {
            if (this.state.isEntityTaxExemptForUSFederalIncomeTax === '' || this.state.isEntityTaxExemptForUSFederalIncomeTax === null) {
                this.setState({
                    isEntityTaxExemptForUSFederalIncomeTaxMsz: this.Constants.ENTITY_TAX_REQUIRED
                })
                return true;
            }

        }
        if (this.state.releaseInvestmentEntityRequired === true) {
            if (this.state.indirectBeneficialOwnersSubjectFOIAStatutes === '' || this.state.indirectBeneficialOwnersSubjectFOIAStatutes === null) {
                this.setState({
                    indirectBeneficialOwnersSubjectFOIAStatutesMsz: this.Constants.INDIRECT_BENIFICIAL_REQUIRED
                })
                return true;
            }

        }
        if (this.state.jurisdictionEntityLegallyRegistered == 231) {
            if (this.state.selectState === '' || this.state.selectState === null) {
                this.setState({
                    selectStateMsz: this.Constants.SELECT_STATE_REQUIRED
                })
                return true;
            }

        }
        return false;
    }

    //Submit LLC Step1 Details
    submitLLCInfoStep1Details() {
        let postInvestorObj = { subscriptonId: this.state.lpsubscriptionTotalObj.id, step: 1, fundId: this.state.fundId, investorType: this.state.investorType, investorSubType: this.state.investorSubType, jurisdictionEntityLegallyRegistered: this.state.jurisdictionEntityLegallyRegistered, entityName: this.state.entityName, istheEntityFundOfFundsOrSimilarTypeVehicle: this.state.istheEntityFundOfFundsOrSimilarTypeVehicle, releaseInvestmentEntityRequired: this.state.releaseInvestmentEntityRequired, isSubjectToDisqualifyingEvent: this.state.isSubjectToDisqualifyingEvent || false, fundManagerInfo: this.state.fundManagerInfo, isEntityTaxExemptForUSFederalIncomeTax: this.state.isEntityTaxExemptForUSFederalIncomeTax, otherInvestorAttributes: this.state.otherInvestorAttributes.join(',') }
        if (this.state.investorSubType === 'otherEntity') {
            postInvestorObj['investorSubType'] = null;
            postInvestorObj['otherInvestorSubType'] = this.state.otherInvestorSubType;
        } else {
            postInvestorObj['otherInvestorSubType'] = null;
        }
        if (this.state.istheEntityFundOfFundsOrSimilarTypeVehicle) {
            postInvestorObj['isEntityTaxExemptForUSFederalIncomeTax'] = this.state.isEntityTaxExemptForUSFederalIncomeTax;
        }
        if (this.state.releaseInvestmentEntityRequired) {
            postInvestorObj['indirectBeneficialOwnersSubjectFOIAStatutes'] = this.state.indirectBeneficialOwnersSubjectFOIAStatutes;
        }
        if (this.state.isEntityTaxExemptForUSFederalIncomeTax === true) {
            postInvestorObj['isEntityUS501c3'] = this.state.isEntityUS501c3;
        }
        if (this.state.jurisdictionEntityLegallyRegistered == 231) {
            postInvestorObj['selectState'] = this.state.selectState;
        }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postInvestorObj, headers).then(result => {
            this.close();
            if (result.data) {
                let obj = this.state.lpsubscriptionTotalObj;
                obj['currentInvestorInfoPageNumber'] = 2;
                obj['currentPage'] = 'investorInfo';
                obj['currentPageCount'] = 1;
                PubSub.publish('investorData', obj);
                this.setState({
                    showLLCInvestorInfoPage1: false,
                    showInvestorType: false,
                    enableLeftIcon: true,
                    investorPageValid: false
                })
                this.validateTrustPages();
                this.closeConfirmationModal();
            }
        })
            .catch(error => {
                this.close();
            });
    }


    //Submit Individual Step1 Details
    submitInvestorInfoStep1Details() {
        let postInvestorObj = { subscriptonId: this.state.lpsubscriptionTotalObj.id, step: 1, fundId: this.state.fundId, investorType: this.state.investorType, name: this.state.name, areYouSubscribingAsJointIndividual: this.state.areYouSubscribingAsJointIndividual, isSubjectToDisqualifyingEvent: this.state.isSubjectToDisqualifyingEvent || false, fundManagerInfo: this.state.fundManagerInfo }
        if (this.state.areYouSubscribingAsJointIndividual === true) {
            postInvestorObj['typeOfLegalOwnership'] = this.state.typeOfLegalOwnership
        }
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.updateLpSubscriptionDetails(postInvestorObj, headers).then(result => {
            this.close();
            if (result.data) {
                let obj = this.state.lpsubscriptionTotalObj;
                obj['currentInvestorInfoPageNumber'] = 2;
                obj['currentPage'] = 'investorInfo';
                obj['currentPageCount'] = 1;
                PubSub.publish('investorData', obj);
                this.setState({
                    showIndividualStep1: false,
                    enableLeftIcon: true,
                    showInvestorType: false
                })
                this.validateTrustPages();
                this.closeConfirmationModal();
            }
        })
            .catch(error => {
                this.close();
                this.setState({
                    showIndividualStep1: false,
                    enableLeftIcon: true
                })
                this.closeConfirmationModal();
            });
    }

    // Update state params values and login button visibility

    updateStateParams(updatedDataObject) {
        this.setState(updatedDataObject, () => {
            this.enableDisableInvestorDetailsButton();
        });
    }

    // Enable / Disble functionality of Investor Details next Button
    enableDisableInvestorDetailsButton1() {
        let status;
        if (this.state.investorType === 'Individual') {
            if (this.state.showIndividualStep1) {
                // status = (this.state.nameValid && this.state.typeOfLegalOwnershipValid && this.state.areYouSubscribingAsJointIndividualValid) ? true : false;
                status = (this.state.nameValid && this.state.areYouSubscribingAsJointIndividualValid && this.state.isSubjectToDisqualifyingEventValid) ? true : false;
            } else {
                status = (this.state.mailingAddressCityValid && this.state.mailingAddressStreetValid && this.state.mailingAddressStateValid && this.state.mailingAddressZipValid && this.state.mailingAddressPhoneNumberValid) ? true : false;
            }
        } else if (this.state.investorType === 'LLC') {
            if (this.state.showLLCInvestorInfoPage1) {
                status = (this.state.investorSubTypeValid && this.state.jurisdictionEntityLegallyRegisteredValid && this.state.entityNameValid && this.state.isEntityTaxExemptForUSFederalIncomeTaxValid && this.state.releaseInvestmentEntityRequiredValid && this.state.isSubjectToDisqualifyingEventValid && this.state.otherInvestorAttributesValid) ? true : false;
            } else {
                status = (this.state.mailingAddressCityValid && this.state.mailingAddressStreetValid && this.state.mailingAddressStateValid && this.state.mailingAddressZipValid && this.state.mailingAddressPhoneNumberValid) ? true : false;
            }
        }
        if (this.state.investorType != 'Trust') {
            this.setState({
                investorPageValid: status,
            }, () => {
                if (this.state.investorType == 'Individual') {
                    if (this.state.areYouSubscribingAsJointIndividual == true && !this.state.typeOfLegalOwnership) {
                        this.setState({
                            investorPageValid: false
                        })
                    }
                }
            });
        }
    }

    enableDisableInvestorDetailsButton() {
        let status;
        let validateValues = [];
        if (this.state.investorType === 'Individual') {
            if (this.state.showIndividualStep1) {
                // status = (this.state.nameValid && this.state.typeOfLegalOwnershipValid && this.state.areYouSubscribingAsJointIndividualValid) ? true : false;
                status = (this.state.nameValid && this.state.areYouSubscribingAsJointIndividualValid) ? true : false;
                validateValues = ['name', 'areYouSubscribingAsJointIndividual', 'isSubjectToDisqualifyingEvent'];
            } else {
                status = (this.state.mailingAddressCityValid && this.state.mailingAddressStreetValid && this.state.mailingAddressStateValid && this.state.mailingAddressZipValid) ? true : false;
                validateValues = ['mailingAddressCity', 'mailingAddressStreet', 'mailingAddressState', 'mailingAddressZip'];
            }
        } else if (this.state.investorType === 'LLC') {
            if (this.state.showLLCInvestorInfoPage1) {
                status = (this.state.investorSubTypeValid && this.state.jurisdictionEntityLegallyRegisteredValid && this.state.entityNameValid && this.state.isEntityTaxExemptForUSFederalIncomeTaxValid && this.state.releaseInvestmentEntityRequiredValid) ? true : false;
                validateValues = ['investorSubType', 'jurisdictionEntityLegallyRegistered', 'entityName', 'isEntityTaxExemptForUSFederalIncomeTax', 'releaseInvestmentEntityRequired', 'isSubjectToDisqualifyingEvent', 'otherInvestorAttributes'];
            } else {
                status = (this.state.mailingAddressCityValid && this.state.mailingAddressStreetValid && this.state.mailingAddressStateValid && this.state.mailingAddressZipValid) ? true : false;
                validateValues = ['mailingAddressCity', 'mailingAddressStreet', 'mailingAddressState', 'mailingAddressZip'];
            }
        }
        if (this.state.investorType != 'Trust') {
            let validCount = 0;
            for (let field of validateValues) {
                if (this.state[field] === null || this.state[field] === '' || this.state[field] === undefined || this.state[field] === 0) {
                    this.setState({
                        investorPageValid: false,
                        [field + 'Valid']: false
                    }, () => {
                        if (this.state.investorType == 'Individual') {
                            if (this.state.areYouSubscribingAsJointIndividual == true && !this.state.typeOfLegalOwnership) {
                                this.setState({
                                    investorPageValid: false
                                })
                            }
                        }
                    })
                    // break;
                } else {
                    if (field == 'trustLegallyDomiciled' && this.state[field] == 231 && (this.state['selectState'] === null || this.state['selectState'] === '' || this.state['selectState'] === undefined || this.state['selectState'] == 0)) {
                        this.setState({
                            investorPageValid: false,
                            [field + 'Valid']: false
                        }, () => {
                            if (this.state.investorType == 'Individual') {
                                if (this.state.areYouSubscribingAsJointIndividual == true && !this.state.typeOfLegalOwnership) {
                                    this.setState({
                                        investorPageValid: false
                                    })
                                }
                            }
                        })
                        // break;
                    } else if (field == 'otherInvestorAttributes' && this.state['otherInvestorAttributes'].length == 0) {
                        this.setState({
                            investorPageValid: false,
                            [field + 'Valid']: false
                        }, () => {
                            if (this.state.investorType == 'Individual') {
                                if (this.state.areYouSubscribingAsJointIndividual == true && !this.state.typeOfLegalOwnership) {
                                    this.setState({
                                        investorPageValid: false
                                    })
                                }
                            }
                        })
                    } else {
                        this.setState({
                            investorPageValid: true,
                            [field + 'Valid']: true
                        }, () => {
                            if (this.state.investorType == 'Individual') {
                                if (this.state.areYouSubscribingAsJointIndividual == true && !this.state.typeOfLegalOwnership) {
                                    this.setState({
                                        investorPageValid: false
                                    })
                                }
                            }
                        })
                        validCount++;
                    }
                }
            }
            if (validCount != validateValues.length) {
                this.setState({
                    investorPageValid: false
                }, () => {
                    if (this.state.investorType == 'Individual') {
                        if (this.state.areYouSubscribingAsJointIndividual == true && !this.state.typeOfLegalOwnership) {
                            this.setState({
                                investorPageValid: false
                            })
                        }
                    }
                })
            }
            // this.setState({
            //     investorPageValid: status,
            // }, () => {
            //     if(this.state.investorType == 'Individual') {
            //         if(this.state.areYouSubscribingAsJointIndividual == true && !this.state.typeOfLegalOwnership) {
            //             this.setState ({
            //                 investorPageValid: false
            //             })
            //         }
            //     }
            // });
        }
    }



    //  Trust Form Validations and Util Functions
    validateTrustPages() {
        let validValues = [];
        this.setState({
            investorInfoErrorMsz: ''
        })
        if (this.state.investorType == 'Trust') {
            if (this.state.investorSubType == 9) {
                if (this.state.showTrustRevocableInvestorPage1) {
                    validValues = ['email', 'trustName', 'trustLegallyDomiciled', 'isEntityTaxExemptForUSFederalIncomeTax', 'releaseInvestmentEntityRequired', 'isSubjectToDisqualifyingEvent', 'otherInvestorAttributes'];
                } else {
                    validValues = ['mailingAddressCity', 'mailingAddressStreet', 'mailingAddressCountry', 'mailingAddressState', 'mailingAddressZip'];
                }
            }
            if (this.state.investorSubType == 10) {
                if (this.state.showTrustIrrevocableInvestorPage1) {
                    validValues = ['email', 'trustName', 'trustLegallyDomiciled', 'isEntityTaxExemptForUSFederalIncomeTax', 'releaseInvestmentEntityRequired', 'isSubjectToDisqualifyingEvent', 'otherInvestorAttributes'];
                } else {
                    validValues = ['mailingAddressCity', 'mailingAddressStreet', 'mailingAddressCountry', 'mailingAddressState', 'mailingAddressZip', 'legalTitleDesignation'];
                }
            }
        } else {
            validValues = ['mailingAddressCity', 'mailingAddressStreet', 'mailingAddressCountry', 'mailingAddressState', 'mailingAddressZip'];
        }
        let validCount = 0;
        for (let field of validValues) {
            if (this.state[field] === null || this.state[field] === '' || this.state[field] === undefined || this.state[field] === 0) {
                this.setState({
                    investorPageValid: false,
                    [field + 'Valid']: false
                })
                break;
            } else {
                if (field == 'trustLegallyDomiciled' && this.state[field] == 231 && (this.state['selectState'] === null || this.state['selectState'] === '' || this.state['selectState'] === undefined || this.state['selectState'] == 0)) {
                    this.setState({
                        investorPageValid: false,
                        [field + 'Valid']: false
                    })
                    break;
                } else if (field == 'otherInvestorAttributes' && this.state['otherInvestorAttributes'].length == 0) {
                    this.setState({
                        investorPageValid: false,
                        [field + 'Valid']: false
                    })
                    break;
                } else {
                    this.setState({
                        investorPageValid: true,
                        [field + 'Valid']: true
                    })
                    validCount++;
                }
            }
        }
        // if (validCount != validValues.length) {
        //     this.setState({
        //         investorPageValid: false
        //     })
        // }

    }

    //  Trust Form Validations and Util Functions
    trustOnChangeForm(e, type, toValidate, key) {
        let name, value;
        this.setState({
            investorInfoErrorMsz: ''
        })
        if (type == 'mobile') {
            name = key ? key : 'mailingAddressPhoneNumber';
            value = e ? e.trim() : '';
        } else {
            name = e.target.name;
            if (e.target.value && e.target.value.trim() == '') {
                value = '';
            } else {
                value = e.target.value;
            }

        }
        switch (type) {
            case 'text':
                this.setState({
                    [name]: value ? ((value == 'true' || value == 'false') ? JSON.parse(value) : value) : '',
                    [name + 'Valid']: true,
                    [name + 'Touched']: true,
                    trustFormValid: toValidate ? (value ? true : false) : true
                }, () => {
                    if ((name == 'trustLegallyDomiciled' || name == 'mailingAddressCountry') && value == 231) {
                        this.getUSStates();
                    }
                    this.validateTrustPages();
                });
                break;
            case 'select':
                this.setState({
                    [name]: value ? parseInt(value) : '',
                    [name + 'Valid']: true,
                    [name + 'Touched']: true,
                    trustFormValid: toValidate ? (value ? true : false) : true
                }, () => {
                    if ((name == 'trustLegallyDomiciled' || name == 'mailingAddressCountry') && value == 0) {
                        this.setState({
                            usStatesList: [],
                            statesList: []
                        })
                    }
                    if (name == 'trustLegallyDomiciled' && value == 231) {
                        this.getUSStates();
                    }
                    if (name == 'mailingAddressCountry' && value != 0) {
                        this.setState({
                            mailingAddressState: 0
                        }, () => {
                            this.validateTrustPages();
                        })
                        this.getStatesByCountry(value);
                    }
                    this.validateTrustPages();
                });
                break;
            case 'mobile':
                this.setState({
                    [name]: value ? value : '',
                    [name + 'Valid']: true,
                    [name + 'Touched']: true,
                    trustFormValid: toValidate ? (value ? true : false) : true
                }, () => {
                    this.validateTrustPages();
                });
                break;
            case 'number':
                const re = /^[1-9]*$/;
                if (re.test(value.trim())) {
                    this.setState({
                        [name]: value ? parseInt(value) : '',
                        [name + 'Valid']: true,
                        [name + 'Touched']: true,
                        trustFormValid: toValidate ? (value ? true : false) : true
                    }, () => {
                        this.validateTrustPages();
                    })
                    return true;
                } else {
                    if (parseInt(value) < 0) {
                        this.setState({
                            [name + 'Valid']: false,
                            [name + 'Touched']: true,
                            trustFormValid: toValidate ? false : true
                        }, () => {
                            this.validateTrustPages();
                        })
                        return true;
                    }
                }
                break;
            case 'checkbox':
                console.log('checkbox selected text:::', name, value);
                let investorAttr = this.state.otherInvestorAttributes;
                if(investorAttr.indexOf(name) > -1) {
                    investorAttr.splice(investorAttr.indexOf(name), 1);
                } else {
                    investorAttr.push(name)
                }
                console.log('investor Attributes:::', investorAttr);
                // investorAttr.push(name);
                this.setState({
                    otherInvestorAttributes: investorAttr
                }, () => {
                    if(this.state.investorType == 'LLC') {
                        if(this.state.otherInvestorAttributes.length > 0) {
                            this.setState({
                                otherInvestorAttributesValid: true
                            });
                            let name = 'otherInvestorAttributes' + 'Valid'
                            let dataObj = {
                                [name]: true
                            };
                            this.updateStateParams(dataObj);    
                        } else {
                            this.setState({
                                otherInvestorAttributesValid: false
                            });
                            let name = 'otherInvestorAttributes' + 'Valid'
                            let dataObj = {
                                [name]: false
                            };
                            this.updateStateParams(dataObj);
                        }
                    } else {
                        this.validateTrustPages();
                    }
                })
                break;
            default:
                break;

        }
        // this.validateTrustPages();
    }


    valueTouched(e, type) {
        const name = e.target.name;
        this.setState({
            [name + 'Touched']: true
        })
    }

    // //Show Tooltip Modal
    openSecurityTooltipModal() {
        PubSub.publish('openModal', { investorType: this.state.investorType, investorSubType: this.state.investorSubType, modalType: 'actModalWindow', type: 'security' });
        // this.setState({ showSecurityTooltipModal: true });
    }

    // //Show Tooltip Modal
    openDisqualifingEventModal() {
        PubSub.publish('openModal', { investorType: this.state.investorType, investorSubType: this.state.investorSubType, modalType: 'disqualifingEvent', type: 'disqualifingEventModal' });
        // this.setState({ showSecurityTooltipModal: true });
    }

    isNumberKey(event) {
        // const re = /^[0-9\b]+$/;
        // if (e.target.value != '' || !re.test(e.target.value)) {
        //     e.preventDefault();
        // }
        if (((event.which != 46 || (event.which == 46 && event.target.value == '')) ||
            event.target.value.indexOf('.') >= 0) && (event.which < 48 || event.which > 57)) {
            event.preventDefault();
        }
      }

    render() {

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

        return (
            <div className="individualForm">
                <div className="form-grid formGridDivMargin min-height-400">
                    <div id="individualForm">
                        {
                            this.state.showInvestorType ?
                                <div>
                                    <div className="title">Investor Information</div>
                                    <Row className="step1Form-row">
                                        <Col xs={12} md={12}>
                                            <label className="form-label width100">Investor Type</label>
                                            <Radio name="investorType" inline checked={this.state.investorType === 'LLC'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'LLC', 'investorType')}>&nbsp; Entity
                                        <span className="radio-checkmark"></span>
                                            </Radio>
                                            <Radio name="investorType" className="marginRight10" inline checked={this.state.investorType === 'Individual'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'Individual', 'investorType')}>&nbsp; Individual or Joint Individual
                                        <span className="radio-checkmark"></span>
                                            </Radio>
                                            <Radio name="investorType" inline checked={this.state.investorType === 'Trust'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'Trust', 'investorType')}>&nbsp; Trust
                                        <span className="radio-checkmark"></span>
                                            </Radio>
                                        </Col>
                                    </Row>
                                    <div className="individual" hidden={this.state.investorType !== 'Individual'}>
                                        <Row className="step1Form-row">
                                            <Col lg={6} md={6} sm={6} xs={12}>
                                                <label className="form-label">Email Address</label>
                                                <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className="inputFormControl" readOnly value={this.state.email} />
                                            </Col>
                                            <Col xs={6} md={6}>
                                                <label className="form-label">Enter your name &nbsp;
                                            <span>
                                                        <LinkWithTooltip tooltip="Please use your full legal name.  This name will appear in the Fund’s records and on tax reporting information. If subscribing as joint individuals, please enter the exact legal name such as John and Linda Smith, Tenants in Common; please consult your legal or estate planning advisor if you are uncertain under precisely what name to hold legal title as joint individuals." id="tooltip-1">
                                                            <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                        </LinkWithTooltip>
                                                    </span>
                                                </label>
                                                <FormControl type="text" placeholder="Enter your name" className={"inputFormControl " + (this.state.nameBorder ? 'inputError' : '')} value={this.state.name} onChange={(e) => this.investorHandleChangeEvent(e, 'name', 'NAME_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e, 'name', 'NAME_REQUIRED')} />
                                                <span className="error">{this.state.nameMsz}</span>
                                            </Col>
                                        </Row>
                                        <Row className="step1Form-row">
                                            <Col xs={12} md={12}>
                                                <label className="form-label width100">Are you subscribing as joint individuals with your spouse, such as community property or tenants in common?</label>
                                                <Radio name="jointIndividual" inline checked={this.state.areYouSubscribingAsJointIndividual === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'areYouSubscribingAsJointIndividual')}>&nbsp; Yes
                                            <span className="radio-checkmark"></span>
                                                </Radio>
                                                <Radio name="jointIndividual" inline checked={this.state.areYouSubscribingAsJointIndividual === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'areYouSubscribingAsJointIndividual')}>&nbsp; No
                                            <span className="radio-checkmark"></span>
                                                </Radio>
                                            </Col>
                                        </Row>
                                        {/* <Row className="step1Form-row" hidden={this.state.areYouSubscribingAsJointIndividual === false || this.state.areYouSubscribingAsJointIndividual === null}>
                                        <Col xs={6} md={6}>
                                            <label className="form-label">Enter Your Spouse’s Name &nbsp;
                                            <span>
                                                <LinkWithTooltip tooltip="Please use your spouse’s full legal name.  This name will appear in the Fund’s records and on tax reporting information." href="#" id="tooltip-1">
                                                <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                </LinkWithTooltip>
                                            </span>  
                                            </label>
                                            <FormControl type="text" defaultValue=""  value={this.state.spouseName} onChange={(e) => this.investorHandleChangeEvent(e,'spouseName')}placeholder="Enter Your Spouse’s Name" className="inputFormControl"/>
                                        </Col>
                                    </Row> */}
                                        <Row className="step1Form-row" hidden={this.state.areYouSubscribingAsJointIndividual !== true}>
                                            <Col xs={12} md={12}>
                                                <label className="form-label width100">Indicate the Type of Legal Ownership Desired</label>
                                                <Radio name="ownershipType" className="right-gap" inline checked={this.state.typeOfLegalOwnership === 'communityProperty'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'communityProperty', 'typeOfLegalOwnership')}>&nbsp; Community Property
                                            <span className="radio-checkmark"></span>
                                                </Radio>
                                                <Radio name="ownershipType" className="right-gap" inline checked={this.state.typeOfLegalOwnership === 'tenantsInCommon'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'tenantsInCommon', 'typeOfLegalOwnership')}>&nbsp; Tenants in Common
                                            <span className="radio-checkmark"></span>
                                                </Radio>
                                                <Radio name="ownershipType" className="right-gap" inline checked={this.state.typeOfLegalOwnership === 'jointTenants'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'jointTenants', 'typeOfLegalOwnership')}>&nbsp; Joint Tenants
                                            <span className="radio-checkmark"></span>
                                                </Radio>
                                                <Radio name="ownershipType" className="right-gap" inline checked={this.state.typeOfLegalOwnership === 'Other'} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', 'Other', 'typeOfLegalOwnership')}>&nbsp; Other
                                            <span className="radio-checkmark"></span>
                                                </Radio>
                                            </Col>
                                        </Row>
                                        <Row className="step1Form-row">
                                            <Col xs={12} md={12}>
                                                <label className="form-label width100 block">Has the Investor or any of its Beneficial Owners been subject to a <span className="helpWord" onClick={this.openDisqualifingEventModal}>Disqualifying Event</span> for purpose of Regulation D of Rule 506(d) promulgated under the <span className="helpWord" onClick={this.openSecurityTooltipModal}>Securities Act</span>?</label>
                                                <Radio name="isSubjectToDisqualifyingEvent2" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.isSubjectToDisqualifyingEvent == true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'isSubjectToDisqualifyingEvent')}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                                </Radio>
                                                <Radio name="isSubjectToDisqualifyingEvent2" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.isSubjectToDisqualifyingEvent == false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'isSubjectToDisqualifyingEvent')}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                                </Radio>
                                            </Col>
                                        </Row>
                                        <Row className="step1Form-row">
                                            <Col xs={12} md={12}>
                                                <label className="form-label width100 block">The Investor has other information to disclose to the Fund Manager in connection with the investment:</label>
                                                <FormControl componentClass="textarea" placeholder="Fund Manager Information" name="fundManagerInfo" value={this.state.fundManagerInfo} className="inputFormControl textarea col-md-4" onChange={(e) => this.investorHandleChangeEvent(e, 'fundManagerInfo', 'NAME_REQUIRED')} onBlur={(e) => this.valueTouched(e)} />
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                :
                                <div>
                                    <div className="individual" hidden={this.state.investorType !== 'Individual'}>
                                        <Row className="step1Form-row">
                                            <Col xs={12} md={12}>
                                                <label className="title">Enter the Investor’s mailing address</label>
                                            </Col>
                                        </Row>
                                        <Row className="step1Form-row">
                                            <Col xs={6} md={6}>
                                                <label className="form-label">Address</label>
                                                <FormControl componentClass="textarea" placeholder="Address" name="mailingAddressStreet" value={this.state.mailingAddressStreet} className={"inputFormControl textarea " + (this.state.mailingAddressStreetTouched && !this.state.mailingAddressStreet ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                {this.state.mailingAddressStreetTouched && !this.state.mailingAddressStreet ? <span className="error">{this.Constants.STREET_REQUIRED}</span> : null}
                                            </Col>

                                        </Row>
                                        <Row className="step1Form-row">
                                            <Col xs={6} md={6}>
                                                <label className="form-label">City</label>
                                                <FormControl type="text" placeholder="City" name="mailingAddressCity" value={this.state.mailingAddressCity} className={"inputFormControl " + (this.state.mailingAddressCityTouched && !this.state.mailingAddressCity ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                {this.state.mailingAddressCityTouched && !this.state.mailingAddressCity ? <span className="error">{this.Constants.CITY_REQUIRED}</span> : null}
                                            </Col>
                                            <Col md={6} xs={6}>
                                                <label className="form-label">Country</label>
                                                <FormControl name='mailingAddressCountry' defaultValue={0} value={this.state.mailingAddressCountry} className={"selectFormControl " + (this.state.mailingAddressCountryTouched && this.state.mailingAddressCountry == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => { this.trustOnChangeForm(e, 'select', true); this.setState({ state: 0, stateTouched: false }) }} onBlur={(e) => this.valueTouched(e)}>
                                                    <option value={0}>Select Country</option>
                                                    {this.state.countriesList.map((record, index) => {
                                                        return (
                                                            <option value={record['id']} key={index} >{record['name']}</option>
                                                        );
                                                    })}
                                                </FormControl>
                                                {this.state.mailingAddressCountryTouched && this.state.mailingAddressCountry == 0 ? <span className="error">{this.Constants.COUNTRY_REQUIRED}</span> : null}
                                            </Col>

                                        </Row>
                                        <Row className="step1Form-row">
                                            <Col md={6} xs={6}>
                                                <label className="form-label">State</label>
                                                <FormControl name='mailingAddressState' defaultValue={0} value={this.state.mailingAddressState} className={"selectFormControl " + (this.state.mailingAddressStateTouched && this.state.mailingAddressState == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.trustOnChangeForm(e, 'select', this.state.mailingAddressCountry == 231 ? true : false)} onBlur={(e) => this.valueTouched(e)}>
                                                    <option value={0}>Select State</option>
                                                    {this.state.statesList.map((record, index) => {
                                                        return (
                                                            <option value={record['id']} key={index} >{record['name']}</option>
                                                        );
                                                    })}
                                                </FormControl>
                                                {this.state.mailingAddressStateTouched && this.state.mailingAddressState == 0 ? <span className="error">{this.Constants.STATE_REQUIRED}</span> : null}
                                            </Col>
                                            <Col xs={6} md={6}>
                                                <label className="form-label">Zip Code</label>
                                                <FormControl type="text" placeholder="Zip Code" name="mailingAddressZip" onKeyPress={(e) => {this.isNumberKey(e)}} value={this.state.mailingAddressZip} className={"inputFormControl " + (this.state.mailingAddressZipTouched && !this.state.mailingAddressZip ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                {this.state.mailingAddressZipTouched && !this.state.mailingAddressZip ? <span className="error">{this.Constants.ZIP_REQUIRED}</span> : null}
                                            </Col>
                                        </Row>
                                        <Row className="step1Form-row">
                                            <Col xs={6} md={6}>
                                                <label className="form-label">Enter the Individual’s primary business telephone number</label>
                                                <PhoneInput name="mailingAddressPhoneNumber" value={this.state.mailingAddressPhoneNumber} onChange={e => { this.trustOnChangeForm(e, 'mobile', false, 'mailingAddressPhoneNumber') }} maxLength="14" placeholder="(123) 456-7890" country="US" />
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                        }



                        <div className="LLC" hidden={this.state.investorType !== 'LLC'}>
                            <div hidden={!this.state.showLLCInvestorInfoPage1}>
                                <Row className="step1Form-row">
                                    <Col lg={6} md={6} sm={6} xs={12}>
                                        <label className="form-label">Type of Entity:</label>
                                        <FormControl defaultValue="0" value={this.state.investorSubType} componentClass="select" placeholder="Select Investor Sub Type" className={"selectFormControl " + (this.state.investorSubTypeBorder ? 'inputError' : '')} onChange={(e) => this.investorHandleChangeEvent(e, 'investorSubType', 'INVESTOR_SUB_TYPE_REQUIRED')}>
                                            <option value="0">Select Type of Entity</option>
                                            {this.state.investorSubTypes.map((record, index) => {
                                                return (
                                                    <option isUS={record['isUS']} value={record['id']} key={index} >{record['name']}</option>
                                                );
                                            })}
                                            <option value="otherEntity" isUS='1'>Other</option>
                                        </FormControl>
                                        <span className="error">{this.state.investorSubTypeMsz}</span>
                                    </Col>
                                    <Col xs={6} md={6} hidden={this.state.investorSubType !== 'otherEntity'}>
                                        <label className="form-label">Enter the Entity Type:
                                        </label>
                                        <FormControl type="text" placeholder="Enter the Entity Type" className={"inputFormControl " + (this.state.otherInvestorSubTypeBorder ? 'inputError' : '')} value={this.state.otherInvestorSubType} onChange={(e) => this.investorHandleChangeEvent(e, 'otherInvestorSubType', 'ENTITY_TYPE_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e, 'otherInvestorSubType', 'ENTITY_TYPE_REQUIRED')} />
                                        <span className="error">{this.state.otherInvestorSubTypeMsz}</span>
                                    </Col>

                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">In what jurisdiction is the Entity legally registered?</label>
                                        <FormControl defaultValue="0" value={this.state.jurisdictionEntityLegallyRegistered} componentClass="select" placeholder="Select Jurisdiction" className={"selectFormControl " + (this.state.jurisdictionEntityLegallyRegisteredBorder ? 'inputError' : '')} onChange={(e) => this.investorHandleChangeEvent(e, 'jurisdictionEntityLegallyRegistered', 'JURIDICTION_REQUIRED')}>
                                            <option value="0">Select Jurisdiction</option>
                                            {this.state.investorJurisdictionTypes.map((record, index) => {
                                                return (
                                                    <option value={record['id']} key={index}>{record['name']}</option>
                                                );
                                            })}
                                        </FormControl>
                                        <span className="error">{this.state.jurisdictionEntityLegallyRegisteredMsz}</span>
                                    </Col>
                                    <Col xs={6} md={6} hidden={this.state.jurisdictionEntityLegallyRegistered != 231}>
                                        <label className="form-label">What State is the entity registered in?</label>
                                        <FormControl defaultValue="0" componentClass="select" value={this.state.selectState} placeholder="Select State" className={"selectFormControl " + (this.state.selectStateBorder ? 'inputError' : '')} onChange={(e) => this.investorHandleChangeEvent(e, 'selectState', 'SELECT_STATE_REQUIRED')}>
                                            <option value="0">Select State</option>
                                            {this.state.usStatesList.map((record, index) => {
                                                return (
                                                    <option value={record['id']} key={index}>{record['name']}</option>
                                                );
                                            })}
                                        </FormControl>
                                        <span className="error">{this.state.selectStateMsz}</span>
                                    </Col>

                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Email Address</label>
                                        <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className="inputFormControl" readOnly value={this.state.email} />
                                        <span className="error"></span>
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label ">Enter the Entity’s full legal name &nbsp;
                                        <span>
                                                <LinkWithTooltip tooltip="Please enter the exact, complete name in which the Entity will hold legal title. This name will appear in the Fund’s records and on tax reporting information." id="tooltip-1">
                                                    <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                </LinkWithTooltip>
                                            </span>
                                        </label>
                                        <FormControl type="text" placeholder="Enter the Entity’s Name" className={"inputFormControl " + (this.state.entityNameBorder ? 'inputError' : '')} value={this.state.entityName} onChange={(e) => this.investorHandleChangeEvent(e, 'entityName', 'ENTITY_NAME_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e, 'entityName', 'ENTITY_NAME_REQUIRED')} />
                                        <span className="error">{this.state.entityNameMsz}</span>
                                    </Col>

                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label block">Is the Entity a fund-of-funds or a similar type vehicle?</label>
                                        <Radio name="entityFundOfFundsOrSimilarTypeVehicle1" className="radioSmallTxtWidth" inline checked={this.state.istheEntityFundOfFundsOrSimilarTypeVehicle === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'istheEntityFundOfFundsOrSimilarTypeVehicle')}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="entityFundOfFundsOrSimilarTypeVehicle1" className="radioSmallTxtWidth" inline checked={this.state.istheEntityFundOfFundsOrSimilarTypeVehicle === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'istheEntityFundOfFundsOrSimilarTypeVehicle')}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>

                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label block">Is the Entity tax exempt for U.S. federal income tax purposes</label>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline checked={this.state.isEntityTaxExemptForUSFederalIncomeTax === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'isEntityTaxExemptForUSFederalIncomeTax')}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="taxExempt" className="radioSmallTxtWidth" inline checked={this.state.isEntityTaxExemptForUSFederalIncomeTax === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'isEntityTaxExemptForUSFederalIncomeTax')}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <div className="error">{this.state.isEntityTaxExemptForUSFederalIncomeTaxMsz}</div>
                                    </Col>
                                    <Col xs={6} md={6} hidden={this.state.isEntityTaxExemptForUSFederalIncomeTax !== true}>
                                        <label className="form-label block">Is the Entity a U.S. 501(c)(3)?</label>
                                        <Radio name="entityUS501" className="radioSmallTxtWidth" inline checked={this.state.isEntityUS501c3 === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'isEntityUS501c3')}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="entityUS501" className="radioSmallTxtWidth" inline checked={this.state.isEntityUS501c3 === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'isEntityUS501c3')}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <div className="error">{this.state.isEntityUS501c3Msz}</div>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}>
                                        <label className="form-label width100">Is it the case that either (x) the Entity or (y) any of the Entity’s direct or indirect beneficial owners are required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide.</label>
                                        <Radio name="releaseInvestmentEntityRequired" className="radioSmallTxtWidth" inline checked={this.state.releaseInvestmentEntityRequired === true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'releaseInvestmentEntityRequired')}>&nbsp; Yes
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="releaseInvestmentEntityRequired" className="radioSmallTxtWidth" inline checked={this.state.releaseInvestmentEntityRequired === false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'releaseInvestmentEntityRequired')}>&nbsp; No
                                        <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row" hidden={!this.state.releaseInvestmentEntityRequired}>
                                    <Col xs={12} md={12}>
                                        <label className="form-label width100">Please describe the manner in which the Entity or its direct or indirect beneficial owners are subject to FOIA or similar statutes.</label>
                                    </Col>
                                    {/* //indirectBeneficialOwnersSubjectFOIAStatutes */}
                                    <Col xs={6} md={6}>
                                        <FormControl type="text" className={"inputFormControl " + (this.state.indirectBeneficialOwnersSubjectFOIAStatutesBorder ? 'inputError' : '')} value={this.state.indirectBeneficialOwnersSubjectFOIAStatutes} onChange={(e) => this.investorHandleChangeEvent(e, 'indirectBeneficialOwnersSubjectFOIAStatutes', 'INDIRECT_BENIFICIAL_REQUIRED')} onBlur={(e) => this.investorHandleChangeEvent(e, 'indirectBeneficialOwnersSubjectFOIAStatutes', 'INDIRECT_BENIFICIAL_REQUIRED')} />
                                        <span className="error">{this.state.indirectBeneficialOwnersSubjectFOIAStatutesMsz}</span>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}>
                                        <label className="form-label width100 block">Has the Investor or any of its Beneficial Owners been subject to a <span className="helpWord" onClick={this.openDisqualifingEventModal}>Disqualifying Event</span> for purpose of Regulation D of Rule 506(d) promulgated under the <span className="helpWord" onClick={this.openSecurityTooltipModal}>Securities Act</span>?</label>
                                        <Radio name="isSubjectToDisqualifyingEvent1" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.isSubjectToDisqualifyingEvent == true} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', true, 'isSubjectToDisqualifyingEvent')}>&nbsp; Yes
                                <span className="radio-checkmark"></span>
                                        </Radio>
                                        <Radio name="isSubjectToDisqualifyingEvent1" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.isSubjectToDisqualifyingEvent == false} onChange={(e) => this.investorHandleChangeEvent(e, 'radio', false, 'isSubjectToDisqualifyingEvent')}>&nbsp; No
                                <span className="radio-checkmark"></span>
                                        </Radio>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}>
                                        <label className="form-label width100 block">The Investor has other information to disclose to the Fund Manager in connection with the investment:</label>
                                        <FormControl componentClass="textarea" placeholder="Fund Manager Information" name="fundManagerInfo" value={this.state.fundManagerInfo} className="inputFormControl textarea col-md-4" onChange={(e) => this.investorHandleChangeEvent(e, 'fundManagerInfo', 'NAME_REQUIRED')} onBlur={(e) => this.valueTouched(e)} />
                                    </Col>
                                </Row>
                                <Row className="step1lastCheckBox">
                                    <label className="form-label width100 step1PaddingLeft15">Please select any of the following that apply:</label>
                                    <Row className="step1PaddingLeft15">
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Tax-Exempt Organization" checked={this.state.otherInvestorAttributes.indexOf('Tax-Exempt Organization') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Tax-Exempt Organization</span>
                                            </CBox>
                                        </Col>
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Employee Benefit Plan" checked={this.state.otherInvestorAttributes.indexOf('Employee Benefit Plan') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Employee Benefit Plan</span>
                                            </CBox>
                                        </Col>
                                    </Row>
                                    <Row className="step1PaddingLeft15">
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="ERISA Partner" checked={this.state.otherInvestorAttributes.indexOf('ERISA Partner') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">ERISA Partner</span>
                                            </CBox>
                                        </Col>
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Bank Holding Company" checked={this.state.otherInvestorAttributes.indexOf('Bank Holding Company') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Bank Holding Company</span>
                                            </CBox>
                                        </Col>
                                    </Row>
                                    <Row className="step1PaddingLeft15">
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Foreign Government Entity" checked={this.state.otherInvestorAttributes.indexOf('Foreign Government Entity') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Foreign Government Entity</span>
                                            </CBox>
                                        </Col>
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Governmental Pension Plan" checked={this.state.otherInvestorAttributes.indexOf('Governmental Pension Plan') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Governmental Pension Plan</span>
                                            </CBox>
                                        </Col>
                                    </Row>
                                    <Row className="step1PaddingLeft15">
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Non-Pension Governmental Entity" checked={this.state.otherInvestorAttributes.indexOf('Non-Pension Governmental Entity') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Non-Pension Governmental Entity</span>
                                            </CBox>
                                        </Col>
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Private Pension Plan" checked={this.state.otherInvestorAttributes.indexOf('Private Pension Plan') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Private Pension Plan</span>
                                            </CBox>
                                        </Col>
                                    </Row>
                                    <Row className="step1PaddingLeft15">
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Fund of Funds" checked={this.state.otherInvestorAttributes.indexOf('Fund of Funds') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Fund of Funds</span>
                                            </CBox>
                                        </Col>
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Insurance Company" checked={this.state.otherInvestorAttributes.indexOf('Insurance Company') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Insurance Company</span>
                                            </CBox>
                                        </Col>
                                    </Row>
                                    <Row className="step1PaddingLeft15">
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Private Foundation" checked={this.state.otherInvestorAttributes.indexOf('Private Foundation') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Private Foundation</span>
                                            </CBox>
                                        </Col>
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="501(c)(3)" checked={this.state.otherInvestorAttributes.indexOf('501(c)(3)') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">501(c)(3)</span>
                                            </CBox>
                                        </Col>
                                    </Row>
                                    <Row className="step1PaddingLeft15">
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Investment Company Registered with SEC" checked={this.state.otherInvestorAttributes.indexOf('Investment Company Registered with SEC') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Investment Company Registered with SEC</span>
                                            </CBox>
                                        </Col>
                                        <Col md={6} sm={6} xs={6}>
                                            <CBox inline className="cBoxFullAlign" name="Broker-Dealer" checked={this.state.otherInvestorAttributes.indexOf('Broker-Dealer') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                <span className="checkbox-checkmark checkmark"></span>
                                                <span className="marginLeft6 otherInvesterFontSize">Broker-Dealer</span>
                                            </CBox>
                                        </Col>
                                    </Row>
                                    {/*<Col md={6} sm={12} xs={12}>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Tax-Exempt Organization</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">ERISA Partner</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Foreign Government Entity </span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Non-Pension Governmental Entity</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Fund of Funds</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Private Foundation</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Investment Company Registered with SEC</span>    
                                        </CBox>
                                    </Col>
                                    <Col md={6} sm={12} xs={12}>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Employee Benefit Plan</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Bank Holding Company</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize"> Governmental Pension Plan</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Private Pension Plan</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Insurance Company</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">501(c)(3)</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Broker-Dealer</span>    
                                        </CBox>
                                    </Col>*/}
                                </Row>
                            </div>
                            <div hidden={this.state.showLLCInvestorInfoPage1}>
                                <Row className="step1Form-row">
                                    <Col xs={12} md={12}>
                                        <label className="title">Enter the Entity’s primary business mailing address</label>
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Address</label>
                                        <FormControl componentClass="textarea" placeholder="Address" name="mailingAddressStreet" value={this.state.mailingAddressStreet} className={"inputFormControl textarea " + (this.state.mailingAddressStreetTouched && !this.state.mailingAddressStreet ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                        {this.state.mailingAddressStreetTouched && !this.state.mailingAddressStreet ? <span className="error">{this.Constants.STREET_REQUIRED}</span> : null}
                                    </Col>

                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">City</label>
                                        <FormControl type="text" placeholder="City" name="mailingAddressCity" value={this.state.mailingAddressCity} className={"inputFormControl " + (this.state.mailingAddressCityTouched && !this.state.mailingAddressCity ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                        {this.state.mailingAddressCityTouched && !this.state.mailingAddressCity ? <span className="error">{this.Constants.CITY_REQUIRED}</span> : null}
                                    </Col>
                                    <Col md={6} xs={6}>
                                        <label className="form-label">Country</label>
                                        <FormControl name='mailingAddressCountry' defaultValue={0} value={this.state.mailingAddressCountry} className={"selectFormControl " + (this.state.mailingAddressCountryTouched && this.state.mailingAddressCountry == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => { this.trustOnChangeForm(e, 'select', true); this.setState({ state: 0, stateTouched: false }) }} onBlur={(e) => this.valueTouched(e)}>
                                            <option value={0}>Select Country</option>
                                            {this.state.countriesList.map((record, index) => {
                                                return (
                                                    <option value={record['id']} key={index} >{record['name']}</option>
                                                );
                                            })}
                                        </FormControl>
                                        {this.state.mailingAddressCountryTouched && this.state.mailingAddressCountry == 0 ? <span className="error">{this.Constants.COUNTRY_REQUIRED}</span> : null}
                                    </Col>

                                </Row>
                                <Row className="step1Form-row">
                                    <Col md={6} xs={6}>
                                        <label className="form-label">State</label>
                                        <FormControl name='mailingAddressState' defaultValue={0} value={this.state.mailingAddressState} className={"selectFormControl " + (this.state.mailingAddressStateTouched && this.state.mailingAddressState == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.trustOnChangeForm(e, 'select', this.state.mailingAddressCountry == 231 ? true : false)} onBlur={(e) => this.valueTouched(e)}>
                                            <option value={0}>Select State</option>
                                            {this.state.statesList.map((record, index) => {
                                                return (
                                                    <option value={record['id']} key={index} >{record['name']}</option>
                                                );
                                            })}
                                        </FormControl>
                                        {this.state.mailingAddressStateTouched && this.state.mailingAddressState == 0 ? <span className="error">{this.Constants.STATE_REQUIRED}</span> : null}
                                    </Col>
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Zip Code</label>
                                        <FormControl type="text" placeholder="Zip Code" onKeyPress={(e) => {this.isNumberKey(e)}} name="mailingAddressZip" value={this.state.mailingAddressZip} className={"inputFormControl " + (this.state.mailingAddressZipTouched && !this.state.mailingAddressZip ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                        {this.state.mailingAddressZipTouched && !this.state.mailingAddressZip ? <span className="error">{this.Constants.ZIP_REQUIRED}</span> : null}
                                    </Col>
                                </Row>
                                <Row className="step1Form-row">
                                    <Col xs={6} md={6}>
                                        <label className="form-label">Enter the Entity’s primary business telephone number</label>
                                        <PhoneInput name="mailingAddressPhoneNumber" value={this.state.mailingAddressPhoneNumber} onChange={e => { this.trustOnChangeForm(e, 'mobile', false, 'mailingAddressPhoneNumber') }} maxLength="14" placeholder="(123) 456-7890" country="US" />
                                    </Col>
                                </Row>
                            </div>
                        </div>

                        {/* ============== Investor Trust Type ============== */}
                        <div className="trust" hidden={this.state.investorType !== 'Trust'}>
                            <Row className="step1Form-row" hidden={!this.state.showTrustRevocableInvestorPage1 || !this.state.showTrustIrrevocableInvestorPage1}>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Investor Sub Type:</label>
                                    {/* <FormControl defaultValue="0" value={this.state.investorSubType} className={"selectFormControl " + (this.state.investorSubTypeBorder ? 'inputError' : '')}  componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.investorHandleChangeEvent(e, 'investorSubType',  'INVESTOR_SUB_TYPE_REQUIRED')}>  */}
                                    <FormControl name='investorSubType' defaultValue={0} value={this.state.investorSubType} className={"selectFormControl " + (this.state.investorSubTypeTouched && this.state.investorSubType == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.trustOnChangeForm(e, 'select', true)} onBlur={(e) => this.valueTouched(e)}>
                                        <option value={0}>Select Investor Sub Type</option>
                                        {this.state.investorTrustSubTypes.map((record, index) => {
                                            return (
                                                <option value={record['id']} key={index} >{record['name']}</option>
                                            );
                                        })}
                                        {/* <option value="UsCCorp">Revocable Trust</option>
                                        <option value="UsSCorp">Irrevocable Trust</option> */}
                                    </FormControl>
                                    {this.state.investorSubTypeTouched && this.state.investorSubType == 0 ? <span className="error">{this.Constants.INVESTOR_SUB_TYPE_REQUIRED}</span> : null}
                                </Col>
                            </Row>

                            {/* ====== revocable trust ========  */}
                            {
                                this.state.investorSubType == 9
                                    ?
                                    <div id="RecoverableTrust">
                                        {
                                            this.state.showTrustRevocableInvestorPage1
                                                ?
                                                <div>
                                                    <Row className="step1Form-row">
                                                        {/* <Col xs={6} md={6}>
                                                            <label className="form-label">Enter the number of Grantors of the Trust</label>
                                                            <FormControl name='numberOfGrantorsOfTheTrust' type="text" placeholder="Enter number of Grantors" value={this.state.numberOfGrantorsOfTheTrust} className="inputFormControl" onChange={(e) => this.trustOnChangeForm(e, 'number', false)} onBlur={(e) => this.valueTouched(e)} />
                                                            <span className="error"></span>
                                                        </Col> */}
                                                        <Col xs={6} md={6}>
                                                            <label className="form-label ">Enter the Trust's Name: &nbsp;
                                                                <span>
                                                                    <LinkWithTooltip tooltip="Please use the entire legal name of the Revocable Trust (the “Trust”).  This name will appear in the Fund’s records and on tax reporting information.  Your estate planning advisor should have supplied you with the exact legal wording to use for this purpose.  Most revocable trusts hold title through the trustee(s), such as: “John Smith, Trustee of the John and Linda Smith Revocable Trust Dated January 1, 2000”.  Accordingly, most commonly entries such as “The John and Linda Smith Revocable Trust” will not be correct.  If you have questions about the correct legal title, contact your estate planning advisor." id="tooltip-1">
                                                                        <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                                    </LinkWithTooltip>
                                                                </span>
                                                            </label>
                                                            <FormControl type="text" name='trustName' placeholder="Enter the Trust's Name" value={this.state.trustName} className={"inputFormControl " + (this.state.trustNameTouched && !this.state.trustName ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                            {this.state.trustNameTouched && !this.state.trustName ? <span className="error">{this.Constants.TRUST_NAME_REQUIRED}</span> : null}
                                                        </Col>
                                                        <Col xs={6} md={6}>
                                                            <label className="form-label ">Email Address</label>
                                                            <FormControl name='email' type="email" name="email" placeholder="ProfessorX@gmail.com" className="inputFormControl" readOnly value={this.state.email} />
                                                            <span className="error"></span>
                                                        </Col>

                                                    </Row>
                                                    <Row className="step1Form-row">
                                                        {/* <Col xs={6} md={6}>
                                                            <label className="form-label ">Enter the Entity’s Name: &nbsp;
                                                                <span>
                                                                    <LinkWithTooltip tooltip="Please use the entire legal name of the Revocable Trust (the “Trust”).  This name will appear in the Fund’s records and on tax reporting information.  Your estate planning advisor should have supplied you with the exact legal wording to use for this purpose.  Most revocable trusts hold title through the trustee(s), such as: “John Smith, Trustee of the John and Linda Smith Revocable Trust Dated January 1, 2000”.  Accordingly, most commonly entries such as “The John and Linda Smith Revocable Trust” will not be correct.  If you have questions about the correct legal title, contact your estate planning advisor." href="#" id="tooltip-1">
                                                                        <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                                    </LinkWithTooltip>
                                                                </span>
                                                            </label>
                                                            <FormControl type="text" name='entityName' placeholder="Enter the Entity’s Name" value={this.state.entityName} className={"inputFormControl " + (this.state.entityNameTouched && !this.state.entityName ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                            {this.state.entityNameTouched && !this.state.entityName ? <span className="error">{this.Constants.ENTITY_NAME_REQUIRED}</span> : null}
                                                        </Col> */}
                                                        <Col lg={6} md={6} sm={6} xs={12}>
                                                            <label className="form-label">Where is the Trust legally domiciled? &nbsp;
                                                    <span>
                                                                    <LinkWithTooltip tooltip="Your estate planning adviser should have supplied you with this information.  If you are unsure of this answer, contact your estate planning adviser." id="tooltip-1">
                                                                        <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                                    </LinkWithTooltip>
                                                                </span>
                                                            </label>
                                                            <FormControl name='trustLegallyDomiciled' defaultValue={0} value={this.state.trustLegallyDomiciled} className={"selectFormControl " + (this.state.trustLegallyDomiciledTouched && this.state.trustLegallyDomiciled == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => { this.trustOnChangeForm(e, 'select', true); this.setState({ state: 0, stateTouched: false }) }} onBlur={(e) => this.valueTouched(e)}>
                                                                <option value={0}>Select Country</option>
                                                                {this.state.countriesList.map((record, index) => {
                                                                    return (
                                                                        <option value={record['id']} key={index} >{record['name']}</option>
                                                                    );
                                                                })}
                                                            </FormControl>
                                                            {this.state.trustLegallyDomiciledTouched && this.state.trustLegallyDomiciled == 0 ? <span className="error">{this.Constants.COUNTRY_REQUIRED}</span> : null}
                                                        </Col>
                                                        <Col lg={6} md={6} sm={6} xs={12} hidden={this.state.trustLegallyDomiciled != 231}>
                                                            <label className="form-label">State</label>
                                                            <FormControl name='selectState' defaultValue={0} value={this.state.selectState} className={"selectFormControl " + (this.state.selectStateTouched && this.state.trustLegallyDomiciled == 231 && this.state.selectState == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.trustOnChangeForm(e, 'select', this.state.trustLegallyDomiciled == 231 ? true : false)} onBlur={(e) => this.valueTouched(e)}>
                                                                <option value={0}>Select State</option>
                                                                {this.state.usStatesList.map((record, index) => {
                                                                    return (
                                                                        <option value={record['id']} key={index} >{record['name']}</option>
                                                                    );
                                                                })}
                                                            </FormControl>
                                                            {this.state.selectStateTouched && this.state.trustLegallyDomiciled == 231 && this.state.selectState == 0 ? <span className="error">{this.Constants.STATE_REQUIRED}</span> : null}
                                                        </Col>
                                                    </Row>
                                                    {/* <Row className="step1Form-row" hidden={this.state.trustLegallyDomiciled != 231}>
                                                        <Col lg={6} md={6} sm={6} xs={12}>
                                                            <label className="form-label">State</label>
                                                            <FormControl name='selectState' defaultValue={0} value={this.state.selectState} className={"selectFormControl " + (this.state.selectStateTouched && this.state.trustLegallyDomiciled == 231 && this.state.selectState == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.trustOnChangeForm(e, 'select', this.state.trustLegallyDomiciled == 231 ? true : false)} onBlur={(e) => this.valueTouched(e)}>
                                                                <option value={0}>Select State</option>
                                                                {this.state.usStatesList.map((record, index) => {
                                                                    return (
                                                                        <option value={record['id']} key={index} >{record['name']}</option>
                                                                    );
                                                                })}
                                                            </FormControl>
                                                            {this.state.selectStateTouched && this.state.trustLegallyDomiciled == 231 && this.state.selectState == 0 ? <span className="error">{this.Constants.STATE_REQUIRED}</span> : null}
                                                        </Col>
                                                    </Row> */}

                                                    {/* <Row className="step1Form-row">
                                                        <Col xs={6} md={6}>
                                                            <label className="form-label block">Is the Entity a fund-of-funds or a similar type vehicle?</label>
                                                            <Radio name="istheEntityFundOfFundsOrSimilarTypeVehicle" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.istheEntityFundOfFundsOrSimilarTypeVehicle == true} onChange={(e) => this.trustOnChangeForm(e, 'text', false)} >&nbsp; Yes
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                            <Radio name="istheEntityFundOfFundsOrSimilarTypeVehicle" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.istheEntityFundOfFundsOrSimilarTypeVehicle == false} onChange={(e) => this.trustOnChangeForm(e, 'text', false)}>&nbsp; No
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                        </Col>
                                                    </Row> */}
                                                    <Row className="step1Form-row">
                                                        <Col xs={6} md={6}>
                                                            <label className="form-label block">Is the Trust tax exempt for United States federal income tax purposes?</label>
                                                            <Radio name="isEntityTaxExemptForUSFederalIncomeTax" value={true} className="radioSmallTxtWidth" inline checked={this.state.isEntityTaxExemptForUSFederalIncomeTax} id="yesCheckbox" onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; Yes
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                            <Radio name="isEntityTaxExemptForUSFederalIncomeTax" value={false} className="radioSmallTxtWidth" inline checked={!this.state.isEntityTaxExemptForUSFederalIncomeTax} id="yesCheckbox" onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; No
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                        </Col>
                                                    </Row>
                                                    <Row className="step1Form-row" hidden={!this.state.isEntityTaxExemptForUSFederalIncomeTax}>
                                                        <Col xs={6} md={6}>
                                                            <label className="form-label block">Is the Trust a 501(c)(3)?</label>
                                                            <Radio name="isTrust501c3" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.isTrust501c3 == true} onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; Yes
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                            <Radio name="isTrust501c3" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.isTrust501c3 == false} onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; No
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                        </Col>
                                                    </Row>
                                                    <Row className="step1Form-row">
                                                        <Col xs={12} md={12}>
                                                            <label className="form-label width100 block">Is the Trust required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?</label>
                                                            <Radio name="releaseInvestmentEntityRequired" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.releaseInvestmentEntityRequired == true} onChange={(e) => this.trustOnChangeForm(e, 'text', false)}>&nbsp; Yes
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                            <Radio name="releaseInvestmentEntityRequired" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.releaseInvestmentEntityRequired == false} onChange={(e) => this.trustOnChangeForm(e, 'text', false)}>&nbsp; No
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                        </Col>
                                                    </Row>
                                                    <Row className="step1Form-row">
                                                        <Col xs={12} md={12}>
                                                            <label className="form-label width100 block">Has the Investor or any of its Beneficial Owners been subject to a <span className="helpWord" onClick={this.openDisqualifingEventModal}>Disqualifying Event</span> for purpose of Regulation D of Rule 506(d) promulgated under the <span className="helpWord" onClick={this.openSecurityTooltipModal}>Securities Act</span>?</label>
                                                            <Radio name="isSubjectToDisqualifyingEvent" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.isSubjectToDisqualifyingEvent == true} onChange={(e) => this.trustOnChangeForm(e, 'text', false)}>&nbsp; Yes
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                            <Radio name="isSubjectToDisqualifyingEvent" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.isSubjectToDisqualifyingEvent == false} onChange={(e) => this.trustOnChangeForm(e, 'text', false)}>&nbsp; No
                                                    <span className="radio-checkmark"></span>
                                                            </Radio>
                                                        </Col>
                                                    </Row>
                                                    <Row className="step1Form-row">
                                                        <Col xs={12} md={12}>
                                                            <label className="form-label width100 block">The Investor has other information to disclose to the Fund Manager in connection with the investment:</label>
                                                            <FormControl componentClass="textarea" placeholder="Address" name="fundManagerInfo" value={this.state.fundManagerInfo} className="inputFormControl textarea col-md-4" onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                        </Col>
                                                    </Row>

                                                    <Row className="step1lastCheckBox">
                                                        <label className="form-label width100 step1PaddingLeft15">Please select any of the following that apply:</label>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Tax-Exempt Organization" checked={this.state.otherInvestorAttributes.indexOf('Tax-Exempt Organization') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Tax-Exempt Organization</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Employee Benefit Plan" checked={this.state.otherInvestorAttributes.indexOf('Employee Benefit Plan') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Employee Benefit Plan</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="ERISA Partner" checked={this.state.otherInvestorAttributes.indexOf('ERISA Partner') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">ERISA Partner</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Bank Holding Company" checked={this.state.otherInvestorAttributes.indexOf('Bank Holding Company') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Bank Holding Company</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Foreign Government Entity" checked={this.state.otherInvestorAttributes.indexOf('Foreign Government Entity') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Foreign Government Entity</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Governmental Pension Plan" checked={this.state.otherInvestorAttributes.indexOf('Governmental Pension Plan') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Governmental Pension Plan</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Non-Pension Governmental Entity" checked={this.state.otherInvestorAttributes.indexOf('Non-Pension Governmental Entity') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Non-Pension Governmental Entity</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Private Pension Plan" checked={this.state.otherInvestorAttributes.indexOf('Private Pension Plan') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Private Pension Plan</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Fund of Funds" checked={this.state.otherInvestorAttributes.indexOf('Fund of Funds') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Fund of Funds</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Insurance Company" checked={this.state.otherInvestorAttributes.indexOf('Insurance Company') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Insurance Company</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Private Foundation" checked={this.state.otherInvestorAttributes.indexOf('Private Foundation') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Private Foundation</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="501(c)(3)" checked={this.state.otherInvestorAttributes.indexOf('501(c)(3)') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">501(c)(3)</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Investment Company Registered with SEC" checked={this.state.otherInvestorAttributes.indexOf('Investment Company Registered with SEC') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Investment Company Registered with SEC</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Broker-Dealer" checked={this.state.otherInvestorAttributes.indexOf('Broker-Dealer') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Broker-Dealer</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        {/*<Col md={6} sm={12} xs={12}>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Tax-Exempt Organization</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">ERISA Partner</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Foreign Government Entity </span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Non-Pension Governmental Entity</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Fund of Funds</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Private Foundation</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Investment Company Registered with SEC</span>    
                                        </CBox>
                                    </Col>
                                    <Col md={6} sm={12} xs={12}>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Employee Benefit Plan</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Bank Holding Company</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize"> Governmental Pension Plan</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Private Pension Plan</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Insurance Company</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">501(c)(3)</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Broker-Dealer</span>    
                                        </CBox>
                                    </Col>*/}
                                                    </Row>
                                                </div>
                                                :
                                                <div>
                                                    <Row className="step1Form-row">
                                                        <Col xs={12} md={12}>
                                                            <label className="title">Enter the Trust's primary business mailing address</label>
                                                        </Col>
                                                    </Row>
                                                    <Row className="step1Form-row">
                                                        <Col xs={6} md={6}>
                                                            <label className="form-label">Address</label>
                                                            <FormControl componentClass="textarea" placeholder="Address" name="mailingAddressStreet" value={this.state.mailingAddressStreet} className={"inputFormControl textarea " + (this.state.mailingAddressStreetTouched && !this.state.mailingAddressStreet ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                            {this.state.mailingAddressStreetTouched && !this.state.mailingAddressStreet ? <span className="error">{this.Constants.STREET_REQUIRED}</span> : null}
                                                        </Col>

                                                    </Row>
                                                    <Row className="step1Form-row">
                                                        <Col xs={6} md={6}>
                                                            <label className="form-label">City</label>
                                                            <FormControl type="text" placeholder="City" name="mailingAddressCity" value={this.state.mailingAddressCity} className={"inputFormControl " + (this.state.mailingAddressCityTouched && !this.state.mailingAddressCity ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                            {this.state.mailingAddressCityTouched && !this.state.mailingAddressCity ? <span className="error">{this.Constants.CITY_REQUIRED}</span> : null}
                                                        </Col>
                                                        <Col md={6} xs={6}>
                                                            <label className="form-label">Country</label>
                                                            <FormControl name='mailingAddressCountry' defaultValue={0} value={!this.state.mailingAddressCountry ? this.state.trustLegallyDomiciled : this.state.mailingAddressCountry} className={"selectFormControl " + (this.state.mailingAddressCountryTouched && this.state.mailingAddressCountry == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => { this.trustOnChangeForm(e, 'select', true); this.setState({ state: 0, stateTouched: false }) }} onBlur={(e) => this.valueTouched(e)}>
                                                                <option value={0}>Select Country</option>
                                                                {this.state.countriesList.map((record, index) => {
                                                                    return (
                                                                        <option value={record['id']} key={index} >{record['name']}</option>
                                                                    );
                                                                })}
                                                            </FormControl>
                                                            {this.state.mailingAddressCountryTouched && this.state.mailingAddressCountry == 0 ? <span className="error">{this.Constants.COUNTRY_REQUIRED}</span> : null}
                                                        </Col>

                                                    </Row>
                                                    <Row className="step1Form-row">
                                                        <Col md={6} xs={6}>
                                                            <label className="form-label">State</label>
                                                            <FormControl name='mailingAddressState' defaultValue={0} value={!this.state.mailingAddressState ? this.state.selectState : this.state.mailingAddressState} className={"selectFormControl " + (this.state.mailingAddressStateTouched && this.state.mailingAddressState == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.trustOnChangeForm(e, 'select', this.state.mailingAddressCountry == 231 ? true : false)} onBlur={(e) => this.valueTouched(e)}>
                                                                <option value={0}>Select State</option>
                                                                {this.state.statesList.map((record, index) => {
                                                                    return (
                                                                        <option value={record['id']} key={index} >{record['name']}</option>
                                                                    );
                                                                })}
                                                            </FormControl>
                                                            {this.state.mailingAddressStateTouched && this.state.mailingAddressState == 0 ? <span className="error">{this.Constants.STATE_REQUIRED}</span> : null}
                                                        </Col>
                                                        <Col xs={6} md={6}>
                                                            <label className="form-label">Zip Code</label>
                                                            <FormControl type="text" placeholder="Zip Code" name="mailingAddressZip" onKeyPress={(e) => {this.isNumberKey(e)}} value={this.state.mailingAddressZip} className={"inputFormControl " + (this.state.mailingAddressZipTouched && !this.state.mailingAddressZip ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                            {this.state.mailingAddressZipTouched && !this.state.mailingAddressZip ? <span className="error">{this.Constants.ZIP_REQUIRED}</span> : null}
                                                        </Col>
                                                    </Row>
                                                    {/* <Row className="step1Form-row">
                                                        <Col xs={12} md={12}>
                                                            <label className="form-label width100">Please input the exact legal title designation you would like used by the
                                            fund to hold the Trust’s interest.</label>
                                                            <Col xs={6} md={6} className="padding-left-0">
                                                                <FormControl type="text" placeholder="Legal Title" name="legalTitleDesignation" value={this.state.legalTitleDesignation} className={"inputFormControl " + (this.state.legalTitleDesignationTouched && !this.state.legalTitleDesignation ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                                {this.state.legalTitleDesignationTouched && !this.state.legalTitleDesignation ? <span className="error">{this.Constants.LEGAL_DESIGNATION_REQUIRED}</span> : null}
                                                            </Col>
                                                        </Col>
                                                    </Row> */}
                                                    <Row className="step1Form-row">
                                                        <Col xs={6} md={6}>
                                                            <label className="form-label">Enter the Trust's primary business telephone number</label>
                                                            <PhoneInput name="mailingAddressPhoneNumber" value={this.state.mailingAddressPhoneNumber} onChange={e => { this.trustOnChangeForm(e, 'mobile', false, 'mailingAddressPhoneNumber') }} maxLength="14" placeholder="(123) 456-7890" country="US" />
                                                        </Col>
                                                    </Row>

                                                </div>
                                        }
                                    </div>
                                    :
                                    (
                                        this.state.investorSubType == 10
                                            ?
                                            <div id="IrrecoverableTrust">
                                                {
                                                    this.state.showTrustIrrevocableInvestorPage1
                                                        ?
                                                        <div>
                                                            <Row className="step1Form-row">
                                                                <Col xs={6} md={6}>
                                                                    <label className="form-label">Enter the Trust’s name &nbsp;
                                                            <span>
                                                                            <LinkWithTooltip tooltip="Please use the entire legal name of the Revocable Trust (the “Trust”).  This name will appear in the Fund’s records and on tax reporting information.  Your estate planning advisor should have supplied you with the exact legal wording to use for this purpose." id="tooltip-1">
                                                                                <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                                            </LinkWithTooltip>
                                                                        </span>
                                                                    </label>
                                                                    <FormControl type="text" name='trustName' placeholder="Enter the Trust’s Name" value={this.state.trustName} className="inputFormControl" onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                                    <span className="error"></span>
                                                                </Col>
                                                                <Col xs={6} md={6}>
                                                                    <label className="form-label">Email Address</label>
                                                                    <FormControl name='email' type="email" name="email" placeholder="ProfessorX@gmail.com" className="inputFormControl" readOnly value={this.state.email} />
                                                                    <span className="error"></span>
                                                                </Col>

                                                            </Row>
                                                            <Row className="step1Form-row">
                                                                {/* <Col xs={6} md={6}>
                                                                    <label className="form-label ">Enter the Entity’s Name: &nbsp;
                                                            <span>
                                                                            <LinkWithTooltip tooltip="Please use the entire legal name of the Revocable Trust (the “Trust”).  This name will appear in the Fund’s records and on tax reporting information.  Your estate planning advisor should have supplied you with the exact legal wording to use for this purpose.  Most revocable trusts hold title through the trustee(s), such as: “John Smith, Trustee of the John and Linda Smith Revocable Trust Dated January 1, 2000”.  Accordingly, most commonly entries such as “The John and Linda Smith Revocable Trust” will not be correct.  If you have questions about the correct legal title, contact your estate planning advisor." href="#" id="tooltip-1">
                                                                                <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                                            </LinkWithTooltip>
                                                                        </span>
                                                                    </label>
                                                                    <FormControl type="text" name='entityName' placeholder="Enter the Entity’s Name" value={this.state.entityName} className={"inputFormControl " + (this.state.entityNameTouched && !this.state.entityName ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                                    {this.state.entityNameTouched && !this.state.entityName ? <span className="error">{this.Constants.ENTITY_NAME_REQUIRED}</span> : null}
                                                                </Col> */}
                                                                <Col lg={6} md={6} sm={6} xs={12}>
                                                                    <label className="form-label">Where is the Trust legally domiciled? &nbsp;
                                                            <span>
                                                                            <LinkWithTooltip tooltip="Your estate planning adviser should have supplied you with this information.  If you are unsure of this answer, contact your estate planning adviser." id="tooltip-1">
                                                                                <i className="fa fa-question-circle toolTipIconAlign" aria-hidden="true"></i>
                                                                            </LinkWithTooltip>
                                                                        </span>
                                                                    </label>
                                                                    <FormControl name='trustLegallyDomiciled' defaultValue={0} value={this.state.trustLegallyDomiciled} className={"selectFormControl " + (this.state.trustLegallyDomiciledTouched && this.state.trustLegallyDomiciled == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => { this.trustOnChangeForm(e, 'select', false); this.setState({ state: 0, stateTouched: false }) }} onBlur={(e) => this.valueTouched(e)}>
                                                                        <option value={0}>Select Country</option>
                                                                        {this.state.countriesList.map((record, index) => {
                                                                            return (
                                                                                <option value={record['id']} key={index} >{record['name']}</option>
                                                                            );
                                                                        })}
                                                                    </FormControl>
                                                                    {this.state.trustLegallyDomiciledTouched && this.state.trustLegallyDomiciled == 0 ? <span className="error">{this.Constants.COUNTRY_REQUIRED}</span> : null}
                                                                </Col>
                                                                <Col lg={6} md={6} sm={6} xs={12} hidden={this.state.trustLegallyDomiciled != 231}>
                                                                    <label className="form-label">State</label>
                                                                    <FormControl name='selectState' defaultValue={0} value={this.state.selectState} className={"selectFormControl " + (this.state.selectStateTouched && this.state.country == 231 && this.state.selectState == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.trustOnChangeForm(e, 'select', this.state.trustLegallyDomiciled == 231 ? true : false)} onBlur={(e) => this.valueTouched(e)}>
                                                                        <option value={0}>Select State</option>
                                                                        {this.state.usStatesList.map((record, index) => {
                                                                            return (
                                                                                <option value={record['id']} key={index} >{record['name']}</option>
                                                                            );
                                                                        })}
                                                                    </FormControl>
                                                                    {this.state.selectStateTouched && this.state.trustLegallyDomiciled == 231 && this.state.selectState == 0 ? <span className="error">{this.Constants.STATE_REQUIRED}</span> : null}
                                                                </Col>
                                                            </Row>
                                                            {/* <Row className="step1Form-row" hidden={this.state.trustLegallyDomiciled != 231}>
                                                                <Col lg={6} md={6} sm={6} xs={12}>
                                                                    <label className="form-label">State</label>
                                                                    <FormControl name='selectState' defaultValue={0} value={this.state.selectState} className={"selectFormControl " + (this.state.selectStateTouched && this.state.country == 231 && this.state.selectState == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.trustOnChangeForm(e, 'select', this.state.trustLegallyDomiciled == 231 ? true : false)} onBlur={(e) => this.valueTouched(e)}>
                                                                        <option value={0}>Select State</option>
                                                                        {this.state.usStatesList.map((record, index) => {
                                                                            return (
                                                                                <option value={record['id']} key={index} >{record['name']}</option>
                                                                            );
                                                                        })}
                                                                    </FormControl>
                                                                    {this.state.selectStateTouched && this.state.trustLegallyDomiciled == 231 && this.state.selectState == 0 ? <span className="error">{this.Constants.STATE_REQUIRED}</span> : null}
                                                                </Col>
                                                            </Row> */}
                                                            <Row className="step1Form-row">
                                                                <Col xs={6} md={6}>
                                                                    <label className="form-label block">Is the Trust tax exempt for United States federal income tax purposes?</label>
                                                                    <Radio name="isEntityTaxExemptForUSFederalIncomeTax" value={true} className="radioSmallTxtWidth" inline checked={this.state.isEntityTaxExemptForUSFederalIncomeTax} id="yesCheckbox" onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; Yes
                                                                <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                    <Radio name="isEntityTaxExemptForUSFederalIncomeTax" value={false} className="radioSmallTxtWidth" inline checked={!this.state.isEntityTaxExemptForUSFederalIncomeTax} id="yesCheckbox" onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; No
                                                                <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                </Col>
                                                            </Row>
                                                            <Row className="step1Form-row" hidden={!this.state.isEntityTaxExemptForUSFederalIncomeTax}>
                                                                {/* <Col xs={6} md={6} hidden={!this.state.isEntityTaxExemptForUSFederalIncomeTax}>
                                                                    <label className="form-label block">Is the Entity a U.S. 501(c)(3)?</label>
                                                                    <Radio name="isEntityUS501c3" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.isEntityUS501c3 == true} onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; Yes
                                                            <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                    <Radio name="isEntityUS501c3" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.isEntityUS501c3 == false} onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; No
                                                            <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                </Col> */}
                                                                <Col xs={6} md={6}>
                                                                    <label className="form-label block">Is the Trust a 501(c)(3)?</label>
                                                                    <Radio name="isTrust501c3" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.isTrust501c3 == true} onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; Yes
                                                            <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                    <Radio name="isTrust501c3" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.isTrust501c3 == false} onChange={(e) => this.trustOnChangeForm(e, 'text', true)}>&nbsp; No
                                                            <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                </Col>
                                                            </Row>
                                                            <Row className="step1Form-row">
                                                                <Col xs={12} md={12}>
                                                                    <label className="form-label width100 block">Is the Trust required, if requested, under United States or other federal, state, local or non-United States similar regulations to release investment information? For example under the United States Freedom of Information Act (“FOIA”) or any similar statues anywhere else worldwide?</label>
                                                                    <Radio name="releaseInvestmentEntityRequired" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.releaseInvestmentEntityRequired == true} onChange={(e) => this.trustOnChangeForm(e, 'text', false)}>&nbsp; Yes
                                                                <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                    <Radio name="releaseInvestmentEntityRequired" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.releaseInvestmentEntityRequired == false} onChange={(e) => this.trustOnChangeForm(e, 'text', false)}>&nbsp; No
                                                                <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                    {/* <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; Yes
                                                            <span className="radio-checkmark"></span>
                                                            </Radio>
                                                            <Radio name="taxExempt" className="radioSmallTxtWidth" inline id="yesCheckbox">&nbsp; No
                                                            <span className="radio-checkmark"></span>
                                                            </Radio> */}
                                                                </Col>
                                                            </Row>
                                                            <Row className="step1Form-row">
                                                                <Col xs={12} md={12}>
                                                                    <label className="form-label width100 block">Has the Investor or any of its Beneficial Owners been subject to a <span className="helpWord" onClick={this.openDisqualifingEventModal}>Disqualifying Event</span> for purpose of Regulation D of Rule 506(d) promulgated under the <span className="helpWord" onClick={this.openSecurityTooltipModal}>Securities Act</span>?</label>
                                                                    <Radio name="isSubjectToDisqualifyingEvent" className="radioSmallTxtWidth" inline id="yesCheckbox" value={true} checked={this.state.isSubjectToDisqualifyingEvent == true} onChange={(e) => this.trustOnChangeForm(e, 'text', false)}>&nbsp; Yes
                                                            <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                    <Radio name="isSubjectToDisqualifyingEvent" className="radioSmallTxtWidth" inline id="yesCheckbox" value={false} checked={this.state.isSubjectToDisqualifyingEvent == false} onChange={(e) => this.trustOnChangeForm(e, 'text', false)}>&nbsp; No
                                                            <span className="radio-checkmark"></span>
                                                                    </Radio>
                                                                </Col>
                                                            </Row>
                                                            <Row className="step1Form-row">
                                                                <Col xs={12} md={12}>
                                                                    <label className="form-label width100 block">The Investor has other information to disclose to the Fund Manager in connection with the investment:</label>
                                                                    <FormControl componentClass="textarea" placeholder="Address" name="fundManagerInfo" value={this.state.fundManagerInfo} className="inputFormControl textarea col-md-4" onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                                </Col>
                                                            </Row>
                                                            <Row className="step1lastCheckBox">
                                                        <label className="form-label width100 step1PaddingLeft15">Please select any of the following that apply:</label>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Tax-Exempt Organization" checked={this.state.otherInvestorAttributes.indexOf('Tax-Exempt Organization') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Tax-Exempt Organization</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Employee Benefit Plan" checked={this.state.otherInvestorAttributes.indexOf('Employee Benefit Plan') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Employee Benefit Plan</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="ERISA Partner" checked={this.state.otherInvestorAttributes.indexOf('ERISA Partner') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">ERISA Partner</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Bank Holding Company" checked={this.state.otherInvestorAttributes.indexOf('Bank Holding Company') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Bank Holding Company</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Foreign Government Entity" checked={this.state.otherInvestorAttributes.indexOf('Foreign Government Entity') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Foreign Government Entity</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Governmental Pension Plan" checked={this.state.otherInvestorAttributes.indexOf('Governmental Pension Plan') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Governmental Pension Plan</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Non-Pension Governmental Entity" checked={this.state.otherInvestorAttributes.indexOf('Non-Pension Governmental Entity') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Non-Pension Governmental Entity</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Private Pension Plan" checked={this.state.otherInvestorAttributes.indexOf('Private Pension Plan') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Private Pension Plan</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Fund of Funds" checked={this.state.otherInvestorAttributes.indexOf('Fund of Funds') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Fund of Funds</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Insurance Company" checked={this.state.otherInvestorAttributes.indexOf('Insurance Company') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Insurance Company</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Private Foundation" checked={this.state.otherInvestorAttributes.indexOf('Private Foundation') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Private Foundation</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="501(c)(3)" checked={this.state.otherInvestorAttributes.indexOf('501(c)(3)') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">501(c)(3)</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        <Row className="step1PaddingLeft15">
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Investment Company Registered with SEC" checked={this.state.otherInvestorAttributes.indexOf('Investment Company Registered with SEC') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Investment Company Registered with SEC</span>
                                                                </CBox>
                                                            </Col>
                                                            <Col md={6} sm={6} xs={6}>
                                                                <CBox inline className="cBoxFullAlign" name="Broker-Dealer" checked={this.state.otherInvestorAttributes.indexOf('Broker-Dealer') > -1} onChange={(e) => this.trustOnChangeForm(e, 'checkbox', true)}>
                                                                    <span className="checkbox-checkmark checkmark"></span>
                                                                    <span className="marginLeft6 otherInvesterFontSize">Broker-Dealer</span>
                                                                </CBox>
                                                            </Col>
                                                        </Row>
                                                        {/*<Col md={6} sm={12} xs={12}>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Tax-Exempt Organization</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">ERISA Partner</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Foreign Government Entity </span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Non-Pension Governmental Entity</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Fund of Funds</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Private Foundation</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Investment Company Registered with SEC</span>    
                                        </CBox>
                                    </Col>
                                    <Col md={6} sm={12} xs={12}>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Employee Benefit Plan</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Bank Holding Company</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize"> Governmental Pension Plan</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Private Pension Plan</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Insurance Company</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">501(c)(3)</span>    
                                        </CBox>
                                        <CBox inline className="cBoxFullAlign">
                                            <span className="checkbox-checkmark checkmark"></span>
                                            <span className="marginLeft6 otherInvesterFontSize">Broker-Dealer</span>    
                                        </CBox>
                                    </Col>*/}
                                                    </Row>
                                                        </div>
                                                        :
                                                        <div>
                                                            <Row className="step1Form-row">
                                                                <Col xs={12} md={12}>
                                                                    <label className="title">Enter the Trust's primary business mailing address</label>
                                                                </Col>
                                                            </Row>
                                                            <Row className="step1Form-row">
                                                                <Col xs={6} md={6}>
                                                                    <label className="form-label">Address</label>
                                                                    <FormControl componentClass="textarea" placeholder="Address" name="mailingAddressStreet" value={this.state.mailingAddressStreet} className={"inputFormControl textarea " + (this.state.mailingAddressStreetTouched && !this.state.mailingAddressStreet ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                                    {this.state.mailingAddressStreetTouched && !this.state.mailingAddressStreet ? <span className="error">{this.Constants.STREET_REQUIRED}</span> : null}
                                                                </Col>

                                                            </Row>
                                                            <Row className="step1Form-row">
                                                                <Col xs={6} md={6}>
                                                                    <label className="form-label">City</label>
                                                                    <FormControl type="text" placeholder="City" name="mailingAddressCity" value={this.state.mailingAddressCity} className={"inputFormControl " + (this.state.mailingAddressCityTouched && !this.state.mailingAddressCity ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                                    {this.state.mailingAddressCityTouched && !this.state.mailingAddressCity ? <span className="error">{this.Constants.CITY_REQUIRED}</span> : null}
                                                                </Col>
                                                                <Col md={6} xs={6}>
                                                                    <label className="form-label">Country</label>
                                                                    <FormControl name='mailingAddressCountry' defaultValue={0} value={!this.state.mailingAddressCountry ? this.state.trustLegallyDomiciled : this.state.mailingAddressCountry} className={"selectFormControl " + (this.state.mailingAddressCountryTouched && this.state.mailingAddressCountry == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => { this.trustOnChangeForm(e, 'select', true); this.setState({ state: 0, stateTouched: false }) }} onBlur={(e) => this.valueTouched(e)}>
                                                                        <option value={0}>Select Country</option>
                                                                        {this.state.countriesList.map((record, index) => {
                                                                            return (
                                                                                <option value={record['id']} key={index} >{record['name']}</option>
                                                                            );
                                                                        })}
                                                                    </FormControl>
                                                                    {this.state.mailingAddressCountryTouched && this.state.mailingAddressCountry == 0 ? <span className="error">{this.Constants.COUNTRY_REQUIRED}</span> : null}
                                                                </Col>

                                                            </Row>
                                                            <Row className="step1Form-row">
                                                                <Col md={6} xs={6}>
                                                                    <label className="form-label">State</label>
                                                                    <FormControl name='mailingAddressState' defaultValue={0} value={!this.state.mailingAddressState ? this.state.selectState : this.state.mailingAddressState} className={"selectFormControl " + (this.state.mailingAddressStateTouched && this.state.mailingAddressState == 0 ? 'inputError' : '')} componentClass="select" placeholder="Select Investor Sub Type" onChange={(e) => this.trustOnChangeForm(e, 'select', this.state.mailingAddressCountry == 231 ? true : false)} onBlur={(e) => this.valueTouched(e)}>
                                                                        <option value={0}>Select State</option>
                                                                        {this.state.statesList.map((record, index) => {
                                                                            return (
                                                                                <option value={record['id']} key={index} >{record['name']}</option>
                                                                            );
                                                                        })}
                                                                    </FormControl>
                                                                    {this.state.mailingAddressStateTouched && this.state.mailingAddressState == 0 ? <span className="error">{this.Constants.STATE_REQUIRED}</span> : null}
                                                                </Col>
                                                                <Col xs={6} md={6}>
                                                                    <label className="form-label">Zip Code</label>
                                                                    <FormControl type="text" placeholder="Zip Code" onKeyPress={(e) => {this.isNumberKey(e)}} name="mailingAddressZip" value={this.state.mailingAddressZip} className={"inputFormControl " + (this.state.mailingAddressZipTouched && !this.state.mailingAddressZip ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                                    {this.state.mailingAddressZipTouched && !this.state.mailingAddressZip ? <span className="error">{this.Constants.ZIP_REQUIRED}</span> : null}
                                                                </Col>
                                                            </Row>
                                                            <Row className="step1Form-row">
                                                                <Col xs={12} md={12}>
                                                                    <label className="form-label width100">Please input the exact legal title designation you would like used by the
                                            fund to hold the Trust’s interest.</label>
                                                                    <Col xs={6} md={6} className="padding-left-0">
                                                                        <FormControl type="text" placeholder="Legal Title" name="legalTitleDesignation" value={this.state.legalTitleDesignation} className={"inputFormControl " + (this.state.legalTitleDesignationTouched && !this.state.legalTitleDesignation ? 'inputError' : '')} onChange={(e) => this.trustOnChangeForm(e, 'text', true)} onBlur={(e) => this.valueTouched(e)} />
                                                                        {this.state.legalTitleDesignationTouched && !this.state.legalTitleDesignation ? <span className="error">{this.Constants.LEGAL_DESIGNATION_REQUIRED}</span> : null}
                                                                    </Col>
                                                                </Col>
                                                            </Row>
                                                            <Row className="step1Form-row">
                                                                <Col xs={6} md={6}>
                                                                    <label className="form-label">Enter the Trust's primary business telephone number</label>
                                                                    <PhoneInput name="mailingAddressPhoneNumber" value={this.state.mailingAddressPhoneNumber} onChange={e => { this.trustOnChangeForm(e, 'mobile', false, 'mailingAddressPhoneNumber') }} maxLength="14" placeholder="(123) 456-7890" country="US" />
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                }
                                            </div>
                                            :
                                            null
                                    )
                            }
                        </div>
                    </div>
                </div>
                <div className="margin30 error">{this.state.investorInfoErrorMsz}</div>
                <div className="footer-nav footerDivAlign">
                    <i className={"fa fa-chevron-left " + (!this.state.enableLeftIcon ? 'disabled' : '')} onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.investorPageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Modal id="confirmInvestorModal" show={this.state.showConfirmationModal} onHide={this.closeConfirmationModal} dialogClassName="confirmInvestorDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.investorType && this.state.investorType.toLowerCase() == 'individual'
                                ?
                                <div>
                                    <div className="title-text">Based on your input, the Fund will register your interest, in terms of legal title, in the name: <span className="fundNameCenter">{this.state.name}</span> This legal title designation cannot be changed after closing, and will be used for reporting, including tax reporting, purposes. </div>
                                </div>
                                :
                                (this.state.investorType && this.state.investorType.toLowerCase() == 'trust'
                                    ?
                                    <div className="title-text title-text-center"><p>Based on your input, the Fund will register your interest, in terms of legal title, in the name: <span className="fundNameCenter">{this.state.trustName}</span> This legal title designation cannot be changed after closing, and will be used for reporting, including tax reporting, purposes.</p></div>
                                    :
                                    <div className="title-text title-text-center"><p>Based on your input, the Fund will register your interest, in terms of legal title, in the name: <span className="fundNameCenter">{this.state.entityName}</span> This legal title designation cannot be changed after closing, and will be used for reporting, including tax reporting, purposes.</p></div>
                                )
                        }
                        <div className="subtext marginTop10">Please carefully review and confirm if correct.</div>
                        <Row className="fundBtnRow">
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Button type="button" className="fsnetCancelButton" onClick={this.closeConfirmationModal}>Cancel</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Button type="button" onClick={this.confirmSubmit} className="fsnetSubmitButton btnEnabled" >Confirm</Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default InvestorInformationComponent;

