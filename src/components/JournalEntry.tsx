// React
import React from 'react';

// Material UI
import {
    Button,
    createStyles,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Switch,
    TextField,
    Theme,
} from '@material-ui/core';

// MUI RTE
import MUIRichTextEditor from 'mui-rte';
import { EditorState, convertToRaw } from 'draft-js';

// FJ
import { JournalEntryModel, Level } from '../models/api';
import { JournalEntryProps } from '../models/props/journal-entry.props';
import { fjTheme } from '../themes';
import { JournalEntryIdService } from '../services';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formRow: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        formRowMargin: {
            marginBottom: theme.spacing(2),
            marginTop: theme.spacing(2),
        },
        formLabel: {
            width: '100%',
        },
        formItem: {
            width: '48%',
        },
    })
);

const idService = new JournalEntryIdService();

const date = new Date();

const emptyState: JournalEntryModel = {
    id: idService.getId(date),
    program: '',
    mobility: '',
    nutrition: {
        hydrated: false,
        carbs: Level.None,
        gluten: Level.None,
        supplements: '',
        caffeine: {
            am: '',
            pm: '',
        },
    },
    sleep: {
        quality: 0,
        quantity: 0,
    },
    notes: '',
    createdDate: date.toISOString(),
};

const JournalEntry: React.FC<JournalEntryProps> = (
    props: JournalEntryProps
) => {
    const classes = useStyles(fjTheme);

    const [journalEntry, setJournalEntry] = React.useState<JournalEntryModel>(
        props.journalEntry ?? emptyState
    );

    const handleCaffeineTextChange = (event: React.ChangeEvent) => {
        const element = event.target as HTMLInputElement;
        const key: string = element.name;
        const value: string = element.value;

        setJournalEntry({
            ...journalEntry,
            nutrition: {
                ...journalEntry.nutrition,
                caffeine: {
                    ...journalEntry.nutrition.caffeine,
                    [key]: value,
                },
            },
        });
    };

    const handleHydratedSwitchChange = (event: React.ChangeEvent) => {
        const element = event.target as HTMLInputElement;
        const checked: boolean = element.checked;

        setJournalEntry({
            ...journalEntry,
            nutrition: {
                ...journalEntry.nutrition,
                hydrated: checked,
            },
        });
    };

    const handleMultiLineTextChange = (key: string, state: EditorState) => {
        const text: string = JSON.stringify(
            convertToRaw(state.getCurrentContent())
        );

        setJournalEntry({
            ...journalEntry,
            [key]: text,
        });
    };

    const handleNutritionTextChange = (event: React.ChangeEvent) => {
        const element = event.target as HTMLInputElement;
        const key: string = element.name;
        const value: string = element.value;

        setJournalEntry({
            ...journalEntry,
            nutrition: {
                ...journalEntry.nutrition,
                [key]: value,
            },
        });
    };

    const handleNotesChange = (state: EditorState) => {
        handleMultiLineTextChange('notes', state);
    };

    const handleProgramChange = (state: EditorState) => {
        handleMultiLineTextChange('program', state);
    };

    const handleSelectChange = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        const element = event.target as HTMLSelectElement;
        const key: string = element.name;
        const level: Level = event.target.value as Level;

        setJournalEntry({
            ...journalEntry,
            nutrition: {
                ...journalEntry.nutrition,
                [key]: level,
            },
        });
    };

    const handleSleepTextChange = (event: React.ChangeEvent) => {
        const element = event.target as HTMLInputElement;
        const key: string = element.name;
        const value: string = element.value;

        setJournalEntry({
            ...journalEntry,
            sleep: {
                ...journalEntry.sleep,
                [key]: value,
            },
        });
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        props.onSave(journalEntry);
    };

    const handleTextChange = (event: React.ChangeEvent) => {
        const element = event.target as HTMLInputElement;
        const key: string = element.name;
        const value: string = element.value;

        setJournalEntry({
            ...journalEntry,
            [key]: value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                inputProps={{ maxLength: 50 }}
                name='id'
                onChange={handleTextChange}
                label='Date *'
                fullWidth
                value={journalEntry.id}
                margin='normal'
            />
            <div className={classes.formRow}>
                <FormLabel className={classes.formLabel}>Program *</FormLabel>
                <MUIRichTextEditor
                    defaultValue={props.journalEntry?.program}
                    onChange={handleProgramChange}
                    maxLength={1000}
                    toolbar={!props.isReadonly}
                    readOnly={props.isReadonly}
                    controls={[
                        'title',
                        'bold',
                        'italic',
                        'underline',
                        'numberList',
                        'bulletList',
                    ]}
                />
            </div>
            <TextField
                inputProps={{ maxLength: 100 }}
                name='mobility'
                onChange={handleTextChange}
                label='Mobility'
                fullWidth
            />
            <FormControl fullWidth margin='normal'>
                <FormControlLabel
                    label='Hydrated?'
                    value={journalEntry.nutrition.hydrated}
                    control={
                        <Switch
                            color='secondary'
                            onChange={handleHydratedSwitchChange}
                        />
                    }
                />
            </FormControl>
            <FormControl fullWidth margin='normal'>
                <InputLabel id='label-carbs'>Carbs?</InputLabel>
                <Select
                    labelId='label-carbs'
                    name='carbs'
                    value={journalEntry.nutrition.carbs}
                    onChange={handleSelectChange}>
                    <MenuItem value={Level.None}>None</MenuItem>
                    <MenuItem value={Level.Low}>Low</MenuItem>
                    <MenuItem value={Level.Medium}>Medium</MenuItem>
                    <MenuItem value={Level.High}>High</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
                <InputLabel id='label-gluten'>Gluten?</InputLabel>
                <Select
                    labelId='label-gluten'
                    name='gluten'
                    value={journalEntry.nutrition.gluten}
                    onChange={handleSelectChange}>
                    <MenuItem value={Level.None}>None</MenuItem>
                    <MenuItem value={Level.Low}>Low</MenuItem>
                    <MenuItem value={Level.Medium}>Medium</MenuItem>
                    <MenuItem value={Level.High}>High</MenuItem>
                </Select>
            </FormControl>
            <TextField
                inputProps={{ maxLength: 100 }}
                name='supplements'
                onChange={handleNutritionTextChange}
                label='Supplements'
                fullWidth
                value={journalEntry.nutrition.supplements}
            />
            <div className={`${classes.formRow} ${classes.formRowMargin}`}>
                <FormLabel className={classes.formLabel}>Caffeine</FormLabel>
                <TextField
                    inputProps={{ maxLength: 100 }}
                    name='am'
                    onChange={handleCaffeineTextChange}
                    label='AM'
                    value={journalEntry.nutrition.caffeine.am}
                    className={classes.formItem}
                />
                <TextField
                    inputProps={{ maxLength: 100 }}
                    name='pm'
                    onChange={handleCaffeineTextChange}
                    label='PM'
                    value={journalEntry.nutrition.caffeine.pm}
                    className={classes.formItem}
                />
            </div>
            <div className={`${classes.formRow} ${classes.formRowMargin}`}>
                <FormLabel className={classes.formLabel}>Sleep</FormLabel>
                <TextField
                    inputProps={{ maxLength: 100 }}
                    name='quantity'
                    onChange={handleSleepTextChange}
                    label='Quantity'
                    value={journalEntry.sleep.quantity}
                    InputProps={{
                        endAdornment: <label>hours</label>,
                    }}
                    className={classes.formItem}
                />
                <TextField
                    inputProps={{ maxLength: 100 }}
                    name='quality'
                    onChange={handleSleepTextChange}
                    label='Quality'
                    value={journalEntry.sleep.quality}
                    InputProps={{
                        endAdornment: <label>/10</label>,
                    }}
                    className={classes.formItem}
                />
            </div>
            <div className={classes.formRow}>
                <FormLabel className={classes.formLabel}>Notes</FormLabel>
                <FormControl fullWidth margin='normal'>
                    <MUIRichTextEditor
                        defaultValue={props.journalEntry?.notes}
                        onChange={handleNotesChange}
                        maxLength={500}
                        toolbar={!props.isReadonly}
                        readOnly={props.isReadonly}
                        controls={[
                            'title',
                            'bold',
                            'italic',
                            'underline',
                            'numberList',
                            'bulletList',
                        ]}
                    />
                </FormControl>
            </div>
            {!props.isReadonly && (
                <Button
                    fullWidth
                    variant='contained'
                    color='secondary'
                    type='submit'>
                    Save
                </Button>
            )}
        </form>
    );
};

export default JournalEntry;
