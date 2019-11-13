import React, {Component} from 'react';
import {connect} from 'react-redux';
import {KeyboardArrowUp} from '@material-ui/icons';
import {Button, Card, CircularProgress} from '@material-ui/core';
import EventDetailsCard from '../../components/eventDetailsCard/EventDetailsCard';
import EventDetailsTitleCard from '../../components/eventDetailsTitleCard/EventDetailsTitleCard';
import * as actions from '../../redux/events/actions';
import {Styled} from './EventDetailsHeaderSelection.styles';

class EventDetailsHeaderSelection extends Component {

    componentDidMount() {
        if(this.props.tactics.length === 0) {
            this.props.getTactics();
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(!!nextProps.currentEvent) {
            return true;
        }
        return false;
    }

    render() {
        const {eventPending, currentEvent, tactics} = this.props;
        if (eventPending) {
            return (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh'}}>
                    <CircularProgress/>
                </div>
            );
        } else {
            return (
                <Card>
                    <EventDetailsTitleCard currentEvent={currentEvent}/>
                    <EventDetailsCard style={Styled} currentEvent={currentEvent} tactics={tactics}/>
                </Card>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        currentEvent: state.Event.currentEvent,
        eventPending: state.Event.getEventPending,
        tactics: state.Event.tactics,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        getTactics: () => dispatch(actions.getTactics())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(EventDetailsHeaderSelection);