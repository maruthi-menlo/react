import React, { Component } from 'react';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Row, Col } from 'react-bootstrap';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import HeaderComponent from '../../header/header.component';
import homeImage from '../../../images/home.png';
import fundLogoSample from '../../../images/fund_logo_sample.png';
import successImage from '../../../images/success-small.png';
import helpImage from '../../../images/help.png';
import signFundImg from '../../../images/edit-grey.svg';
import copyImage from '../../../images/copy_img.svg';
import handShakeImage from '../../../images/handshake.svg';
import { Route, Link } from "react-router-dom";
import { PubSub } from 'pubsub-js';
import { FsnetUtil } from '../../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';
import vanillaLogo from '../../../images/Vanilla-white.png';

class sideLettersComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.state = {
            showModal: false,
            showSideNav: true,
           
        }

    }

    componentWillUnmount() {

    }

    componentDidMount() {
       
    }

 

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    hamburgerClick() {
        if (this.state.showSideNav == true) {
            this.setState({
                showSideNav: false
            })
        } else {
            this.setState({
                showSideNav: true
            })
        }
    }

    
    render() {
        const { match } = this.props;
        return (
            <div className="lpSubFormStyle" id="">
                Side Letters
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default sideLettersComponent;

