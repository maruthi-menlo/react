import React, { Component } from 'react';
import '../createfund.component.css';
 import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class Step4Component extends Component {

    // constructor(props) {
    //     super(props);
    // }


    render() {
        return (
            <div>
                <h1 className="viewApproveForm">View and Approve Form</h1>
                <p className="viewApproveSubtext">View and verify the fund document </p>
                <div>
                    <Button type="button" className="printButton">Print</Button>
                    <Button type="button" className="approveDocumentButton">Approve Document</Button>
                </div>    
                <div className="documentViewWindow">
                <span className="documentViewText">Document Viewing Window</span>
                </div>    
            </div>
        );
    }
}

export default Step4Component;



