import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginComponent from '../components/login/login.componet';
import RegisterComponent from '../components/register/register.component';
import PageNotFoundComponent from '../components/pagenotfound/pagenotfound.component'

class FsnetRouter extends Component{

    render(){
        return(
            <Router>
                <div>
                    <Switch>
                        <Route exact path='/' component={LoginComponent}/> 
                        <Route exact path='/login' component={LoginComponent}/> 
                        <Route exact path='/register' component={RegisterComponent}/> 
                        <Route path='/404' component={PageNotFoundComponent}/>
                        <Redirect from='*' to='/404'/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default FsnetRouter;