import { useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { complaintAPI } from "../api";

export default function Home({ onComplaint, onExit, onAdmin }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    try {
      const data = await complaintAPI.getLiveSummary();
      setSummary(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to load live data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const intervalId = setInterval(fetchSummary, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const quickStats = useMemo(() => {
    const averageMinutes = summary?.avgResolutionMinutes ?? 0;

    return [
      { label: "Total Complaints", value: summary?.totalComplaints ?? 0, tone: "warm" },
      { label: "Filed Today", value: summary?.todayFiled ?? 0, tone: "mint" },
      { label: "Resolved Today", value: summary?.todayResolved ?? 0, tone: "sunset" },
      { label: "Open Critical", value: summary?.openCritical ?? 0, tone: "rose" },
      { label: "Avg. Resolution", value: averageMinutes ? `${averageMinutes} min` : "N/A", tone: "warm" },
    ];
  }, [summary]);

  const weeklyTrend = summary?.weeklyTrend ?? [];
  const categoryBreakup = (summary?.categoryBreakup ?? []).map((item) => ({
    name: item._id,
    value: item.count,
  }));

  return (
    <div className="hf-home">
      <motion.section
        className="hf-hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <div className="hf-hero-text">
          <p className="hf-kicker">Warm Theme | AI Assisted Operations</p>
          <h1>Hostel Complaints, Reimagined for Comfort and Speed</h1>
          <p>
            A polished command center for students and wardens with richer analytics, smoother workflow,
            and deep-learning assisted priority prediction.
          </p>
          <p style={{ marginTop: 8, opacity: 0.85 }}>
            {loading ? "Syncing live complaint data..." : error ? error : `Live data refreshed at ${summary?.updatedAt ? new Date(summary.updatedAt).toLocaleTimeString() : "now"}`}
          </p>
          <div className="hf-hero-buttons">
            <motion.button whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onComplaint}>
              Raise Complaint
            </motion.button>
            <motion.button
              className="secondary"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onExit}
            >
              Request Exit
            </motion.button>
            <motion.button
              className="accent"
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAdmin}
            >
              Open Admin
            </motion.button>
          </div>
        </div>

        <div className="hf-hero-glow" aria-hidden="true" />
      </motion.section>

      <motion.section
        className="hf-stat-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {quickStats.map((stat, index) => (
          <motion.article
            key={stat.label}
            className={`hf-stat-card ${stat.tone}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 * index }}
            whileHover={{ y: -5 }}
          >
            <p>{stat.label}</p>
            <h3>{stat.value}</h3>
          </motion.article>
        ))}
      </motion.section>

      <section className="hf-chart-grid">
        <motion.article
          className="hf-chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
        >
          <div className="hf-chart-header">
            <h2>Weekly Performance</h2>
            <span>Submitted vs Resolved</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="warmSubmitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="warmResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1dfcf" />
              <XAxis dataKey="day" stroke="#7c4a1d" />
              <YAxis stroke="#7c4a1d" />
              <Tooltip />
              <Area type="monotone" dataKey="submitted" stroke="#f97316" fill="url(#warmSubmitted)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="url(#warmResolved)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.article>

        <motion.article
          className="hf-chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
        >
          <div className="hf-chart-header">
            <h2>Complaint Mix</h2>
            <span>By Category</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryBreakup}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1dfcf" />
              <XAxis dataKey="name" stroke="#7c4a1d" />
              <YAxis stroke="#7c4a1d" />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </motion.article>
      </section>
    </div>
  );
}
