import { Constants } from '../constants/constants';

var axios = require('axios');

export class Fsnethttp{

    constructor(){
        this.Constants = new Constants();
    }

    // Get email id of the user using ID from the url.
    getInviationData(data){
        return axios.get(this.Constants.BASE_URL+'getInviationData/'+data);
    }

    //check username exists
    checkUserName(userName) {
        return axios.post(this.Constants.BASE_URL+'isUsernameAvaliable', userName);
    }

    //User login
    login(userObj) {
        return axios.post(this.Constants.BASE_URL+'login', userObj);
    }

    //FSNET registration
    register(userObj) {
        return axios.post(this.Constants.BASE_URL+'register', userObj,{
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    }

    //Forgot password

    forgotPassword(obj) {
        return axios.post(this.Constants.BASE_URL+'forgotPassword', obj);
    }

    //Verify forgot password code
    verifycode(obj) {
        return axios.post(this.Constants.BASE_URL+'forgotPasswordTokenValidate', obj);
    }

    //Reset password
    resetPassword(obj) {
        return axios.post(this.Constants.BASE_URL+'resetPassword', obj);
    }

    //Create fund details step1
    fundStore(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/store', obj);
    }
}
