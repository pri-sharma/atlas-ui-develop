import React from 'react';
import styled from 'styled-components';

const TitleRow = styled.div`
    padding: 10px 25px;
    display: grid;
    justify-items: start;
    grid-template-columns: 40px 1fr;
    grid-gap: 15px;
    
    .title-text {
        color: ${props => props.theme.palette.sb_black};
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
        font-weight: 300;
        font-size: 30px;
        line-height: 35px;
        text-transform: capitalize;
    }
`;

const CustomizeContent = styled.div`
    display: grid;
    justify-items: start;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 0px 60px 10px 40px;
    grid-gap: 40px;
    
    .content-card {
        width: 275px;
    }
    
    .content-title {
        color: ${props => props.theme.palette.customize_black};       
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 21px;
        text-transform: capitalize;
    }
`;

export const Styled = {
    TitleRow,
    CustomizeContent,
};