import React, { Component } from 'react';
import '../lpsubscriptionform.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Radio, Row, Col, FormControl } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';

class confirmComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.Fsnethttp = new Fsnethttp();
        this.state = {
            showModal: false,
        }

    }

    componentDidMount() {

    }

    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    render() {
        return (
            <div className="confirm width100">
                <div className="form-grid formGridDivMargin min-height-400">
                        <Row className="step1Form-row">
                            <Col xs={12} md={12}>
                                <label className="form-label width100">Based on your input, the Fund will hold your interest in the following name:  [John Smith and Judy Smith], [Tenants in Common].  Is this acceptable?</label>
                                <Radio name="confirmCheck" inline id="yesCheckbox">&nbsp; Yes
                                    <span className="radio-checkmark"></span>
                                </Radio>
                                <Radio name="confirmCheck" inline id="yesCheckbox">&nbsp; No
                                    <span className="radio-checkmark"></span>
                                </Radio>
                            </Col>
                        </Row>
                </div>

                <div className="footer-nav footerDivAlign">
                    <i className="fa fa-chevron-left disabled" aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}

export default confirmComponent;

