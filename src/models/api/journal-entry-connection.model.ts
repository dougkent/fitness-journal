import { JournalEntryModel } from ".";

export interface JournalEntryConnectionModel {
    items: JournalEntryModel[];
    nextToken: string;
}