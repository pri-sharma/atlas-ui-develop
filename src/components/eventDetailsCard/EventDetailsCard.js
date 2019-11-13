import React, {Component} from 'react';
import {DateRangePicker} from 'react-dates';
import {Card, CardContent, Chip, Grid, IconButton, InputLabel, MenuItem, Select, Typography} from '@material-ui/core';
import {AttachFile, Close, DateRange, KeyboardArrowLeft, KeyboardArrowRight} from '@material-ui/icons';
import moment from 'moment';
import StatusCellRenderer from '../CellRenderers/StatusCellRenderer';
import {connect} from 'react-redux';
import * as actions from "../../redux/events/actions";

class EventDetailsCard extends Component {
    constructor(props) {
        super(props);
        const event = this.props.currentEvent;

        this.state = {
            id: event.id,
            pricing_start: moment(event.pricing_start),  // TODO: Change when model changes to sellin_start/sellin_end
            pricing_end: moment(event.pricing_end),
            sellout_start: moment(event.sellout_start),
            sellout_end: moment(event.sellout_end),
            ship_start: moment(event.ship_start),
            ship_end: moment(event.ship_end),
            status: event.status,
            tactics: [],
            attachments:[],  // TODO: handle file upload on server
            pricing_input: null,
            sellout_input: null,
            ship_input: null,
        };
        this.style = this.props.style;

        this.handleTactics = this.handleTacticsAdd.bind(this, 'tactics', 'value');
        this.handleAttachments = this.handleAttachmentsAdd.bind(this, 'attachments', 'files');
        this.onDatesPricingChange = this.onDatesChange.bind(this, 'pricing_start', 'pricing_end');
        this.onDatesSelloutChange = this.onDatesChange.bind(this, 'sellout_start', 'sellout_end');
        this.onDatesShipChange = this.onDatesChange.bind(this, 'ship_start', 'ship_end');
        this.onFocusPricingChange = this.onFocusChange.bind(this, 'pricing_input');
        this.onFocusSelloutChange = this.onFocusChange.bind(this, 'sellout_input');
        this.onFocusShipChange = this.onFocusChange.bind(this, 'ship_input');
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.state !== nextState){
            let importantThingsChanged = false;
            Object.keys(nextState).forEach(key => {
                if(!key.includes('input') && this.state[key] !== nextState[key]){
                    importantThingsChanged = true
                }
            });
            if(importantThingsChanged){ // If only values that get stored are changed, then it will store in redux
                let importantChanges = {};
                for (let [key, value] of Object.entries(nextState)){
                    if(!key.includes('input')){
                        importantChanges[key] = value
                    }
                }
                this.props.updateEventChanges(importantChanges)
            }
            return true;
        }
        else if (this.props !== nextProps) {
            return true;
        }
        return false;
    };

    handleAttachmentsAdd = (name, target, props) => {
        const targetValue = props.target && props.target[target];

        if(targetValue) {
            this.setState({[name]: [...this.state[name], targetValue[0]]});
        }
    };

    handleTacticsAdd = (name, target, props) => {
        const targetValue = props.target && props.target[target];
        this.setState({[name]: targetValue});
    };

    handleChipDelete = (name, chipToDelete) => () => {
        const newTarget = this.state[name].filter((value) => value.name !== chipToDelete);
        this.setState({[name]: newTarget});
    };

    onDateChange = (date_label, date) => {
        this.setState({[date_label]: date});
    };

    onDatesChange = (start_label, end_label, range) => {
        let end = moment(range.endDate._d);
        end = end.format('YYYY-MM-DD'); //TODO THIS IS TEMPORARY AS IT WILL CHANGE WITH UX CHANGES TO ANTD
        end = moment(end);

        let start = moment(range.startDate._d);
        start = start.format('YYYY-MM-DD');
        start = moment(start);

        this.setState({[start_label]: start, [end_label]: end});
    };

    onFocusChange = (label, input) => {
        const isObject = typeof input === 'object' && !Array.isArray(input) && input !== null;
        this.setState({[label]: isObject ? input.focused : input });
    };

    onDatesClose = () => {
    };

    isInvalidDate = (date) => {
        const currYear = new Date().getFullYear();
        const lastYearStart = moment(new Date(currYear-1, 0, 1));
        const nextYearEnd = moment(new Date(currYear+2, 0, 1)); // TODO: Investigate
        return !(date.isAfter(lastYearStart) && date.isBefore(nextYearEnd));
    };

    render() {
        return (<Card style={this.style.cardStyle}>
                <CardContent>
                    <Grid container>
                        <Grid item xs={8}>
                            <Typography style={this.style.titlefontStyle}>
                                Event Details
                            </Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <StatusCellRenderer data={{'details': true, 'status': this.props.currentEvent.status, 'id': this.props.currentEvent.id}}/>
                        </Grid>
                        <Grid item xs={6} className='headerSpacing'>
                            <Grid item xs={12}>
                                <InputLabel style={this.style.inputLabelStyle}>Pricing Dates</InputLabel>
                                <RenderDatePicker startDate={this.state.pricing_start} endDate={this.state.pricing_end}
                                                  onDatesChange={this.onDatesPricingChange}
                                                  onFocusChange={this.onFocusPricingChange}
                                                  focusedInput={this.state.pricing_input}
                                                  isInvalidDate={this.isInvalidDate} onClose={this.onDatesClose}/>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel style={this.style.inputLabelStyle}>In-Store Dates</InputLabel>
                                <RenderDatePicker startDate={this.state.sellout_start} endDate={this.state.sellout_end}
                                                  onDatesChange={this.onDatesSelloutChange}
                                                  onFocusChange={this.onFocusSelloutChange}
                                                  focusedInput={this.state.sellout_input}
                                                  isInvalidDate={this.isInvalidDate} onClose={this.onDatesClose}/>
                            </Grid>
                            <Grid item xs={12}>
                                <InputLabel style={this.style.inputLabelStyle}>Shipping Dates</InputLabel>
                                <RenderDatePicker startDate={this.state.ship_start} endDate={this.state.ship_end}
                                                  onDatesChange={this.onDatesShipChange}
                                                  onFocusChange={this.onFocusShipChange} isInvalidDate={this.isInvalidDate}
                                                  onClose={this.onDatesClose} focusedInput={this.state.ship_input} />
                            </Grid>
                        </Grid>
                        <Grid item xs={6} className='headerSpacing'>
                            <Grid item xs={12}>
                                <InputLabel style={this.style.inputLabelStyle}>Select Tactics</InputLabel>
                                <Select
                                    multiple
                                    autoWidth={true}
                                    displayEmpty={true}
                                    value={this.state.tactics}
                                    onChange={this.handleTactics}
                                    style={{height: '25px', marginTop: '0.91%'}}
                                    renderValue={options => (
                                        <div>
                                            {options.map(value => (
                                                <Chip
                                                    key={value.name}
                                                    label={value.name}
                                                    size='small'
                                                    style={{
                                                        backgroundColor: 'rgba(147,213,241, 0.8)',
                                                        color: 'rgba(29,161,218, 0.8)'
                                                    }}
                                                    deleteIcon={ <Close style={{color:'rgba(29,161,218, 0.8)'}}/> }
                                                    onDelete={this.handleChipDelete('tactics', value.name)}
                                                />
                                            ))}
                                        </div>
                                    )}>
                                    {this.props.tactics.map(tactic => (
                                        <MenuItem key={tactic.id} value={tactic} style={{color:'rgba(29,161,218, 0.8)'}}>
                                            <strong>{tactic.name}</strong>: {tactic.description}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <span style={{fontWeight: 'bold'}}>Attachments</span>
                                <label>
                                    <input hidden onChange={this.handleAttachments} type='file'/>
                                    <IconButton color='primary' component='span'>
                                        <AttachFile/>
                                    </IconButton>
                                    Upload File
                                </label>
                                <div>
                                    {
                                        this.state.attachments.map(value => (
                                            <Chip
                                                key={value.name}
                                                label={value.name}
                                                size='small'
                                                style={{
                                                    backgroundColor: 'rgba(147,213,241, 0.8)',
                                                    color: 'rgba(29,161,218, 0.8)'
                                                }}
                                                deleteIcon={<Close style={{color:'rgba(29,161,218, 0.8)'}}/>}
                                                onDelete={this.handleChipDelete('attachments', value.name)}
                                            />
                                        ))
                                    }
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateEventChanges: (changes) => dispatch(actions.updateEventChanges(changes))
    }
};
export default connect(null, mapDispatchToProps)(EventDetailsCard)

const RenderDatePicker = ({...props}) => {
    return (<DateRangePicker
        startDate={props.startDate}
        endDate={props.endDate}
        customInputIcon={<DateRange/>}
        customArrowIcon={'-'}
        onDatesChange={props.onDatesChange}
        onFocusChange={props.onFocusChange}
        focusedInput={props.focusedInput}
        displayFormat={'MMM D YYYY'}
        navPrev={<KeyboardArrowLeft
            className={'DayPickerNavigation_button__horizontalDefault DayPickerNavigation_leftButton__horizontalDefault'}
            style={{fontSize: '3rem'}}/>}
        navNext={<KeyboardArrowRight
            className={'DayPickerNavigation_button__horizontalDefault DayPickerNavigation_rightButton__horizontalDefault'}
            style={{fontSize: '3rem'}}/>}
        startDateId={'start_date'}
        endDateId={'end_date'}
        hideKeyboardShortcutsPanel={true}
        firstDayOfWeek={0}  // TODO: remove hardcoding
        isOutsideRange={props.isInvalidDate}
        onClose={props.onDatesClose}
    />);
};