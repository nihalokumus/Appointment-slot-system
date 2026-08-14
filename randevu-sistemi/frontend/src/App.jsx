import { useState } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import Layout from "./components/layout/Layout";
import Auth from "./components/Auth";

import Dashboard from "./pages/Dashboard";
import NewAppointment from "./pages/NewAppointment";
import MyAppointments from "./pages/MyAppointments";
import Services from "./pages/Services";
import Personnels from "./pages/Personnels";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Routes>

      {/* E-posta doğrulama */}
      <Route
        path="/verify-email/:uid/:token"
        element={<VerifyEmail />}
      />

      {/* Giriş yapılmamış kullanıcı */}
      {!isLoggedIn && (
        <Route
          path="*"
          element={
            <Auth
              onAuthenticated={() => {
                setIsLoggedIn(true);
              }}
              onGuestContinue={() => {
                setIsLoggedIn(true);
              }}
            />
          }
        />
      )}

      {/* Giriş yapılmış kullanıcı */}
      {isLoggedIn && (
        <Route path="/" element={<Layout />}>

          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="new-appointment"
            element={<NewAppointment />}
          />

          <Route
            path="my-appointments"
            element={<MyAppointments />}
          />

          <Route
            path="services"
            element={<Services />}
          />

          <Route
            path="personnels"
            element={<Personnels />}
          />

          <Route
            path="profile"
            element={<Profile />}
          />

        </Route>
      )}

    </Routes>
  );
}

export default App;