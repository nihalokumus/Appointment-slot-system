function CustomerForm({ name, phone, onNameChange, onPhoneChange }) {
  return (
    <>
      <div className="section">
        <label>Ad Soyad</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div className="section">
        <label>Telefon</label>
        <input
          className="form-control"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
        />
      </div>

      <button type="submit" className="submit-btn">
        Randevu Oluştur
      </button>
    </>
  );
}

export default CustomerForm;