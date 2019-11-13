import React from 'react';
import styled from 'styled-components';

const CustomForm = styled.form`
    .filteredFilters {
        width: 100%;
    
        .ant-input::before {
            font-family: 'Material Icons';
            content: 'date_range';
        }
        .ant-input {
            background: ${props => props.theme.palette.primary};
            border: 1px solid ${props => props.theme.palette.content_blue_border};
            box-sizing: border-box;
            border-radius: 3px;
        }
        .ant-input, .ant-calendar-range-picker-separator,.ant-calendar-picker-icon {
            color: ${props => props.theme.palette.primary_white};
        }  
    }
    
    .filteredFiltersComponents {
        display: grid;
        grid-template-columns: 325px 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-gap: 3px;
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 16px;
    }
`;

export const Styled = {
    CustomForm
};