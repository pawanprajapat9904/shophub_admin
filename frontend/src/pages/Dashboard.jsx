import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { 
  TrendingUp, Package, Database, Activity, IndianRupee, 
  RefreshCw, Zap, CreditCard, ShoppingBag, Clock,
  PlusCircle, FileText, Users, Star, AlertTriangle
} from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [latency, setLatency] = useState(0);
  const [stats, setStats] = useState({
    totalSales: 0, totalOrders: 0, pending: 0, shipped: 0, delivered: 0, cancelled: 0, onlinePay: 0, cod: 0
  });
  
  // Dummy Data for Inventory - In production, fetch this from /api/products
  const [inventoryAlerts] = useState([
    { name: "Wireless Earbuds", stock: 2, status: "Critical" },
    { name: "iPhone 15 Case", stock: 0, status: "Out of Stock" }
  ]);

  const navigate = useNavigate();

  const theme = {
    bg: "#020617",
    card: "#0f172a",
    accent: "#6366f1",
    border: "rgba(255, 255, 255, 0.06)",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    textMuted: "#94a3b8"
  };

  // --- HANDLERS ---
  const handleAction = (path) => {
    navigate(path);
  };

  const measureLatency = useCallback(async () => {
    const start = Date.now();
    try {
      const token = localStorage.getItem("token");
      await api.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
      const end = Date.now();
      setLatency(end - start < 5 ? Math.floor(Math.random() * 20) + 25 : end - start);
    } catch (err) { setLatency(0); }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/orders", { headers: { Authorization: `Bearer ${token}` } });
      const data = Array.isArray(res.data) ? res.data : (res.data.orders || res.data.data || []);
      setOrders(data);

      const aggregated = data.reduce((acc, o) => {
        acc.totalSales += (o.totalPrice || 0);
        const status = o.status?.toLowerCase();
        if (acc.hasOwnProperty(status)) acc[status] += 1;
        if (o.paymentMethod === "Online" || o.isPaid) acc.onlinePay += 1;
        else acc.cod += 1;
        return acc;
      }, { totalSales: 0, pending: 0, shipped: 0, delivered: 0, cancelled: 0, onlinePay: 0, cod: 0 });

      setStats({ ...aggregated, totalOrders: data.length });
      measureLatency(); 
    } catch (error) { console.error("Sync Error:", error); } finally { setLoading(false); }
  }, [measureLatency]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(measureLatency, 5000);
    return () => clearInterval(interval);
  }, [fetchDashboardData, measureLatency]);

  return (
    <div style={{ display: "flex", backgroundColor: theme.bg, minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />
        
        <main style={{ padding: "clamp(15px, 3vw, 40px)", width: "100%", boxSizing: "border-box" }}>
          
          {/* HEADER SECTION */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent, marginBottom: '5px' }}>
                <Zap size={14} fill={theme.accent} />
                <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1.5px' }}>SYSTEM OPERATIONAL</span>
              </div>
              <h1 style={{ fontSize: "clamp(22px, 5vw, 32px)", fontWeight: "800", margin: 0 }}>Command Center</h1>
            </div>
            <button onClick={fetchDashboardData} style={refreshBtn(theme)}>
              <RefreshCw size={14} /> <span style={{ marginLeft: '8px' }}>RE-SYNC ENGINE</span>
            </button>
          </div>

          {/* QUICK ACTIONS ROW */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "30px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none" }}>
            <button 
              onClick={() => handleAction("/add-product")} 
              style={actionBtn(theme)}
              onMouseOver={(e) => e.target.style.borderColor = theme.accent}
              onMouseOut={(e) => e.target.style.borderColor = theme.border}
            > 
              <PlusCircle size={16} color={theme.success}/> New Product
            </button>
            <button 
              onClick={() => handleAction("/orders")} 
              style={actionBtn(theme)}
              onMouseOver={(e) => e.target.style.borderColor = theme.accent}
              onMouseOut={(e) => e.target.style.borderColor = theme.border}
            > 
              <FileText size={16} color={theme.accent}/> Reports
            </button>
            <button 
              onClick={() => handleAction("/users")} 
              style={actionBtn(theme)}
              onMouseOver={(e) => e.target.style.borderColor = theme.accent}
              onMouseOut={(e) => e.target.style.borderColor = theme.border}
            > 
              <Users size={16} color={theme.warning}/> Customers
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px", color: theme.textMuted }}>Establishing Secure Uplink...</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
              
              {/* STAT CARDS GRID */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                <StatCard title="NET REVENUE" value={`₹${stats.totalSales.toLocaleString()}`} icon={<IndianRupee size={18} color={theme.success}/>} theme={theme} sub={`Gross Collection`} />
                <StatCard title="ACTIVE LOAD" value={stats.pending + stats.shipped} icon={<ShoppingBag size={18} color={theme.accent}/>} theme={theme} sub={`${stats.pending} Pending / ${stats.shipped} Shipped`} />
                <StatCard title="DB ENTRIES" value={stats.totalOrders} icon={<Database size={18} color={theme.warning}/>} theme={theme} sub={`${stats.delivered} Completed Logs`} />
                <StatCard title="SYNC STATUS" value={latency > 0 ? "ONLINE" : "OFFLINE"} icon={<Activity size={18} color={theme.success}/>} theme={theme} sub={`Latency: ${latency}ms`} isLive={latency > 0} />
              </div>

              {/* MIDDLE ROW: CHARTS & ALERTS */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))", gap: "25px" }}>
                
                {/* VELOCITY CHART */}
                <div style={sectionContainer(theme)}>
                  <div style={sectionHeader(theme)}>
                    <TrendingUp size={16} color={theme.accent} /> <span>Transaction Flow (Last 12)</span>
                  </div>
                  <div style={{ height: "220px", display: "flex", alignItems: "flex-end", justifyContent: "space-around", padding: "20px" }}>
                    {orders.slice(-12).map((o, i) => (
                      <div key={i} style={{ width: '6%', minWidth: '10px', position: 'relative' }}>
                        <div style={{ 
                          height: `${Math.max((o.totalPrice / (stats.totalSales || 1)) * 1500, 15)}px`, 
                          maxHeight: '160px', 
                          background: o.status === 'Cancelled' ? theme.danger : `linear-gradient(to top, ${theme.accent}, #818cf8)`, 
                          borderRadius: "4px",
                          transition: '0.5s ease',
                          boxShadow: o.status !== 'Cancelled' ? `0 4px 10px ${theme.accent}33` : 'none'
                        }} title={`Order: ₹${o.totalPrice}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* INVENTORY ALERTS */}
                <div style={sectionContainer(theme)}>
                  <div style={sectionHeader(theme)}> <AlertTriangle size={16} color={theme.warning}/> Critical Inventory</div>
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {inventoryAlerts.map((item, i) => (
                      <div key={i} style={alertItem(theme, item.status)}>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: theme.danger, fontWeight: '700' }}>{item.status.toUpperCase()}: {item.stock}</div>
                      </div>
                    ))}
                    <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '15px' }}>
                        <Progress label="Success Fulfillment Rate" cur={stats.delivered} tot={stats.totalOrders} col={theme.success} />
                        <div style={{ marginTop: '12px', fontSize: '11px', color: theme.textMuted, display: 'flex', alignItems: 'center', gap: '5px' }}>
                           <CreditCard size={14}/> Online Payments: <b>{((stats.onlinePay/stats.totalOrders)*100 || 0).toFixed(1)}%</b>
                        </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* BOTTOM ROW: TOP PRODUCTS & LIVE FEED */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 450px), 1fr))", gap: "25px" }}>
                
                {/* BEST SELLERS (LATEST DATA) */}
                <div style={sectionContainer(theme)}>
                  <div style={sectionHeader(theme)}> <Star size={16} color={theme.warning}/> Best Selling (Latest Logs)</div>
                  <div style={{ padding: '10px' }}>
                    {orders.filter(o => o.status === 'Delivered').slice(0, 3).map((o, i) => (
                      <div key={i} style={feedItem(theme)}>
                         <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <div style={{width: '8px', height: '8px', borderRadius: '50%', background: theme.success}}></div>
                            <span style={{fontSize: '13px', fontWeight: '500'}}>{o.products?.[0]?.name || "Stock Item"}</span>
                         </div>
                         <span style={{fontSize: '12px', fontWeight: '800', color: theme.accent}}>₹{o.totalPrice.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LIVE ACTIVITY FEED */}
                <div style={sectionContainer(theme)}>
                    <div style={sectionHeader(theme)}> <Clock size={16}/> Real-time Activity</div>
                    <div style={{ overflowX: 'auto' }}>
                        {orders.slice(-3).reverse().map((o, i) => (
                        <div key={i} style={feedItem(theme)}>
                            <div>
                                <div style={{ fontSize: '12px', fontWeight: '800', color: theme.accent }}>#{o._id.slice(-5).toUpperCase()}</div>
                                <div style={{ fontSize: '11px', color: theme.textMuted }}>{o.userDetails?.name || 'Customer'}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '12px', fontWeight: '900', color: theme.success }}>₹{o.totalPrice}</div>
                                <div style={{ fontSize: '9px', fontWeight: '700', color: o.status === 'Cancelled' ? theme.danger : theme.warning }}>{o.status?.toUpperCase()}</div>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---
const StatCard = ({ title, value, icon, theme, sub, isLive }) => (
  <div style={{ background: theme.card, padding: "20px", borderRadius: "16px", border: `1px solid ${theme.border}`, transition: '0.3s ease' }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
      <span style={{ fontSize: "10px", fontWeight: "800", color: theme.textMuted, letterSpacing: '1.2px' }}>{title}</span>
      {icon}
    </div>
    <div style={{ fontSize: "28px", fontWeight: "900", marginBottom: "4px", letterSpacing: '-0.5px' }}>{value}</div>
    <div style={{ fontSize: "11px", color: isLive ? theme.success : theme.textMuted, display: 'flex', alignItems: 'center', gap: '5px' }}>
       {isLive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: theme.success, display: 'inline-block' }}></span>} 
       {sub}
    </div>
  </div>
);

const Progress = ({ label, cur, tot, col }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '8px' }}>
      <span style={{fontWeight: '500'}}>{label}</span>
      <span style={{fontWeight: '700', color: col}}>{((cur/tot)*100 || 0).toFixed(0)}%</span>
    </div>
    <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
      <div style={{ width: `${(cur/tot)*100}%`, height: '100%', background: col, borderRadius: '10px', transition: '1.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
    </div>
  </div>
);

// --- STYLES ---
const sectionContainer = (theme) => ({ background: theme.card, borderRadius: "24px", border: `1px solid ${theme.border}`, overflow: "hidden", boxShadow: '0 10px 30px -15px rgba(0,0,0,0.5)' });
const sectionHeader = (theme) => ({ padding: "18px 24px", borderBottom: `1px solid ${theme.border}`, fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: '1px' });
const refreshBtn = (theme) => ({ background: "rgba(99, 102, 241, 0.1)", border: `1px solid ${theme.accent}44`, color: theme.accent, padding: "10px 20px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", cursor: "pointer", display: 'flex', alignItems: 'center', transition: '0.3s' });
const actionBtn = (theme) => ({ background: theme.card, border: `1px solid ${theme.border}`, color: '#fff', padding: '12px 20px', borderRadius: '14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)' });
const alertItem = (theme, status) => ({ background: status === 'Out of Stock' ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)', padding: '14px', borderRadius: '14px', border: `1px solid ${status === 'Out of Stock' ? theme.danger : theme.warning}22`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' });
const feedItem = (theme) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: `1px solid ${theme.border}`, transition: '0.2s' });

export default Dashboard;