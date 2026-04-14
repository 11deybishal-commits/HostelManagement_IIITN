import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { adminAPI } from "../api";

export default function AdminLogin({ onLogin, onBack, onRegisterNow }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await adminAPI.login(email.trim().toLowerCase(), password.trim());
      onLogin(response.token);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section className="hf-pane hf-narrow" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="hf-pane-header">
        <button className="ghost" onClick={onBack}>Back</button>
        <div>
          <h2>Admin Portal</h2>
          <p>Secure access for hostel operations</p>
        </div>
      </div>

      <form className="hf-form" onSubmit={handleLogin}>
        {error && <div className="hf-error">{error}</div>}

        <div className="hf-grid one">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@iiitn.ac.in"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              autoComplete="current-password"
              required
            />
          </label>
        </div>

        <div className="hf-actions">
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", width: "100%" }}>
            <button type="submit" className="accent" disabled={loading}>
              {loading ? "Logging in..." : "Sign In"}
            </button>
            <button type="button" className="ghost" onClick={onRegisterNow}>
              Register Now
            </button>
          </div>
        </div>
      </form>
    </motion.section>
  );
}
