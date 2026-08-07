import { useNavigate } from "react-router-dom";
function Dashboard() {
  return (
    <>
      <h1>Hoş Geldiniz 👋</h1>

      <p style={{ color: "#666", marginBottom: "35px" }}>
        Kuaför randevu sistemine hoş geldiniz.
        Soldaki menüden işlemlerinizi gerçekleştirebilirsiniz.
      </p>

      <div className="dashboard-grid">

        <div className="card">
          <h3>📅 Yeni Randevu</h3>
          <p>Yeni bir randevu oluşturabilirsiniz.</p>
        </div>

        <div className="card">
          <h3>📖 Randevularım</h3>
          <p>Geçmiş ve gelecek randevularınızı görüntüleyebilirsiniz.</p>
        </div>

        <div className="card">
          <h3>✂️ Hizmetler</h3>
          <p>Sunulan hizmetleri inceleyebilirsiniz.</p>
        </div>

        <div className="card">
          <h3>👩‍💼 Personeller</h3>
          <p>Personeller ve çalışma saatlerini görüntüleyebilirsiniz.</p>
        </div>

      </div>
    </>
  );
}

export default Dashboard;