import { useEffect, useState } from "react";
import { getServices } from "../services/api";

function Services() {

  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <h1>Hizmetler</h1>

      <div className="dashboard-grid">

        {services.map((service) => (

          <div
            className="card"
            key={service.id}
          >
            <h3>{service.name}</h3>

            <p>
              ⏱ Süre:
              {" "}
              {service.duration_minutes}
              {" "}
              dakika
            </p>

            <p>
              💰
              {" "}
              {service.price}
              {" "}
              TL
            </p>

          </div>

        ))}

      </div>

    </>
  );
}

export default Services;