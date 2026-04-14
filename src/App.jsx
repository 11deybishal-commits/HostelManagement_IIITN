import { useState } from "react";
import Home from "./components/Home";
import ComplaintForm from "./components/ComplaintForm";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminRegister from "./components/AdminRegister";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { authStorage } from "./api";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [adminToken, setAdminToken] = useState(authStorage.getToken());

  const handleAdminLogin = (token) => {
    setAdminToken(token);
    authStorage.setToken(token);
    setPage("admin");
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    authStorage.removeToken();
    authStorage.removeAdmin();
    setPage("home");
  };

  return (
    <div className="hf-app-shell">
      <Navbar
        page={page}
        isAdmin={!!adminToken}
        onNavigate={setPage}
        onLogout={handleAdminLogout}
      />

      <main className="hf-main-area">
        {page === "home" && (
          <Home
            onComplaint={() => setPage("complaint")}
            onExit={() => alert("Exit flow coming next")}
            onAdmin={() => setPage("admin-login")}
          />
        )}

        {page === "complaint" && <ComplaintForm onBack={() => setPage("home")} />}

        {page === "admin-login" && !adminToken && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setPage("home")}
            onRegisterNow={() => setPage("admin-register")}
          />
        )}

        {page === "admin-register" && !adminToken && (
          <AdminRegister
            onRegister={handleAdminLogin}
            onBack={() => setPage("admin-login")}
          />
        )}

        {page === "admin" && adminToken && <AdminDashboard onLogout={handleAdminLogout} />}

        {page === "admin" && !adminToken && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onBack={() => setPage("home")}
            onRegisterNow={() => setPage("admin-register")}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
