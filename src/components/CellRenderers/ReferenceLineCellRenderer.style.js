import React from 'react';
import styled from 'styled-components';
import Slider from '@material-ui/core/Slider';

const CustomSlider = styled(Slider)`
    &&.MuiSlider-root {
      color: ${props => props.theme.palette.primary};
    }
`;

export const Styled = {
    CustomSlider,
};
