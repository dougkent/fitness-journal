import { JournalEntryModel } from "../api";

export interface JournalEntriesListState
{
    loading: boolean;
    journalEntries: JournalEntryModel[];
    nextToken: string;
    drawerOpen: boolean;
}