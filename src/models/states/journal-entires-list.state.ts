import { JournalEntryModel } from "../api";

export interface JournalEntriesListState
{
    loading: boolean;
    journalEntries: JournalEntryModel[];
    selectedJournalEntry: JournalEntryModel | null;
    isReadonly: boolean;
    lastQueryDate: Date;
    noMoreEntries: boolean;
    drawerOpen: boolean;
}