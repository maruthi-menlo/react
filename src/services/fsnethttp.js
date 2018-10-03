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

    //Get forgotPasswordGetUsername
    forgotPasswordGetUsername(obj) {
        return axios.post(this.Constants.BASE_URL+'forgotPasswordGetUsername', obj);
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
        return axios.get(this.Constants.BASE_URL+'fund/lpList/'+firmId+'/'+fundId);
    }

    //Get LP's Sort
    getLpSort(firmId,fundId, headers,colName,sortVal) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'fund/lpList/'+firmId+'/'+fundId+ '/'+colName+'/'+sortVal);
    }

    //Invite Gp Delegates to the fund
    addGpDelegate(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/gpDelegate/invite', obj);
    }

    checkEmail(url, obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+url, obj);
    }

    //Invite LP to the fund
    addLp(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/add/lp', obj);
    }

    //Remove LP to the fund
     removeLp(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/removeLp', obj);
    }

    //Deactivate fund
    deactivateFund(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/deactivate', obj);
    }
   
    //send reminder to LP
    sendReminder(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/sendRemainder', obj);
    }

    //Remove LP to the fund
    removeGp(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/removeFundGpDeleate', obj);
    }

    //Assign GP delegates to the fund.
    assignDelegatesToFund(obj,headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/asssingGpDelegate', obj);
    }

    //Assign LP to the fund.
    assignLpToFund(obj,headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/asssinglp', obj);
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

    //Get fund Info
    getFundInfo(id, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'fund/view/info/'+id);
    }

    //Get fund
    getFundDetails(params, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        let url = `${this.Constants.BASE_URL}fund/view/${params.fundId}?status=${params.status}&offset=${params.offset}&orderCol=${params.orderCol}&order=${params.order}`;
        return axios.get(url);
    }

    //Get search based list of funds
    getSearchFunds(headers, name) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'funds/'+name);
    }

    //Start Fund API
    startFund(fundId, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/publish', fundId);
    }

    //Upload patnership document
    uploadDocumentToFund(fundId, headers, obj) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
        return axios.post(this.Constants.BASE_URL+'fund/document/add/'+fundId, obj);
    }

    /************LP Subscription API Calls Start***************/
    //Get LP funds
    getListOfLpFunds(headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'lp/fund/list');
    }
    //Get LP Subscription details
    getLpSubscriptionDetails(id, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'lp/subscription/'+id);
    }

    //Update LP Subscription details
    updateLpSubscriptionDetails(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'lp/subscription', obj);
    }

    //Reject Fund
    rejectGPInvitedFund(headers, obj) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        return axios.post(this.Constants.BASE_URL+'lp/fund/reject', obj);
    }
    
    //Accept Fund
    acceptGPInvitedFund(headers, obj) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        axios.defaults.headers.common['Content-Type'] = 'application/json';
        return axios.post(this.Constants.BASE_URL+'lp/fund/accept', obj);
    }

    //Get Investor Sub Types
    getInvestorSubTypes(headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'getInvestorSubType/LLC');
    }

    //Get Investor Sub Types
    getInvestorTrustSubTypes(headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'getInvestorSubType/Trust');
    }

    //Get Investor Sub Types
    submitSubscription(id, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'pdf/'+id);
    }

    //Get Jurisdiction Types
    getJurisdictionTypes(headers, url) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+url);
    }

    //Invite Gp Delegates to the fund
    addLpDelegate(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/lpDelegate/invite', obj);
    }

    //Get LP Delegates
    getLpDelegates(id,headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'fund/lpDelegateList/'+id);
    }

    //Remove LP Delegate
    removeLpDelegate(obj, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.post(this.Constants.BASE_URL+'fund/removeFundLpDeleate', obj);
    }

    //get All Countries
    getAllCountires(headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'getAllCountires');
    }

    //get All State
    getUSStates(headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+'getUSStates');
    }

    //get All states by country
    getStates(countryId, headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+`getStates/${countryId}`);
    }

    //Get Docusign URL
    getAggrement(envelopId,headers, subscriptionId) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+`getPartnershipAgreement/${envelopId}/${subscriptionId}`);
    }
    /************LP Subscription API Calls End****************/
    /************Docusign API Calls Start****************/
    envelopStatus(envelopId,headers) {
        axios.defaults.headers.common['x-auth-token'] = headers.token;
        return axios.get(this.Constants.BASE_URL+`recipients/status/${envelopId}`);
    }
    /************Docusign API Calls End****************/
}
