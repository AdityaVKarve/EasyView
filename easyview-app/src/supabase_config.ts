import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;


type WeeklyStats = {
    weight: number;
    emissions_saved: number;
    categories: Record<string, number>;
  };
  
export async function getWeeklyData() {
    const { data, error } = await supabase
    .from('waste_records')
    .select(`
        created_at,
        weight,
        category,
        sorted_correctly,
        categorized_correctly,
        emissions_saved
    `)
    .gte('created_at', '2025-01-01')
    .lte('created_at', '2025-12-31')
    .order('created_at', { ascending: true });

    if (error) {
    console.error('Error fetching data:', error);
    return;
    }

    const weeklyData: Record<number, WeeklyStats> = {};

    data.forEach((row) => {
    const week = getWeekNumber(new Date(row.created_at));
    if (!weeklyData[week]) {
        weeklyData[week] = {
        weight: 0,
        emissions_saved: 0,
        categories: {},
        };
    }
    weeklyData[week].weight += row.weight;
    weeklyData[week].emissions_saved += row.emissions_saved;
    weeklyData[week].categories[row.category] =
        (weeklyData[week].categories[row.category] || 0) + 1;
    });

    return weeklyData;
}

function getWeekNumber(date: Date): number {
const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
const pastDaysOfYear =
    (date.getTime() - firstDayOfYear.getTime()) / 86400000;
return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

type CategoryStats = {
    total_weight: number;
    total_emissions_saved: number;
    sorted_correct: number;
    categorized_correct: number;
    count: number;
  };
  
export async function getCategoryData() {
    const { data, error } = await supabase
        .from('waste_records')
        .select(`
        category,
        weight,
        emissions_saved,
        sorted_correctly,
        categorized_correctly
        `);

    if (error) {
        console.error('Error fetching category data:', error);
        return;
    }

    const categoryData: Record<string, CategoryStats> = {};

    data.forEach((row) => {
        const category = row.category || 'Unknown';

        if (!categoryData[category]) {
        categoryData[category] = {
            total_weight: 0,
            total_emissions_saved: 0,
            sorted_correct: 0,
            categorized_correct: 0,
            count: 0,
        };
        }

        categoryData[category].total_weight += row.weight;
        categoryData[category].total_emissions_saved += row.emissions_saved;
        categoryData[category].sorted_correct += row.sorted_correctly ? 1 : 0;
        categoryData[category].categorized_correct += row.categorized_correctly ? 1 : 0;
        categoryData[category].count += 1;
    });

    return categoryData;
}