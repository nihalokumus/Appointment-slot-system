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
    <div className="section">
      <h2>Randevularım</h2>

      {appointments.length === 0 ? (
        <p>Henüz randevunuz bulunmuyor.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <p>
              <b>Tarih:</b> {appointment.appointment_date}
            </p>

            <p>
              <b>Saat:</b> {appointment.start_time}
            </p>

            <StatusBadge status={appointment.status} />
          </div>
        ))
      )}
    </div>
  );
}

export default MyAppointments;