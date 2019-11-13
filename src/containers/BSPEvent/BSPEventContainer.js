import React, {Component, Fragment} from 'react';
import {connect} from 'react-redux';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import {Table, Button} from 'antd/lib/index';
import {Link} from 'react-router-dom';
import * as actions from '../../redux/events/actions';
import FiltersContainer from '../Filters/FiltersContainer';
import Paper from '@material-ui/core/Paper';

class BSPEventContainer extends Component {

    constructor(props) {
        super(props);
        this.props.getEvents('BSP', this.props.customer);
        this.props.getEventSelectionOptionsAction('BSP', this.props.customer);
        this.columns = [
            {
                title: 'ID',
                dataIndex: 'id'
            },
            {
                title: 'Customer',
                dataIndex: 'eventcustomers_set',
                render: value => value.length > 0 ? value[0].customer.description : ''

            },
            {
                title: 'Description',
                dataIndex: 'description'
            },
            {
                title: 'Start',
                dataIndex: 'pricing_start'
            },
            {
                title: 'End',
                dataIndex: 'pricing_end'
            },
            {
                title: 'Actions',
                render: (value, record) => {
                    return (
                        <Fragment>
                            <Button type='primary' onClick={() => this.handleViewEvent(record.id)}>View
                                Event</Button>
                        </Fragment>
                    )
                }
            }
        ];
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.event !== this.props.event) {
            this.props.history.push({pathname: '/bspevent/edit', state: {event: nextProps.event, kind: 'PATCH'}})
        } else if (nextProps.customer !== this.props.customer) {
            this.props.getEvents('BSP', nextProps.customer);
            this.props.getEventSelectionOptionsAction('BSP', nextProps.customer);
        }
    }

    handleDelete = (event_id) => {
        this.props.deleteBSPEvent(event_id)
    };

    handleViewEvent = (eventId) => {
        this.props.getCurrentEvent(eventId);
    };

    render() {
        return (
            <LayoutContentWrapper className='filteredContent'>
                <FiltersContainer/>
                <Paper className='filteredGrid'>
                    <Table rowKey='id' dataSource={this.props.bspevents} columns={this.columns}/>
                    <Button style={{float: 'right', margin: '1vh'}}>
                        <Link to={{pathname: '/bspevent/new', state: {kind: 'POST'}}}>Add New Base Spend Plan</Link>
                    </Button>
                </Paper>
            </LayoutContentWrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        bspevents: state.Event.bspevents,
        event: state.Event.currentEvent,
        customer: state.PlannableCustomers.selectedCustomer,
        user: state.Auth.email,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getEvents: (event_type, customer_id) => dispatch(actions.getEvents(event_type, customer_id)),
        getEventSelectionOptionsAction: (event_type, customer_id) => dispatch(actions.getEventSelectionOptionsAction(event_type, customer_id)),
        deleteBSPEvent: (event_id) => dispatch(actions.deleteEvent(event_id)),
        getCurrentEvent: (eventId) => dispatch(actions.getCurrentEvent(eventId))

    }
};

export default connect(mapStateToProps, mapDispatchToProps)(BSPEventContainer)