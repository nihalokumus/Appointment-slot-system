import { useEffect, useState } from "react";

function Profile() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user || "Kullanıcı");
  }, []);

  const initial = username.charAt(0).toUpperCase();

  return (
    <div className="profile-page">

      <div className="profile-header">
        <div>
          <span className="profile-eyebrow">HESABIM</span>
          <h1>Profilim</h1>
          <p>Hesap bilgilerinizi buradan görüntüleyebilirsiniz.</p>
        </div>
      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          {initial}
        </div>

        <div className="profile-main">
          <h2>{username}</h2>
          <span className="profile-role">Müşteri</span>
        </div>

      </div>

      <div className="profile-info-card">

        <h3>Kullanıcı Bilgileri</h3>

        <div className="profile-info-row">
          <div>
            <span className="info-label">Kullanıcı Adı</span>
            <span className="info-value">{username}</span>
          </div>
        </div>

        <div className="profile-info-row">
          <div>
            <span className="info-label">Rol</span>
            <span className="info-value">Müşteri</span>
          </div>
        </div>

        <div className="profile-info-row">
          <div>
            <span className="info-label">Hesap Durumu</span>
            <span className="info-value status-active">
              ● Aktif
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Profile;