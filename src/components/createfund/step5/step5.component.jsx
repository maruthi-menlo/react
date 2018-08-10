import React, { Component } from 'react';
import '../createfund.component.css';
import { Button, Checkbox as CBox, Row, Col, FormControl } from 'react-bootstrap';
import userDefaultImage from '../../../images/default_user.png';
import { Fsnethttp } from '../../../services/fsnethttp';
import { Constants } from '../../../constants/constants';
import Loader from '../../../widgets/loader/loader.component';
import { reactLocalStorage } from 'reactjs-localstorage';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/rrui.css';
import 'react-phone-number-input/style.css';
import { PubSub } from 'pubsub-js';

class Step5Component extends Component {

    constructor(props) {
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.addLpDelegateBtn = this.addLpDelegateBtn.bind(this);
        this.addLpFn = this.addLpFn.bind(this);
        this.sortLp = this.sortLp.bind(this);
        this.closeLpDelegateModal = this.closeLpDelegateModal.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.state = {
            showAddLpModal: false,
            showNameAsc: true,
            showOrgAsc: true,
            getLpList: [],
            firmId: null,
            fundId: null,
            isLpFormValid: false,
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
            cellNumberBorder: false,
            cellNumberMsz: '',
            cellNumber: '',
            cellNumberValid: false,
            lpErrorMsz: '',
            lpSelectedList: [],
            lpScreenError: '',
            orgName: '',
            step5PageValid: false,
            createdFundData: {},
            noDelegatesMsz: '',
            fundObj: {}
        }
        PubSub.subscribe('fundData', (msg, data) => {
            this.setState({
                fundId: data.id
            },()=>{
                this.showLps(data)
            })
        });
        PubSub.publish('pageNumber', { type: 'sideNav', page: 'lp' });
    }

    addLpFn() {
        let firstName = this.state.firstName;
        let lastName = this.state.lastName;
        let email = this.state.email;
        let cellNumber = this.state.cellNumber;
        let error = false;
        let emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        if (email !== '' && !emailRegex.test(email)) {
            this.setState({
                emailMsz: this.Constants.VALID_EMAIL,
                emailBorder: true,
            })
            error = true;
        }

        if (cellNumber.length < 12 || cellNumber.length > 13) {
            this.setState({
                cellNumberMsz: this.Constants.CELL_NUMBER_VALID,
                cellNumberBorder: true,
            })
            error = true;
        }

        if (!error) {
            let postObj = { firstName: firstName, lastName: lastName, email: email, cellNumber: cellNumber, fundId: this.state.fundId, organizationName: this.state.orgName };
            let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
            this.open()
            this.Fsnethttp.addLp(postObj, headers).then(result => {
                this.close();
                if (result.data) {
                    //Get list of delegates
                    let lpList = this.state.getLpList;
                    let data = result.data.data;
                    //Add checked as true to auto select the user
                    data['selected'] = true;
                    lpList.push(data);
                    //Get list of selected list of users
                    let selectedList = this.state.lpSelectedList;
                    //Push the newly created gp delegate id to selected list of users
                    selectedList.push(data.id);
                    this.setState({
                        getLpList: lpList,
                        showAddLpModal: false,
                        lpSelectedList: selectedList,
                        step5PageValid: true
                    });
                    this.clearFormFileds();
                }
            })
                .catch(error => {
                    this.close();
                    if (error.response !== undefined && error.response.data !== undefined && error.response.data.errors !== undefined) {
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

    //Clear the fileds
    clearFormFileds() {
        this.setState({
            lpErrorMsz: '',
            firstName: '',
            lastName: '',
            email: '',
            orgName: '',
            cellNumber: ''
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


    addLpDelegateBtn() {
        PubSub.publish('openLpModal', this.state.fundObj);
    }

    closeLpDelegateModal() {
        this.setState({
            showAddLpModal: false
        })
        this.clearFormFileds();
    }

    proceedToNext() {
        if (this.state.lpSelectedList.length > 0) {
            this.open();
            let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
            let lpObj = { fundId: this.state.fundId, vcfirmId: this.state.firmId, lps: this.state.lpSelectedList }
            this.Fsnethttp.assignLpToFund(lpObj, headers).then(result => {
                this.close();
                PubSub.publish('fundData', this.state.fundObj);
                this.props.history.push('/createfund/review/' + this.state.fundId);
            })
            .catch(error => {
                this.close();
            });
        } else {
            this.setState({
                lpScreenError: this.Constants.LP_REQUIRED
            })
        }
    }

    proceedToBack() {
        this.props.history.push('/createfund/upload/' + this.state.fundId);
    }

    // Update state params values and login button visibility

    updateStateParams(updatedDataObject) {
        this.setState(updatedDataObject, () => {
            this.enableDisableSubmitButtion();
        });
    }

    // Enable / Disble functionality of Submit Button
    enableDisableSubmitButtion() {
        let status = (this.state.firstNameValid && this.state.lastNameValid && this.state.emailValid && this.state.cellNumberValid) ? true : false;
        this.setState({
            isLpFormValid: status
        });
    }

    //Onchange event for all input text boxes.
    handleInputChangeEvent(event, type, obj) {
        let dataObj = {};
        this.setState({
            lpErrorMsz: ''
        })
        switch (type) {
            case 'firstName':
                if (event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        firstNameMsz: this.Constants.FIRST_NAME_REQUIRED,
                        firstNameValid: false,
                        firstNameBorder: true,
                        firstName: ''
                    })
                    dataObj = {
                        firstNameValid: false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        firstName: event.target.value,
                        firstNameMsz: '',
                        firstNameValid: true,
                        firstNameBorder: false,
                    })
                    dataObj = {
                        firstNameValid: true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'lastName':
                if (event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        lastNameMsz: this.Constants.LAST_NAME_REQUIRED,
                        lastNameValid: false,
                        lastNameBorder: true,
                        lastName: ''
                    })
                    dataObj = {
                        lastNameValid: false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        lastName: event.target.value,
                        lastNameMsz: '',
                        lastNameValid: true,
                        lastNameBorder: false,
                    })
                    dataObj = {
                        lastNameValid: true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'email':
                if (event.target.value.trim() === '' || event.target.value === undefined) {
                    this.setState({
                        emailMsz: this.Constants.VALID_EMAIL,
                        emailValid: false,
                        emailBorder: true,
                        email: ''
                    })
                    dataObj = {
                        emailValid: false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        email: event.target.value,
                        emailMsz: '',
                        emailValid: true,
                        emailBorder: false,
                    })
                    dataObj = {
                        emailValid: true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'orgName':
                this.setState({
                    orgName: event.target.value
                })
                break;
            case 'cellNumber':
                if (event === '' || event === undefined) {
                    this.setState({
                        cellNumberMsz: this.Constants.CELL_NUMBER_VALID,
                        cellNumberValid: false,
                        cellNumberBorder: true,
                        cellNumber: ''
                    })
                    dataObj = {
                        cellNumberValid: false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        cellNumber: event,
                        cellNumberMsz: '',
                        cellNumberValid: true,
                        cellNumberBorder: false,
                    })
                    dataObj = {
                        cellNumberValid: true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'user':
                let getSelectedList = this.state.lpSelectedList;
                let selectedId = obj.record.id
                if (event.target.checked) {
                    if (getSelectedList.indexOf(selectedId) === -1) {
                        getSelectedList.push(selectedId);
                    }
                } else {
                    var index = getSelectedList.indexOf(selectedId);
                    if (index !== -1) {
                        getSelectedList.splice(index, 1);
                    }
                }
                this.updateSelectedValueToList(obj.record.id, event.target.checked)
                this.setState({
                    lpSelectedList: getSelectedList,
                    lpcreenError: ''
                })
                break;
            default:
                // do nothing
                break;
        }
    }

    updateSelectedValueToList(id, value) {
        if (this.state.getLpList.length > 0) {
            let getList = this.state.getLpList;
            for (let index of getList) {
                if (index['id'] === id && this.state.getLpList.indexOf(index['id']) === -1) {
                    index['selected'] = value
                }
                this.setState({
                    getLpList: getList
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
        },()=>{
            this.getLPApi()
        })
    }

    getLPApi() {
        this.open();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.getFund(this.state.fundId, headers).then(result => {
            this.close();
            PubSub.publish('fundData', result.data.data);
            this.showLps(result.data.data)
        })
        .catch(error => {
            this.close();
            this.setState({
                getLpList: [],
                noDelegatesMsz: this.Constants.NO_LPS
            })

        });
    }

    showLps(data) {
        if (data && data.lps.length > 0) {
            this.setState({ fundObj:data, getLpList: data.lps }, () => this.selectedMembersPushToList());
        } else {
            this.setState({
                getLpList: [],
                fundObj:data,
                noDelegatesMsz: this.Constants.NO_LPS
            })
        }
    }

    // getFundDetails(fundId) {
    //     this.open();
    //     let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
    //     this.Fsnethttp.getFund(fundId, headers).then(result => {
    //         this.close();
    //         if (result.data) {
    //             this.setState({ createdFundData: result.data.data });
    //             PubSub.publish('fundData', result.data.data);
    //         } else {
    //             this.setState({
    //                 createdFundData: [],
    //             })
    //         }
    //     })
    //         .catch(error => {
    //             this.close();
    //             this.setState({
    //                 createdFundData: []
    //             })
    //         });
    // }


    sortLp(e, colName, sortVal) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let firmId = this.state.firmId;
        let fundId = this.state.fundId;
        if (this.state.getLpList && this.state.getLpList.length > 1) {
            this.open();
            this.Fsnethttp.getLpSort(firmId, fundId, headers, colName, sortVal).then(result => {
                if (result.data && result.data.data.length > 0) {
                    this.close();
                    this.setState({ getLpList: result.data.data }, () => this.selectedMembersPushToList());
                    if (colName === 'firstName') {
                        if (sortVal === 'desc') {
                            this.setState({
                                showNameAsc: true
                            })
                        } else {
                            this.setState({
                                showNameAsc: false
                            })
                        }
                    } else {
                        if (sortVal === 'desc') {
                            this.setState({
                                showOrgAsc: true
                            })
                        } else {
                            this.setState({
                                showOrgAsc: false
                            })
                        }
                    }

                } else {
                    this.close();
                    this.setState({
                        getLpList: [],
                        showNameAsc: false
                    }, )
                }

            })
            .catch(error => {
                this.close();
                this.setState({
                    getLpList: []
                })

            });
        }
    }

    selectedMembersPushToList() {
        if (this.state.getLpList.length > 0) {
            let list = [];
            for (let index of this.state.getLpList) {
                if (index['selected'] === true) {
                    list.push(index['id'])
                }
                this.setState({
                    lpSelectedList: list,
                    step5PageValid: true
                })
            }
        }
    }

    render() {
        return (
            <div className="LpDelegatesContainer marginTop6">
                <h1 className="assignGp">Assign LPs</h1>
                <p className="Subtext">Select LPs from the list below or choose to add new LP to Fund.</p>
                <Button className="lpDelegateButton" onClick={this.addLpDelegateBtn}><i className="fa fa-plus"></i>Limited Partner</Button>
                {this.state.getLpList.length > 0 ?
                    <Row className="full-width marginTop30">
                        <div className="name-heading marginLeft75" hidden={!this.state.showNameAsc} onClick={(e) => this.sortLp(e, 'firstName', 'asc')}>
                            LP Name
                                    <i className="fa fa-sort-asc" aria-hidden="true"  ></i>
                        </div>
                        <div className="name-heading marginLeft75" onClick={(e) => this.sortLp(e, 'firstName', 'desc')} hidden={this.state.showNameAsc}>
                            LP Name
                                <i className="fa fa-sort-desc" aria-hidden="true"  ></i>
                        </div>
                        <div className="name-heading" onClick={(e) => this.sortLp(e, 'organizationName', 'asc')} hidden={!this.state.showOrgAsc}>
                            Organization
                                <i className="fa fa-sort-asc" aria-hidden="true"></i>
                        </div>
                        <div className="name-heading" onClick={(e) => this.sortLp(e, 'organizationName', 'desc')} hidden={this.state.showOrgAsc}>
                            Organization
                                <i className="fa fa-sort-desc" aria-hidden="true" ></i>
                        </div>
                    </Row> : ''
                }
                <div className={"userLPContainer " + (this.state.getLpList.length === 0 ? 'borderNone' : 'marginTop10')}>
                    {this.state.getLpList.length > 0 ?
                        this.state.getLpList.map((record, index) => {
                            return (

                                <div className="userRow" key={index}>
                                    {
                                        record['profilePic'] ?
                                            <img src={record['profilePic']} alt="img" className="user-image" />
                                            : <img src={userDefaultImage} alt="img" className="user-image" />
                                    }

                                    <div className="lp-name">{record['firstName']}&nbsp;{record['lastName']}</div>
                                    <div className="lp-name lp-name-pad">{record['organizationName']}</div>
                                    <CBox checked={record['selected']} onChange={(e) => this.handleInputChangeEvent(e, 'user', { record })}>
                                        <span className="checkmark"></span>
                                    </CBox>
                                </div>
                            );
                        })
                        :
                        <div className="title margin20 text-center">{this.state.noDelegatesMsz}</div>
                    }
                </div>
                <div className="error">{this.state.lpScreenError}</div>

                <div className="addRoleModal" hidden={!this.state.showAddLpModal}>
                    <div>
                        <div className="croosMarkStyle"><span className="cursor-pointer" onClick={this.closeLpDelegateModal}>x</span></div>
                        <h3 className="title">Add LP</h3>
                    </div>
                    <div className="subtext modal-subtext">Fill in the form below to add a new GP Delegate to the Fund. Fields marked with an * are required.</div>
                    <div className="form-main-div">
                        <form>
                            <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">First Name*</label>
                                    <FormControl type="text" name="firstName" placeholder="Charles" className={"inputFormControl " + (this.state.firstNameBorder ? 'inputError' : '')} value={this.state.firstName} onChange={(e) => this.handleInputChangeEvent(e, 'firstName')} onBlur={(e) => this.handleInputChangeEvent(e, 'firstName')} />
                                    <span className="error">{this.state.firstNameMsz}</span>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Last Name*</label>
                                    <FormControl type="text" name="lastName" placeholder="Xavier" className={"inputFormControl " + (this.state.lastNameBorder ? 'inputError' : '')} value={this.state.lastName} onChange={(e) => this.handleInputChangeEvent(e, 'lastName')} onBlur={(e) => this.handleInputChangeEvent(e, 'lastName')} />
                                    <span className="error">{this.state.lastNameMsz}</span>
                                </Col>
                            </Row>
                            <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Email Address*</label>
                                    <FormControl type="email" name="email" placeholder="ProfessorX@gmail.com" className={"inputFormControl " + (this.state.emailBorder ? 'inputError' : '')} value={this.state.email} onChange={(e) => this.handleInputChangeEvent(e, 'email')} onBlur={(e) => this.handleInputChangeEvent(e, 'email')} />
                                    <span className="error">{this.state.emailMsz}</span>
                                </Col>
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Organization Name</label>
                                    <FormControl type="text" name="orgName" placeholder="Organization Name" className="inputFormControl" value={this.state.orgName} onChange={(e) => this.handleInputChangeEvent(e, 'orgName')} />
                                </Col>
                            </Row>
                            <Row className="marginBot20">
                                <Col lg={6} md={6} sm={6} xs={12}>
                                    <label className="form-label">Phone Number (Cell)*</label>
                                    <PhoneInput className={(this.state.cellNumberBorder ? 'inputError' : '')} maxLength="14" placeholder="(123) 456-7890" value={this.state.cellNumber} country="US" onChange={phone => this.handleInputChangeEvent(phone, 'cellNumber')} />
                                    <span className="error">{this.state.cellNumberMsz}</span>
                                </Col>
                            </Row>
                        </form>
                        <div className="error">{this.state.lpErrorMsz}</div>
                    </div>
                    <Row>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <Button type="button" className="fsnetCancelButton" onClick={this.closeLpDelegateModal}>Cancel</Button>
                        </Col>
                        <Col lg={6} md={6} sm={6} xs={12}>
                            <Button className={"fsnetSubmitButton " + (this.state.isLpFormValid ? 'btnEnabled' : '')} disabled={!this.state.isLpFormValid} onClick={this.addLpFn}>Submit</Button>
                        </Col>
                    </Row>

                </div>
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.step5PageValid ? 'disabled' : '')} onClick={this.proceedToNext} aria-hidden="true"></i>

                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default Step5Component;



