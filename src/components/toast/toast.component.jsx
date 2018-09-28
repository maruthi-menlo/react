import React, { Component } from 'react';
import './toast.component.css';
import { Alert } from 'react-bootstrap';
import { PubSub } from 'pubsub-js';
import errorWhite from '../../images/error.svg';
import removeWhite from '../../images/removeWhite.svg';
import successWhite from '../../images/successWhite.svg';

class ToastComponent extends Component{
    constructor(props) {
        super(props);
        this.handleDismiss = this.handleDismiss.bind(this);
        this.state = {
            showToast: false,
            toastMessage: 'Test',
            toastType: 'success'
        }
    }

    componentWillReceiveProps(nextProps) {
        // if (nextProps.showToast !== this.props.showToast) {
            this.setState({ 
                showToast: this.props.showToast,
                toastMessage: this.props.toastMessage,
                toastType: 'success'
            }, () => {
                // PubSub.publish('closeToast', { timed: true});
            });
        // }
    }

    handleDismiss() {
        PubSub.publish('closeToast', { timed: false});
    }

    render(){
        if(this.props.showToast) {
            PubSub.publish('closeToast', { timed: true});
        }
        return(
            <div>
                {this.props.showToast 
                ?
                    <Alert bsStyle={this.props.toastType}>
                        <p>
                            <img className="success" src={this.props.toastType == 'success' ? successWhite : errorWhite} />
                            <span>{this.props.toastMessage}</span>
                            <img  className="close" src={removeWhite} onClick={this.handleDismiss} />
                        </p>
                    </Alert>
                    
                :
                    null
                }
            </div>
        );
        
    }
}

export default ToastComponent;



