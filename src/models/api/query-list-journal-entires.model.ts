import { JournalEntry } from "./journal-entry.model";

export interface ListJournalEntries
{
    items: JournalEntry[];
    nextToken: string;
}