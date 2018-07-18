import React, { Component } from 'react';
import '../createfund.component.css';
 import { Button } from 'react-bootstrap';

class Step3Component extends Component {

    constructor(props){
        super(props);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadBtnClick = this.uploadBtnClick.bind(this);
    }

    proceedToNext() {
        this.props.history.push('/createfund/step5');
    }
    
    proceedToBack() {
        this.props.history.push('/createfund/step2');
    }

    uploadBtnClick() {
        document.getElementById('uploadBtn').click();
    }

    //Upload patnership document.
    handleChange(event) {
        // let reader = new FileReader();
        // if(event.target.files && event.target.files.length > 0) {
        //     this.imageFile = event.target.files[0];
            // if(this.imageFile.size <=1600000) {
            //     this.setState({
            //         profilePicFile : event.target.files[0],
            //     });
            //     reader.readAsDataURL(this.imageFile);
            //     this.setState({
            //         userImageName: event.target.files[0].name
            //     });
            //     reader.onload = () => {
            //         this.setState({
            //             currentUserImage : reader.result,
            //         });
            //     }
            // } else {
            //    alert('Please upload image Maximum file size : 512X512')
            // }
        // }
    }

    render() {
        return (
            <div className="step3Class">
                <h1 className="uploadFundDocument">Upload Fund Documents</h1>
                <div className="chooseFileMargin">
                    <h1 className="title">Choose files to upload</h1>
                    <div className="subtext">Choose document files to upload. Accepted files information appears here.</div>
                    <div className="uplodFileContainer marginTop20" >
                        <input type="file" id="uploadBtn" className="hide" onChange={ (e) => this.handleChange(e) } />
                        <Button className="uploadFileBox" onClick={this.uploadBtnClick}></Button>
                        <span className="uploadFileSubtext">Or drop files from your desktop to upload. Files should not exceed 10MB.</span>
                    </div>
                </div>
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}

export default Step3Component;



