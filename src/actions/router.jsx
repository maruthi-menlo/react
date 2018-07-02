import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginComponent from '../components/login/login.componet';
import RegisterComponent from '../components/register/register.component';
import PageNotFoundComponent from '../components/pagenotfound/pagenotfound.component';
import DashboardComponent from '../components/dashboard/dashboard.component';
import TermsAndConditionsComponent from '../components/termsandconditions/termsandconditions.component';
import ForgotPasswordComponent from '../components/forgotpassword/forgotpassword.component';

class FsnetRouter extends Component{

    render(){
        return(
            <Router>
                <div>
                    <Switch>
                        <Route exact path='/' component={LoginComponent}/> 
                        <Route exact path='/login' component={LoginComponent}/> 
                        <Route exact path='/getInviationData/*' component={RegisterComponent}/> 
                        <Route path='/404' component={PageNotFoundComponent}/>
                        <Route path='/dashboard' component={DashboardComponent}/>
                        <Route path='/terms-and-conditions' component={TermsAndConditionsComponent}/>
                        <Route path='/forgot-password' component={ForgotPasswordComponent}/>
                        <Redirect from='*' to='/404'/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default FsnetRouter;