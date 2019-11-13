import styled from 'styled-components';

const ContentHolder = styled.div`
    
.customContent {
    background: linear-gradient(to bottom, ${props => props.theme.palette.tb_blue} 244px, 
        ${props => props.theme.palette.content_white} 0%);
        overflow: auto;
        height: 100vh;
    
    .filteredContent {
        padding: 300px 30px 0px 30px;
        display: grid;
        align-items: end;
        justify-items: stretch;
        grid-gap: 4px;
        grid-template-rows: 2fr 10fr;
    }
        
    .filteredGrid {
        height: 50vh !important;
    }

    .filteredContent2 {
        background: ${props => props.theme.palette.content_white};
        padding: 64px 30px 10px 30px;
        display: grid;
        align-items: end;
        justify-items: stretch;
        grid-gap: 8px;
        grid-template-rows: 1fr 5fr auto;
        
        >.MuiCard-root {
            overflow: unset;
        }
        
        .headerSpacing {
            display: grid;
            grid-gap: 10px;
        } 
    }
}
`;

export const Styled = {
    ContentHolder,
};
