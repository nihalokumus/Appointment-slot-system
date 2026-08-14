import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { verifyEmail } from "../services/api";
import "./VerifyEmail.css";

function VerifyEmail() {
  const { uid, token } = useParams();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(uid, token);

        setStatus("success");
        setMessage(
          response.data.message ||
            "E-posta adresiniz başarıyla doğrulandı."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.error ||
            "Doğrulama bağlantısı geçersiz veya süresi dolmuş."
        );
      }
    };

    verify();
  }, [uid, token]);

  return (
    <div className="verify-page">
      <div className="verify-card">

        <div className="verify-logo">
          ✂
        </div>

        {status === "loading" && (
          <>
            <h1>E-posta doğrulanıyor</h1>
            <p>
              Lütfen birkaç saniye bekleyin...
            </p>
          </>
        )}

        {status === "success" && (
          <>

            <h1>E-postanız doğrulandı!</h1>

            <p>
              Hesabınız başarıyla aktifleştirildi.
              Giriş yapabilirsiniz.
            </p>

            <Link
              to="/"
              className="verify-button"
            >
              Giriş Yap
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="verify-icon error-icon">
              !
            </div>

            <h1>Doğrulama başarısız</h1>

            <p>{message}</p>

            <Link
              to="/"
              className="verify-button"
            >
              Giriş Sayfasına Dön
            </Link>
          </>
        )}

      </div>
    </div>
  );
}

export default VerifyEmail;