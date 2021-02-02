export const createJournalEntry = `mutation CreateJournalEntry($input: CreateJournalEntryInput!) {
    createJournalEntry(input: $input) {
        id
    }
}`;

export const updateJournalEntry = `mutation UpdateJournalEntry($input: UpdateJournalEntryInput!) {
    updateJournalEntry(input: $input) {
        id
    }
}`