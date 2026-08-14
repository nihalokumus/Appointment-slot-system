import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

function Auth({ onAuthenticated, onGuestContinue }) {
  const [mode, setMode] = useState("login");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Lütfen zorunlu alanları doldurun.");
      return;
    }

    if (mode === "register") {
      if (!email) {
        setError("E-posta adresinizi girin.");
        return;
      }

      if (password !== passwordAgain) {
        setError("Şifreler eşleşmiyor.");
        return;
      }
    }

    try {
      setLoading(true);

      if (mode === "login") {
        const res = await loginUser(username, password);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);

        onAuthenticated(res.data.username);
      } else {
        const res = await registerUser(
          username,
          email,
          password
        );

        setSuccess(
          res.data.message ||
          "Kayıt başarılı. E-posta adresinizi kontrol edin."
        );

        setPassword("");
        setPasswordAgain("");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Bir hata oluştu. Lütfen tekrar deneyin."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">

      {/* SOL TARAF */}
      <section className="auth-visual">

        <div>
          <div className="auth-brand">
          </div>
        </div>

        <div className="auth-visual-content">
          <h2>
            KUAFÖR
            <br />
            Randevu
            <br />
            <em>Sistemi</em>
          </h2>

          <p>
            Randevunuzu kolayca oluşturun,
            personelinizi seçin ve tüm
            randevularınızı tek ekrandan yönetin.
          </p>
        </div>


      </section>


      {/* SAĞ TARAF */}
      <section className="auth-form-side">

        <div className="auth-card">

          <div className="auth-heading">

            <span className="auth-eyebrow">
              RANDEVU SİSTEMİ
            </span>

            <h1>
              {mode === "login"
                ? "Hoş Geldiniz"
                : "Bize Katılın"}
            </h1>

            <p>
              {mode === "login"
                ? "Randevularınıza erişmek için giriş yapınız."
                : "Hesabınızı oluşturun ve randevularınızı kolayca yönetin."}
            </p>

          </div>


          {/* TABLAR */}

          <div className="auth-tabs">

            <button
              type="button"
              className={`auth-tab ${
                mode === "login" ? "active" : ""
              }`}
              onClick={() => switchMode("login")}
            >
              Giriş Yap
            </button>

            <button
              type="button"
              className={`auth-tab ${
                mode === "register" ? "active" : ""
              }`}
              onClick={() => switchMode("register")}
            >
              Kayıt Ol
            </button>

          </div>


          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              <strong>✓ Başarılı</strong>
              <span>{success}</span>
            </div>
          )}


          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            <div className="field">

              <label>Kullanıcı Adı</label>

              <div className="input-wrap">

                <input
                  className="input has-icon"
                  type="text"
                  placeholder="Örn. Nihal Okumuş"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  autoComplete="username"
                />

              </div>

            </div>


            {mode === "register" && (
              <div className="field">

                <label>E-posta Adresi</label>

                <div className="input-wrap">

                  <span className="input-icon">
                    ✉
                  </span>

                  <input
                    className="input has-icon"
                    type="email"
                    placeholder="ornek@gmail.com"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoComplete="email"
                  />

                </div>

              </div>
            )}


            <div className="field">

              <label>Şifre</label>

              <div className="input-wrap">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  className="input has-icon"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                />

              </div>

            </div>


            {mode === "register" && (
              <div className="field">

                <label>Şifre Tekrar</label>

                <div className="input-wrap">

                  <span className="input-icon">
                    🔒
                  </span>

                  <input
                    className="input has-icon"
                    type="password"
                    placeholder="••••••••"
                    value={passwordAgain}
                    onChange={(e) =>
                      setPasswordAgain(e.target.value)
                    }
                    autoComplete="new-password"
                  />

                </div>

              </div>
            )}


            {mode === "login" && (
              <div className="forgot-password">
                Şifremi unuttum
              </div>
            )}


            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Lütfen bekleyin..."
                : mode === "login"
                  ? "Giriş Yap"
                  : "Hesap Oluştur"}
            </button>

          </form>


          <div className="auth-alt">

            {mode === "login" ? (
              <>
                Hesabınız yok mu?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("register")}
                >
                  Kayıt olun
                </button>
              </>
            ) : (
              <>
                Zaten hesabınız var mı?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("login")}
                >
                  Giriş yapın
                </button>
              </>
            )}

          </div>


          <button
            type="button"
            className="guest-button"
            onClick={onGuestContinue}
          >
            Şimdilik giriş yapmadan devam et →
          </button>

        </div>

      </section>

    </div>
  );
}

export default Auth;