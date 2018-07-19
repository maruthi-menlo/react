import React, { Component } from 'react';
import '../createfund.component.css';
import { Checkbox as CBox, Row, Col } from 'react-bootstrap';
import staticImage from '../../../images/profilePic.jpg';

class Step6Component extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fundId: null
        }
        // this.proceedToNext = this.proceedToNext.bind(this);
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

    // proceedToNext() {
    //     this.props.history.push('/createfund/step6');
    // }

    componentDidMount() { 
        let url = window.location.href;
        let page = url.split('/createfund/review/');
        let fundId = page[1];
        this.setState({
            fundId: fundId
        })
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/lp/'+this.state.fundId);
    }
    

    render() {
        //  var rowItems = this.staticDataFromRow2.map(function(dataObj) {
        //    return (               
        //         <Row className="step6-rows" >
        //             <Col md={3} sm={3} xs={6}>
        //                 <span className="col1">{dataObj.header1}</span>                    
        //             </Col>
        //             <Col md={4} sm={4} xs={6}>
        //                 <span className="col2">{dataObj.href1 ? <a className="col2-redirection" href="/createfund/step4">{dataObj.href1}</a> :dataObj.header2}</span>
        //             </Col>
        //             <Col md={3} sm={3} xs={6}>
        //                 <span className="col3"></span>
        //             </Col>
        //             <Col md={2} sm={2} xs={6}>
        //                 <span className="col4"><a href={dataObj.href?dataObj.href:dataObj.href2}>{dataObj.header3}</a></span>
        //             </Col>
        //         </Row>
        //     );
        // });

        // var tableRows = this.data.map(function(dataObj) {
        //         return (
        //             <tr>
        //                 <td className="tableCols">
        //                     <div>
        //                         <CBox>
        //                             <span className="checkmark"></span>
        //                         </CBox>
        //                         <span>{dataObj.data1}</span>
        //                     </div>
        //                 </td>
        //                 <td className="tableCols">{dataObj.data2}</td>
        //                 <td className="tableCols"><CBox><span className="checkmark"></span></CBox></td>
        //             </tr>
                    
        //         );
        //     });
        return (
            
            <div className="step6Class marginTop30">
                <div className="step6ClassAboveFooter">
                    <div className="staticContent">
                        <h2>Review & Confirm</h2>
                        <h4>Verify that everything looks correct before starting your fund</h4>
                    </div>
                    <Row id="step6-rows1" >
                        <Col md={3} sm={3} xs={6}>
                            <span className="col1">Fund Details</span>                    
                        </Col>
                        <Col md={4} sm={4} xs={6}>
                            <div className="col2">Fund Name: Helios</div>
                            <div className="col2">Fund Amount: $15,000,000</div>
                            <div className="col2">Fund Duration: 2 years</div>
                            <div className="col2">Anticipated Fund Start Date: 6/18/2018</div>
                            <div className="col2">Fund Close Date: 6/18/2020</div>
                        </Col>
                        <Col md={3} sm={3} xs={6}>
                            <div className="col3">Fund Image:</div>
                            <div className="col3"><img src={staticImage} alt="profile-pic" className="profile-pic"/></div>
                            <div className="col3">fundImage.jpg</div>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><a href="/createfund/step1">change</a></span>
                        </Col>
                    </Row>
                    {/* Remaining rows items============ */}
                    <Row className="step6-rows" >
                        <Col md={3} sm={3} xs={6}>
                            <span className="col1">GP Delegates</span>                    
                        </Col>
                        <Col md={4} sm={4} xs={6}>
                            <span className="col2">Review delegates in sidebar and add or remove as necessary</span>
                        </Col>
                        <Col md={3} sm={3} xs={6}>
                            <span className="col3"></span>
                        </Col>
                        <Col md={2} sm={2} xs={6}>
                            <span className="col4"><a>Change</a></span>
                        </Col>
                    </Row>
                    <div className="staticTextAndTbl marginTop20">
                        <h2 className="staticText">Select which documents are required for which LPs (check all that apply)</h2>
                        <div className="table">
                            <table className="tableClass">
                                <thead className="tableHeaderClass">
                                    <tr>
                                        <th className="tableCaret borderTopNone">LP Name<i className="fa fa-caret-down"></i></th>
                                        <th className="tableCaret borderTopNone">Organization<i className="fa fa-caret-down"></i></th>
                                        <th className="borderTopNone">partnership...</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="tableCols lpNameWidth text-left">
                                            <div>
                                                <CBox>
                                                    <span className="checkmark"></span>
                                                </CBox>
                                                <span>hello</span>
                                            </div>
                                        </td>
                                        <td className="tableCols orgNameStyle">Hello hi data1</td>
                                        <td className="tableCols"><CBox><span className="checkmark"></span></CBox></td>
                                    </tr>
                                    <tr>
                                        <td className="outsideTableCols lpNameWidth text-left">
                                            <div>
                                                <CBox>
                                                    <span className="checkmark"></span>
                                                </CBox>
                                                <span> Select All</span>
                                            </div>      
                                        </td>
                                        <td className="outsideTableCols"></td>
                                        <td className="outsideTableCols"><CBox><span className="checkmark"></span></CBox></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="staticTextBelowTable">Once everything is confirmed correct, click the “Start Fund” button in the sidebar.</div>

                </div>
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    {/* <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i> */}
                </div>
            </div>
        );
    }
}

export default Step6Component;



