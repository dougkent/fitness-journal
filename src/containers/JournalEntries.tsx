// React
import React from 'react';

// AWS
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';

// Material UI
import {
    Button,
    CircularProgress,
    createStyles,
    SwipeableDrawer,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';

// FJ
import * as graphQLQueries from '../graphql/queries';
import * as graphQlMutations from '../graphql/mutations';
import {
    CreateJournalEntryInput,
    CreateJournalEntryMutation,
    JournalEntryModel,
    ListJournalEntries,
} from '../models/api';
import { JournalEntriesListState } from '../models/states';
import { fjTheme } from '../themes';
import { JournalEntry } from '../components';

const styles = (theme: Theme) =>
    createStyles({
        container: {
            marginTop: theme.spacing(2),
            [theme.breakpoints.up('lg')]: {
                marginTop: theme.spacing(4),
                width: '100%',
                display: 'flex',
                justifyContent: 'space-evenly',
            },
            [theme.breakpoints.up('xl')]: {
                flexWrap: 'wrap',
            },
        },
        drawer: {
            padding: theme.spacing(2),
        },
        loading: {
            width: theme.spacing(12.5),
            margin: `${theme.spacing(4)}px auto`,
        },
    });

export interface JournalEntriesProps extends WithStyles<typeof styles> {}

class JournalEntries extends React.Component<
    JournalEntriesProps,
    JournalEntriesListState
> {
    constructor(props: any) {
        super(props);

        this.state = {
            loading: false,
            journalEntries: [],
            nextToken: null,
            drawerOpen: false,
        };
    }

    componentDidMount = async () => {
        await this.loadJournalEntries();
    };

    handleCreateJournalEntry = async (journalEntry: JournalEntryModel) => {
        this.setState({
            loading: true,
        });

        const input: CreateJournalEntryInput = {
            id: journalEntry.id,
            program: journalEntry.program,
            mobility: journalEntry.mobility,
            nutrition: journalEntry.nutrition,
            sleep: journalEntry.sleep,
            notes: journalEntry.notes,
        };

        const result = (await API.graphql(
            graphqlOperation(graphQlMutations.createJournalEntry, {
                input: input,
            })
        )) as GraphQLResult<CreateJournalEntryMutation>;

        this.setState({
            loading: false,
            drawerOpen: false,
        });

        if (result.data?.createJournalEntry?.id) {
            await this.loadJournalEntries();
        }
    };

    loadJournalEntries = async () => {
        this.setState({
            loading: true,
        });

        const result = (await API.graphql(
            graphqlOperation(graphQLQueries.listJournalEntries, {
                nextToken: this.state.nextToken,
            })
        )) as GraphQLResult<ListJournalEntries>;

        if (result.data?.listJournalEntrys?.items?.length) {
            this.setState({
                journalEntries: [
                    ...this.state.journalEntries,
                    ...result.data.listJournalEntrys.items,
                ],
                nextToken: result.data.listJournalEntrys.nextToken,
            });
        }

        this.setState({
            loading: false,
        });
    };

    toggleDrawer = (open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        this.setState({
            drawerOpen: open,
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                {this.state.loading && (
                    <div className={classes.loading}>
                        <CircularProgress />
                    </div>
                )}
                {!this.state.loading && (
                    <div>
                        <Typography variant='h3'>Journal Entries</Typography>
                        <div>
                            <Button
                                onClick={this.toggleDrawer(true)}
                                variant='contained'
                                color='secondary'>
                                Create Journal Entry
                            </Button>
                        </div>
                        {this.state.journalEntries.map((journalEntry) => (
                            <div>{journalEntry.id}</div>
                        ))}
                        <SwipeableDrawer
                            anchor='bottom'
                            open={this.state.drawerOpen}
                            onClose={this.toggleDrawer(false)}
                            onOpen={this.toggleDrawer(true)}>
                            <div className={classes.drawer}>
                                <JournalEntry
                                    isReadonly={false}
                                    onSave={this.handleCreateJournalEntry}
                                />
                            </div>
                        </SwipeableDrawer>
                    </div>
                )}
            </div>
        );
    }
}

export default withStyles(styles(fjTheme))(JournalEntries);
