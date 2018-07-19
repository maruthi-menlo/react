import React, { Component } from 'react';
import '../createfund.component.css';
import { Button } from 'react-bootstrap';
import { reactLocalStorage } from 'reactjs-localstorage';
import Loader from '../../../widgets/loader/loader.component';
import { Fsnethttp } from '../../../services/fsnethttp';
import {Constants} from '../../../constants/constants';

class Step3Component extends Component {

    constructor(props){
        super(props);
        this.Fsnethttp = new Fsnethttp();
        this.Constants = new Constants();
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadBtnClick = this.uploadBtnClick.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.state = {
            uploadDocFile: {},
            uploadFileName: '',
            vcFirmId:2,
            fundId:null,
            createdFundData:[]
        }
    }

    componentDidMount() { 
        let url = window.location.href;
        let page = url.split('/createfund/upload/');
        let fundId = page[1];
        this.setState({
            fundId: fundId
        })

        if(fundId != undefined) {
            this.getFundDetails(fundId);
        }
    }

    getFundDetails(fundId) {
        this.open();
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            this.Fsnethttp.getFund(fundId, headers).then(result=>{
                this.close();
                if(result.data) {
                    this.setState({ createdFundData: result.data.data, fundId: result.data.data.id }, () => this.updateDoc());
                } else {
                    this.setState({
                        createdFundData: [],
                    })
                }
            })
            .catch(error=>{
                this.close();
                this.setState({
                    createdFundData: []
                })
            });
    }

    updateDoc() {
        let data = this.state.createdFundData;
        console.log(data);
        if(data){
            this.setState({
                uploadFileName: data.partnershipDocument.filename,
                uploadDocFile: data
            })
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

    proceedToNext() {
        if(this.state.uploadFileName !== '') {
            this.open();
            //call the upload doc api
            var formData = new FormData();
            formData.append("fundId", this.state.fundId);
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            formData.append("fundDoc", this.state.uploadDocFile);
            this.Fsnethttp.uploadDocumentToFund(this.state.vcFirmId,headers, formData).then(result=>{
                this.close();
                this.props.history.push('/createfund/lp/'+this.state.fundId);
            })
            .catch(error=>{
                this.close();
                if(error.response!==undefined && error.response.data !==undefined && error.response.data.errors !== undefined) {
                    this.setState({
                        errorMessage: error.response.data.errors[0].msg,
                    });
                } else {
                    this.setState({
                        errorMessage: this.Constants.INTERNAL_SERVER_ERROR,
                    });

                }
            });
        } else {
            this.setState({
                errorMessage: this.Constants.INTERNAL_SERVER_ERROR,
            });

        }
    }

    deleteFile() {
            let postObj = {fundId: this.state.fundId};
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            this.open()
            this.Fsnethttp.deleteFile(postObj,headers).then(result=>{
                this.close();
                if(result.data) {
                  
                }
            })
            .catch(error=>{
                this.close();
               
            });
    }

    
    proceedToBack() {
        this.props.history.push('/createfund/gpDelegate/'+this.state.fundId);
    }

    uploadBtnClick() {
        document.getElementById('uploadBtn').click();

    }

    //Upload patnership document.
    handleChange(event) {
        let reader = new FileReader();
        if(event.target.files && event.target.files.length > 0) {
            this.uploadFile = event.target.files[0];
            if(this.uploadFile.size <=16000000) {
                this.setState({
                    uploadDocFile : event.target.files[0],
                });
                reader.readAsDataURL(this.uploadFile);
                this.setState({
                    uploadFileName: event.target.files[0].name
                });
                // reader.onload = () => {
                //     this.setState({
                //         currentUserImage : reader.result,
                //     });
                // }
            } else {
               alert('Show error here')
            }
        }
    }

    render() {
        return (
            <div className="step3Class marginTop30">
                <h1 className="uploadFundDocument">Upload Fund Documents</h1>
                <div className="chooseFileMargin">
                    <h1 className="title">Choose files to upload</h1>
                    <div className="subtext">Choose document files to upload. Accepted files information appears here.</div>
                    <div className="uplodFileContainer marginTop20" >
                        <input type="file" id="uploadBtn" className="hide" onChange={ (e) => this.handleChange(e) } />
                        <Button className="uploadFileBox" onClick={this.uploadBtnClick}></Button>
                        <span className="uploadFileSubtext">Or drop files from your desktop to upload. Files should not exceed 10MB.</span>
                        <div><a className="upload-doc-name">{this.state.uploadFileName} </a> </div>
                        <div className="filesize">1.4MB <i className="fa fa-trash cursor-pointer" onClick={this.deleteFile}></i></div>
                    </div>
                </div>
                <div className="error">{this.state.errorMessage}</div>
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" onClick={this.proceedToNext} aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default Step3Component;



