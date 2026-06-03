import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { area: "Entrance", satisfaction: 75, queue: 35 },
  { area: "Food", satisfaction: 82, queue: 15 },
  { area: "WC", satisfaction: 68, queue: 10 },
  { area: "Bar", satisfaction: 80, queue: 12 }
];

const avgSatisfaction = (data.reduce((a, b) => a + b.satisfaction, 0) / data.length).toFixed(1);
const avgQueue = (data.reduce((a, b) => a + b.queue, 0) / data.length).toFixed(1);

export default function App() {
  return (
    <div style={{ padding: 30 }}>
      <h1>CardumeTech Dashboard</h1>

      <div style={{ display: "flex", gap: 20, marginBottom: 30 }}>
        
        <div style={{ background: "# 1e293b", color: "white", padding: 20, borderRadius: 10 }}>
          <h3>Satisfaction</h3>
          <h2>{avgSatisfaction}%</h2>
        </div>

        <div style={{ background: "# 1e293b", color: "white", padding: 20, borderRadius: 10 }}>
          <h3>Queue Time</h3>
          <h2>{avgQueue} min</h2>
        </div>

      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="area" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="satisfaction" fill="#00C49F" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

``