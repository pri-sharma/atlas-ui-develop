import React, {Component, Fragment} from 'react';
import Navbar from "../containers/Navbar";
import {withRouter, Route, Switch} from "react-router";
import CPAssignmentContainer from "./CPAssignmentContainer";
import CustomerUserAssignmentContainer from './CustomerUserAssignmentContainer';
import SalesOrgContainer from './SalesOrgContainer'
import CustomerGroupContainer from './CustomerGroup/CustomerGroupContainer'

class Main extends Component {
    render() {
        return (
            <Fragment>
                <Navbar/>
                <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper" id="kt_wrapper">
                    <Switch>
                        <Route path="/cpassignment" component={CPAssignmentContainer}/>
                        <Route path="/custuserassignment" component={CustomerUserAssignmentContainer}/>
                        <Route path="/salesorg" component={SalesOrgContainer} />
                        <Route path="/customergroup" component={CustomerGroupContainer} />
                    </Switch>
                </div>ytr8
            </Fragment>

        )
    }
}

export default withRouter(Main);