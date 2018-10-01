import React, { Component } from 'react';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Row, Col, Button, Checkbox as CBox, Modal } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import FileDrop from 'react-file-drop';
import { FsnetUtil } from '../../../util/util';
import { reactLocalStorage } from 'reactjs-localstorage';
import userDefaultImage from '../../../images/default_user.png';
import documentImage from '../../../images/documentsWhite.svg';

class addendumsComponent extends Component {

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.uploadBtnClick = this.uploadBtnClick.bind(this);
        this.proceedToNext = this.proceedToNext.bind(this);
        this.proceedToBack = this.proceedToBack.bind(this);
        this.newAddendumFn = this.newAddendumFn.bind(this);
        this.closeAddendumModal = this.closeAddendumModal.bind(this);
        this.showModal = this.showModal.bind(this);
        this.startBtnFn = this.startBtnFn.bind(this);
        this.sortAddendum = this.sortAddendum.bind(this);
        this.state = {
            showModal: false,
            showSideNav: true,
            uploadDocFile: {},
            uploadFileName: '',
            uploadDocSize:'',
            showFooterButtons:false,
            showUploadPage: false,
            showAddendumPage: true,
            showLpPage:false,
            showAddendumModal:false,
            getAddendumsList: [],
            noAddendumsMsz: '',
            showNameAsc: true,
            showOrgAsc: true,
        }

    }

    componentWillUnmount() {

    }

    componentDidMount() {
        let id = this.FsnetUtil.getLpFundId();
        console.log(id);
        this.getAddendums(id);

    }

    //Get list of Addendums
    getAddendums(id) {
        if(id) {
            this.open();
            let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
            this.Fsnethttp.getFund(id, headers).then(result => {
                this.close();
                this.setState({
                    getAddendumsList: result.data.data.lps
                })
            })
            .catch(error => {
                this.close();
                this.setState({
                    getAddendumsList: [],
                    noAddendumsMsz: this.Constants.NO_LPS
                })
    
            });
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

    uploadBtnClick() {
        document.getElementById('uploadBtn').click();
    }

    //Upload patnership document.
    handleChange(event, type) {
        let obj;
        if(type=== 'drop') {
            obj = event;
        } else {
            obj = event.target.files
        }
        let reader = new FileReader();
        if(obj && obj.length > 0) {
            this.uploadFile = obj[0];
            let sFileName = obj[0].name;
            var sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
            if(sFileExtension !== 'pdf' && sFileExtension !== 'docx') {
                document.getElementById('uploadBtn').value = "";
                alert('Partnership document should be in a pdf/docx format only and smaller than 10MB in size.')
                return true;
            }
            //File 10 MB limit
            if(this.uploadFile.size <=10485760) {
                this.setState({
                    uploadDocFile : obj[0],
                    uploadDocSize: (this.uploadFile.size / 1048576).toFixed(2)+' MB'
                });
                reader.readAsDataURL(this.uploadFile);
                this.setState({
                    uploadFileName: obj[0].name,
                });
            } else {
                document.getElementById('uploadBtn').value = "";
               alert('Patnership document should be less than 10 MB.')
            }
        }
    }

    proceedToNext() {
        if(this.state.showUploadPage) {
            this.setState({
                showLpPage:true,
                showUploadPage:false,
            })
        } else {
            this.showModal();
        }
    }

    proceedToBack() {
        if(!this.state.showUploadPage) {
            this.setState({
                showLpPage:false,
                showUploadPage:true,
            })
        } else {
            this.setState({
                showFooterButtons:false,
                showUploadPage:false,
                showAddendumPage:true
            })
        }
    }

    newAddendumFn() {
        this.setState({
            showUploadPage:true,
            showAddendumPage:false,
            showFooterButtons:true
        })
    }

    closeAddendumModal() {
        this.setState({
            showAddendumModal: false,
        })
    }

    showModal() {
        this.setState({
            showAddendumModal: true,
        })
    }

    startBtnFn() {
        
    }

    //Sorting for name and organization
    sortAddendum(e, colName, sortVal) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let firmId = 1;
        let fundId = 90;
        if (this.state.getAddendumsList && this.state.getAddendumsList.length > 1) {
            this.open();
            this.Fsnethttp.getLpSort(firmId, fundId, headers, colName, sortVal).then(result => {
                if (result.data && result.data.data.length > 0) {
                    this.close();
                    this.setState({ getAddendumsList: result.data.data });
                    if (colName === 'firstName') {
                        if (sortVal === 'desc') {
                            this.setState({
                                showNameAsc: true
                            })
                        } else {
                            this.setState({
                                showNameAsc: false
                            })
                        }
                    } else {
                        if (sortVal === 'desc') {
                            this.setState({
                                showOrgAsc: true
                            })
                        } else {
                            this.setState({
                                showOrgAsc: false
                            })
                        }
                    }

                } else {
                    this.close();
                    this.setState({
                        getAddendumsList: [],
                        showNameAsc: false
                    }, )
                }

            })
            .catch(error => {
                this.close();
                this.setState({
                    getAddendumsList: []
                })

            });
        }
    }

    render() {
        return (
            <div className="lpSubFormStyle addendumContainer">
                <div className="main-heading" hidden={this.state.showAddendumPage}><span className="main-title">Add New Addendum</span><Link to="/dashboard" className="cancel-fund">Cancel</Link></div>
                <div className="main-heading" hidden={!this.state.showAddendumPage}><span className="main-title">Addendums</span></div>
                <div className="LpDelegatesContainer marginTop20 marginLeft25 paddingLeft15" hidden={!this.state.showAddendumPage}>
                    <p className="Subtext">View addendums or upload documents to create a new one.</p>
                    <Button className="newAddendumButton" onClick={this.newAddendumFn}><i className="fa fa-plus paddingRight5"></i>New Addendum</Button>
                    {/* <Row className="full-width marginTop20 marginLeft61">
                        <div className="name-heading marginLeft75">
                            LP Name
                                    <i className="fa fa-sort-asc" aria-hidden="true"  ></i>
                        </div>
                        <div className="name-heading">
                            Organization
                                <i className="fa fa-sort-asc" aria-hidden="true"></i>
                        </div>
                    </Row> */}
                    {this.state.getAddendumsList.length > 0 ?
                    <Row className="full-width marginTop20 marginLeft61">
                        <div className="name-heading marginLeft75" hidden={!this.state.showNameAsc} onClick={(e) => this.sortAddendum(e, 'firstName', 'asc')}>
                            LP Name
                                    <i className="fa fa-sort-asc" aria-hidden="true"  ></i>
                        </div>
                        <div className="name-heading marginLeft75" onClick={(e) => this.sortAddendum(e, 'firstName', 'desc')} hidden={this.state.showNameAsc}>
                            LP Name
                                <i className="fa fa-sort-desc" aria-hidden="true"  ></i>
                        </div>
                        <div className="name-heading" onClick={(e) => this.sortAddendum(e, 'organizationName', 'asc')} hidden={!this.state.showOrgAsc}>
                            Organization
                                <i className="fa fa-sort-asc" aria-hidden="true"></i>
                        </div>
                        <div className="name-heading" onClick={(e) => this.sortAddendum(e, 'organizationName', 'desc')} hidden={this.state.showOrgAsc}>
                            Organization
                                <i className="fa fa-sort-desc" aria-hidden="true" ></i>
                        </div>
                    </Row> : ''
                }
                    <div className={"userAddendumContainer " + (this.state.getAddendumsList.length === 0 ? 'borderNone' : 'marginTop10')}>
                    {this.state.getAddendumsList.length > 0 ?
                        this.state.getAddendumsList.map((record, index) => {
                            return (

                                <div className="userRow" key={index}>
                                    <label className="userImageAlt">
                                    {
                                        record['profilePic'] ?
                                            <img src={record['profilePic']['url']} alt="img" className="user-image" />
                                            : <img src={userDefaultImage} alt="img" className="user-image" />
                                    }
                                    </label>
                                    <div className="lp-name">{record['firstName']}&nbsp;{record['lastName']}</div>
                                    <div className="lp-name lp-name-pad">{record['organizationName']}</div>
                                    <Button className="btnViewPrint" ><img src={documentImage} alt="home_image"/><span className="viewPrintText">View + Print</span></Button>
                                </div>
                            );
                        })
                        :
                        <div className="title margin20 text-center">{this.state.noDelegatesMsz}</div>
                    }
                </div>
                </div>
                <div className="LpDelegatesContainer marginTop6 marginLeft25 marginBot20 paddingLeft15" id="createFund" hidden={!this.state.showUploadPage}>
                    <h1 className="uploadFundDocument">Upload Addendum Documents</h1>
                    <div>
                        <h1 className="title marginBottom2">Choose files to upload</h1>
                        <div className="subtext">Choose document files to upload. Accepted files information appears here.</div>
                        <div className="uplodFileContainer marginTop46">
                            <input type="file" id="uploadBtn" className="hide" onChange={ (e) => this.handleChange(e) } />
                            <FileDrop onDrop={(e) => this.handleChange(e, 'drop')}>
                                <Button className="uploadFileBox" onClick={this.uploadBtnClick}></Button>
                                <span className="uploadFileSubtext">Or drop files from your desktop to upload. Files should not exceed 10MB and should be of type pdf/docx only.</span>
                            </FileDrop>
                            <div className="docNameDivAlign"><div className="upload-doc-name">{this.state.uploadFileName} </div> </div>
                            <div className="filesize" hidden={this.state.uploadFileName ===''}>{this.state.uploadDocSize}  <i className="fa fa-trash cursor-pointer" onClick={this.deleteFile}></i></div>
                        </div>
                    </div>
                </div>
                <div className="LpDelegatesContainer marginTop6 marginLeft25 paddingLeft15" hidden={!this.state.showLpPage}>
                    <h1 className="title marginBottom2">Choose LPs</h1>
                    <div className="subtext">Check off the LPs that you want to send this addendum to.</div>
                    {/* <Row className="full-width marginTop20">
                        <div className="name-heading marginLeft30">
                            LP Name
                                    <i className="fa fa-sort-asc" aria-hidden="true"  ></i>
                        </div>
                        <div className="name-heading">
                            Organization
                                <i className="fa fa-sort-asc" aria-hidden="true"></i>
                        </div>
                    </Row>
                    <div className="userLPContainer marginTop10 marginBottom12">
                        <div className="userRow">
                            <div className="lp-name paddingLeft0 lpNameTextAlign"><img src={userDefaultImage} alt="img" className="user-image marginRight12" />SarahDouglas</div>
                            <div className="lp-name lp-name-pad lpNameTextAlign">Menlo Technologies</div>
                            <CBox className="marginLeft8">
                                <span className="checkmark"></span>
                            </CBox>
                        </div>
                    </div> */}
                    {this.state.getAddendumsList.length > 0 ?
                    <Row className="full-width marginTop20 marginLeft61">
                        <div className="name-heading marginLeft75" hidden={!this.state.showNameAsc} onClick={(e) => this.sortAddendum(e, 'firstName', 'asc')}>
                            LP Name
                                    <i className="fa fa-sort-asc" aria-hidden="true"  ></i>
                        </div>
                        <div className="name-heading marginLeft75" onClick={(e) => this.sortAddendum(e, 'firstName', 'desc')} hidden={this.state.showNameAsc}>
                            LP Name
                                <i className="fa fa-sort-desc" aria-hidden="true"  ></i>
                        </div>
                        <div className="name-heading" onClick={(e) => this.sortAddendum(e, 'organizationName', 'asc')} hidden={!this.state.showOrgAsc}>
                            Organization
                                <i className="fa fa-sort-asc" aria-hidden="true"></i>
                        </div>
                        <div className="name-heading" onClick={(e) => this.sortAddendum(e, 'organizationName', 'desc')} hidden={this.state.showOrgAsc}>
                            Organization
                                <i className="fa fa-sort-desc" aria-hidden="true" ></i>
                        </div>
                    </Row> : ''
                }
                    <div className={"userAddendumContainer " + (this.state.getAddendumsList.length === 0 ? 'borderNone' : 'marginTop10')}>
                    {this.state.getAddendumsList.length > 0 ?
                        this.state.getAddendumsList.map((record, index) => {
                            return (

                                <div className="userRow" key={index}>
                                    <label className="userImageAlt">
                                    {
                                        record['profilePic'] ?
                                            <img src={record['profilePic']['url']} alt="img" className="user-image" />
                                            : <img src={userDefaultImage} alt="img" className="user-image" />
                                    }
                                    </label>
                                    <div className="lp-name">{record['firstName']}&nbsp;{record['lastName']}</div>
                                    <div className="lp-name lp-name-pad">{record['organizationName']}</div>
                                    <CBox className="marginLeft8">
                                        <span className="checkmark"></span>
                                    </CBox>
                                </div>
                            );
                        })
                        :
                        <div className="title margin20 text-center">{this.state.noDelegatesMsz}</div>
                    }
                    
                    </div>
                    <div className="selectAllDiv">
                        <CBox className="marginRight8">
                                    <span className="checkmark"></span>
                        </CBox>
                        <span className="lpSelectAll">Select All</span>
                    </div>
                </div>
                <div className="footer-nav" hidden={!this.state.showFooterButtons}>
                    <i className="fa fa-chevron-left" onClick={this.proceedToBack} aria-hidden="true"></i>
                    <i className="fa fa-chevron-right" onClick={this.proceedToNext}  aria-hidden="true"></i>
                </div>
                <Loader isShow={this.state.showModal}></Loader>
                <Modal id="confirmAddendumModal" show={this.state.showAddendumModal}  onHide={this.closeAddendumModal} dialogClassName="confirmFundDialog">
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                        <h1 className="title">Are you sure you want to add this addendum?</h1>
                        <div className="subtext">All LPs assigned to the addendum will receive an email invitation and in app notification of the new document.</div>
                        <div className="error"></div>
                        <Row className="fundBtnRow">
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Button type="button" className="fsnetSubmitButton btnEnabled" onClick={this.closeAddendumModal}>No, take me back</Button>
                            </Col>
                            <Col lg={6} md={6} sm={6} xs={12}>
                                <Button type="button" className="fsnetSubmitButton btnEnabled" onClick={this.startBtnFn}>Yes, add addendum</Button>
                            </Col>
                        </Row>   
                    </Modal.Body>
                </Modal>
            </div>
            

        );
    }
}

export default addendumsComponent;

