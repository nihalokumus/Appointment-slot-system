const STATUS_STYLES = {
  pending: { label: "Onaylanmayı Bekliyor", background: "#dfd812" },
  approved: { label: "Onaylandı", background: "#22c55e" },
  cancelled: { label: "İptal Edildi", background: "#ef4444" },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || { label: status, background: "#6b7280" };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: "20px",
        color: "white",
        fontWeight: "bold",
        fontSize: "13px",
        background: style.background,
      }}
    >
      {style.label}
    </span>
  );
}

export default StatusBadge;