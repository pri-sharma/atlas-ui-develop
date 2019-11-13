import React from 'react';
import ReactDOM from 'react-dom';
import DashApp from './dashApp';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import {store} from './redux/store';
import {firebase} from './firebase/firebase';
import {login, logout} from './redux/auth/actions';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-bootstrap.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import {LicenseManager} from 'ag-grid-enterprise';
import '@material-ui/icons';

//LicenseManager.setLicenseKey(process.env.REACT_APP_AGGRID_KEY);
LicenseManager.setLicenseKey("Foundation_Source_Philanthropic_Inc__Foundation_Source___3Devs2_SaaS_21_December_2019__MTU3Njg4NjQwMDAwMA==ee8b7707231e7b40f6e71ec9bf87a7f1"); //MA Changes
let isRendered = false;
const renderApp = () => {
    if (!isRendered) {
        ReactDOM.render(<DashApp />, document.getElementById('root'));
        isRendered = true;
    }
};

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        user.getIdToken().then(function(idToken) {
            localStorage.setItem('idToken', idToken);
            store.dispatch(login(user.uid, user.email, user.photoURL, idToken))
        });
    } else {
        store.dispatch(logout());
    }
    renderApp();
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.register();
