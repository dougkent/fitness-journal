// React
import React from 'react';
import * as ReactRouter from 'react-router-dom';

// Material UI
import {
    AppBar,
    createStyles,
    makeStyles,
    Theme,
    Toolbar,
    Typography,
} from '@material-ui/core';

// FJ
import { fjTheme } from '../themes';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        navLink: {
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginRight: theme.spacing(4),
            [theme.breakpoints.up('md')]: {
                marginRight: theme.spacing(2),
            },
            [theme.breakpoints.up('lg')]: {
                marginRight: theme.spacing(4),
            },
        },
    })
);

const Nav: React.FC = () => {
    const classes = useStyles(fjTheme);

    return (
        <>
            <AppBar position='sticky' color='default'>
                <Toolbar>
                    <Typography variant='h5'>
                        <ReactRouter.Link to='/' className={classes.navLink}>
                            Fitness Journal
                        </ReactRouter.Link>
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
};

export default Nav;
