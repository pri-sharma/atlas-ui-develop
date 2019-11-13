import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button/index';
import MuiDialogTitle from '@material-ui/core/DialogTitle/index';
import Typography from '@material-ui/core/Typography/index';
import MuiDialogActions from '@material-ui/core/DialogActions/index';

const DialogTitle = styled(MuiDialogTitle)`
        margin: 0;
        padding: 1rem;
        backgroundColor: ${props => props.theme.palette.primary_white};
`;

const TitleTextWrapper = styled(Typography)`
    color: ${props => props.theme.palette.sb_black};
`;

const TitleRow = styled.div`
    padding: 0.5rem;
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

const DialogActions = styled(MuiDialogActions)`
     marginRight: 22px;
     marginBottom: 10px;
     padding: 1rem;
`;

// const CloseButton = styled(Button)`
//      && {
//         position: absolute;
//         right: 1rem;
//         top: 1rem;
//         border-radius: 50%;
//         min-width: 1.5rem;
//         min-height: 1.5rem;
//         color: ${props => props.theme.palette.sb_black};
//      }
// `;

const SubmitButton = styled(Button)`
    && {
        border-radius: 0;
        padding: .5rem 1.5rem .5rem 1.5rem;
        color: ${props => props.theme.palette.primary_white};
        background-color: ${props => props.theme.palette.primary};
    }
`;

const CloseButton = styled(Button)`
    && {
        border-radius: 0;
        color: ${props => props.theme.palette.sb_black_contrast2};
    }
`;

export const Styled = {
    DialogTitle,
    TitleTextWrapper,
    TitleRow,
    DialogActions,
    CloseButton,
    SubmitButton,
};