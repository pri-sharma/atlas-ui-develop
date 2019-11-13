import React from 'react';
import styled from 'styled-components';
import {Button} from '@material-ui/core';
import {KeyboardArrowUp} from '@material-ui/icons';

const CollapsedButton = styled(props => (
  <Button {...props}>
      <UpArrowIcon />
  </Button>
))`
    && {
        border-radius: 45px;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 50%);
        background-color: rgba(237,248,253, 0.8);
        border-color: rgba(237,248,253, 0.8);
        min-width: unset;
        width: 2.5rem;
        padding: 0;
    }
`;

const UpArrowIcon = styled(KeyboardArrowUp)`
    && {
        color: rgba(29,161,218, 0.8);
    }
`;

const cardStyle = {
    width: '100%',
    overflow: 'unset',
    height: '180px',
    marginBottom: '24px',
    backgroundColor: 'rgba(252,252,252, 0.8)',
    position: 'relative',
    boxShadow: '0px 4px 9px rgba(0, 0, 0, 0.16)',
};

const titleCardStyle = {
    width: '100%',
    overflow: 'unset',
    height: '30px',
    margin: '0px',
    padding: '0px',
    backgroundColor: 'rgba(252,252,252, 0.8)',
    position: 'relative',
    display: 'inline-block'
};

const smallCardStyle = {
    width: '50%',
    height: '100vh',
    marginBottom: '30px',
    marginTop: '-30px',
    backgroundColor: 'rgba(252,252,252, 0.8)',
    position: 'relative',
    display: 'inline-block'
};

const titlefontStyle = {
    fontFamily: 'Roboto',
    fontSize: '18px',
    fontWeight: '500',
    marginTop: '-10px',
    marginLeft: '1.59%'
};

const inputLabelStyle = {
    fontFamily: 'Roboto',
    fontSize: '12px',
    color: 'rgba(0,0,0,1)',
    fontWeight: 'normal',
    lineHeight: '122.69%',

};

const buttonStyle = {
    fontWeight: '500',
    fontSize: '12px',
    lineHeight: '14px',
    marginLeft: '73.7%',
    marginTop: '5.7%',
    color: 'rgba(29,161,218, 0.8)',
    position: 'static'

};

export const Styled = {
    CollapsedButton,
    cardStyle,
    smallCardStyle,
    titleCardStyle,
    titlefontStyle,
    inputLabelStyle,
    buttonStyle,
};