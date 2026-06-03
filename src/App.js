import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { area: "Entrance", satisfaction: 75 },
  { area: "Food", satisfaction: 82 },
  { area: "WC", satisfaction: 68 },
  { area: "Bar", satisfaction: 80 }
];

export default function App() {
  return (
    <div style={{ padding: 30 }}>
      <h1>CardumeTech Dashboard</h1>

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

