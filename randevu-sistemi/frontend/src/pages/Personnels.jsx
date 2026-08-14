import { useEffect, useState } from "react";
import { getPersonnels } from "../services/api";

function Personnels() {
  const [personnels, setPersonnels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getPersonnels()
      .then((res) => {
        setPersonnels(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Personeller yüklenirken bir hata oluştu.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Personeller</h1>
          <p>Hizmet alabileceğiniz personelleri görüntüleyin.</p>
        </div>

        <div className="loading-box">
          Personeller yükleniyor...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-content">
        <div className="page-header">
          <h1>Personeller</h1>
        </div>

        <div className="error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <span className="page-kicker">EKİBİMİZ</span>
          <h1>Personeller</h1>
          <p>
            Randevunuz için uygun personelleri ve çalışma saatlerini
            görüntüleyin.
          </p>
        </div>

        <div className="page-count">
          <strong>{personnels.length}</strong>
          <span>Personel</span>
        </div>
      </div>

      {personnels.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👤</div>
          <h3>Henüz personel bulunmuyor</h3>
          <p>Aktif personeller burada görüntülenecek.</p>
        </div>
      ) : (
        <div className="personnel-grid">
          {personnels.map((person) => (
            <div className="personnel-card" key={person.id}>
              <div className="personnel-avatar">
                {person.name?.charAt(0).toUpperCase()}
              </div>

              <div className="personnel-info">
                <h3>{person.name}</h3>

                <div className="working-hours">
                  <span className="hours-icon">🕐</span>

                  <div>
                    <span className="hours-label">Çalışma Saatleri</span>
                    <strong>
                      {person.working_start?.slice(0, 5)} -{" "}
                      {person.working_end?.slice(0, 5)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="available-badge">
                Aktif
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Personnels;