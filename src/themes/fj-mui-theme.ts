import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

const fjTheme = createMuiTheme({
    palette: {
        type: 'dark',
        secondary: {
            main: '#1976d2',
        },
        error: {
            main: red.A200,
        },
        text: {
            disabled: '#bdbdbd',
        },
        background: {
            default: '#353b3d',
            paper: '#4f5b62',
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

Object.assign(fjTheme, {
    overrides: {
        MUIRichTextEditor: {
            root: {
                minHeight: 90,
            },
        },
    },
});

export default fjTheme;
