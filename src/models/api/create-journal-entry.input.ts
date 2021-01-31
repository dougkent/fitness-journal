import { NutritionEntry, SleepEntry } from ".";

export interface CreateJournalEntryInput
{
    id: string;
    program: string;
    mobility: string;
    nutrition: NutritionEntry;
    sleep: SleepEntry;
    notes: string;

}