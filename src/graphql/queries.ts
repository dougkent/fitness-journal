export const listJournalEntries = `query ListJournalEntries($id: ID!, $sortDirection: ModelSortDirection!, $nextToken: String, ) {
    listJournalEntryV2s (id: $id, sortDirection: $sortDirection, nextToken: $nextToken) {
        nextToken
        items {
            id
            date
            program
            mobility
            nutrition {
                hydrated
                carbs
                gluten
                supplements
                caffeine {
                    am
                    pm
                }
            }
            sleep {
                quantity
                quality
            }
            notes
            createdDate
        }
    }
}`;
