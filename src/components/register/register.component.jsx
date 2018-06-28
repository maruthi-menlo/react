import React, { Component } from 'react';
import './register.component.css';
import { Row,Col, Button, Checkbox as CBox} from 'react-bootstrap';
import {Fsnethttp} from '../../services/fsnethttp';
import {Constants} from '../../constants/constants';
import userDefaultImage from '../../images/default_user.png';
import Loader from '../../widgets/loader/loader.component';

class RegisterComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            userImageName: '',
            currentUserImage: userDefaultImage,
            email:'',
            userName:'',
            mobileNumber:'',
            confirmPassword:'',
            password:'',
            errorMessage:'',
            isRememberMe: false,
            userNameExists:'',
            userAccessId: ''
        }
        this.navigateToLogin = this.navigateToLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadBtnClick = this.uploadBtnClick.bind(this);
        this.removeImageBtn = this.removeImageBtn.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.signUpFn = this.signUpFn.bind(this);
        this.checkUserNameExists = this.checkUserNameExists.bind(this);
        this.checkValidations = this.checkValidations.bind(this);
    }

    //Reset all state values to default value.
    componentWillUnmount() {
        this.setState({
            userImageName: '',
            currentUserImage: userDefaultImage,
            email:'',
            userName:'',
            mobileNumber:'',
            confirmPassword:'',
            password:'',
            errorMessage:'',
            isRememberMe: false,
            userNameExists:'',
            userAccessId: ''
        });
    }

    //USer profile pic upload.
    handleChange(event) {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            this.imageFile = event.target.files[0];
            //Change user profile image size limit here.
            if(this.imageFile.size <=1600000) {
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
               alert('Please upload image Maximum file size : 160X160')
            }
        }
    }

    //Onchange event for all input text boxes.
    handleInputChangeEvent(event,type) {
        switch(type) {
            case 'username':
                //Add username value to state
                //Clear the username exists message
                this.setState({
                    userName: event.target.value,
                    userNameExists: ''
                })
                break;
            case 'password':
                this.setState({
                    password: event.target.value
                })
                break;
            case 'confirmPassword':
                this.setState({
                    confirmPassword: event.target.value
                })
                break;
            case 'mobileNumber':
                this.setState({
                    mobileNumber: event.target.value
                })
                break;
            case 'isRememberMe':
                this.setState({
                    isRememberMe : event.target.checked
                });
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
        let username = this.state.userName;
        if(username !== null) {
            let obj = {username:username}
            this.Fsnethttp.checkUserName(obj).then(result=>{
                if(result && result.usernameAvaliable) {
                    this.setState({
                        userNameExists: ''
                    })
                }
            })
            .catch(error=>{
                if(error) {
                    this.setState({
                        userNameExists: this.Constants.USER_NAME_EXISTS
                    })
                }
            });
        }
    }

    //signup button click functionality
    signUpFn() {
        let error = this.checkValidations();
        if(!error) {
            //call the signup api
            let errorObj = {username:this.state.userName,password:this.state.password, confirmPassword:this.state.confirmPassword,rememberme:this.state.isRememberMe, email:this.state.email, id:this.state.userAccessId};
            if(this.state.userImageName !== '') {
                errorObj['userPic'] = this.state.currentUserImage
            }
            console.log(errorObj);
        }
    }

    checkValidations() {
        let errosArr = [];
        //Check password and confirm password is same.
        //If both passwords are not same then show the error.
        if(this.state.password !== this.state.confirmPassword) {
            errosArr.push(this.Constants.REQUIRED_PASSWORD_CONFIRMPASSWORD_SAME)
        } 

        //Need to agree FSNET's Terms of service checkbox
        if(!this.state.isRememberMe) {
            errosArr.push(this.Constants.TERMS_CONDITIONS)
        }

        //Phone number validation
        //Change the regex if needed to support below format
        //[+][country code][area code][phone number]
        let phoneNumberRegex = /^\+[1-9]{1}[0-9]{3,14}$/;
        if(!phoneNumberRegex.test(this.state.mobileNumber)) {
            errosArr.push(this.Constants.MOBILE_NUMBER_FORMAT)
        }

        //append all the errors to one string.
        if(errosArr.length >0) {
            let idx = 1;
            let error = '';
            for(let index of errosArr) {
                error = error+idx+'. '+index+"\n";
                idx++;
            }
            this.setState({
                errorMessage: error
            })
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
        let getId = url.split('id=');
        let userAccessId = getId[1];
        //In register url get the id to get the user details
        //If id is not present in url then redirect to 404.
        if(userAccessId) {
            this.Fsnethttp.getInviationData(userAccessId).then(result=>{
                if(result.data) {
                    this.setState({
                        email:result.data.data.email,
                        userAccessId:userAccessId
                    })
                }
                this.close();
            })
            .catch(error=>{
                this.close();
                this.props.history.push('/404');
            });
        } else {
            this.props.history.push('/404');
        }
    }

    //Clear the image when user click on remove button
    //Clear the image name from state
    //Clear the input file value
    removeImageBtn() {
        this.setState({
            userImageName: '',
            currentUserImage : userDefaultImage,
        });
        document.getElementById('uploadBtn').value = "";
    }

    uploadBtnClick() {
        document.getElementById('uploadBtn').click();
    }

    //Naviage to sign
    navigateToLogin() {
        this.props.history.push('/login');
    }

    render(){
        return(
            <div className="parentContainer">            
                <Row className="headerContainer"> 
                    <Col className="content"> 
                        <div className="logo cursor">FSNET LOGO</div>
                    </Col>
                    <Col className="content">
                        <div className="homeLink cursor"><a href="/login">Home</a></div>
                    </Col>
                </Row>
                <Row className="registerContainer">
                    <div className="topBorder"></div>
                    <div className="parentDiv">
                        <h1 className="register-text">FSNET Account registration</h1>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Username</label>
                                <input type="text" name="username" className="inputFormControl" placeholder="John Doe" onChange={(e) => this.handleInputChangeEvent(e,'username')} onBlur={this.checkUserNameExists}/><br/>
                                <span className="error">{this.state.userNameExists}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Email Address</label>
                                <input type="text" name="email" disabled className="inputFormControl" id="email" placeholder="JohnDoe@gmail.com" value={this.state.email}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Password</label>
                                <input type="password" name="password" className="inputFormControl" placeholder="Password" onChange={(e) => this.handleInputChangeEvent(e,'password')}/>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Password Again</label>
                                <input type="password" name="confirmPassword" className="inputFormControl" placeholder="Password" onChange={(e) => this.handleInputChangeEvent(e,'confirmPassword')}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Phone Number</label>
                                <input type="text" name="phoneNumber" className="inputFormControl" placeholder="(123) 4568-8910" onChange={(e) => this.handleInputChangeEvent(e,'mobileNumber')}/>
                            </Col>
                        </Row>
                        <label className="profile-text">Profile Picture:(Image must not exceed 160x160)</label>
                        <Row className="profile-Row">
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <img src={this.state.currentUserImage} alt="profile-pic" className="profile-pic"/>
                                <span className="profilePicName">{this.state.userImageName}</span>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <input type="file" id="uploadBtn" className="hide" onChange={ (e) => this.handleChange(e) } />
                                <Button className="uploadFile" onClick={this.uploadBtnClick}>Upload File</Button> <br/>
                                <label className="removeBtn" onClick={this.removeImageBtn}>Remove</label>
                            </Col>
                        </Row>
                        <CBox id="rememberme" className="cbRemeberMe" onChange={(e) => this.handleInputChangeEvent(e,'isRememberMe')}>
                        </CBox>
                        <label className="rememberLabel">By Checking this box you agree to <a href="/terms-and-conditions">FSNET's Terms of service</a></label>
                        <div className="error">{this.state.errorMessage}</div>
                        <Button className="signupBtn" onClick={this.signUpFn}>Sign Up</Button>
                        <label className="already-text" onClick={this.navigateToLogin}> Already have an account? Sign In</label>
                    </div>
                    <Loader isShow={this.state.showModal}></Loader>
                </Row>
            </div>
        );
    }
}

export default RegisterComponent;

