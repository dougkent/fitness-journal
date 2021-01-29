export const listJournalEntries = `query ListJournalEntries($nextToken: String) {
    listJournalEntrys (limit: 30, nextToken: $nextToken) {
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