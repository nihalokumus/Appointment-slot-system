import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div
      style={{
        width: "230px",
        background: "#f7f7f7",
        padding: "20px",
        borderRight: "1px solid #ddd",
      }}
    >
      <h3>Menü</h3>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "25px",
        }}
      >
        <Link to="/">🏠 Ana Sayfa</Link>

        <Link to="/new-appointment">
          📅 Yeni Randevu
        </Link>

        <Link to="/my-appointments">
          📖 Randevularım
        </Link>

        <Link to="/services">
          ✂ Hizmetler
        </Link>

        <Link to="/personnels">
          👩 Personeller
        </Link>

        <Link to="/profile">
          👤 Profil
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;