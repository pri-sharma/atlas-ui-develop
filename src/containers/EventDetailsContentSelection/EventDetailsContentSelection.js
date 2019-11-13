import React, {Component} from 'react';
import {connect} from 'react-redux';
import {CircularProgress, Paper} from '@material-ui/core';
import EventGrid from '../../components/EventGrid';
import * as plannableCustomerActions from '../../redux/plannableCustomers/actions';
import * as salesorgActions from '../../redux/salesorg/actions';
import * as eventActions from '../../redux/events/actions';

class EventDetailsContentSelection extends Component {

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(!nextProps.eventPending) {
            // TODO: Is this right place to set it? From what I understand,
            //  planning config must be set.
            if(Object.entries(nextProps.planningConfig).length === 0) {
                const customer = nextProps.currentEvent.eventcustomers_set[0].customer.id;
                nextProps.setSelectedCustomerAction(customer);
                nextProps.setSelectedSalesOrg(customer);
                return false;
            }
            if(!nextProps.tpConditions) {
                nextProps.getConditions('TP');
                return false;
            }
            return true;
        }
        return false;
    }

    render() {
        if (this.props.eventPending) {
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <CircularProgress/>
                </div>
            );
        } else {
            return (
                <Paper className='filteredGrid'>
                    <EventGrid/>
                </Paper>);
        }
    }
}

const mapStateToProps = state => {
    return {
        currentEvent: state.Event.currentEvent,
        eventPending: state.Event.getEventPending,
        planningConfig: state.PlannableCustomers.planningConfig,
        plannableCustomers: state.PlannableCustomers.plannableCustomers,
        selectedCustomer: state.PlannableCustomers.selectedCustomer,
        tpConditions: state.Event.tpConditions,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getPlannableCustomers: (user) => dispatch(plannableCustomerActions.getPlannableCustomersAction(user)),
        setSelectedCustomerAction: (customer) => dispatch(plannableCustomerActions.setSelectedCustomerAction(customer)),
        setSelectedSalesOrg: (customer_id) => dispatch(salesorgActions.setSelectedSalesOrg(customer_id)),
        getConditions: (eventType) => dispatch(eventActions.getConditions(eventType)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailsContentSelection);