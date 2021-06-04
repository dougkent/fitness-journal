import { JournalEntryModel } from '../api';

export interface JournalEntriesListState {
    loading: boolean;
    journalEntries: JournalEntryModel[];
    selectedJournalEntry: JournalEntryModel | null;
    isReadonly: boolean;
    nextToken: string;
    lastQueryDate: Date;
    noMoreEntries: boolean;
    entryOpen: boolean;
}
