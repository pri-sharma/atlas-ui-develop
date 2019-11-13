import React from 'react';
import styled from 'styled-components';

const Labeled = styled.div`
    height: 89px;
    padding-top: 18px;
    background: ${props => props.theme.palette.sb_black};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);    
    display: grid;
    justify-items: start;
    grid-auto-flow: column;

    .logo-icon {
        color: ${props => props.theme.palette.sb_blue};
    }

    .logo-text {
        overflow: hidden;
        color: ${props => props.theme.palette.primary_white};
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
        font-weight: normal;
        font-size: 17px;
        line-height: 20px;
    }      
`;

export const Styled = {
    Labeled,
};