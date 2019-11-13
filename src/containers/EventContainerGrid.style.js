import React from 'react';
import styled from 'styled-components';

const TPGridContent = styled.div`
    height: 45vh;

    // ag-grid component override
    &&.ag-theme-material .ag-header-cell-label .ag-header-cell-text {
        overflow: hidden;
        text-overflow: unset;
        white-space: nowrap;
        font-weight: 500;
        font-size: 117%;
        color: #000000;
    }
    &&.ag-theme-material .ag-header-cell, .ag-theme-material .ag-header-group-cell {
        border-style: solid;
        border-color: #606D80;
        line-height: 56px;
        padding-left: 24px;
        padding-right: 24px;
        border-width: 1px;
        background-color: #DCE0E5;
    }   
    &&.ag-cell {
        display: inline-block;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        font-size: 108%;
        font-weight: normal;
    }
    &&.ag-theme-material .ag-cell {
        text-overflow: unset;
        line-height: 275%;
        padding-left: 24px;
        padding-right: 24px;
        border: 1px solid transparent;
        padding-left: 23px;
        padding-right: 23px;
    }
    &&.ag-theme-material .ag-icon-checkbox-checked:empty {
        // background-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0nMTgnIGhlaWdodD0nMTgnIHZpZXdCb3g9JzAgMCAxOCAxOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTYgMEgyYTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjJhMiAyIDAgMCAwLTItMnpNNyAxNEwyIDlsMS40MS0xLjQxTDcgMTEuMTdsNy41OS03LjU5TDE2IDVsLTkgOXonIGZpbGw9JyMxREExREEnLz48L3N2Zz4=);
        color: ${props => props.theme.palette.primary};
    }
`;

export const Styled = {
    TPGridContent,
};