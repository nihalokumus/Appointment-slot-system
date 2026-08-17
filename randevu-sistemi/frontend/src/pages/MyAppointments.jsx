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

  // Backend sayfalaması
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemCount, setItemCount] = useState(0);

  const [loading, setLoading] = useState(true);

  // Randevuları getir
  const refreshAppointments = () => {
    setLoading(true);

    getMyAppointments(page)
      .then((res) => {
        setAppointments(res.data.results);

        setTotalPages(res.data.total_pages);

        setTotalCount(res.data.count);

        setItemCount(res.data.item_count);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshAppointments();
  }, [page]);

  // Randevu iptal
  const handleCancel = (id) => {
    const confirmCancel = window.confirm(
      "Bu randevuyu iptal etmek istiyor musunuz?"
    );

    if (!confirmCancel) return;

    cancelAppointment(id)
      .then(() => {
        refreshAppointments();
      })
      .catch((error) => {
        console.error(error);

        alert(
          error.response?.data?.error ||
            "Randevu iptal edilirken bir hata oluştu."
        );
      });
  };

  // Arama + durum filtresi
  const filteredAppointments = appointments.filter((appointment) => {
    const text = search.toLowerCase();

    const matchesSearch =
      appointment.service_name
        ?.toLowerCase()
        .includes(text) ||
      appointment.personnel_name
        ?.toLowerCase()
        .includes(text) ||
      appointment.customer_name
        ?.toLowerCase()
        .includes(text) ||
      appointment.appointment_date?.includes(text);

    const matchesStatus =
      statusFilter === "all" ||
      appointment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Arama veya filtre değişirse 1. sayfaya dön
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const getStatusCount = (status) => {
    return appointments.filter(
      (appointment) => appointment.status === status
    ).length;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(`${dateString}T00:00:00`);

    return {
      day: date.getDate(),
      month: date.toLocaleDateString("tr-TR", {
        month: "short",
      }),
    };
  };

  return (
    <div className="page">

      {/* BAŞLIK */}
      <div className="page-head">

        <span className="page-eyebrow">
          RANDEVULAR
        </span>

        <h1>Randevularım</h1>

        <p>
          Oluşturduğunuz randevuları buradan takip edebilir
          ve yönetebilirsiniz.
        </p>

      </div>

      {/* ARAMA */}
      <div className="appointments-toolbar">

        <div className="appointment-search">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Hizmet, personel veya tarih ara..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      {/* FİLTRELER */}
      <div className="filter-row">

        <button
          className={`chip ${
            statusFilter === "all" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("all")}
        >
          Tümü
          <span>{totalCount}</span>
        </button>

        <button
          className={`chip ${
            statusFilter === "pending" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("pending")}
        >
          Bekleyen
          <span>{getStatusCount("pending")}</span>
        </button>

        <button
          className={`chip ${
            statusFilter === "approved" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("approved")}
        >
          Onaylanan
          <span>{getStatusCount("approved")}</span>
        </button>

        <button
          className={`chip ${
            statusFilter === "cancelled" ? "active" : ""
          }`}
          onClick={() => setStatusFilter("cancelled")}
        >
          İptal Edilen
          <span>{getStatusCount("cancelled")}</span>
        </button>

      </div>

      {/* SONUÇ BİLGİSİ */}
      {!loading && (
        <div className="appointments-result">

          <strong>{totalCount}</strong>{" "}
          toplam randevu —{" "}
          <strong>{itemCount}</strong>{" "}
          item gösteriliyor

        </div>
      )}

      {/* YÜKLENİYOR */}
      {loading && (
        <div className="appointments-empty">

          <div className="empty-icon">
            ◌
          </div>

          <h3>
            Randevular yükleniyor...
          </h3>

        </div>
      )}

      {/* RANDEVU YOK */}
      {!loading &&
        filteredAppointments.length === 0 && (
          <div className="appointments-empty">

            <div className="empty-icon">
              ♡
            </div>

            <h3>
              Randevu bulunamadı
            </h3>

            <p>
              {search
                ? "Arama kriterlerinize uygun bir randevu bulunamadı."
                : "Henüz oluşturduğunuz bir randevu bulunmuyor."}
            </p>

          </div>
        )}

      {/* RANDEVULAR */}
      {!loading &&
        filteredAppointments.length > 0 && (
          <>

            <div className="appt-list">

              {filteredAppointments.map((appointment) => {

                const date = formatDate(
                  appointment.appointment_date
                );

                return (
                  <div
                    key={appointment.id}
                    className="appt"
                  >

                    {/* TARİH */}
                    <div className="appt-date">

                      <span className="d">
                        {date.day}
                      </span>

                      <span className="m">
                        {date.month}
                      </span>

                    </div>

                    {/* BİLGİLER */}
                    <div className="appt-main">

                      <h4>
                        {appointment.service_name}
                      </h4>

                      <div className="appt-meta">

                        <span>
                          ✂️ {appointment.personnel_name}
                        </span>

                        <span>
                          🕐 {appointment.start_time}

                          {appointment.end_time &&
                            ` - ${appointment.end_time}`}
                        </span>

                      </div>

                      <div className="appt-meta">

                        <span>
                          👤 {appointment.customer_name}
                        </span>

                      </div>

                    </div>

                    {/* SAĞ TARAF */}
                    <div className="appt-right">

                      <StatusBadge
                        status={appointment.status}
                      />

                      {appointment.status !== "cancelled" && (
                        <button
                          className="appointment-cancel-btn"
                          onClick={() =>
                            handleCancel(
                              appointment.id
                            )
                          }
                        >
                          Randevuyu İptal Et
                        </button>
                      )}

                    </div>

                  </div>
                );
              })}

            </div>

            {/* SAYFALAMA */}
            {totalPages > 1 && (
              <div className="pagination">

                {/* GERİ */}
                <button
                  disabled={page === 1}
                  onClick={() =>
                    setPage(page - 1)
                  }
                >
                  ←
                </button>

                {/* SAYFA NUMARALARI */}
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (

                  <button
                    key={pageNumber}
                    className={
                      page === pageNumber
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPage(pageNumber)
                    }
                  >
                    {pageNumber}
                  </button>

                ))}

                {/* İLERİ */}
                <button
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage(page + 1)
                  }
                >
                  →
                </button>

              </div>
            )}

          </>
        )}

    </div>
  );
}

export default MyAppointments;