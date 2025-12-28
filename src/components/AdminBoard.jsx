export default function AdminBoard({ onBack }) {
  return (
    <div style={page}>
      <div style={dashboard}>
        <h1 style={title}>🛠 Admin Dashboard</h1>

        {/* STATS */}
        <div style={statsRow}>
          <div style={statCard}>
            <h3>Total Complaints</h3>
            <p style={{ fontSize: 22 }}>12</p>
          </div>

          <div style={statCard}>
            <h3>High Priority</h3>
            <p style={{ fontSize: 22, color: "red" }}>3</p>
          </div>

          <div style={statCard}>
            <h3>Resolved</h3>
            <p style={{ fontSize: 22, color: "lightgreen" }}>5</p>
          </div>
        </div>

        {/* COMPLAINT TABLE */}
        <table style={table}>
          <thead>
            <tr>
              <th style={thTd}>ID</th>
              <th style={thTd}>Category</th>
              <th style={thTd}>Priority</th>
              <th style={thTd}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={thTd}>IIITN-2025-9779</td>
              <td style={thTd}>Cleaning</td>
              <td style={{ ...thTd, color: "lightgreen" }}>Low</td>
              <td style={thTd}>Open</td>
            </tr>

            <tr>
              <td style={thTd}>IIITN-2025-9821</td>
              <td style={thTd}>Electricity</td>
              <td style={{ ...thTd, color: "red" }}>High</td>
              <td style={thTd}>In Progress</td>
            </tr>
          </tbody>
        </table>

        <button style={backBtn} onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "radial-gradient(circle, #020617, #000)",
};

const dashboard = {
  width: "90%",
  maxWidth: "1000px",
  padding: "30px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 0 50px rgba(0,0,0,0.7)",
  color: "white",
};

const title = {
  marginBottom: "30px",
  fontSize: "2.2rem",
};

const statsRow = {
  display: "flex",
  gap: "20px",
  marginBottom: "30px",
};

const statCard = {
  flex: 1,
  padding: "20px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.08)",
  textAlign: "center",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "30px",
  tableLayout: "fixed",
};

const thTd = {
  padding: "14px 10px",
  textAlign: "center",
  width: "25%",
  fontSize: "1rem",
};

const backBtn = {
  padding: "12px 24px",
  borderRadius: "10px",
  background: "transparent",
  border: "1px solid #475569",
  color: "white",
  cursor: "pointer",
};
