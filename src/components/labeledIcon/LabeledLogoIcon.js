import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import RadioButtonUncheckedSharpIcon from '@material-ui/icons/RadioButtonUncheckedSharp';
import {Styled} from './LabeledLogoIcon.style';
import Typography from '@material-ui/core/Typography';

export default class LabeledLogoIcon extends Component {
    constructor(props) {
        super(props);

        this.resetMenu = this.resetMenu.bind(this);
    };

    resetMenu() {
        this.props.clearClickCB();
    }

    render() {
        return (<Link to="/" onClick={this.resetMenu}>
            <Styled.Labeled>
                <RadioButtonUncheckedSharpIcon className='logo-icon'/>
                <Typography className='logo-text'>Atlas</Typography>
            </Styled.Labeled>
        </Link>)
    }
}
