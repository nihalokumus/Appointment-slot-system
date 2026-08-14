import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/api";

function Dashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    cancelled: 0,
  });

  useEffect(() => {

    getDashboard()
      .then((res) => {

        setStats(res.data);

      })
      .catch(console.error);

  }, []);

  return (
    <>
      <h1>Hoş Geldiniz 👋</h1>

      <p
        style={{
          color: "#666",
          marginBottom: "35px",
        }}
      >
        Kuaför Randevu Sistemine hoş geldiniz.
      </p>

      <div className="dashboard-grid">

        <div
          className="card"
          onClick={() => navigate("/new-appointment")}
        >
          <h2>{stats.total}</h2>
          <h3>📅 Toplam Randevu</h3>
        </div>

        <div className="card">
          <h2>{stats.pending}</h2>
          <h3>⏳ Bekleyen</h3>
        </div>

        <div className="card">
          <h2>{stats.approved}</h2>
          <h3>✅ Onaylanan</h3>
        </div>

        <div className="card">
          <h2>{stats.cancelled}</h2>
          <h3>❌ İptal</h3>
        </div>

      </div>
    </>
  );
}

export default Dashboard;