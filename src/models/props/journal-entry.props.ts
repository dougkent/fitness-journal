import { JournalEntryModel } from "../api";

export interface JournalEntryProps
{
    isReadonly: boolean;
    journalEntry?: JournalEntryModel;
    onSave?: (journalEntry: JournalEntryModel) => void;
}