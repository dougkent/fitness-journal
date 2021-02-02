import { JournalEntryModel } from "../api";

export interface JournalEntryProps
{
    isReadonly: boolean;
    journalEntry: JournalEntryModel;
    onSave: (journalEntry: JournalEntryModel) => void;
    onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}