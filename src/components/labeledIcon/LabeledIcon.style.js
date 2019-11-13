import React from 'react';
import styled from 'styled-components';

const Labeled = styled.div`
    display: grid;
    justify-items: center;
    grid-gap: 3px;

    .label-icon {
        color: ${props => props.theme.palette.sb_black_contrast2};
        font-family: 'Material Icons Outlined';
        font-size: 200%;
    }

    .label-text {
        overflow: hidden;
        color: ${props => props.theme.palette.sb_black_contrast2};
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
        font-weight: bold;
        font-size: 12px;
        line-height: 15px;
        text-align: center;
    }
`;

export const Styled = {
    Labeled,
};