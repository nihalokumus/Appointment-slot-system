import { useEffect, useState } from "react";

import BookingForm from "../components/appointment/BookingForm";
import AlertMessage from "../components/common/AlertMessage";
import StatusBadge from "../components/common/StatusBadge";

import {
  getServices,
  getPersonnels,
  getAvailableSlots,
  createAppointment,
} from "../services/api";

function NewAppointment() {
  const [services, setServices] = useState([]);
  const [personnels, setPersonnels] = useState([]);
  const [slots, setSlots] = useState([]);

  const [selectedService, setSelectedService] = useState("");
  const [selectedPersonnel, setSelectedPersonnel] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [message, setMessage] = useState("");
  const [lastAppointment, setLastAppointment] = useState(null);

  useEffect(() => {
    getServices().then((res) => setServices(res.data));
    getPersonnels().then((res) => setPersonnels(res.data));
  }, []);

  useEffect(() => {
    if (selectedService && selectedPersonnel && selectedDate) {
      getAvailableSlots(
        selectedService,
        selectedPersonnel,
        selectedDate
      ).then((res) => setSlots(res.data));
    } else {
      setSlots([]);
    }
  }, [selectedService, selectedPersonnel, selectedDate]);

  const handleBooking = (e) => {
    e.preventDefault();

    const payload = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail,
      personnel_id: selectedPersonnel,
      service_id: selectedService,
      appointment_date: selectedDate,
      start_time: selectedTime,
    };

    createAppointment(payload)
      .then((res) => {
        setLastAppointment(res.data);
        setMessage("");

        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setSelectedTime("");

        return getAvailableSlots(
          selectedService,
          selectedPersonnel,
          selectedDate
        );
      })
      .then((res) => setSlots(res.data))
      .catch((err) => {
        setLastAppointment(null);
        setMessage(
          "❌ " + (err.response?.data?.error || "Bir hata oluştu.")
        );
      });
  };

  return (
    <>
      <AlertMessage message={message} />

      {lastAppointment && (
        <div className="section">
          <label>Randevu Durumu</label>

          <div style={{ marginTop: "8px" }}>
            <StatusBadge status={lastAppointment.status} />
          </div>
        </div>
      )}

      <BookingForm
        services={services}
        personnels={personnels}
        slots={slots}
        selectedService={selectedService}
        selectedPersonnel={selectedPersonnel}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        customerName={customerName}
        customerPhone={customerPhone}
        customerEmail={customerEmail}
        onEmailChange={setCustomerEmail}
        onServiceChange={setSelectedService}
        onPersonnelChange={setSelectedPersonnel}
        onDateChange={setSelectedDate}
        onTimeSelect={setSelectedTime}
        onNameChange={setCustomerName}
        onPhoneChange={setCustomerPhone}
        onSubmit={handleBooking}
      />
    </>
  );
}

export default NewAppointment;