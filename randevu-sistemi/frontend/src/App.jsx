import { useEffect, useState } from "react";

import Header from "./components/layout/Header";
import AlertMessage from "./components/common/AlertMessage";
import BookingForm from "./components/appointment/BookingForm";
import StatusBadge from "./components/common/StatusBadge";
import MyAppointments from "./pages/MyAppointments";
import Auth from "./components/Auth";

import {
  getServices,
  getPersonnels,
  getAvailableSlots,
  createAppointment,
} from "./services/api";

function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

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

  // Sayfa yenilenince giriş bilgisini localStorage'dan geri yükle
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (!(username || isGuest)) return;
    getServices().then((res) => setServices(res.data)).catch(console.error);
    getPersonnels().then((res) => setPersonnels(res.data)).catch(console.error);
  }, [username, isGuest]);

  useEffect(() => {
    if (selectedService && selectedPersonnel && selectedDate) {
      getAvailableSlots(selectedService, selectedPersonnel, selectedDate)
        .then((res) => setSlots(res.data))
        .catch(console.error);
    } else {
      setSlots([]);
    }
  }, [selectedService, selectedPersonnel, selectedDate]);

  const handleBooking = (e) => {
    e.preventDefault();

    if (!selectedTime) {
      alert("Lütfen saat seçiniz.");
      return;
    }

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
        setMessage("");
        setLastAppointment(res.data);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setSelectedTime("");

        return getAvailableSlots(selectedService, selectedPersonnel, selectedDate);
      })
      .then((res) => setSlots(res.data))
      .catch((err) => {
        console.error(err);
        setLastAppointment(null);
        setMessage("❌ " + (err.response?.data?.error || "Bir hata oluştu."));
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    setIsGuest(false);
  };

  if (!authChecked) return null;

  if (!username && !isGuest) {
    return (
      <Auth
        onAuthenticated={(name) => setUsername(name)}
        onGuestContinue={() => setIsGuest(true)}
      />
    );
  }

  return (
    <div className="container">
      <Header />

      <div style={{ textAlign: "right", marginBottom: "10px", fontSize: "14px" }}>
        {username ? (
          <>
            <b>{username}</b> olarak giriş yaptın —{" "}
            <button
              onClick={handleLogout}
              style={{ background: "none", border: "none", color: "#1d4ed8", cursor: "pointer", textDecoration: "underline" }}
            >
              Çıkış Yap
            </button>
          </>
        ) : (
          <span>Misafir olarak devam ediyorsun</span>
        )}
      </div>

      <AlertMessage message={message} />

      {lastAppointment && (
        <div className="section">
          <label>Randevu Durumu</label>
          <div style={{ marginTop: "6px" }}>
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
      <MyAppointments />
    </div>
  );
}

export default App;