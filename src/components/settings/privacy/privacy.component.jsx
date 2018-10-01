import React, { Component } from 'react';
import '../settings.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Link } from "react-router-dom";
import { Row,Col, Button, FormGroup, Radio} from 'react-bootstrap';
import 'react-phone-number-input/rrui.css'
import 'react-phone-number-input/style.css'

class privacyComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            allowGPdelegatesToSign: true,
            isImporsonatingAllowed:true
        }

    }

    componentDidMount() {
        
    }


    
    render() {
        return (
            <div className="width100 privacy-container">
                <div className="main-heading"><span className="main-title">Settings</span><Link to="/dashboard" className="cancel-fund">Cancel</Link></div>
                <div className="profileContainer">
                    <h1 className="title">Privacy Options</h1>
                    <div className="subText">Allow FSNET admin access to view and edit firm Funds? This will allow an admin to impersonate a GP from firm and take actions on their behalf</div>
                    <Radio name="isImporsonatingAllowed" className="marginLeft15" inline>
                        On
                        <span className="radio-checkmark"></span>
                    </Radio>
                    <Radio name="isImporsonatingAllowed" className="marginLeft15" inline>
                        Off
                        <span className="radio-checkmark"></span>
                    </Radio>
                    <div className="subText">Allow GP delegates to sign documents on behalf of GP?</div>
                    <FormGroup>
                        <Radio name="allowGPdelegatesToSign" className="marginLeft15" inline>
                            On
                            <span className="radio-checkmark"></span>
                        </Radio>
                        <Radio name="allowGPdelegatesToSign" className="marginLeft15" inline>
                            Off
                            <span className="radio-checkmark"></span>
                        </Radio>
                    </FormGroup>
                </div>
                <div className="footer-profile">
                    <Button type="button" className="fsnetSubmitButton btnEnabled">Save Changes</Button>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default privacyComponent;

