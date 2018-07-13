import React, { Component } from 'react';
import '../createfund.component.css';
import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';
import staticImage from '../../../images/profilePic.jpg';

class Step6Component extends Component {

    constructor(props) {
        super(props);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.data=[
            {data1:"hello",data2:"Hello hi data1",data3:"Hello Hi data"},
            {data1:"hello",data2:"Hello hi data2",data3:"Hello Hi data"},
            {data1:"hello",data2:"Hello hi data3",data3:"Hello Hi data"},
            {data1:"hello",data2:"Hello hi data4",data3:"Hello Hi data"},
            {data1:"hello",data2:"Hello hi data5",data3:"Hello Hi data"}

        ]
        this.staticDataFromRow2=[
            {header1:"GP Delegates",header2:"Review delegates in sidebar and add or remove as necessary",href:"/createfund/step2",header3:"Change"},
            {header1:"Fund Documents",href1:"View Fund Documents",href2:"/createfund/step3",header3:"Change"},
            {header1:"Limited Partners",header2:"Review LP’s in sidebard and add or remove as necessary",href:"/createfund/step5",header3:"Change"}

        ]
        
    }

    proceedToNext() {
        this.props.history.push('/createfund/step6');
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/step5');
    }
    

    render() {
         var rowItems = this.staticDataFromRow2.map(function(dataObj) {
           return (               
                <Row className="step6-rows" >
                    <Col xs={3} md={3} sm={3} xs={6}>
                        <span className="col1">{dataObj.header1}</span>                    
                    </Col>
                    <Col xs={4} md={4} sm={4} xs={6}>
                        <span className="col2">{dataObj.href1 ? <a className="col2-redirection" href="/createfund/step4">{dataObj.href1}</a> :dataObj.header2}</span>
                    </Col>
                    <Col xs={3} md={3} sm={3} xs={6}>
                        <span className="col3"></span>
                    </Col>
                    <Col xs={2} md={2} sm={2} xs={6}>
                        <span className="col4"><a href={dataObj.href?dataObj.href:dataObj.href2}>{dataObj.header3}</a></span>
                    </Col>
                </Row>
            );
        });

        var tableRows = this.data.map(function(dataObj) {
                return (
                    <tr>
                        <td className="tableCols"><CBox>&nbsp; {dataObj.data1}</CBox></td>
                        <td className="tableCols">{dataObj.data2}</td>
                        <td className="tableCols"><CBox></CBox></td>
                        <td className="tableCols"><CBox></CBox></td>
                        <td className="tableCols"><CBox></CBox></td>
                    </tr>
                    
                );
            });
        return (
            
            <div className="step6Class">
                <div className="step6ClassAboveFooter">
                    <div className="staticContent">
                        <h2>Review & Confirm</h2>
                        <h4>Verify that everything looks correct before starting your fund</h4>
                    </div>
                    <Row id="step6-rows1" >
                        <Col xs={3} md={3} sm={3} xs={6}>
                            <span className="col1">Fund Details</span>                    
                        </Col>
                        <Col xs={4} md={4} sm={4} xs={6}>
                            <div className="col2">Fund Name: Helios</div>
                            <div className="col2">Fund Amount: $15,000,000</div>
                            <div className="col2">Fund Duration: 2 years</div>
                            <div className="col2">Anticipated Fund Start Date: 6/18/2018</div>
                            <div className="col2">Fund Close Date: 6/18/2020</div>
                        </Col>
                        <Col xs={3} md={3} sm={3} xs={6}>
                            <div className="col3">Fund Image:</div>
                            <div className="col3"><img src={staticImage} alt="profile-pic" className="profile-pic"/></div>
                            <div className="col3">fundImage.jpg</div>
                        </Col>
                        <Col xs={2} md={2} sm={2} xs={6}>
                            <span className="col4"><a href="/createfund/step1">change</a></span>
                        </Col>
                    </Row>
                    {/* Remaining rows items============ */}
                    {rowItems}
                    <div className="staticTextAndTbl">
                        <h2 className="staticText">Select which documents are required for which LPs (check all that apply)</h2>
                        <div className="table">
                            <table className="tableClass">
                                <thead className="tableHeaderClass">
                                    <tr>
                                        <th className="tableCaret">LP Name<i className="fa fa-caret-down"></i></th>
                                        <th className="tableCaret">Organization<i className="fa fa-caret-down"></i></th>
                                        <th>partnership...</th>
                                        <th>subform.pdf</th>
                                        <th>subdetail.pdf</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRows}
                                    <tr>
                                        <td className="outsideTableCols"><CBox>&nbsp;Select All</CBox></td>
                                        <td className="outsideTableCols"></td>
                                        <td className="outsideTableCols"><CBox></CBox></td>
                                        <td className="outsideTableCols"><CBox></CBox></td>
                                        <td className="outsideTableCols"><CBox></CBox></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="staticTextBelowTable">Once everything is confirmed correct, click the “Start Fund” button in the sidebar.</div>

                </div>
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}

export default Step6Component;



