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
    getServices()
      .then((res) => setServices(res.data))
      .catch(() => setMessage("Hizmetler yüklenirken bir hata oluştu."));

    getPersonnels()
      .then((res) => setPersonnels(res.data))
      .catch(() => setMessage("Personeller yüklenirken bir hata oluştu."));
  }, []);

  useEffect(() => {
    setSelectedTime("");

    if (selectedService && selectedPersonnel && selectedDate) {
      getAvailableSlots(
        selectedService,
        selectedPersonnel,
        selectedDate
      )
        .then((res) => {
          setSlots(res.data);
          setMessage("");
        })
        .catch(() => {
          setSlots([]);
          setMessage("Uygun saatler yüklenirken bir hata oluştu.");
        });
    } else {
      setSlots([]);
    }
  }, [selectedService, selectedPersonnel, selectedDate]);

  const handleBooking = (e) => {
    e.preventDefault();

    if (!selectedTime) {
      setMessage("Lütfen bir saat seçin.");
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
          err.response?.data?.error ||
            "Randevu oluşturulurken bir hata oluştu."
        );
      });
  };

  const selectedServiceData = services.find(
    (service) => String(service.id) === String(selectedService)
  );

  const selectedPersonnelData = personnels.find(
    (personnel) => String(personnel.id) === String(selectedPersonnel)
  );

  return (
    <div className="appointment-page">

      <div className="appointment-page-header">
        <div>
          <span className="page-eyebrow">RANDEVU</span>

          <h1>Yeni Randevu</h1>

          <p>
            Hizmetinizi, personelinizi ve size uygun zamanı seçerek
            kolayca randevunuzu oluşturun.
          </p>
        </div>
      </div>

      <AlertMessage message={message} />

      {lastAppointment && (
        <div className="appointment-success">
          <div className="success-icon">✓</div>

          <div>
            <strong>Randevunuz oluşturuldu.</strong>
            <span>
              Randevu durumunuz aşağıdaki gibidir.
            </span>
          </div>

          <StatusBadge status={lastAppointment.status} />
        </div>
      )}

      <div className="appointment-layout">

        <div className="appointment-form-card">

          <div className="appointment-card-header">
            <div>
              <h2>Randevu Bilgileri</h2>
              <p>Size uygun hizmet ve zamanı seçin.</p>
            </div>

            <div className="step-circle">1</div>
          </div>

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

        </div>

        <div className="appointment-summary-card">

          <div className="summary-header">
            <span className="page-eyebrow">ÖZET</span>
            <h2>Randevu Özeti</h2>
          </div>

          <div className="summary-divider" />

          <div className="summary-row">
            <span>Hizmet</span>
            <strong>
              {selectedServiceData?.name || "Henüz seçilmedi"}
            </strong>
          </div>

          <div className="summary-row">
            <span>Personel</span>
            <strong>
              {selectedPersonnelData?.name || "Henüz seçilmedi"}
            </strong>
          </div>

          <div className="summary-row">
            <span>Tarih</span>
            <strong>
              {selectedDate || "Henüz seçilmedi"}
            </strong>
          </div>

          <div className="summary-row">
            <span>Saat</span>
            <strong className={selectedTime ? "selected-value" : ""}>
              {selectedTime || "Henüz seçilmedi"}
            </strong>
          </div>

          {selectedServiceData && (
            <div className="summary-price">
              <span>Hizmet Ücreti</span>

              <strong>
                {selectedServiceData.price} TL
              </strong>
            </div>
          )}

          {!selectedService && (
            <div className="summary-empty">
              <div>✦</div>
              <p>
                Randevu detaylarınızı burada
                görüntüleyebilirsiniz.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default NewAppointment;