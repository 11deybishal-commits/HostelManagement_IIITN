import { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { complaintAPI } from "../api";
import { initializePriorityModel, predictPriorityLstm } from "../ml/priorityLstm";

export default function ComplaintForm({ onBack }) {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [submittedId, setSubmittedId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modelState, setModelState] = useState("Fast AI mode active");

  const [studentProfile, setStudentProfile] = useState({
    name: "Student Name",
    roll: "IIITN-2025-XXX",
    hostel: "Hostel A",
    room: "204",
    email: "",
    phone: "",
  });

  const [priorityPrediction, setPriorityPrediction] = useState({
    label: "Low",
    confidence: 0,
    probabilities: [1, 0, 0],
  });

  useEffect(() => {
    let active = true;
    initializePriorityModel()
      .then((result) => {
        if (!active) return;
        if (result?.model) {
          setModelState("Hybrid model ready: LSTM + safety rules active");
          return;
        }
        setModelState("Safety rules active (fast mode)");
      })
      .catch(() => {
        if (active) setModelState("Hybrid fallback active");
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!description.trim()) {
      setPriorityPrediction({ label: "Low", confidence: 0, probabilities: [1, 0, 0] });
      return;
    }

    let canceled = false;
    const timer = setTimeout(async () => {
      try {
        const result = await predictPriorityLstm(`${category} ${description}`);
        if (!canceled) {
          setPriorityPrediction(result);
        }
      } catch {
        console.error("Priority prediction failed");
      }
    }, 300);

    return () => {
      canceled = true;
      clearTimeout(timer);
    };
  }, [category, description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !description.trim()) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await complaintAPI.createComplaint({
        studentName: studentProfile.name,
        studentRoll: studentProfile.roll,
        hostel: studentProfile.hostel,
        room: studentProfile.room,
        email: studentProfile.email,
        phone: studentProfile.phone,
        category,
        description,
        priority: priorityPrediction.label,
      });

      setSubmittedId(response.complaintId);
      setCategory("");
      setDescription("");
    } catch (err) {
      setError(err.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section className="hf-pane" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="hf-pane-header">
        <button className="ghost" onClick={onBack}>Back</button>
        <div>
          <h2>Raise a Complaint</h2>
          <p>Deep-learning assisted priority prediction with LSTM</p>
        </div>
      </div>

      {submittedId ? (
        <motion.div className="hf-success-block" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <h3>Complaint Submitted Successfully</h3>
          <p>Your complaint ID</p>
          <strong>{submittedId}</strong>
          <button onClick={onBack}>Return Home</button>
        </motion.div>
      ) : (
        <form className="hf-form" onSubmit={handleSubmit}>
          {error && <div className="hf-error">{error}</div>}

          <div className="hf-grid two">
            <label>
              Name
              <input value={studentProfile.name} onChange={(e) => setStudentProfile({ ...studentProfile, name: e.target.value })} />
            </label>
            <label>
              Roll Number
              <input value={studentProfile.roll} onChange={(e) => setStudentProfile({ ...studentProfile, roll: e.target.value })} />
            </label>
            <label>
              Hostel
              <input value={studentProfile.hostel} onChange={(e) => setStudentProfile({ ...studentProfile, hostel: e.target.value })} />
            </label>
            <label>
              Room
              <input value={studentProfile.room} onChange={(e) => setStudentProfile({ ...studentProfile, room: e.target.value })} />
            </label>
            <label>
              Email
              <input
                type="email"
                value={studentProfile.email}
                onChange={(e) => setStudentProfile({ ...studentProfile, email: e.target.value })}
              />
            </label>
            <label>
              Phone
              <input value={studentProfile.phone} onChange={(e) => setStudentProfile({ ...studentProfile, phone: e.target.value })} />
            </label>
          </div>

          <div className="hf-grid one">
            <label>
              Category *
              <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select category</option>
                <option>Electricity</option>
                <option>Water</option>
                <option>Cleaning</option>
                <option>Internet</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Description *
              <textarea
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue with details such as urgency, risk, location and impact"
                required
              />
            </label>
          </div>

          <motion.div className="hf-ai-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="hf-ai-chip">AI ENGINE: {modelState}</p>
            <div className="hf-ai-row">
              <div>
                <p className="hf-ai-label">Predicted Priority</p>
                <h3 className={`hf-priority ${priorityPrediction.label.toLowerCase()}`}>{priorityPrediction.label}</h3>
              </div>
            </div>
            <p className="hf-ai-label" style={{ marginTop: "0.65rem" }}>Priority updates automatically while you type.</p>
          </motion.div>

          <div className="hf-actions">
            <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit Complaint"}</button>
          </div>
        </form>
      )}
    </motion.section>
  );
}
