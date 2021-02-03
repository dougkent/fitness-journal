// React
import React from 'react';

// Material UI
import {
    createStyles,
    Dialog,
    makeStyles,
    Theme,
    useMediaQuery,
} from '@material-ui/core';

// FJ
import { fjTheme } from '../themes';
import { JournalEntry } from '.';
import { JournalEntryDialogProps } from '../models/props/journal-entry-dialog.props';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialog: {
            padding: `${theme.spacing(1)}px ${theme.spacing(
                2
            )}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
        },
    })
);

const JournalEntryDialog: React.FC<JournalEntryDialogProps> = (
    props: JournalEntryDialogProps
) => {
    const fullScreen = useMediaQuery(fjTheme.breakpoints.down('sm'));
    const classes = useStyles(fjTheme);

    return (
        <Dialog
            fullScreen={fullScreen}
            open={props.isOpen}
            onClose={props.onClose}>
            <div className={classes.dialog}>
                <JournalEntry
                    isReadonly={props.isReadonly}
                    journalEntry={props.journalEntry}
                    onSave={props.onSave}
                    onClose={props.onClose}
                />
            </div>
        </Dialog>
    );
};

export default JournalEntryDialog;
