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

}
