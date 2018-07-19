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

    //create vc frim
    createVcFirm(obj) {
        return axios.post(this.Constants.BASE_URL+'createVCFirm', obj);
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

    //remove upload files
    deleteFile(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'/fund/remove/file', obj);
    }

    //Get list of gp delegates
    getGpDelegates(firmId,fundId, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'fund/gpDelegateList/'+firmId+'/'+fundId);
    }

    //Get list of LP's
    getLp(firmId,fundId, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'fund/lpDelegateList/'+firmId+'/'+fundId);
    }

    //Get LP's Sort
    getLpSort(firmId,fundId, headers,colName,sortVal) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'fund/lpDelegateList/'+firmId+'/'+fundId+ '/'+colName+'/'+sortVal);
    }

    //Invite Gp Delegates to the fund
    addGpDelegate(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/gpDelegate/invite', obj);
    }

    //Invite LP to the fund
    addLp(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/lpDelegate/invite', obj);
    }

    //Assign GP delegates to the fund.
    assignDelegatesToFund(obj,headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/asssingGpDelegate', obj);
    }

    //Assign LP to the fund.
    assignLpToFund(obj,headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/asssingLpDelegate', obj);
    }

    //Get list of funds
    getListOfAllFunds(headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'funds');
    }

    //Get fund
    getFund(id, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'fund/'+id);
    }

    //Get search based list of funds
    getSearchFunds(headers, name) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'funds/'+name);
    }

    //Upload patnership document
    uploadDocumentToFund(firmId, headers, obj) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
        return axios.post(this.Constants.BASE_URL+'fund/document/add/'+firmId, obj);
    }
}
