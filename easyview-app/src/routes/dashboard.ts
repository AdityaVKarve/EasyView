import { Router } from "express";
import { renderTemplate } from "../utils/templateRenderer";
import { ensureAuthenticated } from "../middleware/auth";
import { getWeeklyData, getCategoryData } from "../supabase_config"; // adjust path if needed


type CategoryStats = {
  total_weight: number;
  total_emissions_saved: number;
  sorted_correct: number;
  categorized_correct: number;
  count: number;
};


const router = Router();
const categoryRaw = await getCategoryData() as Record<string, CategoryStats>;

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const weeklyRaw = await getWeeklyData();
    const categoryRaw = await getCategoryData();
    // Transform weekly data into bar chart-friendly format
    const weeklyLabels = Object.keys(weeklyRaw).map((week) => `Week ${week}`);
    const weeklyValues = Object.values(weeklyRaw).map((w) => w.weight);

    // Prepare donutData from category totals
    const donutLabels = Object.keys(categoryRaw);
    const donutValues = donutLabels.map((cat) => categoryRaw[cat].total_weight);

    // Sources data (optional: you'll need to aggregate source field too if you want this)
    const sourcesData = {
      labels: ["Office", "Cafeteria", "Production"],
      values: [33, 33, 33], // placeholder — update with real aggregated source stats if needed
    };

    const totalWeight = donutValues.reduce((a, b) => a + b, 0);
    const totalEmissions = Object.values(categoryRaw).reduce((sum, cat) => sum + cat.total_emissions_saved, 0);
    const correctlyCategorized = Object.values(categoryRaw).reduce(
      (sum, cat) => sum + cat.categorized_correct,
      0
    );
    const totalItems = Object.values(categoryRaw).reduce((sum, cat) => sum + cat.count, 0);
    const correctlySorted = Object.values(categoryRaw).reduce(
      (sum, cat) => sum + cat.sorted_correct,
      0
    );

    const metrics = [
      { value: `${totalWeight.toFixed(0)} kg`, label: "Total residual waste processed", change: "+12%", status: "up" },
      { value: `${totalEmissions.toFixed(0)} kg`, label: "CO₂ emissions saved", change: "+8%", status: "up" },
      { value: `${((correctlyCategorized / totalItems) * 100).toFixed(0)}%`, label: "Correctly categorized", change: "+15%", status: "up" },
      { value: `${((correctlySorted / totalItems) * 100).toFixed(0)}%`, label: "Correctly sorted", change: "10% improvement possible", status: "neutral" },
      { value: "5%", label: "Should not be residual", change: "-2%", status: "down" }, // optional placeholder
    ];

    const content = await renderTemplate("dashboard", {
      layout: "main",
      currentRoute: "dashboard",
      weeklyData: weeklyValues,
      weeklyLabels,
      donutData: {
        labels: donutLabels,
        values: donutValues,
      },
      sourcesData,
      metrics,
      showNavbar: true,
    });

    res.send(content);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).send("Error rendering dashboard");
  }
});

export default router;
