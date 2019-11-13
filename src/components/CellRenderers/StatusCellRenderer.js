import React, {Component} from 'react';
import {connect} from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem/index';
import Select from '@material-ui/core/Select/index';
import * as actions from '../../redux/events/actions';

class StatusCellRenderer extends Component {
    constructor(props){
        super(props);
        this.data = this.props.data;
        this.details = props.data.details;
        this.colors = {
            Draft: {background: '#DCE0E5', text: '#3D4551'},
            Planned: {background: '#F0E8A4', text: '#A29415'},
            Approved: {background: '#A0E7B3', text: '#2FA84F'},
            CorrectiveActions: {background: '#FFD900', text: '#FF8B00'},
            Cancelled: {background: '#FF6E00', text: '#4D1C19'},
            DraftCopy: {background: '#DCE0E5', text: '#3D4551'},

        };

        this.styles = (value) => {
            let customStyle = {
                borderRadius: '15px',
                minWidth: '100%',
                maxWidth: '100%',
                height: '100%',
                textAlign: 'center',
                fontSize: '100%'
            }
            if(this.colors[value]) {
                customStyle = {
                    ...customStyle,
                    backgroundColor: `${this.colors[value].background}`,
                    color: `${this.colors[value].text}`,
                }
            }
            return customStyle;
        };

        this.state = {
            status: props.data.status,
        }
    }

    handleChange = (e) => {
        this.setState({
            status: e.target.value
        });
        this.data.status = e.target.value;

        if(!this.details){
            this.props.api.updateRowData({update: this.data.forEachNode});// update the ag-grid row data's status
            this.props.api.destroyFilter('status'); //destroys the filter so that when accessing again, updates new values
        }
        this.props.updateEventStatus(this.props.data.id, e.target.value)
    };

    render(){
        return(<Select disableUnderline={true} style={this.styles(this.state.status)} value={this.state.status} onChange={this.handleChange.bind(this)}>
                    <MenuItem value={'Draft'}>Draft</MenuItem>
                    <MenuItem value={'Planned'}>Planned</MenuItem>
                    <MenuItem value={'Approved'}>Approved</MenuItem>
                    <MenuItem value={'CorrectiveActions'}>Corrective Actions</MenuItem>
                    <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
                    <MenuItem value={'DraftCopy'}>Draft Copy</MenuItem>
                </Select>)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateEventStatus: (event_id, newStatus) => dispatch(actions.updateEventStatus(event_id, newStatus))
    }
};

export default connect(null, mapDispatchToProps)(StatusCellRenderer);

