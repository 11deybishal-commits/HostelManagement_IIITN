import { motion } from "framer-motion";
import iiitLogo from "../assets/iiitn-logo.png";

export default function Navbar({ page, isAdmin, onNavigate, onLogout }) {
  return (
    <motion.header
      className="hf-navbar"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="hf-brand" onClick={() => onNavigate("home")}>
        <img src={iiitLogo} alt="IIITN" className="hf-brand-logo" />
        <div>
          <p className="hf-brand-title">HostelFlow</p>
          <p className="hf-brand-subtitle">Smart Living & Administration</p>
        </div>
      </div>

      <nav className="hf-nav-actions">
        <button className={page === "home" ? "hf-nav-btn active" : "hf-nav-btn"} onClick={() => onNavigate("home")}>
          Home
        </button>
        <button className={page === "complaint" ? "hf-nav-btn active" : "hf-nav-btn"} onClick={() => onNavigate("complaint")}>
          Raise Complaint
        </button>
        {!isAdmin && (
          <button className={page === "admin-login" ? "hf-nav-btn active" : "hf-nav-btn"} onClick={() => onNavigate("admin-login")}>
            Admin
          </button>
        )}
        {isAdmin && (
          <>
            <button className={page === "admin" ? "hf-nav-btn active" : "hf-nav-btn"} onClick={() => onNavigate("admin")}>
              Dashboard
            </button>
            <button className="hf-nav-btn hf-logout" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </nav>
    </motion.header>
  );
}
