import { NavLink } from "react-router-dom";
import {
  Menu,
  Home,
  CalendarPlus,
  CalendarDays,
  Scissors,
  Users,
  User,
  LogOut,
} from "lucide-react";

function Sidebar({ isOpen, setIsOpen }) {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "15px",
    textDecoration: "none",
    color: isActive ? "#2563eb" : "#374151",
    fontWeight: isActive ? "600" : "500",
    padding: "12px 14px",
    borderRadius: "10px",
    backgroundColor: isActive ? "#eff6ff" : "transparent",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  });

  return (
    <aside
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{
        width: isOpen ? "250px" : "70px",
        minHeight: "calc(100vh - 70px)",
        background: "#ffffff",
        borderRight: "1px solid #e5e7eb",
        boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "width 0.25s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "20px 10px" }}>

        {/* Menü ikonu */}
        <div
          style={{
            height: "45px",
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "flex-start" : "center",
            paddingLeft: isOpen ? "4px" : "0",
            marginBottom: "25px",
          }}
        >
          <Menu size={24} color="#374151" />
        </div>

        {/* Menü */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <NavLink to="/" end style={linkStyle}>
            <Home size={21} />
            {isOpen && <span>Ana Sayfa</span>}
          </NavLink>

          <NavLink to="/new-appointment" style={linkStyle}>
            <CalendarPlus size={21} />
            {isOpen && <span>Yeni Randevu</span>}
          </NavLink>

          <NavLink to="/my-appointments" style={linkStyle}>
            <CalendarDays size={21} />
            {isOpen && <span>Randevularım</span>}
          </NavLink>

          <NavLink to="/services" style={linkStyle}>
            <Scissors size={21} />
            {isOpen && <span>Hizmetler</span>}
          </NavLink>

          <NavLink to="/personnels" style={linkStyle}>
            <Users size={21} />
            {isOpen && <span>Personeller</span>}
          </NavLink>

          <NavLink to="/profile" style={linkStyle}>
            <User size={21} />
            {isOpen && <span>Profil</span>}
          </NavLink>
        </nav>
      </div>

      {/* Çıkış */}
      <div
        style={{
          padding: "15px 10px",
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: isOpen ? "flex-start" : "center",
            gap: "15px",
            padding: "12px 14px",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            background: "#fee2e2",
            color: "#dc2626",
            fontWeight: "600",
            fontSize: "14px",
            whiteSpace: "nowrap",
          }}
        >
          <LogOut size={21} />
          {isOpen && <span>Çıkış Yap</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;