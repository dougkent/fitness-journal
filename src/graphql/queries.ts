export const listJournalEntries = `query ListJournalEntries($id: ID!, $limit: Int!, $sortDirection: ModelSortDirection!, $nextToken: String, ) {
    listJournalEntryV2s (id: $id, limit: $limit, sortDirection: $sortDirection, nextToken: $nextToken) {
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
