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
    <form onSubmit={onSubmit}>
      <div className="section">
        <label>Hizmet</label>
        <select
          value={selectedService}
          onChange={(e) => onServiceChange(e.target.value)}
          className="form-control"
        >
          <option value="">Hizmet seçiniz</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - {service.duration_minutes} dk
            </option>
          ))}
        </select>
      </div>

      <div className="section">
        <label>Personel</label>
        <select
          value={selectedPersonnel}
          onChange={(e) => onPersonnelChange(e.target.value)}
          className="form-control"
        >
          <option value="">Personel seçiniz</option>
          {personnels.map((personnel) => (
            <option key={personnel.id} value={personnel.id}>
              {personnel.name}
            </option>
          ))}
        </select>
      </div>

      <div className="section">
        <label>Tarih</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <SlotList slots={slots} selectedTime={selectedTime} onSelect={onTimeSelect} />

      {selectedTime && (
        <CustomerForm
          name={customerName}
          phone={customerPhone}
          email={customerEmail}
          onNameChange={onNameChange}
          onPhoneChange={onPhoneChange}
          onEmailChange={onEmailChange}
        />
      )}
    </form>
  );
}

export default BookingForm;
