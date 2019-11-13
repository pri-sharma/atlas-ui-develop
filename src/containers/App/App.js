import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Layout} from 'antd';
import {Debounce} from 'react-throttle';
import WindowResizeListener from 'react-window-size-listener';
import styled, {ThemeProvider} from 'styled-components';
import {ThemeProvider as MaterialThemeProvider, StylesProvider} from '@material-ui/styles';
import appActions from '../../redux/app/actions';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import AppRouter from './AppRouter';
import {themeConfig} from '../../settings';
import themes from '../../settings/themes';
import './global.css';
import {logout} from '../../redux/auth/actions';

const Box = styled.div`
  background-color: ${props => props.theme.palette.primary};
`;

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: themes[themeConfig.normal],
        };
        this.showTheme = localStorage.getItem('atlasThemes');
    }

    changeTheme = theme => event => {
        switch (theme) {
            case 'light':
                this.setState({theme: themes[themeConfig.light]});
                break;
            case 'dark':
                this.setState({theme: themes[themeConfig.dark]});
                break;
            default:
                this.setState({theme: themes[themeConfig.normal]});
                break;
        }
    }

    render() {
        const {url} = this.props.match;
        return (
                <MaterialThemeProvider theme={themes[themeConfig.material]}>
                    <ThemeProvider theme={this.state.theme}>
                        {(this.showTheme) ? <Box>
                            Themes:
                            <button onClick={this.changeTheme('normal')}>Normal</button>
                            <button onClick={this.changeTheme('light')}>Light</button>
                            <button onClick={this.changeTheme('dark')}>Dark</button>
                        </Box> : null}
                        <Layout>
                            <Sidebar url={url}/>
                            <Layout>
                                <Topbar url={url}/>
                                <AppRouter url={url} isLoggedIn={this.props.isLoggedIn}/>
                            </Layout>
                        </Layout>
                    </ThemeProvider>
                </MaterialThemeProvider>
        );
    }
}

export const mapStateToProps = state => {
    return {
        auth: state.Auth,
        height: state.App.height
    }
};

export default connect(
    mapStateToProps,
    {logout}
)(App);
