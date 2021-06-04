export const createJournalEntry = `mutation CreateJournalEntry($input: CreateJournalEntryV2Input!) {
    createJournalEntryV2(input: $input) {
        id
    }
}`;

export const updateJournalEntry = `mutation UpdateJournalEntry($input: UpdateJournalEntryV2Input!) {
    updateJournalEntryV2(input: $input) {
        id
    }
}`;
