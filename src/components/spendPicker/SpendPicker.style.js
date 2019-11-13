import React from 'react';
import styled from 'styled-components';

const TitleRow = styled.div`
    padding: 10px 12px;
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
    grid-template-columns: 470px 300px;
    padding: 0px 30px 10px 25px;
    grid-gap: 30px;
    
    .content-card-left {
        width: 470px;
        
        // material-ui component override    
        .MuiCheckbox-root {
            padding: 0px;
        }
    }
    
    .content-card-right {
        width: 300px;
        display: grid;
        grid-template-rows: 30px 1fr;
    }
    
    .content-card-right-subcontent {
        text-align: center;
    }
    
    .content-card-right-subcontent-image {
        margin-top: calc(50%);
        margin-bottom: 15px;
    }
    
    .content-card-right-subcontent-text {
        color: ${props => props.theme.palette.customize_black};
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 14px;
    }
    
    .content-card-right-subcontent-text-sub {
        color: #8B96A7;
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 15px;
    }
    
    .content-card-left-subcontent {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }
    
    .content-title {
        margin-bottom: 10px;
        color: ${props => props.theme.palette.customize_black};       
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 21px;
        text-transform: capitalize;
    }
`;

export const Styled = {
    TitleRow,
    CustomizeContent,
};