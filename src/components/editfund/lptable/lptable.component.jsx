import React, { Component } from 'react';
import './lptable.component.css';
import Loader from '../../../widgets/loader/loader.component';
import { Constants } from '../../../constants/constants';
import { Fsnethttp } from '../../../services/fsnethttp';
import { FsnetAuth } from '../../../services/fsnetauth';
import { Row, Col,Table,Button} from 'react-bootstrap';
import userDefaultImage from '../../../images/default_user.png';
import errorImage from '../../../images/error.svg';
import editImage from '../../../images/edit_2.svg';
import documentsWhiteImage from '../../../images/documentsWhite.svg';
import popoutButton from '../../../images/popout-button.svg';
import ModalComponent from '../../createfund/modals/modals.component';
import { PubSub } from 'pubsub-js';
import { reactLocalStorage } from 'reactjs-localstorage';
import { FsnetUtil } from '../../../util/util';
import $ from 'jquery';
var fundInfo = {};
class LpTableComponent extends Component{

    constructor(props) {
        super(props);
        this.FsnetAuth = new FsnetAuth();
        this.Constants = new Constants();
        this.FsnetUtil = new FsnetUtil();
        this.Fsnethttp = new Fsnethttp();
        this.state = {
            showModal: false,
            showSideNav: true,
            fundId: null,
            status: 0,
            offset: 0,
            pageCount: 20,
            isExpanded: false,
            orderCol: 'firstName',
            order: 'asc',
            tableHeader: [
                { 'key': 'LP Name', 'property': 'firstName', 'direction': 'asc' },
                { 'key': 'Investor Type', 'property': 'investorType', 'direction': null },
                { 'key': 'Investor Sub Type', 'property': 'investorSubType', 'direction': null },
                { 'key': 'Other Investor Attributes', 'property': 'otherInvestorAttr', 'direction': null },
                { 'key': 'Capital Commitment', 'property': 'lpCapitalCommitment', 'direction': null },
                { 'key': 'Accredited Investor', 'property': 'areYouAccreditedInvestor', 'direction': null },
                { 'key': 'Qualified Client', 'property': 'areYouQualifiedClient', 'direction': null },
                { 'key': 'Qualified Purchaser', 'property': 'areYouQualifiedPurchaser', 'direction': null },
                { 'key': 'Investment Company Act Matters', 'property': 'companiesAct', 'direction': null },
                { 'key': 'No. of Beneficial Owners', 'property': 'numberOfDirectEquityOwners', 'direction': null },
                { 'key': 'Look-Through Issues', 'property': 'lookThorughIssues', 'direction': null },
                // { 'key': 'Look-Through Issues', 'property': 'lookThorughIssues/entityProposingAcquiringInvestment/anyOtherInvestorInTheFund/entityHasMadeInvestmentsPriorToThedate/partnershipWillNotConstituteMoreThanFortyPercent/beneficialInvestmentMadeByTheEntity', 'direction': null },
                { 'key': 'ERISA Representation', 'property': 'erisaPlan', 'direction': null },
                // { 'key': 'Benefit Plan/ERISA Representation', 'property': 'erisaPlan/employeeBenefitPlan/planAsDefinedInSection4975e1/benefitPlanInvestor', 'direction': null },
                { 'key': 'Benefit Plan %', 'property': 'totalValueOfEquityInterests', 'direction': null },
                { 'key': 'FOIA and Similar Disclosure Obligations', 'property': 'releaseInvestmentEntityRequired', 'direction': null },
                { 'key': 'Disqualifying Event', 'property': 'isSubjectToDisqualifyingEvent', 'direction': null },
                { 'key': 'Special Disclosures', 'property': 'fundManagerInfo', 'direction': null },
                
            ],
            notSortedColumns: ['otherInvestorAttr', 'companiesAct', 'lookThorughIssues', 'erisaPlan'],
            filterArr: ['all', 'closed', 'closeReady', 'open', 'new', 'rejected', 'notInterested'],
            fundDetailList: [],
            gpDelegatesSelectedUsers: false,
        }
    }

    componentDidMount() {
        // if(this.props && this.props.fundId) {
        //     this.setState({ 
        //         fundId: this.props.fundId,
        //         status: 0,
        //         offset: 0,
        //         orderCol: 'firstName',
        //         order: 'asc' 
        //     }, () => {
        //         this.getFundDetails();
        //     });
        // }
        var url = window.location.href;
        var parts = url.split("/");
        var urlString = parts[parts.length - 2];
        if(parts.indexOf('expandTable') > -1) {
            this.setState({
                isExpanded: true
            })
        } else {
            this.setState({
                isExpanded: false
            })
        }
        $('tbody').scroll(function(e) { //detect a scroll event on the tbody
            /*
          Setting the thead left value to the negative valule of tbody.scrollLeft will make it track the movement
          of the tbody element. Setting an elements left value to that of the tbody.scrollLeft left makes it maintain 			it's relative position at the left of the table.    
          */
          $('thead').css("left", -$("tbody").scrollLeft()); //fix the thead relative to the body scrolling
          $('thead th:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first cell of the header
          $('tbody td:nth-child(1)').css("left", $("tbody").scrollLeft()); //fix the first column of tdbody
        });
        // element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
        var lastScrollLeft = 0;
        var lastScrollTop = 0;
        this.refs.fundScroll.addEventListener('scroll', () => {
            var documentScrollLeft = this.refs.fundScroll.scrollLeft;
            var documentScrollTop = this.refs.fundScroll.scrollTop;
            if (lastScrollLeft != documentScrollLeft) {
                console.log('scroll x');
                lastScrollLeft = documentScrollLeft;
            } else if((lastScrollTop != documentScrollTop) && (this.refs.fundScroll.scrollTop + this.refs.fundScroll.clientHeight >=
                    this.refs.fundScroll.scrollHeight) && !this.state.showModal && this.state.fundDetailList.length){
                console.log('scroll y');
                if(!this.state.finishedScroll) {
                    this.getLazyLoadedFundDetails(true);
                }
                // this.setState({
                //     offset: this.state.offset + this.state
                // }, () => {
                //     // this.getFundDetails(true);
                //     this.getLazyLoadedFundDetails(true);
                // })
            }
        })
    }

    // ProgressLoader : close progress loader
    close() {
        this.setState({ showModal: false });
    }

    // ProgressLoader : show progress loade
    open() {
        this.setState({ showModal: true });
    }

    //Unsuscribe the pubsub
    componentWillUnmount() {
        PubSub.unsubscribe(fundInfo);
    }

    componentWillReceiveProps(nextProps) {
        console.log('hfkldhjsfds by modal');
        if (nextProps.fundId !== this.props.fundId) {
            this.setState({ 
                fundId: nextProps.fundId,
                status: 0,
                offset: 0,
                orderCol: 'firstName',
                order: 'asc'
            }, () => {
                this.getFundDetails();
            });
          }
    }

    getLazyLoadedFundDetails() {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let fundId = this.state.fundId;
        let params = {
            fundId: this.state.fundId,
            status: this.state.status,
            offset: this.state.offset,
            orderCol: this.state.orderCol,
            order: this.state.order
        }
        if (fundId) {
            this.open();
            this.Fsnethttp.getFundDetails(params, headers).then(result => {
                this.close();
                if (result.data) {
                    // this.setState({
                    //     fundDetailList: result.data.data
                    // })
                    this.setState({
                        offset: this.state.offset + result.data.data.length,
                        fundDetailList: this.state.fundDetailList.concat(result.data.data)
                    }, () => {
                        if(result.data.itemCount < 6) {
                            this.setState({
                                finishedScroll : true
                            })
                        }
                    })
                }
            })
            .catch(error => {
                this.close();
                if(error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    // this.props.history.push('/createfund/funddetails');
                }
            });
        }
    }

    redirectToLogin() {
        reactLocalStorage.clear();
        this.props.history.push('/login');
    }

    getFundDetails(lazyLoaded) {
        let headers = { token: JSON.parse(reactLocalStorage.get('token')) };
        let fundId = this.state.fundId;
        let params = {
            fundId: this.state.fundId,
            status: this.state.status,
            offset: this.state.offset,
            orderCol: this.state.orderCol,
            order: this.state.order
        }
        if (fundId) {
            this.open();
            this.Fsnethttp.getFundDetails(params, headers).then(result => {
                this.close();
                if (result.data) {
                    if(result.data.data.length) {
                        let dataArr = [];
                        for(let i =0; i < 10; i++) {
                            dataArr.push(result.data.data[0]);
                        }
                        this.setState({
                            offset: this.state.offset + result.data.data.length,
                            fundDetailList: result.data.data,
                            fundDetailsEmpty: false
                        }, () => {
                            if(result.data.itemCount < 6) {
                                this.setState({
                                    finishedScroll : true
                                })
                            }
                        })
                    } else {
                        this.setState({
                            fundDetailsEmpty: true
                        })
                    }
                }
            })
            .catch(error => {
                this.close();
                if(error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    // this.props.history.push('/createfund/funddetails');
                }
            });
        }
    }

    filterFun(statusId) {
        this.setState({
            status: statusId ? statusId : 0,
            offset: 0
        }, () => {
            this.sortViewFund({ key: 'LP Name', property: 'id', direction: 'asc'});
            // this.getFundDetails();
        })
        
    }

    openFundDetailsModal() {
        window.open('/fund/expandTable/'+this.state.fundId, '_blank');
        // this.setState({
        //     status: 0,
        //     offset: 0,
        //     orderCol: 'firstName',
        //     order: 'asc'
        // }, () => {
        //     PubSub.publish('openfundDetailModal', {fundId: this.state.fundId, fundName: this.state.fundName, fundStatus: this.state.fundStatus})
        // })
    }

    sortViewFund(header) {
        if(this.state.fundDetailList && this.state.fundDetailList.length) {
            let tableHeaders = this.state.tableHeader;
            let selectedIdx;
            tableHeaders.forEach((header1, idx) => {
            if (header1.property === header.property) {
                    header1.direction = header1.direction && header1.direction == 'asc' ? 'desc' : 'asc';
                    selectedIdx = idx;
            }
            if (header1.property !== header.property) {
                header1.direction = null;
            }
            });
            this.setState({
                tableHeader: tableHeaders,
                orderCol: tableHeaders[selectedIdx] ? tableHeaders[selectedIdx].property : 'firstName',
                offset: 0,
                order: tableHeaders[selectedIdx] ? tableHeaders[selectedIdx].direction : 'asc'
            }, () => {
                this.getFundDetails();
            })
        }
    }

    sendReminder(lpId) {
        let headers = { token : JSON.parse(reactLocalStorage.get('token'))};
        let postObj = {fundId:this.state.fundId, lpId: lpId};
        this.open()
        this.Fsnethttp.sendReminder(postObj,headers).then(result=>{
            this.close();
            if(result) {
                // this.handlefundClose(true);
                PubSub.publish('toastNotification', {showToast: true, toastMessage: 'Reminder sent successfully', toastType: 'success'});
            }
        })
        .catch(error=>{
            this.close();
            PubSub.publish('toastNotification', {showToast: true, toastMessage: 'Error while sending reminder', toastType: 'danger'});
            // this.handlefundClose(true);
        });
    }
    
    render() {
        const { fundId } = this.props;
        return (
            <div className="lptableContainer">
                <div>
                    <div>
                        <h1 className="Showing-LP-Participa">Showing LP Participants from Current Opening 
                            {/* <i className="fa fa-chevron-down"></i> */}
                        </h1>
                    </div>
                    <div className="lpParticipants">
                        <span className={`marginRight60 marginLeft57 cursor ${this.state.status == 0 ? 'active' : ''}`} onClick={() => { this.filterFun(0) }}>All</span>
                        <span className={`marginRight60 cursor ${this.state.status == 10 ? 'active' : ''}`}  onClick={() => { this.filterFun(10) }}>Closed</span>
                        <span className={`marginRight60 cursor ${this.state.status == 7 ? 'active' : ''}`}  onClick={() => { this.filterFun(7) }}>Close-Ready</span>
                        <span className={`marginRight60 cursor ${this.state.status == 1 ? 'active' : ''}`}  onClick={() => { this.filterFun(1) }}>Open</span>
                        {/* <span className={`marginRight60 cursor ${this.state.status == 2 ? 'active' : ''}`}  onClick={() => { this.filterFun(2) }}>New</span> */}
                        <span className={`marginRight60 cursor ${this.state.status == 5 ? 'active' : ''}`}  onClick={() => { this.filterFun(5) }}>Removed</span>
                        <span className={`marginRight60 cursor ${this.state.status == 3 ? 'active' : ''}`}  onClick={() => { this.filterFun(3) }}>Not Interested</span>
                        {/* <i className="fa fa-university cursor"  onClick={() => { this.filterFun('all') }} aria-hidden="true"></i> */}
                        <span hidden={this.state.isExpanded} title="Expand View"><img className="cursor" src={popoutButton} alt="expand" onClick={() => { this.openFundDetailsModal()}}/></span>
                    </div>
                    <div className="tableEdit">
                        <Table striped bordered className="tableMargin">
                            <thead>
                                <tr>
                                    {this.state.tableHeader.map((header, idx) => {
                                       return ( 
                                            <th key={`header_${idx}`} className="cursor" title={header.key} onClick={() => {this.state.notSortedColumns.indexOf(header.property) < 0 ? this.sortViewFund(header) : null}}>
                                                {header.key} 
                                                {this.state.notSortedColumns.indexOf(header.property) < 0 && header.direction != null && header.direction == 'desc' ? <i className="fa fa-caret-down caretDown"></i> : null}
                                                {this.state.notSortedColumns.indexOf(header.property) < 0 && header.direction != null && header.direction == 'asc' ? <i className="fa fa-caret-up caretDown"></i> : null}
                                            </th> 
                                        )
                                    })}
                                    {/* <th><span className="lpNameTh">LP Name</span><i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Investor Type <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Other Investor Attributes <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Accredited Investor Status <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Qualified Client Status <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Qualified Purchaser Status <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Investment Company Act Matters <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>No. of Beneficial Owners <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Look-Through Issues <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Benefit Plan / ERISA Representation <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>benefit plan investor <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>FOIA and Similar Disclosure Obligations <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Disqualifying Event <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Special Disclosures <i className="fa fa-caret-down caretDown"></i></th>
                                    <th>Capital Commitment <i className="fa fa-caret-down caretDown"></i></th> */}
                                    <th>
                                        <span className="marginLeft20">Actions</span>
                                        {/* <i className="fa fa-caret-down caretDown"></i> */}
                                    </th>
                                </tr>
                            </thead>
                            <tbody ref="fundScroll" hidden={this.state.fundDetailsEmpty}>
                                {
                                    this.state.fundDetailList.map((data, idx) => {
                                        return (
                                            <tr key={`lp_data_${idx}`}>
                                                <td title={`${data.lp.firstName} ${data.lp.lastName}`}>
                                                    <img src={data.lp.profilePic ? data.lp.profilePic.url : userDefaultImage} alt="img" className="imgEdit" />
                                                    <span className="lpInfo">
                                                        <span className="lpName">{data.lp.firstName} {data.lp.lastName}</span>
                                                        { data.subscriptionStatus && (data.subscriptionStatus.name == 'Closed' || data.subscriptionStatus.name == 'Close-Ready' || data.subscriptionStatus.name == 'Open' || data.subscriptionStatus.name == 'Open-Ready-Draft')
                                                        ?
                                                        <span className="statusIndicator">
                                                            {data.subscriptionStatus ? data.subscriptionStatus.name : null} &nbsp;
                                                            <span className="dot dot-closed" hidden={data.subscriptionStatus && data.subscriptionStatus.name != 'Closed'}></span>
                                                            <span className="dot dot-closeReady" hidden={data.subscriptionStatus && data.subscriptionStatus.name != 'Close-Ready'}></span>
                                                            <span className="dot dot-open" hidden={data.subscriptionStatus && (data.subscriptionStatus.name != 'Open' && data.subscriptionStatus.name != 'Open-Ready-Draft')}></span>
                                                        </span>
                                                        :
                                                        null}
                                                    </span>
                                                </td>
                                                <td  title={data.investorType == 'LLC' ? 'Entity' : (data.investorType ? data.investorType : 'N/A')}>
                                                    {data.investorType == 'LLC' ? 'Entity' : (data.investorType ? data.investorType : 'N/A')}
                                                </td>
                                                <td  title={ data.investorType == 'LLC' || data.investorType == 'Trust' ? (data.investorSubType ? data.investorSubTypeInfo.name : (data.otherInvestorSubType ? data.otherInvestorSubType : 'N/A')) : 'N/A'}>
                                                    { data.investorType == 'LLC' || data.investorType == 'Trust' ? (data.investorSubType ? data.investorSubTypeInfo.name : (data.otherInvestorSubType ? data.otherInvestorSubType : 'N/A')) : 'N/A'}
                                                </td>
                                                <td  title={ data.otherInvestorAttributes ? data.otherInvestorAttributes.join(', ') : 'N/A'}>
                                                    { data.otherInvestorAttributes && data.otherInvestorAttributes.length ? data.otherInvestorAttributes.join(', ') : 'N/A'}
                                                </td>
                                                <td title={data.lpCapitalCommitment ? this.FsnetUtil.convertToCurrency(data.lpCapitalCommitment) : '$0.00'}>
                                                    {data.lpCapitalCommitment ? this.FsnetUtil.convertToCurrency(data.lpCapitalCommitment) : '$0.00'}
                                                </td>
                                                <td  title={data.areYouAccreditedInvestor ? 'Yes' : 'No'}>
                                                    {data.areYouAccreditedInvestor ? 'Yes' : 'No'}
                                                </td>
                                                <td title={data.areYouQualifiedClient ? 'Yes' : 'No'}>
                                                    {data.areYouQualifiedClient ? 'Yes' : 'No'}
                                                </td>
                                                <td  title={data.areYouQualifiedPurchaser ? 'Yes' : 'No'}>
                                                    {data.areYouQualifiedPurchaser ? 'Yes' : 'No'}
                                                </td>
                                                <td title={data.companiesAct && data.companiesAct > 1 ? 'Yes' : 'No' }>
                                                    {data.companiesAct && data.companiesAct > 1 ? 'Yes' : 'No' }
                                                </td>
                                                <td title={((data.companiesAct && (data.companiesAct == 1 || data.companiesAct == 4)) && (data.entityProposingAcquiringInvestment && data.anyOtherInvestorInTheFund && data.entityHasMadeInvestmentsPriorToThedate && data.partnershipWillNotConstituteMoreThanFortyPercent && data.beneficialInvestmentMadeByTheEntity)) ? 'N/A' : (data.numberOfDirectEquityOwners ? data.numberOfDirectEquityOwners : 0)}>
                                                    {((data.companiesAct && (data.companiesAct == 1 || data.companiesAct == 4)) && (data.entityProposingAcquiringInvestment && data.anyOtherInvestorInTheFund && data.entityHasMadeInvestmentsPriorToThedate && data.partnershipWillNotConstituteMoreThanFortyPercent && data.beneficialInvestmentMadeByTheEntity)) ? 'N/A' : (data.numberOfDirectEquityOwners ? data.numberOfDirectEquityOwners : 0)}
                                                </td>
                                                <td title={(!data.entityProposingAcquiringInvestment && !data.anyOtherInvestorInTheFund && !data.entityHasMadeInvestmentsPriorToThedate && !data.partnershipWillNotConstituteMoreThanFortyPercent && !data.beneficialInvestmentMadeByTheEntity) ? 'No' : 'Yes'}>
                                                    {(!data.entityProposingAcquiringInvestment && !data.anyOtherInvestorInTheFund && !data.entityHasMadeInvestmentsPriorToThedate && !data.partnershipWillNotConstituteMoreThanFortyPercent && !data.beneficialInvestmentMadeByTheEntity) ? 'No' : 'Yes'}
                                                </td>
                                                <td title={(!data.employeeBenefitPlan && !data.planAsDefinedInSection4975e1 && !data.benefitPlanInvestor) ? 'No' : 'Yes'}>
                                                    {(!data.employeeBenefitPlan && !data.planAsDefinedInSection4975e1 && !data.benefitPlanInvestor) ? 'No' : 'Yes'}
                                                </td>
                                                <td title={!data.employeeBenefitPlan && !data.planAsDefinedInSection4975e1 && !data.benefitPlanInvestor ? '0%' : (!data.employeeBenefitPlan && !data.planAsDefinedInSection4975e1 ? `${data.totalValueOfEquityInterests ? data.totalValueOfEquityInterests : '0'}%` : '100%')}>
                                                    {!data.employeeBenefitPlan && !data.planAsDefinedInSection4975e1 && !data.benefitPlanInvestor ? '0%' : (!data.employeeBenefitPlan && !data.planAsDefinedInSection4975e1 ? `${data.totalValueOfEquityInterests ? data.totalValueOfEquityInterests : '0'}%` : '100%')}
                                                </td>
                                                <td title={data.releaseInvestmentEntityRequired ? 'Yes': 'No'}>
                                                    {data.releaseInvestmentEntityRequired ? 'Yes': 'No'}
                                                </td>
                                                <td title={data.isSubjectToDisqualifyingEvent ? 'Yes' : 'No'}>
                                                    {data.isSubjectToDisqualifyingEvent ? 'Yes' : 'No'}
                                                </td>
                                                <td title={data.fundManagerInfo ? data.fundManagerInfo : 'N/A'}>
                                                    {data.fundManagerInfo ? data.fundManagerInfo : 'N/A'}
                                                </td>
                                                <td>
                                                    { data.subscriptionStatus.name == 'Closed' ? <Button className="btnViewPrint"><img src={documentsWhiteImage} width="13" height="13"/> <span className="">View + Print</span></Button> : null}
                                                    { data.subscriptionStatus.name == 'Close-Ready' ? <Button className="btnViewPrint"><img src={editImage} width="13" height="13"/> <span className="viewPrintText">Sign Documents</span></Button> : null}
                                                    { (data.subscriptionStatus.name == 'Open' || data.subscriptionStatus.name == 'Open-Ready-Draft') ? <Button className="btnViewPrint" onClick={() => { this.sendReminder(data.lp ? data.lp.id : null) }}><img src={errorImage} width="13" height="13"/> <span className="viewPrintText">Send Reminder</span></Button> : null}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </Table>
                        <div className="text-center" hidden={!this.state.fundDetailsEmpty}>
                            <p> No LP data found</p>
                        </div>
                    </div>

                </div>
                <Loader isShow={this.state.showModal}></Loader>
                <ModalComponent></ModalComponent>
            </div>
        );
    }
}

export default LpTableComponent;

