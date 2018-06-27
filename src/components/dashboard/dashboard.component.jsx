
import React, { Component } from 'react';
import './dashboard.component.css';
import { FsnetAuth } from'../../services/fsnetauth';

class DashboardComponent extends Component{

    constructor(props){
        super(props);
        this.FsnetAuth = new FsnetAuth();
    }

    // Get current loggedin user details
    //If token is undefined then redirect to login page 
    componentDidMount() {
        if(this.FsnetAuth.isAuthenticated()){
            //Get user obj from local storage.
        }else{
            this.props.history.push('/');
        }        
    }

    render(){
        return(
            <h1>
                Dashboard screen works!!
            </h1>
        );
    }
}

export default DashboardComponent;

