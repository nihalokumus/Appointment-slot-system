import { useState } from "react";
import { registerUser, loginUser } from "../services/api";

function Auth({ onAuthenticated, onGuestContinue }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const action = mode === "login" ? loginUser : registerUser;

    action(username, password)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        onAuthenticated(res.data.username);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Bir hata oluştu.");
      });
  };

  return (
    <div className="container">
      <h1>✂️ Kuaför Randevu Sistemi</h1>

      <div className="section" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => setMode("login")}
          style={{
            flex: 1, padding: "10px", borderRadius: "8px", border: "none",
            background: mode === "login" ? "#1d4ed8" : "#eee",
            color: mode === "login" ? "white" : "#222",
          }}
        >
          Giriş Yap
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          style={{
            flex: 1, padding: "10px", borderRadius: "8px", border: "none",
            background: mode === "register" ? "#1d4ed8" : "#eee",
            color: mode === "register" ? "white" : "#222",
          }}
        >
          Kayıt Ol
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="section">
          <label>Kullanıcı Adı</label>
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="section">
          <label>Şifre</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button type="submit" className="submit-btn">
          {mode === "login" ? "Giriş Yap" : "Kayıt Ol"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          type="button"
          onClick={onGuestContinue}
          style={{ background: "none", border: "none", color: "#1d4ed8", cursor: "pointer", textDecoration: "underline" }}
        >
          Giriş Yapmadan Devam Et
        </button>
      </p>
    </div>
  );
}

export default Auth;