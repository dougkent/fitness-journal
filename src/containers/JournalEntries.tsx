// React
import React from 'react';

// AWS
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';

// Material UI
import {
    Button,
    ButtonGroup,
    CircularProgress,
    createStyles,
    Hidden,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import DetailsIcon from '@material-ui/icons/Details';
import EditIcon from '@material-ui/icons/Edit';

// FJ
import * as graphQLQueries from '../graphql/queries';
import * as graphQlMutations from '../graphql/mutations';
import {
    CreateJournalEntryMutation,
    JournalEntryModel,
    ListJournalEntries,
    UpdateJournalEntryMutation,
} from '../models/api';
import { JournalEntriesListState } from '../models/states';
import { fjTheme } from '../themes';
import { JournalEntry, JournalEntryDialog } from '../components';
import { JournalEntryIdService } from '../services';
import { JournalEntriesProps } from '../models/props';

const styles = (theme: Theme) =>
    createStyles({
        journalEntries: {
            marginTop: theme.spacing(2),
            [theme.breakpoints.up('lg')]: {
                marginTop: theme.spacing(4),
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
            },
        },
        container: {
            [theme.breakpoints.up('lg')]: {
                width: '48%',
            },
        },
        loading: {
            width: '100%',
            margin: `${theme.spacing(4)}px auto`,
            display: 'flex',
            justifyContent: 'center',
        },
        row: {
            width: '100%',
            marginBottom: theme.spacing(2),
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        rowItem: {
            width: '33%',
        },
        buttonGroup: {
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
    });

export interface JournalEntriesContainerProps
    extends JournalEntriesProps,
        WithStyles<typeof styles> {}

class JournalEntries extends React.Component<
    JournalEntriesContainerProps,
    JournalEntriesListState
> {
    constructor(props: any) {
        super(props);

        const date: Date = new Date();
        date.setDate(date.getDate() + 1);

        this.state = {
            loading: false,
            journalEntries: [],
            entryOpen: false,
            nextToken: null,
            lastQueryDate: date,
            noMoreEntries: false,
            selectedJournalEntry: null,
            isReadonly: false,
        };
    }

    private idService = new JournalEntryIdService();

    componentDidMount = async () => {
        await this.loadJournalEntries();
    };

    private getPreviewText = (rteText: string): string => {
        const jsonObj = JSON.parse(rteText);

        let preview: string = '';

        jsonObj.blocks.forEach((block: any) => {
            if (preview.length) {
                preview = preview + ' ';
            }

            preview = preview + block.text;
        });

        return preview;
    };

    private handleUpdateJournalEntry = async (
        journalEntry: JournalEntryModel
    ) => {
        this.setState({
            loading: true,
        });

        const result = (await API.graphql(
            graphqlOperation(graphQlMutations.updateJournalEntry, {
                input: journalEntry,
            })
        )) as GraphQLResult<UpdateJournalEntryMutation>;

        this.setState({
            loading: false,
            entryOpen: false,
            selectedJournalEntry: null,
        });

        if (result.data?.updateJournalEntryV2?.id) {
            const date: Date = new Date();
            date.setDate(date.getDate() + 1);

            await this.setState({
                lastQueryDate: date,
            });

            await this.loadJournalEntries(true);
        }
    };

    private handleCreateJournalEntry = async (
        journalEntry: JournalEntryModel
    ) => {
        this.setState({
            loading: true,
        });

        const result = (await API.graphql(
            graphqlOperation(graphQlMutations.createJournalEntry, {
                input: journalEntry,
            })
        )) as GraphQLResult<CreateJournalEntryMutation>;

        this.setState({
            loading: false,
            entryOpen: false,
            selectedJournalEntry: null,
        });

        if (result.data?.createJournalEntryV2?.id) {
            const date: Date = new Date();
            date.setDate(date.getDate() + 1);

            await this.setState({
                lastQueryDate: date,
            });

            await this.loadJournalEntries(true);
        }
    };

    private handleNextPage = async () => {
        this.loadJournalEntries();
    };

    private handleSave = async (journalEntry: JournalEntryModel) => {
        if (this.state.selectedJournalEntry) {
            await this.handleUpdateJournalEntry(journalEntry);
        } else {
            await this.handleCreateJournalEntry(journalEntry);
        }
    };

    private loadJournalEntries = async (isRefresh: boolean = false) => {
        this.setState({
            loading: true,
        });

        const result = (await API.graphql(
            graphqlOperation(graphQLQueries.listJournalEntries, {
                id: this.props.userId,
                sortDirection: 'DESC',
                netxToken: this.state.nextToken,
            })
        )) as GraphQLResult<ListJournalEntries>;

        if (result.data?.listJournalEntryV2s?.items?.length) {
            let newJournalEntries: JournalEntryModel[];

            if (isRefresh) {
                newJournalEntries = result.data.listJournalEntryV2s.items;
            } else {
                newJournalEntries = [
                    ...this.state.journalEntries,
                    ...result.data.listJournalEntryV2s.items,
                ];
            }

            this.setState({
                journalEntries: newJournalEntries,
                nextToken: result.data.listJournalEntryV2s.nextToken,
            });
        }

        this.setState({
            loading: false,
        });
    };

    private openCreateEntry = (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        this.setState({
            selectedJournalEntry: null,
            isReadonly: false,
            entryOpen: true,
        });
    };

    private openViewEntry =
        (journalEntry: JournalEntryModel) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            this.setState({
                selectedJournalEntry: journalEntry,
                isReadonly: true,
                entryOpen: true,
            });
        };

    private openEditEntry =
        (journalEntry: JournalEntryModel) =>
        (event: React.KeyboardEvent | React.MouseEvent) => {
            this.setState({
                selectedJournalEntry: journalEntry,
                isReadonly: false,
                entryOpen: true,
            });
        };

    private closeEntry = (event: React.KeyboardEvent | React.MouseEvent) => {
        this.setState({
            selectedJournalEntry: null,
            entryOpen: false,
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.journalEntries}>
                <Typography variant='h3' className={classes.row}>
                    Journal Entries
                </Typography>
                <div className={classes.container}>
                    <div className={classes.row}>
                        <Button
                            onClick={this.openCreateEntry}
                            variant='contained'
                            color='secondary'>
                            Create Journal Entry
                        </Button>
                    </div>
                    {this.state.journalEntries.map((journalEntry) => (
                        <div className={classes.row} key={journalEntry.id}>
                            <Typography className={classes.rowItem}>
                                {journalEntry.date}
                            </Typography>
                            <Typography noWrap className={classes.rowItem}>
                                {this.getPreviewText(journalEntry.program)}
                            </Typography>
                            <div className={classes.rowItem}>
                                <ButtonGroup className={classes.buttonGroup}>
                                    <Button
                                        size='small'
                                        onClick={this.openViewEntry(
                                            journalEntry
                                        )}>
                                        <DetailsIcon />
                                        <Hidden xsDown>&nbsp;View</Hidden>
                                    </Button>
                                    <Button
                                        size='small'
                                        onClick={this.openEditEntry(
                                            journalEntry
                                        )}>
                                        <EditIcon />
                                        <Hidden xsDown>&nbsp;Edit</Hidden>
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    ))}
                    {this.state.loading && (
                        <div className={classes.loading}>
                            <CircularProgress />
                        </div>
                    )}
                    {this.state.nextToken && !this.state.loading && (
                        <div className={classes.row}>
                            <Button onClick={this.handleNextPage}>
                                Load Next Page
                            </Button>
                        </div>
                    )}
                    <Hidden lgUp>
                        <JournalEntryDialog
                            userId={this.props.userId}
                            isOpen={this.state.entryOpen}
                            isReadonly={this.state.isReadonly}
                            journalEntry={this.state.selectedJournalEntry}
                            onSave={this.handleSave}
                            onClose={this.closeEntry}
                        />
                    </Hidden>
                </div>
                <Hidden mdDown>
                    {this.state.entryOpen && (
                        <div className={classes.container}>
                            <JournalEntry
                                userId={this.props.userId}
                                isReadonly={this.state.isReadonly}
                                journalEntry={this.state.selectedJournalEntry}
                                onSave={this.handleSave}
                                onClose={this.closeEntry}
                            />
                        </div>
                    )}
                </Hidden>
            </div>
        );
    }
}

export default withStyles(styles(fjTheme))(JournalEntries);
