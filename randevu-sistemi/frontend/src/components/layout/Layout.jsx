import Header from "./Header";
import Sidebar from "./Sidebar";

import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          minHeight: "90vh",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px",
          }}
        >
          {/* hangi sayfadaysak onu yerleştir */}
          <Outlet /> 
        </div>
      </div>
    </>
  );
}

export default Layout;