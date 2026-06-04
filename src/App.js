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

  const avgSatisfaction =
    filteredData.reduce((sum, item) => sum + Number(item.satisfaction), 0) /
    filteredData.length;

  const avgQueue =
    filteredData.reduce((sum, item) => sum + Number(item.queue), 0) /
    filteredData.length;

  const eventScore = (
    (avgSatisfaction * 0.6) + ((100 - avgQueue) * 0.4)
  ).toFixed(1);

  const getColor = (value, type) => {
    if (type === "satisfaction") {
      if (value >= 80) return "#22c55e"; // verde
      if (value >= 70) return "#eab308"; // amarelo
      return "#ef4444"; // vermelho
    }

    if (type === "queue") {
      if (value <= 10) return "#22c55e";
      if (value <= 20) return "#eab308";
      return "#ef4444";
    }

    return "#1f2a3d";
  };

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
      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>

        <div style={{
          backgroundColor: getColor(avgSatisfaction, "satisfaction"),
          color: "white",
          padding: 20,
          borderRadius: 10
        }}>
          <h3>Satisfaction</h3>
          <h2>{avgSatisfaction.toFixed(1)}%</h2>
        </div>

        <div style={{
          backgroundColor: getColor(avgQueue, "queue"),
          color: "white",
          padding: 20,
          borderRadius: 10
        }}>
          <h3>Queue Time</h3>
          <h2>{avgQueue.toFixed(1)} min</h2>
        </div>

        <div style={{
          backgroundColor: "#1f2a3d",
          color: "white",
          padding: 20,
          borderRadius: 10
        }}>
          <h3>Event Score</h3>
          <h2>{eventScore} / 10</h2>
        </div>

      </div>

      {/* CHART 1 */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <XAxis dataKey="area" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="satisfaction" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>

      {/* CHART 2 */}
      <h2 style={{ marginTop: 40 }}>Queue Time by Area</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={filteredData}>
          <XAxis dataKey="area" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="queue" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
