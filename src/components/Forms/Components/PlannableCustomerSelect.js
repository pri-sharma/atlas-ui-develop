import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import {Select} from '@material-ui/core';
import {MenuItem, InputLabel} from "@material-ui/core";
import * as plannableCustomerActions from '../../../redux/plannableCustomers/actions';
import * as salesorgActions from '../../../redux/salesorg/actions';
import FormControl from '@material-ui/core/FormControl';

class PlannableCustomerSelect extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    createCustomerOptions = () => {
        return this.props.plannableCustomers.map(
            customer => <MenuItem value={customer.id} key={customer.id}>{customer.description}</MenuItem>
        );
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // get plannable customers when user is updated
        if (prevProps.user !== this.props.user) {
            this.props.getPlannableCustomers(this.props.user);
        }
    }

    onChange = (cust) => {
        this.props.setSelectedCustomerAction(cust.target.value);
        this.props.setSelectedSalesOrg(cust.target.value);
    }

    render() {
        return (
            <FormControl style={{width: '15rem'}}>
                <InputLabel htmlFor='cpg-input'
                            className='customHeaderText'>{(this.props.selectedCustomer) ? '' : 'Choose a Customer'}</InputLabel>
                <Select id={'cpg-input'}
                        disableUnderline={true}
                        fullWidth={true}
                        value={this.props.selectedCustomer}
                        displayEmpty={true}
                        onChange={this.onChange}
                        className='customHeaderText customerSelection'>
                    {this.createCustomerOptions()}
                </Select>
            </FormControl>
        )
    }
}

const mapStateToProps = state => {
    return {
        plannableCustomers: state.PlannableCustomers.plannableCustomers,
        selectedCustomer: state.PlannableCustomers.selectedCustomer,
        user: state.Auth.email
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPlannableCustomers: (user) => dispatch(plannableCustomerActions.getPlannableCustomersAction(user)),
        setSelectedCustomerAction: (customer) => dispatch(plannableCustomerActions.setSelectedCustomerAction(customer)),
        setSelectedSalesOrg: (customer_id) => dispatch(salesorgActions.setSelectedSalesOrg(customer_id))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlannableCustomerSelect)