import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function ComplaintForm({ onBack }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submittedId, setSubmittedId] = useState(null);
  const [error, setError] = useState("");

  const [studentProfile, setStudentProfile] = useState({
    name: "Student Name",
    roll: "IIITN-2025-XXX",
    hostel: "Hostel A",
    room: "204",
  });

  const [priority, setPriority] = useState("Low");

  const generateComplaintId = () => {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `IIITN-2025-${random}`;
  };

  const detectPriority = (text) => {
    const t = text.toLowerCase();
    if (t.includes("urgent") || t.includes("danger") || t.includes("fire") || t.includes("electric"))
      return "High";
    if (t.includes("water") || t.includes("internet") || t.includes("clean"))
      return "Medium";
    return "Low";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !description.trim()) {
      setError("Please fill all required fields");
      return;
    }

    const id = generateComplaintId();

    try {
      await addDoc(collection(db, "complaints"), {
        complaintId: id,
        ...studentProfile,
        category,
        description,
        priority,
        status: "Submitted",
        createdAt: serverTimestamp(),
      });

      setSubmittedId(id);
      setCategory("");
      setDescription("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to submit complaint");
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>📝 Raise a Complaint</h1>

        <div style={profileBox}>
          <input style={profileInput} value={studentProfile.name}
            onChange={(e) => setStudentProfile({ ...studentProfile, name: e.target.value })} />
          <input style={profileInput} value={studentProfile.roll}
            onChange={(e) => setStudentProfile({ ...studentProfile, roll: e.target.value })} />
          <input style={profileInput} value={studentProfile.hostel}
            onChange={(e) => setStudentProfile({ ...studentProfile, hostel: e.target.value })} />
          <input style={profileInput} value={studentProfile.room}
            onChange={(e) => setStudentProfile({ ...studentProfile, room: e.target.value })} />
        </div>

        <form onSubmit={handleSubmit}>
          <label style={label}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={select}>
            <option value="">Select Category</option>
            <option>Electricity</option>
            <option>Water</option>
            <option>Cleaning</option>
            <option>Internet</option>
            <option>Other</option>
          </select>

          <label style={label}>Description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setPriority(detectPriority(e.target.value));
            }}
            style={textarea}
            placeholder="Describe your issue..."
          />

          <div style={priorityBadge(priority)}>Priority: {priority}</div>

          {error && <p style={errorText}>{error}</p>}

          <div style={btnRow}>
            <button type="submit" style={submitBtn}>Submit</button>
            <button type="button" style={backBtn} onClick={onBack}>Back</button>
          </div>
        </form>
      </div>

      {submittedId && (
        <div style={overlay}>
          <div style={modal}>
            <h2>✅ Complaint Submitted</h2>
            <strong style={complaintId}>{submittedId}</strong>
            <button style={okBtn} onClick={() => setSubmittedId(null)}>OK</button>
          </div>
        </div>
      )}
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
  overflowX: "hidden",      
  padding: "20px",          
};


const card = {
  width: "420px",
  padding: "30px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.05)",
  boxShadow: "0 0 40px rgba(0,0,0,0.6)",
  color: "#fff",
};

const title = { marginBottom: "20px" };
const label = { marginTop: "14px", marginBottom: "6px", opacity: 0.8 };

const select = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  background: "#1f2933",
  color: "white",
  border: "1px solid #334155",
};

const textarea = {
  width: "100%",
  minHeight: "110px",
  padding: "12px",
  borderRadius: "10px",
  background: "#1f2933",
  color: "white",
  border: "1px solid #334155",
};

const btnRow = { display: "flex", justifyContent: "space-between", marginTop: "20px" };

const submitBtn = {
  padding: "12px 22px",
  borderRadius: "10px",
  background: "#22c55e",
  border: "none",
  cursor: "pointer",
};

const backBtn = {
  padding: "12px 22px",
  borderRadius: "10px",
  background: "transparent",
  border: "1px solid #475569",
  color: "white",
};

const errorText = { color: "#f87171", marginTop: "8px" };

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "#020617",
  padding: "30px",
  borderRadius: "16px",
  textAlign: "center",
};

const complaintId = { color: "#38bdf8", margin: "10px 0", display: "block" };

const okBtn = {
  marginTop: "12px",
  padding: "8px 20px",
  borderRadius: "10px",
  background: "#38bdf8",
  border: "none",
};

const profileBox = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "6px",
  marginBottom: "12px",
};

const profileInput = {
  padding: "6px",
  borderRadius: "6px",
  background: "#020617",
  border: "1px solid #334155",
  color: "white",
};

const priorityBadge = (p) => ({
  marginTop: "8px",
  padding: "6px 10px",
  borderRadius: "8px",
  fontWeight: "bold",
  background:
    p === "High" ? "rgba(248,113,113,0.15)" :
    p === "Medium" ? "rgba(250,204,21,0.15)" :
    "rgba(74,222,128,0.15)",
  color:
    p === "High" ? "#f87171" :
    p === "Medium" ? "#facc15" :
    "#4ade80",
});
