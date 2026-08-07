import { useEffect, useState } from "react";
import { getMyAppointments } from "../services/api";
import StatusBadge from "../components/common/StatusBadge";

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    getMyAppointments()
      .then((res) => setAppointments(res.data))
      .catch(console.error);
  }, []);

  return (
    <>
      <h1>📖 Randevularım</h1>

      {appointments.length === 0 ? (
        <p>Henüz randevunuz bulunmuyor.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="card"
            style={{ marginBottom: "20px" }}
          >
            <h3>{appointment.service_name}</h3>

            <p>
              👩 Personel:
              <b> {appointment.personnel_name}</b>
            </p>

            <p>
              📅 {appointment.appointment_date}
            </p>

            <p>
              🕒 {appointment.start_time}
            </p>

            <StatusBadge status={appointment.status} />
          </div>
        ))
      )}
    </>
  );
}

export default MyAppointments;