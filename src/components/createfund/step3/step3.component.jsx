import React, { Component } from 'react';
import '../createfund.component.css';
 import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class Step3Component extends Component {

    // constructor(props) {
    //     super(props);
    // }


    render() {
        return (
            <div>
                <h1 className="uploadFundDocument">Upload Fund Documents - 1 of 2</h1>
                <div className="chooseFileMargin">
                    <h1 className="titleChooseFile">Choose files to upload</h1>
                    <p className="titleChooseSubtext">Choose document files to upload. Accepted files information appears here.</p>
                    <div className="uplodFileContainer">
                        <Button type="button" className="uploadFileBox">Upload File</Button>
                        <span className="uploadFileSubtext">Or drop files from your desktop to upload. Files should not exceed 10MB.</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Step3Component;



