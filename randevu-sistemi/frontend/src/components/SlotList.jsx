function SlotList({ slots, selectedTime, onSelect }) {
  if (slots.length === 0) return null;

  return (
    <div className="section">
      <label>Uygun Saatler</label>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {slots.map((slot) => (
          <button
            key={slot.start_time}
            type="button"
            disabled={!slot.is_available}
            onClick={() => onSelect(slot.start_time)}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: slot.is_available ? "pointer" : "not-allowed",
              background: !slot.is_available
                ? "#ddd"
                : selectedTime === slot.start_time
                ? "#1d4ed8"
                : "#22c55e",
              color: "white",
            }}
          >
            {slot.start_time} - {slot.end_time}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SlotList;