export const listJournalEntries = `query ListJournalEntries($filter: ModelJournalEntryFilterInput, $nextToken: String) {
    listJournalEntrys (filter: $filter, limit: 365, nextToken: $nextToken) {
        nextToken
        items {
            id
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