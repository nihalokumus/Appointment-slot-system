import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboard, getMyAppointments } from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    cancelled: 0,
  });

  const [nextAppointment, setNextAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboard(),
      getMyAppointments(),
    ])
      .then(([dashboardRes, appointmentsRes]) => {
        setStats(dashboardRes.data);

        const appointments = appointmentsRes.data || [];

        const upcoming = appointments
          .filter((appointment) => appointment.status !== "cancelled")
          .filter((appointment) => {
            const dateTime = new Date(
              `${appointment.appointment_date}T${appointment.start_time}`
            );

            return dateTime >= new Date();
          })
          .sort((a, b) => {
            const dateA = new Date(
              `${a.appointment_date}T${a.start_time}`
            );

            const dateB = new Date(
              `${b.appointment_date}T${b.start_time}`
            );

            return dateA - dateB;
          });

        setNextAppointment(upcoming[0] || null);
      })
      .catch((error) => {
        console.error("Dashboard verileri alınamadı:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return "Onaylandı";
      case "pending":
        return "Bekliyor";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  return (
    <div className="dashboard-page">

      {/* Üst karşılama alanı */}
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">
            Randevu Yönetimi
          </span>

          <h1>Hoş Geldiniz 👋</h1>

          <p>
            Randevularınızı kolayca yönetin ve bir sonraki
            ziyaretinizi planlayın.
          </p>
        </div>

        <button
          className="dashboard-primary-btn"
          onClick={() => navigate("/new-appointment")}
        >
          + Yeni Randevu
        </button>
      </section>

      {/* İstatistikler */}
      <section className="dashboard-stats">

        <div
          className="dashboard-stat-card clickable"
          onClick={() => navigate("/my-appointments")}
        >
          <div className="dashboard-stat-icon pink">
            📅
          </div>

          <div>
            <span>Toplam Randevu</span>
            <strong>{loading ? "—" : stats.total}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon orange">
            ⏳
          </div>

          <div>
            <span>Bekleyen</span>
            <strong>{loading ? "—" : stats.pending}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon green">
            ✓
          </div>

          <div>
            <span>Onaylanan</span>
            <strong>{loading ? "—" : stats.approved}</strong>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="dashboard-stat-icon red">
            ×
          </div>

          <div>
            <span>İptal</span>
            <strong>{loading ? "—" : stats.cancelled}</strong>
          </div>
        </div>

      </section>

      {/* Alt bölüm */}
      <section className="dashboard-content">

        {/* Sonraki randevu */}
        <div className="dashboard-next card">

          <div className="dashboard-section-head">
            <div>
              <span className="dashboard-eyebrow">
                Yaklaşan
              </span>

              <h2>Bir Sonraki Randevunuz</h2>
            </div>
          </div>

          {loading ? (
            <div className="dashboard-empty">
              <span>Yükleniyor...</span>
            </div>
          ) : nextAppointment ? (
            <div className="next-appointment">

              <div className="next-date">
                <span>
                  {new Date(
                    `${nextAppointment.appointment_date}T00:00:00`
                  ).toLocaleDateString("tr-TR", {
                    weekday: "short",
                  })}
                </span>

                <strong>
                  {new Date(
                    `${nextAppointment.appointment_date}T00:00:00`
                  ).getDate()}
                </strong>

                <span>
                  {new Date(
                    `${nextAppointment.appointment_date}T00:00:00`
                  ).toLocaleDateString("tr-TR", {
                    month: "short",
                  })}
                </span>
              </div>

              <div className="next-info">

                <h3>
                  {nextAppointment.service?.name ||
                    "Randevu"}
                </h3>

                <p>
                  👤{" "}
                  {nextAppointment.personnel?.name ||
                    "Personel"}
                </p>

                <p>
                  🕐 {nextAppointment.start_time?.slice(0, 5)}
                  {" - "}
                  {nextAppointment.end_time?.slice(0, 5)}
                </p>

                <p className="next-full-date">
                  {formatDate(
                    nextAppointment.appointment_date
                  )}
                </p>

              </div>

              <span
                className={`dashboard-status ${nextAppointment.status}`}
              >
                {getStatusText(nextAppointment.status)}
              </span>

            </div>
          ) : (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">
                ✨
              </div>

              <h3>Yaklaşan randevunuz yok</h3>

              <p>
                Kendinize güzel bir zaman ayırmaya ne dersiniz?
              </p>

              <button
                className="dashboard-secondary-btn"
                onClick={() => navigate("/new-appointment")}
              >
                Randevu Oluştur
              </button>
            </div>
          )}

        </div>

        {/* Hızlı işlemler */}
        <div className="dashboard-actions card">

          <div className="dashboard-section-head">
            <div>
              <span className="dashboard-eyebrow">
                Hızlı İşlemler
              </span>

              <h2>Ne yapmak istersiniz?</h2>
            </div>
          </div>

          <button
            className="dashboard-action"
            onClick={() => navigate("/new-appointment")}
          >
            <div className="action-icon">
              +
            </div>

            <div>
              <strong>Yeni Randevu</strong>
              <span>
                Hizmet ve saat seçerek randevu oluşturun
              </span>
            </div>

            <span className="action-arrow">→</span>
          </button>

          <button
            className="dashboard-action"
            onClick={() => navigate("/my-appointments")}
          >
            <div className="action-icon">
              📋
            </div>

            <div>
              <strong>Randevularım</strong>
              <span>
                Geçmiş ve yaklaşan randevularınızı görüntüleyin
              </span>
            </div>

            <span className="action-arrow">→</span>
          </button>

          <button
            className="dashboard-action"
            onClick={() => navigate("/personnels")}
          >
            <div className="action-icon">
              ✂
            </div>

            <div>
              <strong>Personeller</strong>
              <span>
                Personellerimizi ve hizmet seçeneklerini inceleyin
              </span>
            </div>

            <span className="action-arrow">→</span>
          </button>

        </div>

      </section>
    </div>
  );
}

export default Dashboard;