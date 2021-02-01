import { JournalEntryModel } from "../api";

export interface JournalEntriesListState
{
    loading: boolean;
    journalEntries: JournalEntryModel[];
    nextToken: string;
    lastQueryDate: Date;
    noMoreEntries: boolean;
    drawerOpen: boolean;
}