import React, { Component } from 'react';
import '../createfund.component.css';
 import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class Step3Component extends Component {

    constructor(props){
        super(props);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
    }

    proceedToNext() {
        this.props.history.push('/createfund/step4');
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/step2');
    }
    

    render() {
        return (
            <div className="step3Class">
                <h1 className="uploadFundDocument">Upload Fund Documents - 1 of 2</h1>
                <div className="chooseFileMargin">
                    <h1 className="titleChooseFile">Choose files to upload</h1>
                    <p className="titleChooseSubtext">Choose document files to upload. Accepted files information appears here.</p>
                    <div className="uplodFileContainer">
                        <Button type="button" className="uploadFileBox fsnetBtn ">Upload File</Button>
                        <span className="uploadFileSubtext">Or drop files from your desktop to upload. Files should not exceed 10MB.</span>
                    </div>
                </div>
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}

export default Step3Component;



