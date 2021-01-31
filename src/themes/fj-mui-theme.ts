import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const fjTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#3d3d3d',
        },
        secondary: {
            main: '#095b06',
        },
        error: {
            main: red.A200,
        },
        background: {
            default: '#f4f4f6',
        },
    },
    shape: {
        borderRadius: 0,
    },
    typography: {
        fontFamily: '"Barlow", sans-serif',
        fontSize: 14,
        fontWeightRegular: 400,
        h1: {
            fontFamily: '"Barlow", serif',
            fontWeight: 600,
            lineHeight: 1,
        },
        h2: {
            fontFamily: '"Barlow", serif',
            fontWeight: 600,
            lineHeight: 1,
        },
        h3: {
            fontFamily: '"Barlow", serif',
            fontWeight: 600,
            lineHeight: 1,
        },
        h4: {
            fontFamily: '"Barlow", serif',
            fontWeight: 600,
            lineHeight: 1,
        },
        h5: {
            fontFamily: '"Barlow", serif',
            fontWeight: 600,
            lineHeight: 1,
        },
        h6: {
            fontFamily: '"Barlow", serif',
            fontWeight: 600,
            lineHeight: 1,
        },
    },
    overrides: {
        MuiFormLabel: {
            root: {
                color: 'inherit',
            },
        },
    },
});

export default fjTheme;
