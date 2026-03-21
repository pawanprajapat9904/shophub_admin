import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
// Icons ke liye: npm install lucide-react
import { Package, User, MapPin, IndianRupee, Clock, ChevronRight } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const theme = {
    bg: "#020617", // Deeper Dark
    card: "#0f172a",
    cardHover: "#1e293b",
    accent: "#818cf8", // Soft Indigo
    border: "rgba(255, 255, 255, 0.06)",
    textMain: "#f8fafc",
    textMuted: "#94a3b8",
    success: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
      setOrders(Array.isArray(res.data) ? res.data : (res.data?.orders || []));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await api.put(`/orders/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchOrders();
    } catch (error) { alert("Update failed"); }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    let config = { color: theme.warning, bg: "rgba(234, 179, 8, 0.1)" };
    if (s === "delivered") config = { color: theme.success, bg: "rgba(34, 197, 94, 0.1)" };
    if (s === "shipped") config = { color: theme.accent, bg: "rgba(129, 140, 248, 0.1)" };
    if (s === "cancelled") config = { color: theme.danger, bg: "rgba(239, 68, 68, 0.1)" };

    return (
      <span style={{
        color: config.color,
        backgroundColor: config.bg,
        padding: "6px 12px",
        borderRadius: "8px",
        fontSize: "11px",
        fontWeight: "700",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        border: `1px solid ${config.color}22`
      }}>
        <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: config.color }} />
        {status?.toUpperCase()}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", backgroundColor: theme.bg, minHeight: "100vh", color: theme.textMain, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {!isMobile && <Sidebar />}
      
      <div style={{ flex: 1, width: "100%" }}>
        <Header />

        <div style={{ padding: isMobile ? "20px" : "40px 60px", maxWidth: "1400px", margin: "0 auto" }}>
          
          {/* Header Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "800", marginBottom: "8px", letterSpacing: "-1px" }}>Orders Analytics</h1>
              <p style={{ color: theme.textMuted }}>Review and manage incoming store requests</p>
            </div>
            {!isMobile && (
              <div style={{ fontSize: "14px", color: theme.accent, fontWeight: "600", cursor: "pointer" }} onClick={fetchOrders}>
                Refresh Data
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ padding: "100px", textAlign: "center", color: theme.textMuted }}>
              <div className="spinner" style={{ marginBottom: "10px" }}>⌛</div>
              Syncing with server...
            </div>
          ) : (
            <div style={{ 
              backgroundColor: theme.card, 
              borderRadius: "24px", 
              border: `1px solid ${theme.border}`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              overflow: "hidden"
            }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
                  <thead>
                    <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      <th style={thStyle}>ORDER INFO</th>
                      <th style={thStyle}>CUSTOMER</th>
                      <th style={thStyle}>ORDERED ITEMS</th>
                      <th style={thStyle}>TOTAL AMOUNT</th>
                      <th style={thStyle}>STATUS</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o._id} className="order-row" style={trStyle(theme)}>
                        {/* ID Column */}
                        <td style={tdStyle}>
                          <div style={{ color: theme.textMuted, fontSize: "11px", marginBottom: "4px" }}>ID</div>
                          <span style={{ fontWeight: "700", fontSize: "13px", color: theme.accent }}>
                            #{o._id?.slice(-6).toUpperCase()}
                          </span>
                        </td>

                        {/* Customer Column */}
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={avatarStyle(theme)}>{o.userDetails?.name?.charAt(0)}</div>
                            <div>
                              <div style={{ fontWeight: "600", fontSize: "14px" }}>{o.userDetails?.name}</div>
                              <div style={{ color: theme.textMuted, fontSize: "12px" }}>{o.userDetails?.phone}</div>
                            </div>
                          </div>
                        </td>

                        {/* Items Column */}
                        <td style={tdStyle}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {o.products?.slice(0, 2).map((p, i) => (
                              <div key={i} style={itemBadgeStyle(theme)}>
                                {p.name} <span style={{ color: theme.accent }}>×{p.qty}</span>
                              </div>
                            ))}
                            {o.products?.length > 2 && (
                              <span style={{ fontSize: "11px", color: theme.textMuted }}>+{o.products.length - 2} more</span>
                            )}
                          </div>
                        </td>

                        {/* Revenue Column */}
                        <td style={tdStyle}>
                          <div style={{ fontSize: "16px", fontWeight: "800", color: "#fff" }}>
                            ₹{o.totalPrice?.toLocaleString()}
                          </div>
                          <div style={{ fontSize: "10px", color: theme.success }}>PAID</div>
                        </td>

                        {/* Status Column */}
                        <td style={tdStyle}>
                          {getStatusBadge(o.status)}
                        </td>

                        {/* Actions Column */}
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          <select
                            style={selectStyle(theme)}
                            value={o.status}
                            onChange={(e) => updateStatus(o._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Modern Styles ---

const thStyle = {
  padding: "20px 24px",
  fontSize: "10px",
  fontWeight: "800",
  color: "#64748b",
  textAlign: "left",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  borderBottom: "1px solid rgba(255,255,255,0.05)"
};

const tdStyle = {
  padding: "24px",
  fontSize: "14px",
  verticalAlign: "middle",
  borderBottom: "1px solid rgba(255,255,255,0.02)"
};

const trStyle = (theme) => ({
  transition: "all 0.3s ease",
  cursor: "default",
});

const avatarStyle = (theme) => ({
  width: "36px",
  height: "36px",
  borderRadius: "12px",
  backgroundColor: "rgba(129, 140, 248, 0.15)",
  color: theme.accent,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "14px"
});

const itemBadgeStyle = (theme) => ({
  backgroundColor: "rgba(255,255,255,0.03)",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "12px",
  border: "1px solid rgba(255,255,255,0.05)",
  color: "#cbd5e1"
});

const selectStyle = (theme) => ({
  backgroundColor: "#1e293b",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "8px 12px",
  fontSize: "12px",
  fontWeight: "600",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236366f1%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px top 50%",
  backgroundSize: "10px auto",
  paddingRight: "30px"
});

export default Orders;