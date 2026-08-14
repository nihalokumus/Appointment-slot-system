import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 70px)",
          background: "#fafafa",
        }}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />

        <main
          style={{
            flex: 1,
            padding: "30px",
            minWidth: 0,
          }}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default Layout;