import { useEffect, useState } from "react";

function Profile() {

  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user);
  }, []);

  return (
    <>
      <h1>👤 Profil</h1>

      <div className="card">

        <h3>Kullanıcı Bilgileri</h3>

        <p>
          <strong>Kullanıcı Adı:</strong> {username}
        </p>

        <p>
          <strong>Rol:</strong> Müşteri
        </p>

      </div>
    </>
  );
}

export default Profile;