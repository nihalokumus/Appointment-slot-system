import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // State'ler
  const [services, setServices] = useState([]);
  const [personnels, setPersonnels] = useState([]);

  // Sayfa açılınca çalışır
  useEffect(() => {

    // Hizmetleri getir
    axios
      .get("http://127.0.0.1:8000/api/services/")
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // Personelleri getir
    axios
      .get("http://127.0.0.1:8000/api/personnels/")
      .then((response) => {
        setPersonnels(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

  }, []);

  return (
    <div>
      <h1>Kuaför Randevu Sistemi</h1>

      <h2>Hizmetler</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            {service.name} - {service.price} TL
          </li>
        ))}
      </ul>

      <h2>Personeller</h2>
      <ul>
        {personnels.map((personnel) => (
          <li key={personnel.id}>
            {personnel.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;