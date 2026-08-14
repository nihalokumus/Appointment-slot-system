function CustomerForm({
  name,
  phone,
  email,
  onNameChange,
  onPhoneChange,
  onEmailChange,
}) {
  return (
    <div className="customer-form">

      <div className="booking-field">
        <label>Ad Soyad</label>

        <input
          type="text"
          className="booking-input"
          value={name}
          onChange={(e) =>
            onNameChange(e.target.value)
          }
          placeholder="Adınız ve soyadınız"
          required
        />
      </div>

      <div className="booking-field">
        <label>Telefon</label>

        <input
          type="tel"
          className="booking-input"
          value={phone}
          onChange={(e) =>
            onPhoneChange(e.target.value)
          }
          placeholder="05XX XXX XX XX"
          required
        />
      </div>

      <div className="booking-field">
        <label>E-posta</label>

        <input
          type="email"
          className="booking-input"
          value={email}
          onChange={(e) =>
            onEmailChange(e.target.value)
          }
          placeholder="ornek@email.com"
          required
        />
      </div>

      <button
        type="submit"
        className="appointment-submit"
      >
        Randevuyu Oluştur
        <span>→</span>
      </button>

    </div>
  );
}

export default CustomerForm;