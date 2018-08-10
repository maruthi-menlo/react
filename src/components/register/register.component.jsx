import React, { Component } from 'react';
import './register.component.css';
import { Row,Col, Button, Checkbox as CBox, FormControl} from 'react-bootstrap';
import {Fsnethttp} from '../../services/fsnethttp';
import {Constants} from '../../constants/constants';
import userDefaultImage from '../../images/default_user.png';
import Loader from '../../widgets/loader/loader.component';
import  HeaderComponent from '../authheader/header.component'
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'
import successImage from '../../images/success.png';
import { reactLocalStorage } from 'reactjs-localstorage';

class RegisterComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            userImageName: 'Profile_Pic.jpg',
            currentUserImage: userDefaultImage,
            profilePicFile: {},
            email:'',
            userName:'',
            mobileNumber:'',
            cellNumber:'',
            confirmPassword:'',
            password:'',
            errorMessage:'',
            fsnetTermsandServices: false,
            userNameExists:'',
            userAccessId: '',
            invalidInvitationCode:'',
            showRegisterScreen: false,
            passwordEmptyMsz: '',
            confirmPasswordEmptyMsz: '',
            cellNumberEmptyMsz:'',
            termsandConditionsRequired:'',
            showSuccesScreen:false,
            isFormValid: false,
            isUserNameValid: false,
            isPasswordValid: false,
            isCnfrmPasswordValid: false,
            isCellNumberValid: false,
            fsnetTermsandServicesValid: false,
            userNameBorder: false,
            passwordBorder: false,
            confirmPasswordBorder: false,
            cellNumberBorder: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.uploadBtnClick = this.uploadBtnClick.bind(this);
        this.removeImageBtn = this.removeImageBtn.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.signUpFn = this.signUpFn.bind(this);
        this.checkUserNameExists = this.checkUserNameExists.bind(this);
        this.checkValidations = this.checkValidations.bind(this);
        this.navigateToLogin = this.navigateToLogin.bind(this);
    }

    //Navigate to login
    navigateToLogin() {
        this.props.history.push('/login');
    }

    //Reset all state values to default value.
    componentWillUnmount() {
        this.setState({
            userImageName: 'Profile_Pic.jpg',
            currentUserImage: userDefaultImage,
            profilePicFile: {},
            email:'',
            userName:'',
            mobileNumber:'',
            cellNumber:'',
            confirmPassword:'',
            password:'',
            errorMessage:'',
            fsnetTermsandServices: false,
            userNameExists:'',
            userAccessId: '',
            invalidInvitationCode:'',
            showRegisterScreen: false,
            passwordEmptyMsz: '',
            confirmPasswordEmptyMsz: '',
            cellNumberEmptyMsz:'',
            termsandConditionsRequired:'',
            showSuccesScreen:false,
            isFormValid: false,
            isUserNameValid: false,
            isPasswordValid: false,
            isCnfrmPasswordValid: false,
            isCellNumberValid: false,
            userNameBorder: false,
            passwordBorder: false,
            confirmPasswordBorder: false,
            cellNumberBorder: false,
        });
    }


     // Update state params values and login button visibility

     updateStateParams(updatedDataObject){
        this.setState(updatedDataObject, ()=>{
            this.enableDisableLoginButtion();
        });
    }

    // Enable / Disble functionality of Login Button

    enableDisableLoginButtion(){
        let status = (this.state.isUserNameValid && this.state.isPasswordValid && this.state.isCnfrmPasswordValid && this.state.isCellNumberValid && this.state.fsnetTermsandServicesValid ) ? true : false;
        this.setState({
            isFormValid : status
        });
    }

    //USer profile pic upload.
    handleChange(event) {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            this.imageFile = event.target.files[0];
            //Change user profile image size limit here.
            if(this.imageFile.size <=1600000) {
                    this.setState({
                        profilePicFile : event.target.files[0],
                    });
                reader.readAsDataURL(this.imageFile);
                this.setState({
                    userImageName: event.target.files[0].name
                });
                reader.onload = () => {
                    this.setState({
                        currentUserImage : reader.result,
                    });
                }
            } else {
               alert('Please upload image Maximum file size : 512X512')
            }
        }
    }

    //Onchange event for all input text boxes.
    handleInputChangeEvent(event,type) {
        let dataObj = {}; 
        switch(type) {
            case 'username':
                //Add username value to state
                //Clear the username exists message
                if(event.target.value === '' || event.target.value === undefined) {
                    this.setState({
                        userNameExists: this.Constants.LOGIN_USER_NAME_REQUIRED,
                        isUserNameValid: false,
                        userNameBorder: true,
                        userName: ''
                    })
                    window.scrollTo(300, 0)                    
                    dataObj ={
                        isUserNameValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        userName: event.target.value,
                        userNameExists: '',
                        isUserNameValid: true,
                        userNameBorder: false,
                    })
                    dataObj ={
                        isUserNameValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'password':
                if(event.target.value === '' || event.target.value === undefined) {
                    this.setState({
                        passwordEmptyMsz: this.Constants.LOGIN_PASSWORD_REQUIRED,
                        isPasswordValid: false,
                        passwordBorder: true,
                    })
                    dataObj ={
                        isPasswordValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        password: event.target.value,
                        passwordEmptyMsz: '',
                        isPasswordValid: true,
                        passwordBorder: false,
                    })
                    dataObj ={
                        isPasswordValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'confirmPassword':
                if(event.target.value === '' || event.target.value === undefined) {
                    this.setState({
                        confirmPasswordEmptyMsz: this.Constants.LOGIN_PASSWORD_REQUIRED,
                        isCnfrmPasswordValid: false,
                        confirmPasswordBorder: true,
                    })
                    dataObj ={
                        isCnfrmPasswordValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        confirmPassword: event.target.value,
                        confirmPasswordEmptyMsz: '',
                        isCnfrmPasswordValid: true,
                        confirmPasswordBorder: false,
                    })
                    dataObj ={
                        isCnfrmPasswordValid :true
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            case 'cellNumber':
                if(event === '' || event === undefined) {
                    this.setState({
                        cellNumberEmptyMsz: this.Constants.CELL_NUMBER_REQUIRED,
                        isCellNumberValid: false,
                        cellNumberBorder: true,
                    })
                    dataObj ={
                        isCellNumberValid :false
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        cellNumber: event,
                        cellNumberEmptyMsz: '',
                        isCellNumberValid: true,
                        cellNumberBorder: false,
                    })
                    // document.getElementsByClassName('react-phone-number-input').style.borderColor = "#526173";
                    dataObj ={
                        isCnfrmPasswordValid :true
                    };
                    this.updateStateParams(dataObj);
                }
            // console.log(event)
            // console.log(event.target.value)
                // this.setState({
                //     mobileNumber: event.target.value
                // })
                break;
            // case 'cellNumber':
            //     this.setState({
            //         cellNumber: event,
            //         cellNumberEmptyMsz:''
            //     })
            //     break;
            case 'fsnetTermsandServices':
                if(event.target.checked) {
                    this.setState({
                        fsnetTermsandServices : event.target.checked,
                        termsandConditionsRequired:'',
                        fsnetTermsandServicesValid: true
                    })
                    dataObj ={
                        fsnetTermsandServicesValid :true
                    };
                    this.updateStateParams(dataObj);
                } else {
                    this.setState({
                        termsandConditionsRequired: this.Constants.TERMS_CONDITIONS,
                        fsnetTermsandServices : event.target.checked,
                        fsnetTermsandServicesValid:false,
                    })
                    dataObj ={
                        fsnetTermsandServicesValid :false
                    };
                    this.updateStateParams(dataObj);
                }
                break;
            default:
                // do nothing
        }
        this.setState({
            errorMessage: ''
        })
    }

    //Check username exists
    checkUserNameExists() {
        let username = this.state.userName.trim();
        let userNameSpaceRegex = /^[a-zA-Z0-9]+$/;
        if(username !== null && username !== '') {
            if(username.length >=5) {
                if(!userNameSpaceRegex.test(username)) {
                    this.setState({
                        userNameExists: this.Constants.USERNAME_FORMAT
                    });
                } else {
                    let obj = {username:username}
                    this.Fsnethttp.checkUserName(obj).then(result=>{
                        if(result && result.usernameAvaliable) {
                            this.setState({
                                userNameExists: '',
                                isUserNameValid: true,
                                userNameBorder: false,
                            })
                            let dataObj = {};
                            dataObj ={
                                isUserNameValid :true
                            };
                            this.updateStateParams(dataObj);
                        }
                    })
                    .catch(error=>{
                        if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                            this.setState({
                                userNameExists: error.response.data.errors[0].msg,
                                isUserNameValid: false,
                                userNameBorder: true,
                            });
                            let dataObj = {};
                            dataObj ={
                                isUserNameValid :false
                            };
                            this.updateStateParams(dataObj);
                        }
                    });
                }
            } else {
                this.setState({
                    userNameExists: this.Constants.USERNAME_MIN_CHARCTERS,
                    isUserNameValid: false,
                    userNameBorder: true,
                });
            }
            
        }

        if(username === '' || username === null || username === undefined) {
            let dataObj = {};
            this.setState({
                userNameExists: this.Constants.LOGIN_USER_NAME_REQUIRED,
                isUserNameValid: false,
                userNameBorder: true,
                userName: ''
            })
            dataObj ={
                isUserNameValid :false
            };
            this.updateStateParams(dataObj);
        }
    }

    //signup button click functionality
    signUpFn() {
        let error = this.checkValidations();
        
        if(!error && this.state.email.trim() !== '' && this.state.userAccessId !== '') {
            this.open();
            //call the signup api
            var formData = new FormData();
            formData.append("username", this.state.userName);
            formData.append("password", this.state.password);
            formData.append("email", this.state.email);
            formData.append("emailConfirmCode", this.state.userAccessId);
            formData.append("cellNumber", this.state.cellNumber);
            if(this.state.userImageName !== '') {
                formData.append("profilePic", this.state.profilePicFile);
            }
            if(this.state.homeNumber !== '' && this.state.homeNumber !== undefined) {
                formData.append("homeNumber", this.state.mobileNumber);
            }
            this.Fsnethttp.register(formData).then(result=>{
                this.close();
                this.setState({
                    showSuccesScreen: true
                })
            })
            .catch(error=>{
                this.close();
                if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        errorMessage: error.response.data.errors[0].msg,
                    });
                } else {
                    this.setState({
                        errorMessage: this.Constants.INTERNAL_SERVER_ERROR,
                    });

                }
            });
            
        }
    }

    checkValidations() {
        let errosArr = [];
        let registerError = false;
        //Check Username is null
        if(this.state.userName.trim() === '') {
            window.scrollTo(300, 0)
            registerError = true;
            this.setState({
                userNameExists: this.Constants.LOGIN_USER_NAME_REQUIRED
            })
        }
        if(this.state.password.trim() === '') {
            registerError = true;
            this.setState({
                passwordEmptyMsz: this.Constants.LOGIN_PASSWORD_REQUIRED
            })
        }
        if(this.state.confirmPassword.trim() === '') {
            registerError = true;
            this.setState({
                confirmPasswordEmptyMsz: this.Constants.LOGIN_PASSWORD_REQUIRED
            })
        }
        if(this.state.cellNumber === '' || this.state.cellNumber === undefined) {
            registerError = true;
            this.setState({
                cellNumberEmptyMsz: this.Constants.CELL_NUMBER_REQUIRED
            })
        } 
        else if(this.state.cellNumber.length < 12 || this.state.cellNumber.length > 13) {
            registerError = true;
            this.setState({
                cellNumberEmptyMsz: this.Constants.CELL_NUMBER_VALID
            })
        }

        let passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[?\{\}\|\(\)\`~!@#\$%\^&\*\[\]"\';:_\-<>\., =\+\/\\]).{8,}$/;
        //Check password and confirm password is same.
        //If both passwords are not same then show the error.
        if((this.state.password.trim() !== '' && this.state.confirmPassword.trim() !== '') &&(this.state.password !== this.state.confirmPassword)) {
            errosArr.push(this.Constants.REQUIRED_PASSWORD_CONFIRMPASSWORD_SAME)
        } 
        //Check password contains min 8 letters with letters, numbers and symbols.
        else if((!passwordRegex.test(this.state.password) || !passwordRegex.test(this.state.confirmPassword)) && (this.state.password.trim() !== '' && this.state.confirmPassword.trim() !== '')) {
            errosArr.push(this.Constants.PASSWORD_RULE_MESSAGE)
        }

        //Need to agree FSNET's Terms of service checkbox
        if(!this.state.fsnetTermsandServices) {
            registerError = true;
            this.setState({
                termsandConditionsRequired: this.Constants.TERMS_CONDITIONS
            })
        }

        //Phone number validation
        //Change the regex if needed to support below format
        //[+][country code][area code][phone number]
        // let phoneNumberRegex = /^\+[1-9]{1}[0-9]{3,14}$/;
        // if(!phoneNumberRegex.test(this.state.cellNumber)) {
        //     errosArr.push(this.Constants.MOBILE_NUMBER_FORMAT)
        // }

        //append all the errors to one string.
        if(errosArr.length >0) {
            let error = '';
            let idx = 1;
            for(let index of errosArr) {
                error = error+index+"\n";
                idx++;
            }
            this.setState({
                errorMessage: error
            })
            return true;
        } else if(registerError){
            return true;
        } else {
            return false;
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

    componentDidMount() {
        this.open();
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        let url = window.location.href;
        let getId = url.split('register/');
        let userAccessId = getId[1];
        //In register url get the id to get the user details
        //If id is not present in url then redirect to 404.
        if(userAccessId) {
            this.Fsnethttp.getInviationData(userAccessId).then(result=>{
                //Clear the local storage
                reactLocalStorage.clear();
                if(result.data) {
                    this.setState({
                        email:result.data.data.email,
                        userAccessId:userAccessId,
                        showRegisterScreen:true
                    })
                }
                this.close();
            })
            .catch(error=>{
                this.close();
                if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        invalidInvitationCode: error.response.data.errors[0].msg,
                        showRegisterScreen:false
                    });
                } else {
                    this.setState({
                        invalidInvitationCode: this.Constants.INTERNAL_SERVER_ERROR,
                    });
                }
            });
        } else {
            this.close();
            this.props.history.push('/404');
        }
    }

    //Clear the image when user click on remove button
    //Clear the image name from state
    //Clear the input file value
    removeImageBtn() {
        this.setState({
            userImageName: 'Profile_Pic.jpg',
            currentUserImage : userDefaultImage,
            profilePicFile:{}
        });
        document.getElementById('uploadBtn').value = "";
    }

    uploadBtnClick() {
        document.getElementById('uploadBtn').click();
    }

    render(){
        return(
            <div className="parentContainer" id="registerContainer">            
                <div className="text-center" hidden={this.state.showRegisterScreen}>
                    <h1>{this.state.invalidInvitationCode}</h1>
                </div>
                <div hidden={!this.state.showRegisterScreen}>
                    <HeaderComponent ></HeaderComponent>
                </div>
                <Row className="registerContainer" hidden={!this.state.showRegisterScreen || this.state.showSuccesScreen}>
                    <div className="topBorder"></div>
                    <div className="parentDiv">
                        <h1 className="register-text">FSNET Account registration</h1>
                        <div className="mandatory-content">Fill in the form below to register for your account. Fields marked with an * are mandatory.</div>
                        <div className="mandatory-content">Password should contain a minimum of eight characters with at least one letter, one number, and one special character.</div>
                        <form>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Username*</label>
                                <FormControl type="text" name="username" className={"inputFormControl " + (this.state.userNameBorder ? 'inputError' : '')} value= {this.state.userName} maxLength="200" placeholder="John Doe" onChange={(e) => this.handleInputChangeEvent(e,'username')} onBlur={this.checkUserNameExists}/>
                                <span className="error">{this.state.userNameExists}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Email Address</label>
                                <FormControl type="text" name="email" disabled className="inputFormControl opacityInput" id="email" placeholder="JohnDoe@gmail.com" value={this.state.email}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Password*</label>
                                <FormControl type="password" name="password" className={"inputFormControl " + (this.state.passwordBorder ? 'inputError' : '')} placeholder="Password" onChange={(e) => this.handleInputChangeEvent(e,'password')} onBlur={(e) => this.handleInputChangeEvent(e,'password')}/>
                                <span className="error">{this.state.passwordEmptyMsz}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Password Confirm*</label>
                                <FormControl type="password" name="confirmPassword" className={"inputFormControl " + (this.state.confirmPasswordBorder ? 'inputError' : '')} placeholder="Password" onChange={(e) => this.handleInputChangeEvent(e,'confirmPassword')} onBlur={(e) => this.handleInputChangeEvent(e,'confirmPassword')}/>
                                <span className="error">{this.state.confirmPasswordEmptyMsz}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Phone Number (Cell)*</label>
                                <PhoneInput className={(this.state.cellNumberBorder ? 'inputError' : '')} maxLength="14" placeholder="(123) 456-7890" value={ this.state.cellNumber } country="US" onChange={phone => this.handleInputChangeEvent(phone,'cellNumber')} />
                                <span className="error">{this.state.cellNumberEmptyMsz}</span>
                            </Col>
                            {/* <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Phone Number (Main)</label>
                                <PhoneInput maxLength="14" placeholder="(123) 456-7890" value={ this.state.mobileNumber } country="US" onChange={ phone => this.setState({ mobileNumber: phone }) }/>
                            </Col> */}
                        </Row>
                        <label className="profile-text">Profile Picture: (Image must not exceed 512 x 512)</label>
                        <Row className="profile-Row profileMargin">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <img src={this.state.currentUserImage} alt="profile-pic" className="profile-pic"/>
                                <span className="profilePicName">{this.state.userImageName}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <input type="file" id="uploadBtn" className="hide" onChange={ (e) => this.handleChange(e) } />
                                <Button className="uploadFile fsnetBtn" onClick={this.uploadBtnClick}>Upload File</Button> <br/>
                                <label className="removeBtn" onClick={this.removeImageBtn}>Remove</label>
                            </Col>
                        </Row>
                        <CBox checked={this.state.fsnetTermsandServices} className="" onChange={(e) => this.handleInputChangeEvent(e,'fsnetTermsandServices')}>
                        <span className="checkmark"></span>
                        </CBox>
                        <label className="rememberLabel remember-text">By checking this box you agree to  <a>FSNET&apos;s Terms of Service</a></label><br/>
                        <div className="error marginTopminus10">{this.state.termsandConditionsRequired}</div>
                        <div className="error">{this.state.errorMessage}</div>
                        <Button className={"signupBtn "+ (this.state.isFormValid ? 'btnEnabled' : '') } disabled={!this.state.isFormValid} onClick={this.signUpFn}>Sign Up</Button>
                        <label className="signIn-text"> <a href="/login">Already have an account? Sign In</a></label>
                        </form>
                    </div>
                    <div className="topBorder bottomBorder"></div>
                    <Loader isShow={this.state.showModal}></Loader>
                </Row>
                <Row hidden={!this.state.showSuccesScreen} className="sucess-row">
                    <div className="topBorder"></div>
                    <Col lg={12} md={12} sm={12} xs={12}>
                        <label className="register-success-text">Success</label>
                        <label className="register-reset-text">Your account has been created</label>
                        <div className="success-icon">
                            {/* <i className="fa fa-check-circle" aria-hidden="true"></i> */}
                            <img src={successImage} alt="success"/>
                        </div>
                        <div className="text-center">
                            <Button className="register-submit" onClick={this.navigateToLogin}>Proceed to Login</Button> <br/>
                        </div>
                    </Col>
                </Row>

            </div>
        );
    }
}

export default RegisterComponent;

