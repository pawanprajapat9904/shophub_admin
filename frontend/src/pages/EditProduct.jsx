import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { ArrowLeft, Save, Package, Tag, Database, IndianRupee, Image as ImageIcon } from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    images: [] // Added to handle existing images
  });

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const theme = {
    bg: "#020617",
    card: "#0f172a",
    accent: "#6366f1",
    border: "rgba(255, 255, 255, 0.08)",
    inputBg: "rgba(255, 255, 255, 0.03)",
    textMuted: "#94a3b8"
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await api.get("/products");
      // Note: If your API supports get by ID, use api.get(`/products/${id}`) instead for better performance
      const product = res.data.find((p) => p._id === id);
      if (product) {
        setFormData(product);
      }
    } catch (error) {
      console.log("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(`/products/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Product Updated Successfully");
      navigate("/products");
    } catch (error) {
      alert("Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ display: "flex", background: theme.bg, minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />

        <main style={{ padding: "clamp(20px, 5%, 40px)", width: "100%", boxSizing: "border-box" }}>
          
          {/* Top Navigation */}
          <button 
            onClick={() => navigate("/products")}
            style={backBtnStyle(theme)}
          >
            <ArrowLeft size={16} /> BACK TO INVENTORY
          </button>

          {/* Page Heading */}
          <div style={{ marginBottom: "35px" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.accent, marginBottom: '8px' }}>
              <Package size={14} />
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px' }}>UNIT MODIFICATION</span>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "900", margin: 0, letterSpacing: "-1px" }}>
              Edit <span style={{ color: theme.accent }}>Asset</span>
            </h1>
            <p style={{ color: theme.textMuted, fontSize: "14px", marginTop: "5px" }}>
              Modifying System Entry: <span style={{ fontFamily: "monospace", color: theme.accent }}>{id}</span>
            </p>
          </div>

          {loading ? (
            <div style={{ padding: "100px", textAlign: "center", color: theme.accent }}>
               <div className="loader" style={{margin: '0 auto 20px'}}></div>
               SYNCHRONIZING WITH DATABASE...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px' }}>
              
              {/* Form Section */}
              <form onSubmit={handleSubmit} style={formCardStyle(theme)}>
                <div style={fieldGroup}>
                  <label style={labelStyle}><Tag size={12} style={{marginRight: '8px'}}/> PRODUCT IDENTITY</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter asset name"
                    style={inputStyle(theme)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}><IndianRupee size={12} style={{marginRight: '8px'}}/> PRICE</label>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      style={inputStyle(theme)}
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}><Database size={12} style={{marginRight: '8px'}}/> STOCK</label>
                    <input
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      style={inputStyle(theme)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>CATEGORY / SECTOR</label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={inputStyle(theme)}
                    required
                  />
                </div>

                <button type="submit" disabled={updating} style={submitBtnStyle(theme, updating)}>
                  {updating ? "COMMITTING CHANGES..." : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <Save size={18} /> COMMIT UPDATES
                    </span>
                  )}
                </button>
              </form>

              {/* Asset Preview Section (New) */}
              <div style={formCardStyle(theme)}>
                <label style={labelStyle}><ImageIcon size={12} style={{marginRight: '8px'}}/> ASSET PREVIEW</label>
                <div style={previewContainer(theme)}>
                  {formData.images?.length > 0 ? (
                    <img src={formData.images[0]} alt="Current Asset" style={previewImg} />
                  ) : (
                    <div style={{ opacity: 0.2, textAlign: 'center' }}>
                      <Package size={48} />
                      <p style={{ fontSize: '12px', marginTop: '10px' }}>NO MEDIA DETECTED</p>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: '20px', padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${theme.border}` }}>
                   <p style={{ fontSize: '11px', color: theme.textMuted, margin: 0, lineHeight: '1.6' }}>
                     <strong>SYSTEM NOTE:</strong> Changes made to the identity or valuation of this asset will reflect globally across the customer interface immediately after commit.
                   </p>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
      
      <style>{`
        .loader { width: 40px; height: 40px; border: 3px solid rgba(99, 102, 241, 0.1); border-top: 3px solid #6366f1; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #6366f1 !important; box-shadow: 0 0 15px rgba(99, 102, 241, 0.1); }
      `}</style>
    </div>
  );
};

// --- Styles ---

const backBtnStyle = (theme) => ({
  background: "none",
  border: "none",
  color: theme.textMuted,
  fontSize: "12px",
  fontWeight: "700",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  marginBottom: "20px",
  padding: 0,
  transition: "0.2s",
  ":hover": { color: "#fff" }
});

const formCardStyle = (theme) => ({
  background: theme.card,
  padding: "30px",
  borderRadius: "24px",
  border: `1px solid ${theme.border}`,
  display: "flex",
  flexDirection: "column",
  gap: "25px",
  height: 'fit-content'
});

const fieldGroup = { display: 'flex', flexDirection: 'column' };

const labelStyle = {
  display: "flex",
  alignItems: 'center',
  fontSize: "11px",
  fontWeight: "800",
  opacity: 0.4,
  marginBottom: "10px",
  letterSpacing: "1.5px"
};

const inputStyle = (theme) => ({
  width: "100%",
  padding: "14px 18px",
  background: theme.inputBg,
  border: `1px solid ${theme.border}`,
  borderRadius: "12px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "0.3s",
});

const previewContainer = (theme) => ({
  width: '100%',
  aspectRatio: '1/1',
  borderRadius: '16px',
  background: 'rgba(0,0,0,0.2)',
  border: `1px dashed ${theme.border}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
});

const previewImg = { width: '100%', height: '100%', objectFit: 'cover' };

const submitBtnStyle = (theme, updating) => ({
  width: "100%",
  padding: "18px",
  borderRadius: "14px",
  border: "none",
  background: updating ? "#1e293b" : theme.accent,
  color: "#fff",
  fontWeight: "900",
  fontSize: "14px",
  letterSpacing: '1px',
  cursor: updating ? "not-allowed" : "pointer",
  boxShadow: updating ? "none" : `0 10px 25px ${theme.accent}44`,
  transition: "0.3s",
  marginTop: '10px'
});

export default EditProduct;