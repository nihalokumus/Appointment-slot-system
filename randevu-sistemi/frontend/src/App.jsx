import { Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import NewAppointment from "./pages/NewAppointment";
import MyAppointments from "./pages/MyAppointments";
import Services from "./pages/Services";
import Personnels from "./pages/Personnels";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />

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
    </Routes>
  );
}

export default App;