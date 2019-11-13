import React from 'react';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';

const ProductGridContent = styled(Paper)`
    height: 78%;
    width: 96%;
    position: absolute;
    left: 50%;
    top: 59%;
    transform: translate(-50%, -50%);

    // ag-grid component override
    &&.ag-theme-material .ag-icon-checkbox-checked:empty {
        // background-image: url(data:image/svg+xml;charset=utf-8;base64,PHN2ZyB3aWR0aD0nMTgnIGhlaWdodD0nMTgnIHZpZXdCb3g9JzAgMCAxOCAxOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMTYgMEgyYTIgMiAwIDAgMC0yIDJ2MTRhMiAyIDAgMCAwIDIgMmgxNGEyIDIgMCAwIDAgMi0yVjJhMiAyIDAgMCAwLTItMnpNNyAxNEwyIDlsMS40MS0xLjQxTDcgMTEuMTdsNy41OS03LjU5TDE2IDVsLTkgOXonIGZpbGw9JyMxREExREEnLz48L3N2Zz4=);
        color: ${props => props.theme.palette.primary};
    }
`;

export const Styled = {
    ProductGridContent,
};