import { Level, CaffeineEntry } from ".";

export interface NutritionEntry
{
    hydrated: boolean;
    carbs: Level;
    gluten: Level;
    supplements: string
    caffeine: CaffeineEntry;
}