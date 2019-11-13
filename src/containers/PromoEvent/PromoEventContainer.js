import React, {Component} from 'react';
import LayoutContentWrapper from '../../components/utility/layoutWrapper';
import {connect} from 'react-redux';
import * as actions from '../../redux/events/actions'
import FiltersContainer from '../Filters/FiltersContainer';
import EventContainerGrid from '../EventContainerGrid';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import StatusCellRenderer from '../../components/CellRenderers/StatusCellRenderer';
import LinkCellRenderer from '../../components/CellRenderers/LinkCellRenderer';
import CustomFilterHeader from '../../components/CustomFilterHeader';

class PromoEventContainer extends Component {

    constructor(props) {
        super(props);
        this.props.getEvents('TP', this.props.customer);
        this.props.getEventSelectionOptionsAction('TP', this.props.customer);

        this.frameworkComponents = {
            statusCellRenderer: StatusCellRenderer,
            linkCellRenderer: LinkCellRenderer,
            customFilterHeader: CustomFilterHeader
        };

        this.columnDefs = [
            {
                headerCheckboxSelection: true,
                checkboxSelection: true,
                suppressMenu: true,
                width: 65,
                headerHeight: 40,
            },
            {
                headerName: 'Status',
                field: 'status',
                cellRendererFramework: this.frameworkComponents.statusCellRenderer,
                editable: true,
                headerComponent: 'customFilterHeader',
                filter: true,
                menuTabs: ['filterMenuTab'],
            },
            {
                headerName: 'Event ID',
                cellRendererFramework: this.frameworkComponents.linkCellRenderer,
                headerComponent: 'customFilterHeader',
                filter: true,
                filterValueGetter: this.eventIdFilter,
                menuTabs: ['filterMenuTab'],
            },
            {
                headerName: 'Description',
                field: 'description',
                headerComponent: 'customFilterHeader',
                filter: true,
                menuTabs: ['filterMenuTab'],
            },
            {
                headerName: 'Pricing Dates',
                valueGetter: function (event) {
                    let start = moment(event.data.pricing_start).format('MMMM D YYYY');
                    let end = moment(event.data.pricing_end).format('MMMM D YYYY');
                    return `${start} - ${end}`;
                },
                headerComponent: 'customFilterHeader',
                filter: true,
                menuTabs: ['filterMenuTab'],
            },
            {
                headerName: 'In-Store Dates',
                valueGetter: function (event) {
                    let start = moment(event.data.sellout_start).format('MMMM D YYYY');
                    let end = moment(event.data.sellout_end).format('MMMM D YYYY');
                    return `${start} - ${end}`;
                },
                headerComponent: 'customFilterHeader',
                filter: true,
                menuTabs: ['filterMenuTab'],
            },
            {
                headerName: 'Shipping Dates',
                valueGetter: function (event) {
                    let start = moment(event.data.ship_start).format('MMMM D YYYY');
                    let end = moment(event.data.ship_end).format('MMMM D YYYY');
                    return `${start} - ${end}`;
                },
                headerComponent: 'customFilterHeader',
                filter: true,
                menuTabs: ['filterMenuTab'],
            }
        ];

    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.customer !== this.props.customer) {
            this.props.getEvents('TP', nextProps.customer);
            this.props.getEventSelectionOptionsAction('TP', nextProps.customer);
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !(nextProps.tpevents === this.props.tpevents);
    }

    handleDelete = (event) => {
        this.props.deleteTPEvent(event.id)
    };

    eventIdFilter = (params) => {
        return params.data.external_id
    };

    render() {
        return (
            <LayoutContentWrapper className='filteredContent'>
                <FiltersContainer/>
                <Paper className='filteredGrid'>
                    <EventContainerGrid frameworkComponents={this.frameworkComponents} columnDefs={this.columnDefs}
                                        data={this.props.tpevents}/>
                </Paper>
            </LayoutContentWrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        tpevents: state.Event.tpevents,
        event: state.Event.currentEvent,
        customer: state.PlannableCustomers.selectedCustomer,
        user: state.Auth.email,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getEvents: (event_type, customer_id) => dispatch(actions.getEvents('TP', customer_id)),
        getEventSelectionOptionsAction: (event_type, customer_id) => dispatch(actions.getEventSelectionOptionsAction('TP', customer_id)),
        deleteTPEvent: (event_id) => dispatch(actions.deleteEvent(event_id, 'TP')),
        getCurrentEvent: (eventId) => dispatch(actions.getCurrentEvent(eventId)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoEventContainer);