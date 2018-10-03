import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginComponent from '../components/login/login.componet';
import RegisterComponent from '../components/register/register.component';
import PageNotFoundComponent from '../components/pagenotfound/pagenotfound.component';
import DashboardComponent from '../components/dashboard/dashboard.component';
import TermsAndConditionsComponent from '../components/termsandconditions/termsandconditions.component';
import ForgotPasswordComponent from '../components/forgotpassword/forgotpassword.component';
import CreateFundComponent from '../components/createfund/createfund.component';
import editFundComponent from '../components/editfund/editfund.component';
import CreateVcFirmComponent from '../components/admin/createvcfirm.component';
import LpSubscriptionFormComponent from '../components/lp/lpsubscriptionform.component';
import SettingsComponent from '../components/settings/settings.component';
import DocusignDocumentComponent from '../components/docusign/docusigndocument.component';

class FsnetRouter extends Component{

    render(){
        return(
            <Router>
                <div>
                    <Switch>
                        <Route exact path='/' component={LoginComponent}/> 
                        <Route exact path='/login' component={LoginComponent}/> 
                        <Route exact path='/register/*' component={RegisterComponent}/> 
                        <Route path='/404' component={PageNotFoundComponent}/>
                        <Route path='/dashboard' component={DashboardComponent}/>
                        <Route path='/terms-and-conditions' component={TermsAndConditionsComponent}/>
                        <Route path='/forgot-password' component={ForgotPasswordComponent}/>
                        <Route path='/createfund' component={CreateFundComponent}/>
                        <Route path='/admin' component={CreateVcFirmComponent}/>
                        <Route path='/lp' component={LpSubscriptionFormComponent}/>
                        <Route path='/fund' component={editFundComponent}/>
                        <Route path='/settings' component={SettingsComponent}/>
                        <Route path='/docusign/response*' component={DocusignDocumentComponent}/>
                        <Redirect from='*' to='/404'/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default FsnetRouter;