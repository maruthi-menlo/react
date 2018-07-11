import React, { Component } from 'react';
import '../createfund.component.css';
import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import userDefaultImage from '../../../images/default_user.png';
class Step2Component extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div className="GpDelegatesContainer">
                <h1 className="assignGp">Assign GP Delegates</h1>
                <p className="Subtext">Select GP Delegate(s) from the list below or add a new one.</p>
                <Button className="gpDelegateButton">Gp Delegate</Button>
                <div className="checkBoxGpContainer">
                    <label className="Rectangle-6">
                    <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Ben Parker</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                    <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Jeff Lynne</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Kaitlyn Lopez</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Larry Croft</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Samrutha Karujika</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Sarmad Ahallah</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Terrence Osborne</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Virginia Tang</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Xiao Pang</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Zita Hoffenheimer</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                </div>
            </div>
        );
    }
}

export default Step2Component;



