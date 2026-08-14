function Header() {
  const username = localStorage.getItem("username");

  return (
    <header
      style={{
        height: "70px",
        background: "#ffffff",
        borderBottom: "1px solid #E8558A",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
      }}
    >
      {/* Logo / Sistem adı */}
      <h2
        style={{
          margin: 0,
          color: "#374151",
          fontSize: "25px",
          fontWeight: "700",
          letterSpacing: "-0.3px",
        }}
      >
      Kuaför Randevu Sistemi
      </h2>

      {/* Kullanıcı */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          color: "#374151",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        <span>
          {username || "Misafir"}
        </span>

        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            username || "Guest"
          )}&background=fce7f3&color=db2777`}
          alt="avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "2px solid #fce7f3",
          }}
        />
      </div>
    </header>
  );
}

export default Header;