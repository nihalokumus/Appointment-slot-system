import { useEffect, useState } from "react";
import {
  getMyAppointments,
  cancelAppointment,
} from "../services/api";

import StatusBadge from "../components/common/StatusBadge";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Randevuları getir
  const refreshAppointments = () => {
    getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    refreshAppointments();
  }, []);

  // İptal işlemi
  const handleCancel = (id) => {
    const confirmCancel = window.confirm(
      "Bu randevuyu iptal etmek istiyor musunuz?"
    );

    if (!confirmCancel) return;

    cancelAppointment(id)
      .then(() => {
        refreshAppointments();
      })
      .catch(console.error);
  };

  // Arama + Durum filtresi
  const filteredAppointments = appointments.filter((appointment) => {
    const text = search.toLowerCase();

    const matchesSearch =
      appointment.service_name.toLowerCase().includes(text) ||
      appointment.personnel_name.toLowerCase().includes(text) ||
      appointment.customer_name.toLowerCase().includes(text) ||
      appointment.appointment_date.includes(text);

    const matchesStatus =
      statusFilter === "all" ||
      appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <h1>📖 Randevularım</h1>

      <input
        type="text"
        placeholder="🔍 Hizmet, personel, müşteri veya tarih ara..."
        className="form-control"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "15px" }}
      />

      <select
        className="form-control"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ marginBottom: "20px" }}
      >
        <option value="all">Tüm Randevular</option>
        <option value="pending">Bekleyen</option>
        <option value="approved">Onaylanan</option>
        <option value="cancelled">İptal Edilen</option>
      </select>

      <p style={{ color: "#666", marginBottom: "20px" }}>
        Toplam <strong>{filteredAppointments.length}</strong> randevu bulundu.
      </p>

      {filteredAppointments.length === 0 ? (
        <p>Randevu bulunamadı.</p>
      ) : (
        filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="card"
            style={{ marginBottom: "20px" }}
          >
            <h3>{appointment.service_name}</h3>

            <p>
              <strong>👤 Müşteri:</strong>{" "}
              {appointment.customer_name}
            </p>

            <p>
              <strong>👩 Personel:</strong>{" "}
              {appointment.personnel_name}
            </p>

            <p>
              📅 {appointment.appointment_date} | 🕒{" "}
              {appointment.start_time}
            </p>

            <div style={{ margin: "15px 0" }}>
              <StatusBadge status={appointment.status} />
            </div>

            {appointment.status !== "cancelled" && (
              <button
                onClick={() =>
                  handleCancel(appointment.id)
                }
                style={{
                  background:
                    appointment.status === "approved"
                      ? "#dc2626"
                      : "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "180px",
                  fontWeight: "600",
                }}
              >
                ❌ Randevuyu İptal Et
              </button>
            )}
          </div>
        ))
      )}
    </>
  );
}

export default MyAppointments;