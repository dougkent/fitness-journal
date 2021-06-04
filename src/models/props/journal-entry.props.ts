import { JournalEntryModel } from '../api';

export interface JournalEntryProps {
    userId: string;
    isReadonly: boolean;
    journalEntry: JournalEntryModel;
    onSave: (journalEntry: JournalEntryModel) => void;
    onClose: (event: React.KeyboardEvent | React.MouseEvent) => void;
}
