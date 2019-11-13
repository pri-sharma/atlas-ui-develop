import React, {Component} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import LayoutContentWrapper from '../../../components/utility/layoutWrapper';
import * as actions from '../../../redux/events/actions'
import EventDetailHeaderSelection from '../../EventDetailsHeader/EventDetailsHeaderSelection';
import EventDetailsContentSelection from '../../EventDetailsContentSelection/EventDetailsContentSelection';
import isEmpty from 'lodash/isEmpty';
import PublishedButton from '../../../components/publishButton/PublishedButton';

class PromoEventDetailsContainer extends Component {

    constructor(props) {
        super(props);
        // TODO: investigate the right way to integrate with promoEvent
        if (!this.props.currentEvent) {
            this.props.getCurrentEvent(this.props.match.params.id);
        }
        if (!this.props.tpConditions) {
            this.props.getConditions('TP');
        }
    }

    handleSave = () => {
        this.props.saveEventGridChanges(this.props.pendingGridChanges).then(
            (changed) => {
                let event = {};
                if(!isEmpty(this.props.pendingDetailChanges)) {
                    Object.assign(event, this.props.pendingDetailChanges);

                    ['sellout_start', 'sellout_end', 'pricing_start', 'pricing_end', 'ship_start', 'ship_end'].forEach(date => {
                        if(event[date]) {
                            event[date] = event[date]._i // TODO HANDLE DATE CHANGES BY KEYBOARD INSTEAD OF CALENDAR CLICK
                        }
                    });

                    if(event.tactics){
                        event['tactics'] = event.tactics.map(tactic => tactic.id.toString());
                    }
                    this.props.updateTPEvent(event);
                }
            },
            (err) => {
                return
            }
        )


    };

    render() {
        return (
            <LayoutContentWrapper className='filteredContent2'>
                <PublishedButton handleSaveCB={this.handleSave} changeReady={!this.props.changePending}/>
                <NavLink to='/promoevent'>
                    <IconButton color='primary' component='span'>
                        <ArrowBackIcon />
                    </IconButton>Back
                </NavLink>
                <EventDetailHeaderSelection />
                <EventDetailsContentSelection />
            </LayoutContentWrapper>
        )
    }
}

const mapStateToProps = state => {
    return {
        eventPending: state.Event.getEventPending,
        currentEvent: state.Event.currentEvent,
        changePending: state.Event.pendingChange,
        pendingGridChanges: state.Event.changedEntries,
        pendingDetailChanges: state.Event.pendingEventChanges,
        tpConditions: state.Event.tpConditions,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getCurrentEvent: (eventId) => dispatch(actions.getCurrentEvent(eventId)),
        updateTPEvent: (event) => dispatch(actions.updateTPEvent(event)),
        saveEventGridChanges: (changedEntries) => dispatch(actions.saveEventGridChanges(changedEntries)),
        getConditions: (eventType) => dispatch(actions.getConditions(eventType)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PromoEventDetailsContainer);