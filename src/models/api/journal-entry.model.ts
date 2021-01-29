import { NutritionEntry, SleepEntry } from ".";

export interface JournalEntry
{
    id: string;
    program: string;
    mobility: string;
    nutrition: NutritionEntry;
    sleep: SleepEntry;
    notes: string;
    createdDate: string;
}