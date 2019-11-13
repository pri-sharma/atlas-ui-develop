import styled from 'styled-components';
import WithDirection from '../../settings/withDirection';

const SidebarWrapper = styled.div`
.customSiderBar {
    z-index: 1000;
    overflow: hidden;
    height: 100vh;
    left: 0;
    
    // ant.design layout override    
    >.ant-layout-sider-zero-width-trigger {
        background: ${props => props.theme.palette.sb_black};
        top: 64px;
    }     
    
    .customAntMenu {
        height: 100vh;
        background: ${props => props.theme.palette.sb_black};
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);    

        // ant.design layout override
        >.ant-menu-item-selected {
            background-color: ${props => props.theme.palette.sb_black_contrast};
            
            .label-icon {
                color: ${props => props.theme.palette.sb_white};
                font-family: 'Material Icons Outlined';
            }
            .label-text {
                color: ${props => props.theme.palette.sb_white};
            font-weight: bold;
            }
        }
        >.ant-menu-item.customClass {
            height: 54px;
            display: grid;
        }

        >li {
            &:hover {
                .label-icon {
                    color: ${props => props.theme.palette.sb_white};
                }
                .label-text {
                    color: ${props => props.theme.palette.sb_white};
                }
            }
        }
    }
}
`;

export default WithDirection(SidebarWrapper);