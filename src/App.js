import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {

  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedArea, setSelectedArea] = useState("All");

  // ✅ obter user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // ✅ buscar dados filtrados por user
  const fetchData = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("cardumetech_baseline_events")
      .select("*")
      .eq("client_id", user.email);

    if (!error && data) {
      setData(data);
    }
  };

  // ✅ só busca quando há user
  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const filteredData =
    selectedArea === "All"
      ? data
      : data.filter(item => item.area === selectedArea);

  const avgSatisfaction =
    filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.satisfaction, 0) / filteredData.length
      : 0;

  const avgQueue =
    filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.queue, 0) / filteredData.length
      : 0;

  const eventScore = (
    (avgSatisfaction * 0.6) + ((100 - avgQueue) * 0.4)
  ).toFixed(1);
const handleLogin = async () => {
  const email = prompt("Enter your email:");

  if (!email) return;

  const { error } = await supabase.auth.signInWithOtp({
    email: email
  });

  if (error) {
    alert("Erro no login");
  } else {
    alert("Check your email 📩");
  }
};

  return (
    <div style={{ padding: 30 }}>
<button
  onClick={handleLogin}
  style={{
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 5
  }}
>
  Login
</button>
      <h1>CardumeTech Dashboard</h1>

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

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>

        <div style={{ background: "#22c55e", padding: 20, color: "white" }}>
          <h3>Satisfaction</h3>
          <h2>{avgSatisfaction.toFixed(1)}%</h2>
        </div>

        <div style={{ background: "#eab308", padding: 20, color: "white" }}>
          <h3>Queue</h3>
          <h2>{avgQueue.toFixed(1)} min</h2>
        </div>

        <div style={{ background: "#1f2937", padding: 20, color: "white" }}>
          <h3>Score</h3>
          <h2>{eventScore}</h2>
        </div>

      </div>

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
``