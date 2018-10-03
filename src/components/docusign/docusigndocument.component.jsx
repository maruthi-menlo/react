
import React, { Component } from 'react';
import './docusigndocument.component.css';
import { FsnetAuth } from '../../services/fsnetauth';
import { Row } from 'react-bootstrap';
import { Fsnethttp } from '../../services/fsnethttp';
import { FsnetUtil } from '../../util/util';
import Loader from '../../widgets/loader/loader.component';
import { reactLocalStorage } from 'reactjs-localstorage';

class DocusignDocumentComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Fsnethttp = new Fsnethttp();
        this.FsnetUtil = new FsnetUtil();
        this.state = {
            
        }
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    // Get current loggedin user details
    //If token is undefined then redirect to login page 
    componentDidMount() {
        this.open();
        this.changeStatus();
    }

    changeStatus() {
        const envelopId = this.FsnetUtil.getEnvelopeId();
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        this.Fsnethttp.envelopStatus(envelopId, headers).then(result => {
            this.close();
            window.close();
        })
        .catch(error => {
            this.close();
            window.close();
        });
    }
    

    render() {
        return (
            <Row className="dashboardContainer" id="MainDashboard">
                <Loader isShow={this.state.showModal}></Loader>
            </Row>
        );
    }
}

export default DocusignDocumentComponent;

