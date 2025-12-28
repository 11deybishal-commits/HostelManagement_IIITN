import { useState } from "react";

export default function Complaint({ onBack }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const isValid = category !== "" && description.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;

    console.log("Complaint Submitted:", {
      category,
      description,
      time: new Date().toISOString(),
    });

    alert("Complaint submitted successfully ✅");
    onBack();
  };

  return (
    <div style={page}>
      <form style={card} onSubmit={handleSubmit}>
        <h1 style={title}>📝 Raise a Complaint</h1>

        {/* CATEGORY */}
        <label style={label}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={select}
        >
          <option value="">Select Category</option>
          <option>Electricity</option>
          <option>Water</option>
          <option>Cleaning</option>
          <option>Internet</option>
          <option>Other</option>
        </select>

        {/* DESCRIPTION */}
        <label style={label}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue..."
          style={textarea}
        />
        {description.trim() === "" && (
          <span style={error}>Description is required</span>
        )}

        {/* ACTIONS */}
        <div style={actions}>
          <button
            type="submit"
            disabled={!isValid}
            style={{
              ...submitBtn,
              opacity: isValid ? 1 : 0.5,
              cursor: isValid ? "pointer" : "not-allowed",
            }}
          >
            Submit
          </button>

          <button type="button" style={backBtn} onClick={onBack}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top, #020617, #000)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const card = {
  width: "420px",
  background: "#181818",
  padding: "32px",
  borderRadius: "18px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  display: "flex",
  flexDirection: "column",
};

const title = {
  marginBottom: "24px",
};

const label = {
  marginBottom: "6px",
  fontSize: "0.9rem",
  opacity: 0.8,
};

const select = {
  background: "#262626",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #333",
  marginBottom: "18px",
};

const textarea = {
  background: "#262626",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #333",
  minHeight: "100px",
};

const error = {
  color: "#f87171",
  fontSize: "0.8rem",
  marginTop: "6px",
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "24px",
};

const submitBtn = {
  background: "#22c55e",
  color: "white",
  padding: "12px 22px",
  borderRadius: "10px",
  border: "none",
};

const backBtn = {
  background: "transparent",
  color: "white",
  border: "1px solid #444",
  padding: "12px 22px",
  borderRadius: "10px",
};
