import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import PptxGenJS from "pptxgenjs";

const data = [
  { area: "Entrance", satisfaction: 75, queue: 35 },
  { area: "Food", satisfaction: 82, queue: 15 },
  { area: "WC", satisfaction: 68, queue: 10 },
  { area: "Bar", satisfaction: 80, queue: 12 }
];

export default function App() {

  const [selectedArea, setSelectedArea] = useState("All");

  const filteredData =
    selectedArea === "All"
      ? data
      : data.filter(item => item.area === selectedArea);

  const avgSatisfaction =
    filteredData.reduce((sum, item) => sum + item.satisfaction, 0) /
    filteredData.length;

  const avgQueue =
    filteredData.reduce((sum, item) => sum + item.queue, 0) /
    filteredData.length;

  const eventScore = (
    (avgSatisfaction * 0.6) + ((100 - avgQueue) * 0.4)
  ).toFixed(1);

  const getColor = (value, type) => {
    if (type === "satisfaction") {
      if (value >= 80) return "#22c55e";
      if (value >= 70) return "#eab308";
      return "#ef4444";
    }

    if (type === "queue") {
      if (value <= 10) return "#22c55e";
      if (value <= 20) return "#eab308";
      return "#ef4444";
    }

    return "#1f2a3d";
  };

  // ✅ INSIGHTS
  const generateInsight = () => {
    let insights = [];

    if (avgSatisfaction < 75) {
      insights.push("⚠️ Overall satisfaction is below expected levels.");
    } else {
      insights.push("✅ Satisfaction levels are positive.");
    }

    if (avgQueue > 20) {
      insights.push("⚠️ Queue times are high and impacting experience.");
    } else {
      insights.push("✅ Queue times are within acceptable range.");
    }

    const worstArea = filteredData.reduce((prev, curr) =>
      prev.satisfaction < curr.satisfaction ? prev : curr
    );

    insights.push(`📍 Lowest satisfaction area: ${worstArea.area}`);

    return insights;
  };

  // ✅ RECOMENDAÇÕES
  const generateRecommendations = () => {
    let recs = [];

    if (avgQueue > 20) {
      recs.push("👉 Increase staff or service points.");
    }

    if (avgSatisfaction < 75) {
      recs.push("👉 Improve key touchpoints.");
    }

    recs.push("👉 Optimize visitor flow.");

    return recs;
  };

  // ✅ EXPORT PPT
  const exportToPPT = () => {
    let pptx = new PptxGenJS();

    let slide1 = pptx.addSlide();
    slide1.addText("Event Report", { x: 1, y: 1, fontSize: 24 });
    slide1.addText("CardumeTech", { x: 1, y: 2 });

    let slide2 = pptx.addSlide();
    slide2.addText(`Satisfaction: ${avgSatisfaction.toFixed(1)}%`, { x: 1, y: 1 });
    slide2.addText(`Queue: ${avgQueue.toFixed(1)} min`, { x: 1, y: 1.5 });

    let slide3 = pptx.addSlide();
    slide3.addText("Insights", { x: 1, y: 0.5 });
    generateInsight().forEach((i, idx) => {
      slide3.addText(i, { x: 1, y: 1 + idx * 0.5 });
    });

    let slide4 = pptx.addSlide();
    slide4.addText("Recommendations", { x: 1, y: 0.5 });
    generateRecommendations().forEach((r, idx) => {
      slide4.addText(r, { x: 1, y: 1 + idx * 0.5 });
    });

    pptx.writeFile("Report.pptx");
  };

  return (
    <div style={{ padding: 30 }}>

      <h1>CardumeTech Dashboard</h1>

      {/* BOTÃO PPT */}
      <button onClick={exportToPPT}
        style={{ marginBottom: 20, padding: 8, background: "#2563eb", color: "white" }}>
        Download PPT
      </button>

      {/* FILTER */}
      <select
        value={selectedArea}
        onChange={(e) => setSelectedArea(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Entrance">Entrance</option>
        <option value="Food">Food</option>
        <option value="WC">WC</option>
        <option value="Bar">Bar</option>
      </select>

      {/* KPIs */}
      <div style={{ display: "flex", gap: 20 }}>

        <div style={{ background: getColor(avgSatisfaction, "satisfaction"), padding: 20 }}>
          <h3>Satisfaction</h3>
          <h2>{avgSatisfaction.toFixed(1)}%</h2>
        </div>

        <div style={{ background: getColor(avgQueue, "queue"), padding: 20 }}>
          <h3>Queue</h3>
          <h2>{avgQueue.toFixed(1)} min</h2>
        </div>

        <div style={{ background: "#1f2a3d", padding: 20 }}>
          <h3>Score</h3>
          <h2>{eventScore}</h2>
        </div>

      </div>

      {/* INSIGHTS */}
      <h2>Insights</h2>
      <ul>
        {generateInsight().map((i, idx) => <li key={idx}>{i}</li>)}
      </ul>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <XAxis dataKey="area" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="satisfaction" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
``