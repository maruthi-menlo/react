import React, { Component } from 'react';

class PageNotFoundComponent extends Component{

    render(){
        return(
            <div className="text-center">
                <h1>Bad Request.</h1><br/>
                <a href="/login">Click here</a> <span>to go back Home.</span>
            </div>
        );
    }
}

export default PageNotFoundComponent;

