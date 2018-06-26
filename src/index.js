import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FsnetRouter from './actions/router';
// import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<FsnetRouter />, document.getElementById('root'));
registerServiceWorker();
