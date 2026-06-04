import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import PptxGenJS from "pptxgenjs/dist/pptxgen.es.js";

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

  const generateInsight = () => {
    let insights = [];

    if (avgSatisfaction < 75) {
      insights.push("⚠️ Satisfaction is below expected levels.");
    } else {
      insights.push("✅ Satisfaction is strong.");
    }

    if (avgQueue > 20) {
      insights.push("⚠️ High queue time detected.");
    } else {
      insights.push("✅ Queue time is acceptable.");
    }

    const worstArea = filteredData.reduce((prev, curr) =>
      prev.satisfaction < curr.satisfaction ? prev : curr
    );

    insights.push(`📍 Lowest satisfaction area: ${worstArea.area}`);
    return insights;
  };

  const exportToPPT = () => {
    let pptx = new PptxGenJS();

    let slide = pptx.addSlide();

    slide.addText("Event Report", { x: 1, y: 1, fontSize: 24 });

    slide.addText(`Satisfaction: ${avgSatisfaction.toFixed(1)}%`, { x: 1, y: 2 });
    slide.addText(`Queue: ${avgQueue.toFixed(1)} min`, { x: 1, y: 2.5 });

    generateInsight().forEach((i, idx) => {
      slide.addText(i, { x: 1, y: 3 + idx * 0.5 });
    });

    pptx.writeFile("Report.pptx");
  };

  return (
    <div style={{ padding: 30 }}>

      <h1>CardumeTech Dashboard</h1>

      <button
        onClick={exportToPPT}
        style={{ marginBottom: 20, padding: 8, background: "#2563eb", color: "white" }}
      >
        Download PPT
      </button>

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

      <h2>Insights</h2>
      <ul>
        {generateInsight().map((i, idx) => <li key={idx}>{i}</li>)}
      </ul>

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