import { useEffect, useState } from "react";
import { getServices } from "../services/api";

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="page">
      <div className="page-head">
        <h1>Hizmetler</h1>
        <p>Sunulan hizmetleri, sürelerini ve fiyatlarını görüntüleyin.</p>
      </div>

      <div className="services-table-card">
        <div className="services-table-header">
          <div>
            <h2>Hizmet Listesi</h2>
            <p>{services.length} hizmet bulunmaktadır.</p>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✂️</div>
            <h3>Henüz hizmet bulunmuyor</h3>
            <p>Görüntülenecek aktif bir hizmet bulunamadı.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="services-table">
              <thead>
                <tr>
                  <th>Hizmet</th>
                  <th>Süre</th>
                  <th>Fiyat</th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service-name">
                        <div className="service-icon">✂</div>
                        <div>
                          <strong>{service.name}</strong>
                          <span>Profesyonel hizmet</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="service-duration">
                        🕒 {service.duration_minutes} dakika
                      </span>
                    </td>

                    <td>
                      <span className="service-price">
                        {service.price} TL
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;