import styled from 'styled-components';
import WithDirection from '../../settings/withDirection';

const TopbarWrapper = styled.div`
.customHeaderBar {
    padding: 0px 30px;
    white-space: nowrap;
    position: fixed;
    z-index: 1000;
    display: grid;
    justify-items: start;
    align-items: center;
    background-color: ${props => props.theme.palette.tb_blue};
    grid-template-columns: 4fr 7fr 1fr;
    
    .customHeaderText {
        line-height: 18px;
        text-transform: capitalize;
        font-weight: 500;          
        color: ${props => props.theme.palette.primary_white};
        font-family: ${props => props.theme.fonts.primary};
        font-style: normal;
    }
    
    // H4 - TODO: use global styles via variants
    .customTabs {
        flex-basis: inherit;
        font-size: 18px;
    }
    
    // H1 - TODO: use global styles via variants
    .customerSelection {
        // font-weight: normal;
        font-size: 28px;
        
        // material-ui component override
        >.MuiSelect-icon {
            color: ${props => props.theme.palette.primary_white};
        }
    }
}
`;

export default WithDirection(TopbarWrapper);
