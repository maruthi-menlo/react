import React, { Component } from 'react';
import '../createfund.component.css';
// import { DropdownButton, Grid, Button, Checkbox as CBox, Row, Col, MenuItem, ControlLabel, FormControl, FormGroup } from 'react-bootstrap';

class Step6Component extends Component {

    constructor(props) {
        super(props);
        this.data=[
            {data1:"hello",data2:"Hello hi data1",data3:"Hello Hi data"},
            {data1:"hello",data2:"Hello hi data2",data3:"Hello Hi data"},
            {data1:"hello",data2:"Hello hi data3",data3:"Hello Hi data"},
            {data1:"hello",data2:"Hello hi data4",data3:"Hello Hi data"},
            {data1:"hello",data2:"Hello hi data5",data3:"Hello Hi data"}

        ]
    }


    render() {

        // var rowItems = this.data.map(function(dataObj) {
            return (
               
        //         <Row className="step6Form-row" >
        //             <Col xs={3} md={3} >
        //                 <span className="col1">{dataObj.data1}</span>                    
        //             </Col>
        //             <Col xs={3} md={3} >
        //                 <span className="col2">{dataObj.data2}</span>
        //             </Col>
        //             <Col xs={3} md={3} >
        //                 <span className="col3">{dataObj.data3}</span>
        //             </Col>
        //             <Col xs={3} md={3} >
        //                 <span className="col4">change</span>
        //             </Col>
        //         </Row>
        //     );
        //   });

        //   var tableRows = this.data.map(function(dataObj) {
        //     return (
        //         <tr>
        //             <td className="tableCols"><CBox>&nbsp; {dataObj.data1}</CBox></td>
        //             <td className="tableCols">{dataObj.data2}</td>
        //             <td className="tableCols"><CBox></CBox></td>
        //             <td className="tableCols"><CBox></CBox></td>
        //             <td className="tableCols"><CBox></CBox></td>
        //         </tr>
                
        //     );
        //   });
        // return (
        //     <div>
        //         <div className="step6-form">
        //             <h2>Review & Confirm</h2>
        //             <h4>Verify that everything looks correct before starting your fund</h4>
        //             {/* To show object in a row ===================*/}
        //             {rowItems}
        //             <div className="staticTextAndTbl">
        //                 <h2 className="staticText">Select which documents are required for which LPs (check all that apply)</h2>
        //                 <div className="table">
        //                     <table className="tableClass">
        //                         <thead className="tableHeaderClass">
        //                             <tr>
        //                                 <th className="tableCaret">LP Name<i className="fa fa-caret-down"></i></th>
        //                                 <th className="tableCaret">Organization<i className="fa fa-caret-down"></i></th>
        //                                 <th>partnership...</th>
        //                                 <th>subform.pdf</th>
        //                                 <th>subdetail.pdf</th>
        //                             </tr>
        //                         </thead>
        //                         <tbody>
        //                             {tableRows}
        //                             <tr>
        //                                 <td className="outsideTableCols"><CBox>&nbsp;Select All</CBox></td>
        //                                 <td className="outsideTableCols"></td>
        //                                 <td className="outsideTableCols"><CBox></CBox></td>
        //                                 <td className="outsideTableCols"><CBox></CBox></td>
        //                                 <td className="outsideTableCols"><CBox></CBox></td>
        //                             </tr>

        //                         </tbody>
        //                     </table>
        //                 </div>
        //             </div>
        //             <div className="staticTextBelowTable">Once everything is confirmed correct, click the “Start Fund” button in the sidebar.</div>
                   
                     
        //         </div>
        //     </div>
        <div>

            </div>
        );
    }
}

export default Step6Component;



