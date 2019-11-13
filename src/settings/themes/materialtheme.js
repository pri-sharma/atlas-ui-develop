import {createMuiTheme} from '@material-ui/core/styles';

// TODO - get these to come from props.theme via styled components
const primary = '#1DA1DA';
const primary_white = '#FCFCFC';
const secondary = '#A781EA';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: primary,
            contrastText: primary_white,
        },
        secondary: {
            main: secondary,
        },
    },
    overrides: {
        MuiTabs: {
            indicator: {
                borderBottom: '5px solid '+ primary_white
            }
        },
    },
});

export default theme;