import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import App from './containers/App/App';
import asyncComponent from './helpers/AsyncFunc';
import {restrictedRoutes} from './containers/App/AppRouter';

const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
    return (
        <Route
            {...rest}
            render={props => {
                return isLoggedIn ? (
                    <Component {...props} isLoggedIn={isLoggedIn}/>
                ) : (
                    <Redirect
                        to={{
                            pathname: '/signin',
                            state: {from: props.location}
                        }}
                    />
                )}
            }/>);
};
const appRoutes = (isLoggedIn) => {
    return restrictedRoutes.map(route => {
        return (<RestrictedRoute
                exact
                key={route.path}
                path={`${route.path}`}
                component={App}
                isLoggedIn={isLoggedIn}
            />
        )
    })
};
const PublicRoutes = ({ history, isLoggedIn }) => {
  return (
    <ConnectedRouter history={history}>
        <div>
            {appRoutes(isLoggedIn)}
            <Route
                exact
                path={'/signin'}
                component={asyncComponent(() => import('./containers/Page/signin'))}
            />
        </div>
    </ConnectedRouter>
  );
};

export default connect(state => ({
  isLoggedIn: localStorage.getItem('idToken') !== null
}))(PublicRoutes);
