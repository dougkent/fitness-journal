import { NutritionEntry, SleepEntry } from '.';

export interface JournalEntryModel {
    id: string;
    date: string;
    program: string;
    mobility: string;
    nutrition: NutritionEntry;
    sleep: SleepEntry;
    notes: string;
    createdDate: string;
}
