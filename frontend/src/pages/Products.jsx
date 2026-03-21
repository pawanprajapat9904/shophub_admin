import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { 
  Package, Edit3, Trash2, Plus, 
  Search, Filter, AlertCircle, ShoppingBag 
} from "lucide-react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const theme = {
    bg: "#020617",
    card: "#0f172a",
    accent: "#6366f1",
    border: "rgba(255, 255, 255, 0.06)",
    danger: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
    textMuted: "#94a3b8"
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(Array.isArray(res.data) ? res.data : (res.data.products || []));
    } catch (error) {
      alert("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("🚨 Permanent Action: Decommission this unit?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      alert("Decommissioning failed");
    }
  };

  // Search filter
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", backgroundColor: theme.bg, minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />

        <main style={{ padding: "clamp(20px, 5%, 40px)", width: "100%", boxSizing: "border-box" }}>
          
          {/* HEADER SECTION */}
          <div style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent, marginBottom: '8px' }}>
                <ShoppingBag size={14} />
                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px' }}>GLOBAL INVENTORY</span>
              </div>
              <h1 style={{ fontSize: "32px", fontWeight: "900", margin: 0, letterSpacing: '-1px' }}>
                Product <span style={{ color: theme.accent }}>Assets</span>
              </h1>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
               <div style={searchBoxStyle(theme)}>
                  <Search size={16} opacity={0.4} />
                  <input 
                    placeholder="Search serial or name..." 
                    style={searchInputStyle}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <button onClick={() => navigate("/add-product")} style={addBtnStyle(theme)}>
                 <Plus size={18} /> NEW UNIT
               </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '100px', textAlign: 'center', color: theme.accent }}>
               <div className="loader" style={{ margin: '0 auto 20px' }}></div>
               AUTHENTICATING DATABASE UPLINK...
            </div>
          ) : (
            <div style={tableContainer(theme)}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                      <th style={thStyle}>ASSET</th>
                      <th style={thStyle}>IDENTIFIER</th>
                      <th style={thStyle}>CATEGORY</th>
                      <th style={thStyle}>STOCK</th>
                      <th style={thStyle}>VALUATION</th>
                      <th style={{ ...thStyle, textAlign: "right" }}>CONTROL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p._id} className="table-row" style={trStyle(theme)}>
                        {/* Image & Name */}
                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={imgContainer(theme)}>
                              {p.images?.[0] ? (
                                <img src={p.images[0]} style={imgStyle} alt={p.name} />
                              ) : (
                                <Package size={20} opacity={0.2} />
                              )}
                            </div>
                            <span style={{ fontWeight: "700", fontSize: "14px" }}>{p.name}</span>
                          </div>
                        </td>

                        {/* ID */}
                        <td style={{ ...tdStyle, fontFamily: 'monospace', color: theme.textMuted }}>
                          #{p._id.slice(-6).toUpperCase()}
                        </td>

                        {/* Category */}
                        <td style={tdStyle}>
                           <span style={categoryBadge(theme)}>{p.category || "General"}</span>
                        </td>

                        {/* Stock Status */}
                        <td style={tdStyle}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                fontWeight: '800', 
                                color: p.stock < 5 ? theme.danger : theme.textMuted 
                              }}>
                                {p.stock}
                              </span>
                              {p.stock < 5 && <AlertCircle size={14} color={theme.danger} />}
                           </div>
                        </td>

                        {/* Price */}
                        <td style={{ ...tdStyle, color: theme.success, fontWeight: "800", fontSize: '15px' }}>
                          ₹{p.price.toLocaleString()}
                        </td>

                        {/* Actions */}
                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                            <button onClick={() => navigate(`/edit-product/${p._id}`)} style={iconBtn(theme, "accent")}>
                              <Edit3 size={16} />
                            </button>
                            <button onClick={() => deleteProduct(p._id)} style={iconBtn(theme, "danger")}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div style={{ padding: '60px', textAlign: 'center', color: theme.textMuted }}>
                   No matching assets found in local buffer.
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <style>{`
        .table-row { transition: all 0.2s ease; }
        .table-row:hover { background: rgba(99, 102, 241, 0.03); transform: scale(1.001); }
        .loader { width: 40px; height: 40px; border: 3px solid rgba(99, 102, 241, 0.1); border-top: 3px solid #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// --- STYLES ---

const tableContainer = (theme) => ({
  background: theme.card,
  borderRadius: "24px",
  border: `1px solid ${theme.border}`,
  overflow: "hidden",
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
});

const thStyle = { padding: "20px", fontSize: "11px", fontWeight: "800", opacity: 0.4, letterSpacing: "1.5px", textTransform: "uppercase" };
const tdStyle = { padding: "16px 20px", fontSize: "14px", verticalAlign: "middle" };
const trStyle = (theme) => ({ borderBottom: `1px solid ${theme.border}` });

const imgContainer = (theme) => ({
  width: "44px", height: "44px", borderRadius: "10px", overflow: "hidden", 
  background: "#1e293b", border: `1px solid ${theme.border}`,
  display: 'flex', alignItems: 'center', justifyContent: 'center'
});

const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };

const searchBoxStyle = (theme) => ({
  display: 'flex', alignItems: 'center', gap: '10px', background: theme.card,
  padding: '10px 16px', borderRadius: '12px', border: `1px solid ${theme.border}`, width: '250px'
});

const searchInputStyle = { background: 'none', border: 'none', color: '#fff', fontSize: '13px', outline: 'none', width: '100%' };

const addBtnStyle = (theme) => ({
  background: theme.accent, color: "#fff", border: "none", display: 'flex', alignItems: 'center', gap: '8px',
  padding: "10px 20px", borderRadius: "12px", fontWeight: "800", cursor: "pointer", fontSize: "12px",
  boxShadow: `0 10px 20px ${theme.accent}33`, transition: '0.3s'
});

const categoryBadge = (theme) => ({
  padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.03)',
  border: `1px solid ${theme.border}`, fontSize: '11px', fontWeight: '600', color: theme.textMuted
});

const iconBtn = (theme, type) => ({
  background: type === "danger" ? "rgba(239, 68, 68, 0.1)" : "rgba(99, 102, 241, 0.1)",
  color: type === "danger" ? theme.danger : theme.accent,
  border: `1px solid ${type === "danger" ? theme.danger : theme.accent}33`,
  padding: "8px", borderRadius: "10px", cursor: "pointer", display: 'flex', alignItems: 'center'
});

export default Products;