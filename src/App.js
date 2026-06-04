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

    return "#1f2937";
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

    insights.push(
      `📍 ${worstArea.area} has the lowest satisfaction (${worstArea.satisfaction}%)`
    );

    return insights;
  };

  const generateRecommendations = () => {
    let recs = [];

    if (avgQueue > 20) {
      recs.push("👉 Increase staff or service points.");
    }

    if (avgSatisfaction < 75) {
      recs.push("👉 Improve key customer touchpoints.");
    }

    recs.push("👉 Optimize visitor flow and layout.");

    return recs;
  };

  const exportToPPT = () => {
    let pptx = new PptxGenJS();

    // SLIDE 1 — CAPA
    let slide1 = pptx.addSlide();
    slide1.background = { fill: "#0f172a" };
    slide1.addText("CardumeTech Report", {
      x: 1, y: 2, fontSize: 30, color: "FFFFFF", bold: true
    });

    // SLIDE 2 — KPIs
    let slide2 = pptx.addSlide();
    slide2.addText("Executive Summary", { x: 0.5, y: 0.5, fontSize: 24 });

    slide2.addText(`Score: ${eventScore}`, { x: 0.5, y: 1.5 });
    slide2.addText(`Satisfaction: ${avgSatisfaction.toFixed(1)}%`, { x: 0.5, y: 2 });
    slide2.addText(`Queue: ${avgQueue.toFixed(1)} min`, { x: 0.5, y: 2.5 });

    // SLIDE 3 — GRÁFICO
    let slide3 = pptx.addSlide();
    slide3.addText("Satisfaction by Area", { x: 0.5, y: 0.5 });

    slide3.addChart(pptx.ChartType.bar, [
      {
        name: "Satisfaction",
        labels: data.map(d => d.area),
        values: data.map(d => d.satisfaction)
      }
    ], {
      x: 1,
      y: 1.5,
      w: 8,
      h: 4
    });

    // SLIDE 4 — INSIGHTS
    let slide4 = pptx.addSlide();
    slide4.addText("Insights", { x: 0.5, y: 0.5 });

    generateInsight().forEach((i, idx) => {
      slide4.addText(i, { x: 0.5, y: 1.5 + idx * 0.5 });
    });

    // SLIDE 5 — RECOMENDAÇÕES
    let slide5 = pptx.addSlide();
    slide5.addText("Recommendations", { x: 0.5, y: 0.5 });

    generateRecommendations().forEach((r, idx) => {
      slide5.addText(r, { x: 0.5, y: 1.5 + idx * 0.5 });
    });

    pptx.writeFile("CardumeTech_Report.pptx");
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>

      <h1>CardumeTech Dashboard</h1>

      <button
        onClick={exportToPPT}
        style={{
          marginBottom: 20,
          padding: 10,
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 5,
          cursor: "pointer"
        }}
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

      {/* KPIs */}
      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>

        <div style={{
          background: getColor(avgSatisfaction, "satisfaction"),
          padding: 20,
          color: "white",
          borderRadius: 8
        }}>
          <h3>Satisfaction</h3>
          <h2>{avgSatisfaction.toFixed(1)}%</h2>
        </div>

        <div style={{
          background: getColor(avgQueue, "queue"),
          padding: 20,
          color: "white",
          borderRadius: 8
        }}>
          <h3>Queue</h3>
          <h2>{avgQueue.toFixed(1)} min</h2>
        </div>

        <div style={{
          background: "#1f2937",
          padding: 20,
          color: "white",
          borderRadius: 8
        }}>
          <h3>Score</h3>
          <h2>{eventScore}</h2>
        </div>

      </div>

      {/* INSIGHTS */}
      <h2 style={{ marginTop: 30 }}>Insights</h2>
      <ul>
        {generateInsight().map((i, idx) => <li key={idx}>{i}</li>)}
      </ul>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="area" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="satisfaction" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
