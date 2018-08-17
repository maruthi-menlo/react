import React, { Component } from 'react';
import './header.component.css';
import { Row,Col} from 'react-bootstrap';
import vanillaLogo from '../../images/Vanilla.png';

class HeaderComponent extends Component{

    render(){
        return(
            <Row className="headerContainer"> 
                <a href="/login"><img src={vanillaLogo} alt="vanilla" className="vanilla-logo marginLeft30"/></a>
            </Row>
        );
    }
}

export default HeaderComponent;



