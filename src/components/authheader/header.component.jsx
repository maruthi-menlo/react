import React, { Component } from 'react';
import './header.component.css';
import { Row,Col} from 'react-bootstrap';

class HeaderComponent extends Component{

    render(){
        return(
            <Row className="headerContainer"> 
                <Col className="content"> 
                    <div className="logo cursor"><a href="/login">FSNET LOGO</a></div>
                </Col>
                {/* <Col className="content">
                    <div className="homeLink cursor"><a href="/login">Home</a></div>
                </Col> */}
            </Row>
        );
    }
}

export default HeaderComponent;



