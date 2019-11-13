import React from 'react';
import styled from 'styled-components';
import Fab from '@material-ui/core/Fab';

const Published = styled(Fab)`
    && {
        border-radius: 23px;
        position: fixed;
        right: 40px;
        bottom: 30px;
        width: 7rem;
        height: 2rem;
        z-index: 10;
    }
    
    .buttonText {
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;        
        text-align: center;
        letter-spacing: 0.75px;
        text-transform: uppercase;
    }
`;

export const Styled = {
    Published,
};