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
            uploadDocSize:'',
            firmId:null,
            fundId:null,
            createdFundData:[],
            uploadFundPageValid: false,
        }
    }

    componentDidMount() {
        let firmId = reactLocalStorage.getObject('firmId'); 
        var url = window.location.href;
        var parts = url.split("/");
        var urlSplitFundId = parts[parts.length - 1];
        let fundId = urlSplitFundId;
        this.setState({
            fundId: fundId,
            firmId:firmId
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
        if(data.partnershipDocument){
            this.setState({
                uploadFileName: data.partnershipDocument.filename,
                uploadDocFile: data,
                uploadDocSize: (data.partnershipDocument.size/ 1048576).toFixed(4),
                uploadFundPageValid: true
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
        if(this.state.uploadFileName === '') {
            this.setState({
                errorMessage: this.Constants.UPLOAD_DOC_REQUIRED,
            });
        } else if(this.state.uploadFileName !== '') {
            if(this.state.createdFundData.partnershipDocument) {
                if(this.state.uploadFileName === this.state.createdFundData.partnershipDocument.filename) {
                    this.props.history.push('/createfund/lp/'+this.state.fundId);
                } else {
                    this.uploadDocApi()
                }
            } else {
                this.uploadDocApi()
            }
            
        }
    }

    uploadDocApi() {
        this.open();
            //call the upload doc api
            var formData = new FormData();
            formData.append("fundId", this.state.fundId);
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            formData.append("fundDoc", this.state.uploadDocFile);
            this.Fsnethttp.uploadDocumentToFund(this.state.fundId,headers, formData).then(result=>{
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
    }

    deleteFile() {
            let postObj = {fundId: this.state.fundId};
            let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
            this.open()
            this.Fsnethttp.deleteFile(postObj,headers).then(result=>{
                this.close();
                document.getElementById('uploadBtn').value = "";
                if(result) {
                    this.setState({
                        uploadDocFile: {},
                        uploadFileName: '',
                        uploadFundPageValid: false,
                        errorMessage: ''
                    })
                }
            })
            .catch(error=>{
                this.close();
                this.setState({
                    uploadDocFile: {},
                    uploadFileName: '',
                    uploadFundPageValid: false
                })
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
            let sFileName = event.target.files[0].name;
            var sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
            if(sFileExtension !== 'pdf' && sFileExtension !== 'docx') {
                document.getElementById('uploadBtn').value = "";
                alert('Patnership document should be pdf/docx only and less than 10MB size')
                return true;
            }
            //File 10 MB limit
            if(this.uploadFile.size <=1024000) {
                this.setState({
                    uploadDocFile : event.target.files[0],
                    uploadDocSize: (this.uploadFile.size / 1048576).toFixed(2)
                });
                reader.readAsDataURL(this.uploadFile);
                this.setState({
                    uploadFileName: event.target.files[0].name,
                    uploadFundPageValid: true
                });
                // reader.onload = () => {
                //     this.setState({
                //         currentUserImage : reader.result,
                //     });
                // }
            } else {
                document.getElementById('uploadBtn').value = "";
               alert('Patnership document should be less than 10 MB')
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
                        <div className="filesize" hidden={this.state.uploadFileName ===''}>{this.state.uploadDocSize} MB <i className="fa fa-trash cursor-pointer" onClick={this.deleteFile}></i></div>
                    </div>
                </div>
                <div className="error">{this.state.errorMessage}</div>
                <div className="footer-nav">
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className={"fa fa-chevron-right " + (!this.state.uploadFundPageValid ? 'disabled' : '')} onClick={this.proceedToNext}  aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
            </div>
        );
    }
}

export default Step3Component;



