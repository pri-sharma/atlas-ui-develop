import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {Styled} from './PublishedButton.style';

export default class PublishedButton extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (<Styled.Published
            color='primary'
            disabled={this.props.changeReady}
            onClick={this.props.handleSaveCB}>
            <Typography className='buttonText'>Publish</Typography>
        </Styled.Published>)
    }
}