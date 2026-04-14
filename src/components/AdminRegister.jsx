import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { adminAPI } from "../api";

export default function AdminRegister({ onRegister, onBack }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await adminAPI.register({
        ...form,
        email: form.email.trim().toLowerCase(),
        password: form.password.trim(),
        name: form.name.trim(),
        department: form.department.trim(),
      });
      onRegister(response.token);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section className="hf-pane hf-narrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="hf-pane-header">
        <button className="ghost" onClick={onBack}>Back</button>
        <div>
          <h2>Register Admin</h2>
          <p>Create a new admin account</p>
        </div>
      </div>

      <form className="hf-form" onSubmit={handleSubmit}>
        {error && <div className="hf-error">{error}</div>}

        <div className="hf-grid one">
          <label>
            Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Hostel Administrator"
              autoComplete="name"
              required
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@iiitn.ac.in"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            Department
            <input
              type="text"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Hostel Administration"
            />
          </label>
        </div>

        <div className="hf-actions" style={{ justifyContent: "space-between" }}>
          <button type="button" className="ghost" onClick={onBack}>Cancel</button>
          <button type="submit" className="accent" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </div>
      </form>
    </motion.section>
  );
}