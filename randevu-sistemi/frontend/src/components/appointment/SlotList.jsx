function SlotList({ slots, selectedTime, onSelect }) {
  if (slots.length === 0) {
    return null;
  }

  return (
    <div className="slot-section">

      <div className="slot-header">
        <div>
          <h3>Uygun Saatler</h3>
          <p>Size uygun saati seçin.</p>
        </div>

        <span className="slot-count">
          {slots.filter((slot) => slot.is_available).length} uygun
        </span>
      </div>

      <div className="slot-grid">

        {slots.map((slot) => (
          <button
            key={slot.start_time}
            type="button"
            disabled={!slot.is_available}
            onClick={() => onSelect(slot.start_time)}
            className={`slot-button ${
              !slot.is_available
                ? "slot-disabled"
                : selectedTime === slot.start_time
                ? "slot-selected"
                : ""
            }`}
          >
            {slot.start_time}
          </button>
        ))}

      </div>

      <div className="slot-legend">
        <span>
          <i className="legend-dot available" />
          Uygun
        </span>

        <span>
          <i className="legend-dot selected" />
          Seçili
        </span>

        <span>
          <i className="legend-dot unavailable" />
          Dolu
        </span>
      </div>

    </div>
  );
}

export default SlotList;