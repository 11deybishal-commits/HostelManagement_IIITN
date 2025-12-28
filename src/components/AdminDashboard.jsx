import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminBoard({ onBack }) {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const snap = await getDocs(collection(db, "complaints"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setComplaints(list);
    };
    fetchComplaints();
  }, []);

  const updateStatus = async (docId, newStatus) => {
    await updateDoc(doc(db, "complaints", docId), {
      status: newStatus,
    });
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === docId ? { ...c, status: newStatus } : c
      )
    );
  };

  /* 🔹 GRAPH DATA (AUTO FROM FIREBASE) */
  const priorityData = [
    {
      name: "Low",
      count: complaints.filter((c) => c.priority === "Low").length,
    },
    {
      name: "Medium",
      count: complaints.filter((c) => c.priority === "Medium").length,
    },
    {
      name: "High",
      count: complaints.filter((c) => c.priority === "High").length,
    },
  ];

  return (
    <div style={page}>
      <div style={card}>
        {/* 🔹 HEADER */}
        <div style={header}>
          <div style={{ width: "120px" }} />
          <h1 style={title}>🛠️ Admin Dashboard</h1>
          <button style={backBtn} onClick={onBack}>
            ← Back
          </button>
        </div>

        {/* 🔹 TABLE */}
        <table style={table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id}>
                <td><div style={cellValue}>{c.complaintId}</div></td>
                <td><div style={cellValue}>{c.name}</div></td>
                <td><div style={cellValue}>{c.category}</div></td>
                <td>
                  <div
                    style={{
                      ...cellValue,
                      fontWeight: "bold",
                      color:
                        c.priority === "High"
                          ? "#f87171"
                          : c.priority === "Medium"
                          ? "#facc15"
                          : "#4ade80",
                    }}
                  >
                    {c.priority}
                  </div>
                </td>
                <td><div style={cellValue}>{c.status}</div></td>
                <td>
                  <select
                    value={c.status}
                    onChange={(e) => updateStatus(c.id, e.target.value)}
                  >
                    <option>Submitted</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 🔹 GRAPH SECTION */}
        <div style={graphSection}>
          <h3 style={graphTitle}>📊 Complaint Priority Overview</h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={priorityData}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

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
  alignItems: "flex-start",
  background: "radial-gradient(circle at top, #020617, #000)",
};

const card = {
  width: "90%",
  maxWidth: "1100px",
  marginTop: "40px",
  padding: "30px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.05)",
  color: "white",
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "24px",
};

const title = {
  margin: 0,
  textAlign: "center",
  flexGrow: 1,
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const backBtn = {
  padding: "10px 22px",
  borderRadius: "10px",
  border: "none",
  background: "#38bdf8",
  cursor: "pointer",
};

const cellValue = {
  marginTop: "6px",
  fontSize: "15px",
  textAlign: "center",
};

/* 🔹 GRAPH STYLES (NEW, SAFE) */
const graphSection = {
  marginTop: "40px",
  paddingTop: "20px",
  borderTop: "1px solid rgba(255,255,255,0.1)",
};

const graphTitle = {
  textAlign: "center",
  marginBottom: "16px",
  opacity: 0.85,
};
