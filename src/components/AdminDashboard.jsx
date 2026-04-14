import { useCallback, useEffect, useMemo, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { complaintAPI, authStorage } from "../api";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#f59e0b", "#fb7185", "#22c55e", "#38bdf8", "#8b5cf6", "#f97316"];

export default function AdminDashboard({ onLogout }) {
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState({ category: [], status: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");
  const token = authStorage.getToken();

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      const data = await complaintAPI.getAllComplaints(token);
      setComplaints(data);
    } catch (err) {
      setError(err.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchAnalytics = useCallback(async () => {
    try {
      const categoryData = await complaintAPI.getAnalyticsByCategory(token);
      const statusData = await complaintAPI.getAnalyticsByStatus(token);
      setAnalytics({ category: categoryData, status: statusData });
    } catch (err) {
      setError(err.message || "Failed to fetch analytics");
    }
  }, [token]);

  useEffect(() => {
    fetchComplaints();
    fetchAnalytics();
  }, [fetchComplaints, fetchAnalytics]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchComplaints();
      fetchAnalytics();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [fetchComplaints, fetchAnalytics]);

  const updateComplaintStatus = async (complaintId, newStatus) => {
    if (!newStatus) return;
    try {
      await complaintAPI.updateComplaintStatus(complaintId, { status: newStatus }, token);
      fetchComplaints();
      fetchAnalytics();
    } catch (err) {
      setError(err.message || "Failed to update complaint");
    }
  };

  const trendData = useMemo(() => {
    const map = new Map();
    complaints.forEach((c) => {
      const key = new Date(c.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!map.has(key)) {
        map.set(key, { day: key, submitted: 0, resolved: 0 });
      }
      const item = map.get(key);
      item.submitted += 1;
      if (c.status === "Resolved") item.resolved += 1;
    });
    return Array.from(map.values()).slice(-8);
  }, [complaints]);

  const todaySummary = useMemo(() => {
    const todayKey = new Date().toDateString();
    const todaysComplaints = complaints.filter((c) => new Date(c.createdAt || Date.now()).toDateString() === todayKey);
    const todayResolved = complaints.filter(
      (c) => c.status === "Resolved" && new Date(c.resolvedAt || c.updatedAt || c.createdAt || Date.now()).toDateString() === todayKey,
    );

    return {
      todayFiled: todaysComplaints.length,
      todayResolved: todayResolved.length,
      pending: complaints.filter((c) => c.status !== "Resolved").length,
    };
  }, [complaints]);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const statusMatch = selectedStatus === "All" || c.status === selectedStatus;
      const searchTarget = `${c.complaintId} ${c.studentName} ${c.category}`.toLowerCase();
      const searchMatch = searchTarget.includes(search.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [complaints, selectedStatus, search]);

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      critical: complaints.filter((c) => c.priority === "High" && c.status !== "Resolved").length,
      progress: complaints.filter((c) => c.status === "In Progress").length,
      resolvedRate: complaints.length
        ? Math.round((complaints.filter((c) => c.status === "Resolved").length / complaints.length) * 100)
        : 0,
    };
  }, [complaints]);

  return (
    <section className="hf-pane">
      <div className="hf-pane-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Interactive monitoring, filtering and action center</p>
        </div>
        <button className="accent" onClick={onLogout}>Logout</button>
      </div>

      {error && <div className="hf-error">{error}</div>}

      {loading ? (
        <div className="hf-loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="hf-stat-grid">
            <article className="hf-stat-card warm"><p>Total Complaints</p><h3>{stats.total}</h3></article>
            <article className="hf-stat-card rose"><p>Open Critical</p><h3>{stats.critical}</h3></article>
            <article className="hf-stat-card mint"><p>In Progress</p><h3>{stats.progress}</h3></article>
            <article className="hf-stat-card sunset"><p>Resolved Rate</p><h3>{stats.resolvedRate}%</h3></article>
            <article className="hf-stat-card warm"><p>Filed Today</p><h3>{todaySummary.todayFiled}</h3></article>
            <article className="hf-stat-card mint"><p>Resolved Today</p><h3>{todaySummary.todayResolved}</h3></article>
          </div>

          <div className="hf-chart-grid">
            <motion.article className="hf-chart-card" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
              <div className="hf-chart-header"><h2>Daily Trend</h2><span>Submitted vs Resolved</span></div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="adminSubmit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.04} />
                    </linearGradient>
                    <linearGradient id="adminResolve" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1dfcf" />
                  <XAxis dataKey="day" stroke="#7c4a1d" />
                  <YAxis stroke="#7c4a1d" />
                  <Tooltip />
                  <Area type="monotone" dataKey="submitted" stroke="#f59e0b" fill="url(#adminSubmit)" strokeWidth={2.2} />
                  <Area type="monotone" dataKey="resolved" stroke="#10b981" fill="url(#adminResolve)" strokeWidth={2.2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.article>

            <motion.article className="hf-chart-card" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}>
              <div className="hf-chart-header"><h2>Status Distribution</h2><span>Live view</span></div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={analytics.status} dataKey="count" nameKey="_id" outerRadius={95} label>
                    {analytics.status.map((entry, idx) => (
                      <Cell key={entry._id || idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.article>
          </div>

          <div className="hf-filter-row">
            <input
              placeholder="Search by ID / student / category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="hf-chip-row">
              {["All", "Submitted", "Acknowledged", "In Progress", "Resolved", "Rejected"].map((status) => (
                <button
                  type="button"
                  key={status}
                  className={selectedStatus === status ? "hf-chip active" : "hf-chip"}
                  onClick={() => setSelectedStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="hf-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id}>
                    <td>{c.complaintId}</td>
                    <td>{c.studentName}</td>
                    <td>{c.category}</td>
                    <td><span className={`hf-priority ${String(c.priority || "low").toLowerCase()}`}>{c.priority}</span></td>
                    <td>{c.status}</td>
                    <td>
                      <select value={c.status} onChange={(e) => updateComplaintStatus(c.complaintId, e.target.value)}>
                        <option value="Submitted">Submitted</option>
                        <option value="Acknowledged">Acknowledged</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
