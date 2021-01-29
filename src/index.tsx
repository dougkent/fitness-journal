// React
import React from 'react';
import ReactDOM from 'react-dom';

// Material UI
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';

// FJ
import { fjTheme } from './themes';
import App from './containers/App';

ReactDOM.render(
    <ThemeProvider theme={fjTheme}>
        <CssBaseline />
        <App />
    </ThemeProvider>,
    document.getElementById('root')
);
