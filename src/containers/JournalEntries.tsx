// React
import React from 'react';

// AWS
import { API, graphqlOperation } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';

// Material UI
import {
    CircularProgress,
    createStyles,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';

// FJ
import * as graphQLQueries from '../graphql/queries';
import { ListJournalEntries } from '../models/api';
import { JournalEntriesListState } from '../models/states';
import { fjTheme } from '../themes';

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
        };
    }

    componentDidMount = () => {
        this.loadJournalEntries();
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

        if (result.data?.items?.length) {
            this.setState({
                journalEntries: [
                    ...this.state.journalEntries,
                    ...result.data.items,
                ],
                nextToken: result.data.nextToken,
            });
        }

        this.setState({
            loading: false,
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
                        {this.state.journalEntries.map((journalEntry) => (
                            <div>{journalEntry.id}</div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default withStyles(styles(fjTheme))(JournalEntries);
