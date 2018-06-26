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
            isRememberMe: false
        }
        this.navigateToLogin = this.navigateToLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadBtnClick = this.uploadBtnClick.bind(this);
        this.removeImageBtn = this.removeImageBtn.bind(this);
        this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
        this.signUpFn = this.signUpFn.bind(this);
    }

    handleChange(event) {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            this.imageFile = event.target.files[0];
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

    handleInputChangeEvent(event,type) {
        switch(type) {
            case 'username':
                this.setState({
                    userName: event.target.value
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
        }
        this.setState({
            errorMessage: ''
        })
    }

    signUpFn() {
        let errosArr = [];
        if(this.state.password != this.state.confirmPassword) {
            errosArr.push(this.Constants.REQUIRED_PASSWORD_CONFIRMPASSWORD_SAME)
        } 
        if(!this.state.isRememberMe) {
            errosArr.push(this.Constants.TERMS_CONDITIONS)
        }
        let phoneNumberRegex = /^\+[1-9]{1}[0-9]{3,14}$/;
        if(!phoneNumberRegex.test(this.state.mobileNumber)) {
            errosArr.push(this.Constants.MOBILE_NUMBER_FORMAT)
        }

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
        if(userAccessId) {
            this.Fsnethttp.getInviationData(userAccessId).then(result=>{
                if(result.data) {
                    this.setState({
                        email:result.data.data.email
                    })
                }
                this.close();
            })
            .catch(error=>{
                console.log(error)
                this.close();
            });
        }
    }

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
                        <div className="homeLink cursor">Home</div>
                    </Col>
                </Row>
                <Row className="registerContainer">
                    <div className="topBorder"></div>
                    <div className="parentDiv">
                        <h1 className="register-text">FSNET Account registration</h1>
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <label className="label-text">Username</label>
                                <input type="text" name="username" className="inputFormControl" placeholder="John Doe" onChange={(e) => this.handleInputChangeEvent(e,'username')}/>
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
                        <Row>
                            <Col lg={6} md={6} sm={6} xs={12} className="width40">
                                <img src={this.state.currentUserImage} className="profile-pic"/>
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
                        <label className="rememberLabel">By Checking this box you agree to <a>FSNET's Terms of service</a></label>
                        <pre className="error">{this.state.errorMessage}</pre>
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

