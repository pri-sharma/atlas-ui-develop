import React, { Component } from 'react';
import { Redirect } from 'react-router'
import { connect } from 'react-redux';
import { Layout } from 'antd';
import appActions from '../../redux/app/actions';
import * as bvpActions from '../../redux/bvp/actions';
import TopbarUser from './topbarUser';
import PlannableCustomerSelect from '../../components/Forms/Components/PlannableCustomerSelect';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import RestoreIcon from '@material-ui/icons/Restore';
import moment from 'moment';
import 'react-dates/initialize';
import HeaderWrapper from './topbar.style';
import 'react-dates/lib/css/_datepicker.css';
import './react_dates_overrides.css';

const { Header } = Layout;

class Topbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            focusInput: null,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            startDayOfWeek: null,
        };
        this.startDate = this.props.startDate;
        this.endDate = this.props.endDate;
        this.initTab();
    }

    initTab = () => {
        const tabIds = ['baseline_volume_planning', 'bspevent', 'promoevent'];
        const url = this.props.url.replace(/\//g, '');
        tabIds.forEach(id => {
            if (url.startsWith(id)) {
                this.props.setTab(id);
            }
        });
    };

    handleTabChange = (event, tabId) => {
        this.props.setTab(tabId);
        this.setState({
            redirect: true
        });
    };

    onDatesChange = ({ startDate, endDate }) => {
        this.startDate = startDate;
        this.endDate = endDate;
        this.setState({ startDate, endDate });
    };

    onDatesClose = () => {
        this.props.setSelectedDates(this.startDate, this.endDate);
    };

    getStartDay = () => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days.indexOf(this.props.customerStartDay);
    };

    onFocusChange = (focusedInput) => {
        this.setState({ focusedInput });

        const startDayInt = this.getStartDay();
        if (this.state.startDayOfWeek !== startDayInt) {
            this.setState({ startDayOfWeek: startDayInt });
        }
    };

    isInvalidDate = (date) => {
        const currYear = new Date().getFullYear();
        const lastYearStart = moment(new Date(currYear - 1, 0, 1));
        const nextYearEnd = moment(new Date(currYear + 2, 0, 1));
        return !(date.isAfter(lastYearStart) && date.isBefore(nextYearEnd));
    };

    render() {
        const url = this.props.url.replace(/\//g, '');
        if (this.state.redirect && url !== this.props.currentTab) {
            return <Redirect to={`/${this.props.currentTab}`} />
        }

        return ( // TODO: have global enums for links
            <HeaderWrapper>
                <Header
                    className='customHeaderBar'>
                         <Box>
                    {(url != 'reporting') ?
                       
                            < PlannableCustomerSelect />
                       : null}
                        </Box> 
                    <Box>
                        {(url === 'baseline_volume_planning' || url.startsWith('bspevent') || url.startsWith('promoevent'))
                            && !!(this.props.selectedCustomer) ?
                            <Tabs value={this.props.currentTab || 'baseline_volume_planning'}
                                onChange={this.handleTabChange}
                                indicatorColor='primary'
                                variant='fullWidth'>
                                {this.props.planningConfig.BVP ?
                                    <Tab className='customHeaderText customTabs' label='Baseline Volume'
                                        value={'baseline_volume_planning'} /> : null}
                                {this.props.planningConfig.BSP ?
                                    <Tab className='customHeaderText customTabs' label='Base Spends'
                                        value={'bspevent'} /> : null}
                                {this.props.planningConfig.TP ?
                                    <Tab className='customHeaderText customTabs' label='Trade Promotion'
                                        value={'promoevent'} /> : null}
                            </Tabs>
                            : null}

                    </Box>
                    <Box>
                        <IconButton className='customHeaderText' aria-label='mass copy'>
                            <FileCopyOutlinedIcon />
                        </IconButton>
                        <IconButton className='customHeaderText' aria-label='restore'>
                            <RestoreIcon />
                        </IconButton>
                        <IconButton className='customHeaderText' aria-label='notification'>
                            <NotificationsNoneIcon />
                        </IconButton>
                        <TopbarUser />
                    </Box>
                </Header>
            </HeaderWrapper>
        );
    }
}

const mapStateToProps = state => {
    return {
        currentTab: state.App.currentTab,
        collapsed: state.App.collapsed,
        openDrawer: state.App.openDrawer,
        startDate: state.Bvp.startDate,
        endDate: state.Bvp.endDate,
        customerStartDay: state.PlannableCustomers.customerStartDay,
        selectedCustomer: state.PlannableCustomers.selectedCustomer,
        planningConfig: state.PlannableCustomers.planningConfig,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setTab: (tabId) => dispatch(appActions.setTab(tabId)),
        setSelectedDates: (startDate, endDate) => dispatch(bvpActions.setSelectedDatesAction(startDate, endDate)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Topbar);