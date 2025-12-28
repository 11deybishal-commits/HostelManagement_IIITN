import { motion } from "framer-motion";
import iiitLogo from "../assets/iiitn-logo.png";

export default function Home({ onComplaint, onExit, onAdmin }) {
  return (
    <div style={container}>
      {/* Background Watermark */}
      <img src={iiitLogo} alt="IIIT Nagpur" style={logoWatermark} />

      {/* CONTENT */}
      <div style={contentWrapper}>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={title}
        >
          INDIAN INSTITUTE OF INFORMATION TECHNOLOGY, NAGPUR
          <p style={subHeading}>
            <em>An Institute of National Importance by Act of Parliament</em>
          </p>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={subtitle}
        >
          Smart Hostel Management System
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={btnGroup}
        >
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            style={primaryBtn}
            onClick={onComplaint}
          >
            Raise Complaint
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            style={secondaryBtn}
            onClick={onExit}
          >
            Request Exit
          </motion.button>

          {/* ✅ ADMIN BOARD (ONLY ADDITION) */}
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            style={adminBtn}
            onClick={onAdmin}
          >
            🛠 Admin Board
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  height: "100vh",
  width: "100vw",
  background: "radial-gradient(circle at center, #020617 0%, #000000 70%)",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const contentWrapper = {
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const title = {
  fontSize: "2.6rem",   // 🔧 reduced (as you asked earlier)
  fontWeight: "700",
  color: "#ffffff",
  maxWidth: "900px",
};

const subHeading = {
  marginTop: "12px",
  fontSize: "1.1rem",
  opacity: 0.75,
};

const subtitle = {
  marginTop: "18px",
  fontSize: "1.1rem",
  color: "rgba(255,255,255,0.75)",
};

const btnGroup = {
  display: "flex",
  gap: "22px",
  marginTop: "42px",
  flexWrap: "wrap",
  justifyContent: "center",
};

const primaryBtn = {
  padding: "14px 30px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #38bdf8, #2563eb)",
  color: "#fff",
  fontSize: "1rem",
  cursor: "pointer",
};

const secondaryBtn = {
  padding: "14px 30px",
  borderRadius: "14px",
  border: "1px solid #334155",
  background: "rgba(255,255,255,0.05)",
  color: "#fff",
  fontSize: "1rem",
  cursor: "pointer",
};

const adminBtn = {
  padding: "14px 30px",
  borderRadius: "14px",
  border: "2px solid #38bdf8",
  background: "rgba(56,189,248,0.08)",
  color: "#38bdf8",
  fontSize: "1rem",
  cursor: "pointer",
};

/* Watermark */
const logoWatermark = {
  position: "absolute",
  width: "420px",
  height: "420px",
  opacity: 0.05,
  borderRadius: "50%",
  objectFit: "cover",
  filter: "grayscale(100%)",
  pointerEvents: "none",
};
