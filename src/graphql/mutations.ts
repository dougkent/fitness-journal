export const createJournalEntry = `mutation CreateJournalEntry($input: CreateJournalEntryInput!) {
    createJournalEntry(input: $input) {
        id
    }
}`