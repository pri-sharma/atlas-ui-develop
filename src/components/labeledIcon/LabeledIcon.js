import React, {Component} from 'react';
import Icon from '@material-ui/core/Icon';
import {Styled} from './LabeledIcon.style';
import {Typography} from '@material-ui/core';

export default class LabeledIcon extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        return (<Styled.Labeled>
            <Icon className='label-icon'>{this.props.icon}</Icon>
            <Typography className='label-text'>
                {this.props.label}
            </Typography>
        </Styled.Labeled>)
    }
}