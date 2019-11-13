import React, {Component} from 'react';
import {Card, CardContent, Grid, TextField, Typography} from '@material-ui/core';
import {connect} from 'react-redux';
import * as actions from '../../redux/events/actions';

class EventDetailsTitleCard extends Component {
    constructor(props) {
        super(props);

        const event = this.props.currentEvent;

        this.state = {
            id: event.id,
            description: event.description,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.state !== nextState){
            this.props.updateEventChanges(nextState);
            return true
        }
        else if(this.props !== nextProps) {
            return true;
        }
        return false;
    };

    handleChange = name => event => {
        this.setState({[name]: event.target.value});
    };

    handleClick = (button = '', type, targetKeys = []) => {
        this.setState({
            [button]: !this.state[button],
            [type]: targetKeys  //type is either products or conditions
        });
    };

    handleDelete = (name, chipToDelete,arr) => ()=>{
        const temp = arr.filter(function (value) {
            return value !== chipToDelete
        });
        this.setState({[name]:temp});
    };

    render() {
        return (<Card>
                <CardContent  style={{height: '40px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <Typography>
                                {this.props.currentEvent.external_id ? this.props.currentEvent.external_id : 'external_id'}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                style={{marginTop: '-14px',}}
                                value={this.state.description}
                                onChange={this.handleChange('description')}
                            />
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

export default connect(null, mapDispatchToProps)(EventDetailsTitleCard)