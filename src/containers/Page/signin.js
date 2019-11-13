import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebase } from '../../firebase/firebase'
import { withRouter } from 'react-router-dom'
import { Redirect } from 'react-router'

import {firebaseLogin, login, logout} from "../../redux/auth/actions";

class SignIn extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        try {

        } catch (err) {

        }
    }

    render() {
        if (localStorage.getItem("idToken") == null) {
            this.props.firebaseLogin();
            return (
                <p>Please click here if you're not redirected...</p>
            )
        } else {
            return (
                <Redirect to="/">

                </Redirect>
            )
        }

    }
}

const mapStateToProps= (state) => {
    return { ...state }  // Take it all
};


const mapDispatchToProps = (dispatch) => ({
    login: () => dispatch(login()),
    firebaseLogin: () => dispatch(firebaseLogin())
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignIn));
