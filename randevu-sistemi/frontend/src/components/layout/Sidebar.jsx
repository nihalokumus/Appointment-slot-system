import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkStyle = ({ isActive }) => ({
    display: "block",
    textDecoration: "none",
    color: isActive ? "#2563eb" : "#374151",
    fontWeight: isActive ? "600" : "500",
    padding: "12px 15px",
    borderRadius: "10px",
    backgroundColor: isActive ? "#eff6ff" : "transparent",
    transition: "all .2s ease",
  });

  return (
    <aside
      style={{
        width: "250px",
        minHeight: "100vh",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        boxShadow: "2px 0 10px rgba(0,0,0,.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ padding: "30px 20px" }}>
        <h2
          style={{
            margin: 0,
            marginBottom: "35px",
            color: "#2563eb",
            textAlign: "center",
          }}
        >
          📅 Randevu Sistemi
        </h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <NavLink to="/" end style={linkStyle}>
            🏠 Ana Sayfa
          </NavLink>

          <NavLink to="/new-appointment" style={linkStyle}>
            📅 Yeni Randevu
          </NavLink>

          <NavLink to="/my-appointments" style={linkStyle}>
            📖 Randevularım
          </NavLink>

          <NavLink to="/services" style={linkStyle}>
            ✂️ Hizmetler
          </NavLink>

          <NavLink to="/personnels" style={linkStyle}>
            👩‍💼 Personeller
          </NavLink>

          <NavLink to="/profile" style={linkStyle}>
            👤 Profil
          </NavLink>
        </nav>
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <button
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            background: "#ef4444",
            color: "#fff",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          🚪 Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;