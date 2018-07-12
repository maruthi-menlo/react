import React, { Component } from 'react';
import '../createfund.component.css';
import { Button, Checkbox as CBox } from 'react-bootstrap';
import userDefaultImage from '../../../images/default_user.png';
class Step2Component extends Component {

    constructor(props) {
        super(props);
        this.addGpDelegateBtn = this.addGpDelegateBtn.bind(this);
        this.state = {
            showAddGpDelegateModal: false,
        }
    }

    addGpDelegateBtn() {
        console.log(this.state.showAddGpDelegateModal)
        this.setState({
            showAddGpDelegateModal: true
        })
    }

    componentWillUnmount () {
        console.log(this.state.showAddGpDelegateModal)
    }

    render() {
        console.log(this.state.showAddGpDelegateModal)
        return (
            <div className="GpDelegatesContainer">
                <h1 className="assignGp">Assign GP Delegates</h1>
                <p className="Subtext">Select GP Delegate(s) from the list below or add a new one.</p>
                <Button className="gpDelegateButton" onClick={this.addGpDelegateBtn}>Gp Delegate</Button>
                <div className="checkBoxGpContainer">
                    <label className="Rectangle-6">
                    <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Ben Parker</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                    <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Jeff Lynne</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Kaitlyn Lopez</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Larry Croft</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Samrutha Karujika</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Sarmad Ahallah</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Terrence Osborne</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Virginia Tang</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Xiao Pang</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                    <label className="Rectangle-6">
                        <img src={userDefaultImage} alt="fund_image" className="gpdelegateImg" />
                        <span className="Ben-Parker">Zita Hoffenheimer</span>
                        <CBox className="checkBoxBen">
                        </CBox>
                    </label>
                </div>
                <div className="addRoleModal" hidden={!this.state.showAddGpDelegateModal}>
                    <h4>Add Lp</h4>                            
                </div>
            </div>
        );
    }
}

export default Step2Component;



