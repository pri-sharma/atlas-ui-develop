import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import * as plannableCustomerActions from '../../redux/plannableCustomers/actions';
import * as actions from "../../redux/bvp/actions";
import {InputNumber} from "antd";
import {Button, Select, MenuItem, Input, InputLabel, Grid} from '@material-ui/core'
import Form from '../uielements/form';
import PlannableCustomerSelect from '../Forms/Components/PlannableCustomerSelect'
import {MuiPickersUtilsProvider, DatePicker} from '@material-ui/pickers'
import MomentUtils from '@date-io/moment'

const year = new Date().getFullYear();
let year_options;
let years = [];
for (let i = year; i <= year + 5; i++) {
    years.push(i);
}

class BVPSearchForm extends Component {
    constructor(props) {
        super(props);
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear() + 1, today.getMonth(), 1);

        this.state = {
            customer: this.props.plannableCustomers.length === 1 ? this.props.plannableCustomers[0] : '',
            calyear: new Date().getFullYear(),
            startDate: start,
            endDate: end
        };
    }

    handleChange = (e, type = '') => {
        this.setState({
            [type]: e
        });

        if (type === 'customer') {
            this.props.setSelectedCustomer(e);
            this.props.checkChange();
        }

        if (type === 'calyear') {
            this.props.setSelectedYear(e);
            this.props.checkChange();
        }

    };

    createYearOptions = () => {
        year_options = years.map(year => {
            return (
                <MenuItem key={year} value={year}>{year}</MenuItem>
            )
        });
    };

    handleDateChange = (d, type) => {
        let newDate = new Date(d.year(), d.month(), 1);
        this.setState({[type]: newDate});
    };

    onSubmit = (e) => {
        //this.props.setSelectedDates(this.state.startDate, this.state.endDate);
        if (this.props.selectedCustomer) {
            let selectedCustomer = typeof this.props.selectedCustomer === 'number' ? this.props.selectedCustomer : this.props.selectedCustomer.id;
            this.props.getBvps(selectedCustomer, this.state.startDate, this.state.endDate);
        } else {

        }
        this.props.noChange();
    };

    render() {
        this.createYearOptions();
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        return (
            <Grid container justify={'flex-start'} alignItems={'flex-start'} spacing={2}>
                <Grid item md={2}>
                    <InputLabel htmlFor="bvp-customer">Customer</InputLabel>
                    <PlannableCustomerSelect input={<Input name={'year'} id={'bvp-year'}/>}/>
                </Grid>

                <MuiPickersUtilsProvider utils={MomentUtils}>
                    <Grid item md={1}>
                        <DatePicker
                            views={['year', 'month']}
                            label='Start Month'
                            value={this.state.startDate}
                            onChange={(d) => this.handleDateChange(d, 'startDate')}
                        />
                    </Grid>
                    <Grid item md={1}>
                        <DatePicker
                            views={['year', 'month']}
                            label='End Month'
                            value={this.state.endDate}
                            onChange={(d) => this.handleDateChange(d, 'endDate')}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>


                <Grid item md={1}>
                    <Button color="primary" variant={"contained"} disabled={false} onClick={this.onSubmit}>
                        Submit
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        baselineVolumePlans: state.Bvp.baselineVolumePlans,
        selectedCustomer: state.PlannableCustomers.selectedCustomer,
        plannableCustomers: state.PlannableCustomers.plannableCustomers,
        user: state.Auth.email
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setSelectedCustomer: (customer) => dispatch(plannableCustomerActions.setSelectedCustomerAction(customer)),
        setSelectedDates: (start, end) => dispatch(actions.setSelectedDatesAction(start, end)),
        // getPlannableCustomers: (user) => dispatch(plannableCustomerActions.getPlannableCustomersAction(user)),
        getBvps: (customer, start, end) => dispatch(actions.getBvpsAction(customer, start, end)),
        checkChange: () => dispatch(actions.checkChange()),
        noChange: () => dispatch(actions.noChange())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BVPSearchForm)