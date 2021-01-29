import { JournalEntry } from "../api";

export interface JournalEntriesListState
{
    loading: boolean;
    journalEntries: JournalEntry[];
    nextToken: string;
}