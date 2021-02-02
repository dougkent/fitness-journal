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
    SwipeableDrawer,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import DetailsIcon from '@material-ui/icons/Details';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';

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
import { JournalEntry } from '../components';
import { JournalEntryIdService } from '../services';

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
            padding: `${theme.spacing(1)}px ${theme.spacing(
                2
            )}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
        },
        drawerActions: {
            display: 'flex',
            justifyContent: 'flex-end',
        },
        loading: {
            width: '100%',
            margin: `${theme.spacing(4)}px auto`,
            display: 'flex',
            justifyContent: 'center',
        },
        row: {
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

export interface JournalEntriesProps extends WithStyles<typeof styles> {}

class JournalEntries extends React.Component<
    JournalEntriesProps,
    JournalEntriesListState
> {
    constructor(props: any) {
        super(props);

        const date: Date = new Date();
        date.setDate(date.getDate() + 1);

        this.state = {
            loading: false,
            journalEntries: [],
            drawerOpen: false,
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
            drawerOpen: false,
            selectedJournalEntry: null,
        });

        if (result.data?.updateJournalEntry?.id) {
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
            drawerOpen: false,
            selectedJournalEntry: null,
        });

        if (result.data?.createJournalEntry?.id) {
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

        const pageSize = 14;

        let upperDate = new Date(this.state.lastQueryDate.getTime());
        upperDate.setDate(upperDate.getDate() - 1);
        let lowerDate = new Date(this.state.lastQueryDate.getTime());
        lowerDate.setDate(lowerDate.getDate() - 1 - pageSize);
        const upperBounds: string = this.idService.getId(upperDate);
        const lowerBounds: string = this.idService.getId(lowerDate);

        const filter: any = {
            id: {
                between: [lowerBounds, upperBounds],
            },
        };

        const result = (await API.graphql(
            graphqlOperation(graphQLQueries.listJournalEntries, {
                filter: filter,
            })
        )) as GraphQLResult<ListJournalEntries>;

        if (result.data?.listJournalEntrys?.items?.length) {
            let newJournalEntries: JournalEntryModel[];

            if (isRefresh) {
                newJournalEntries = result.data.listJournalEntrys.items;
            } else {
                newJournalEntries = [
                    ...this.state.journalEntries,
                    ...result.data.listJournalEntrys.items,
                ];
            }

            this.setState({
                journalEntries: newJournalEntries.sort((a, b) => {
                    const idA = a.id;
                    const idB = b.id;

                    if (idA > idB) return -1;
                    if (idA < idB) return 1;
                    return 0;
                }),
                noMoreEntries:
                    result.data.listJournalEntrys.items.length < pageSize,
            });
        } else {
            this.setState({
                noMoreEntries: true,
            });
        }

        this.setState({
            lastQueryDate: lowerDate,
            loading: false,
        });
    };

    private openCreateDrawer = (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        this.setState({
            selectedJournalEntry: null,
            isReadonly: false,
            drawerOpen: true,
        });
    };

    private openViewDrawer = (journalEntry: JournalEntryModel) => (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        this.setState({
            selectedJournalEntry: journalEntry,
            isReadonly: true,
            drawerOpen: true,
        });
    };

    private openEditDrawer = (journalEntry: JournalEntryModel) => (
        event: React.KeyboardEvent | React.MouseEvent
    ) => {
        this.setState({
            selectedJournalEntry: journalEntry,
            isReadonly: false,
            drawerOpen: true,
        });
    };

    private closeDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        this.setState({
            selectedJournalEntry: null,
            drawerOpen: false,
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <div>
                    <Typography variant='h3' className={classes.row}>
                        Journal Entries
                    </Typography>
                    <div className={classes.row}>
                        <Button
                            onClick={this.openCreateDrawer}
                            variant='contained'
                            color='secondary'>
                            Create Journal Entry
                        </Button>
                    </div>
                    {this.state.journalEntries.map((journalEntry) => (
                        <div className={classes.row} key={journalEntry.id}>
                            <Typography className={classes.rowItem}>
                                {journalEntry.id}
                            </Typography>
                            <Typography noWrap className={classes.rowItem}>
                                {this.getPreviewText(journalEntry.program)}
                            </Typography>
                            <div className={classes.rowItem}>
                                <ButtonGroup className={classes.buttonGroup}>
                                    <Button
                                        size='small'
                                        onClick={this.openViewDrawer(
                                            journalEntry
                                        )}>
                                        <DetailsIcon />
                                    </Button>
                                    <Button
                                        size='small'
                                        onClick={this.openEditDrawer(
                                            journalEntry
                                        )}>
                                        <EditIcon />
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
                    {!this.state.noMoreEntries && !this.state.loading && (
                        <div className={classes.row}>
                            <Button onClick={this.handleNextPage}>
                                Load Next Page
                            </Button>
                        </div>
                    )}
                    <SwipeableDrawer
                        anchor='bottom'
                        open={this.state.drawerOpen}
                        onClose={this.closeDrawer}
                        onOpen={this.openCreateDrawer}>
                        <div className={classes.drawer}>
                            <div className={classes.drawerActions}>
                                <Button onClick={this.closeDrawer} size='small'>
                                    <CloseIcon />
                                </Button>
                            </div>
                            <JournalEntry
                                isReadonly={this.state.isReadonly}
                                journalEntry={this.state.selectedJournalEntry}
                                onSave={this.handleSave}
                            />
                        </div>
                    </SwipeableDrawer>
                </div>
            </div>
        );
    }
}

export default withStyles(styles(fjTheme))(JournalEntries);
