import React from 'react';
import styled from 'styled-components';

const AGGridContent = styled.div`
    height: 45vh;

    // ag-grid component override
    &&.ag-theme-material .ag-icon-checkbox-checked:empty {
        // background-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0nMTgnIGhlaWdodD0nMTgnIHZpZXdCb3g9JzAgMCAxOCAxOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTYgMEgyYTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjJhMiAyIDAgMCAwLTItMnpNNyAxNEwyIDlsMS40MS0xLjQxTDcgMTEuMTdsNy41OS03LjU5TDE2IDVsLTkgOXonIGZpbGw9JyMxREExREEnLz48L3N2Zz4=);
        color: ${props => props.theme.palette.primary};
    }
    &&.ag-theme-material.bvpGridContent .ag-header-cell-label .ag-header-icon {
        visibility: hidden;
    } 
`;

export const Styled = {
    AGGridContent,
};