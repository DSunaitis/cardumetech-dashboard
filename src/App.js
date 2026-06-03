import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

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

  const avgSatisfaction = (
    filteredData.reduce((sum, item) => sum + Number(item.satisfaction), 0) / filteredData.length
  ).toFixed(1);

  const avgQueue = (
    filteredData.reduce((sum, item) => sum + Number(item.queue), 0) / filteredData.length
  ).toFixed(1);

  const eventScore = (
    (avgSatisfaction * 0.6) + ((100 - avgQueue) * 0.4)
  ).toFixed(1);
const getColor = (value, type) => {
  if (type === "satisfaction") {
    if (value >= 80) return "hsl(141, 33%, 39%)"; // verde
    if (value >= 70) return "rgb(221, 173, 29)"; // amarelo
    return "rgb(237, 62, 62)"; // vermelho
  }

  if (type === "queue") {
    if (value <= 10) return "#hsl(141, 33%, 39%)"; 
    if (value <= 20) return "#rgb(221, 173, 29)";
    return "#rgb(237, 62, 62)";
  }

  return "hsl(217, 33%, 18%)";
};
``
  return (
    <div style={{ padding: 30 }}>
      <h1>CardumeTech Dashboard</h1>

      {/* FILTRO */}
      <select
        value={selectedArea}
        onChange={(e) => setSelectedArea(e.target.value)}
        style={{ marginBottom: 20, padding: 8 }}
      >
        <option value="All">All Areas</option>
        <option value="Entrance">Entrance</option>
        <option value="Food">Food</option>
        <option value="WC">WC</option>
        <option value="Bar">Bar</option>
      </select>

      {/* KPIs */}
      <div style={{
  backgroundColor: getColor(Number(avgSatisfaction), "satisfaction"),
  color: "white",
  padding: 20,
  borderRadius: 10
}}>
  <h3>Satisfaction</h3>
  <h2>{avgSatisfaction}%</h2>
</div>

<div style={{
  backgroundColor: getColor(Number(avgQueue), "queue"),
  color: "white",
  padding: 20,
  borderRadius: 10
}}>
  <h3>Queue Time</h3>
  <h2>{avgQueue} min</h2>
</div>

<div style={{
  backgroundColor: "hsl(221, 34%, 40%)",
  color: "white",
  padding: 20,
  borderRadius: 10
}}>
  <h3>Event Score</h3>
  <h2>{eventScore} / 10</h2>
</div>
``
      {/* CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <XAxis dataKey="area" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="satisfaction" fill="hsl(168, 10%, 81%)" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}