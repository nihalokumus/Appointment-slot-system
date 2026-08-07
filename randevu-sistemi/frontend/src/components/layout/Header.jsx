function Header() {
  const username = localStorage.getItem("username");

  return (
    <header
      style={{
        height: "70px",
        background: "#ffffff",
        borderBottom: "1px solid #ececec",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 30px",
      }}
    >
      <h2
        style={{
          margin: 0,
          color: "#2563eb",
        }}
      >
        ✂ Kuaför Randevu Sistemi
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <span>
          👤 {username ? username : "Misafir"}
        </span>

        <img
          src={`https://ui-avatars.com/api/?name=${username || "Guest"}`}
          alt="avatar"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
        />
      </div>
    </header>
  );
}

export default Header;