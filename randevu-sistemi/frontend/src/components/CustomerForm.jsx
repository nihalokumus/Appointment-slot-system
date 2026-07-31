function CustomerForm({
  name,
  phone,
  email,
  onNameChange,
  onPhoneChange,
  onEmailChange,
}) {
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

      <div className="section">
        <label>E-posta</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      <button type="submit" className="submit-btn">
        Randevu Oluştur
      </button>
    </>
  );
}

export default CustomerForm;