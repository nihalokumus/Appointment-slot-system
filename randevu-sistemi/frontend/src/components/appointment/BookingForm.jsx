import SlotList from "./SlotList";
import CustomerForm from "./CustomerForm";

function BookingForm({
  services,
  personnels,
  slots,
  selectedService,
  selectedPersonnel,
  selectedDate,
  selectedTime,
  customerName,
  customerPhone,
  customerEmail,
  onEmailChange,
  onServiceChange,
  onPersonnelChange,
  onDateChange,
  onTimeSelect,
  onNameChange,
  onPhoneChange,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="booking-form">

      <div className="booking-field-grid">

        <div className="booking-field">
          <label>Hizmet</label>

          <select
            value={selectedService}
            onChange={(e) => onServiceChange(e.target.value)}
            className="booking-input"
            required
          >
            <option value="">Hizmet seçiniz</option>

            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — {service.duration_minutes} dk
              </option>
            ))}
          </select>
        </div>

        <div className="booking-field">
          <label>Personel</label>

          <select
            value={selectedPersonnel}
            onChange={(e) =>
              onPersonnelChange(e.target.value)
            }
            className="booking-input"
            required
          >
            <option value="">Personel seçiniz</option>

            {personnels.map((personnel) => (
              <option
                key={personnel.id}
                value={personnel.id}
              >
                {personnel.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="booking-field">
        <label>Tarih</label>

        <input
          type="date"
          min={new Date().toISOString().split("T")[0]}
          className="booking-input"
          value={selectedDate}
          onChange={(e) =>
            onDateChange(e.target.value)
          }
          required
        />
      </div>

      <SlotList
        slots={slots}
        selectedTime={selectedTime}
        onSelect={onTimeSelect}
      />

      {selectedTime && (
        <div className="customer-section">

          <div className="customer-section-header">
            <div className="step-circle">2</div>

            <div>
              <h3>İletişim Bilgileri</h3>
              <p>Randevunuz için bilgilerinizi girin.</p>
            </div>
          </div>

          <CustomerForm
            name={customerName}
            phone={customerPhone}
            email={customerEmail}
            onNameChange={onNameChange}
            onPhoneChange={onPhoneChange}
            onEmailChange={onEmailChange}
          />

        </div>
      )}

    </form>
  );
}

export default BookingForm;