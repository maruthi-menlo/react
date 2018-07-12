import React, { Component } from 'react';
import '../createfund.component.css';
 import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class Step4Component extends Component {

    constructor(props){
        super(props);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
    }

    proceedToNext() {
        this.props.history.push('/createfund/step5');
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/step3');
    }


    render() {
        return (
            <div className="step4Class">
                <h1 className="viewApproveForm">View and Approve Form</h1>
                <p className="viewApproveSubtext">View and verify the fund document </p>
                <div>
                    <Button type="button" className="printButton">Print</Button>
                    <Button type="button" className="approveDocumentButton">Approve Document</Button>
                </div>    
                <div className="documentViewWindow">
                <span className="documentViewText">Document Viewing Window</span>
                </div>  
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>  
            </div>
        );
    }
}

export default Step4Component;



