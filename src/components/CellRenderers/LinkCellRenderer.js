import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import * as actions from '../../redux/events/actions';

class LinkCellRenderer extends Component{
    constructor(props){
        super(props);
        this.styles = {
            color: '#1DA1DA',
            fontWeight: 500,
            textDecoration: 'underline',
        };
        this.link = this.props.data.type == 'TP' ? 'promoevent' : 'bsp'
    }

    render(){
        return <Link style={this.styles} onClick={() => this.props.getCurrentEvent(this.props.data.id)} to={{pathname:`/${this.link}/details/${this.props.data.id}`, state: {event: this.props.data, kind:'PATCH'}}}>{this.props.data.external_id ? this.props.data.external_id : 'external_id'}</Link>
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getCurrentEvent: (event_id) => dispatch(actions.getCurrentEvent(event_id))
    }
};

export default connect(null, mapDispatchToProps)(LinkCellRenderer);


