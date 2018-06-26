import { Constants } from '../constants/constants';

var axios = require('axios');

export class Fsnethttp{

    constructor(){
        this.Constants = new Constants();
        this.axiosInstance = axios.create();
    }

    // Get email id of the user using ID from the url.
    getInviationData(data){
         return axios.post(this.Constants.BASE_URL+'getInviationData', data);
    }

}
