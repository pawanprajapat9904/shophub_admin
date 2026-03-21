import { useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Package, IndianRupee, Layers, List, Image as ImageIcon, Plus, X } from "lucide-react";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: ""
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]); // For UI Previews
  const [loading, setLoading] = useState(false);

  const theme = {
    bg: "#020617",
    card: "#0f172a",
    accent: "#6366f1",
    border: "rgba(255, 255, 255, 0.08)",
    textMuted: "#94a3b8",
    success: "#10b981"
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Generate Previews
    const filePreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(filePreviews);
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      images.forEach((img) => data.append("images", img));

      const token = localStorage.getItem("token");
      await api.post("/products", data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("🚀 Product Synchronized Successfully!");
      setFormData({ name: "", description: "", price: "", category: "", stock: "" });
      setImages([]);
      setPreviews([]);
    } catch (error) {
      alert("Error: Database connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", backgroundColor: theme.bg, minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header />

        <main style={{ padding: "clamp(20px, 5%, 40px)", maxWidth: "1200px" }}>
          
          <div style={{ marginBottom: "35px" }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme.accent, marginBottom: '8px' }}>
              <Plus size={18} />
              <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px' }}>INVENTORY MANAGEMENT</span>
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: "900", margin: 0, letterSpacing: '-1px' }}>
              Register <span style={{ color: theme.accent }}>Asset</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px" }}>
            
            {/* LEFT COLUMN: BASIC INFO */}
            <div style={formCard(theme)}>
              <div style={cardHeader}><List size={16} /> Basic Details</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="field">
                  <label style={labelStyle}><Package size={12} style={{marginRight: '5px'}}/> PRODUCT NAME</label>
                  <input name="name" placeholder="e.g. RTX 5090 Ultra" value={formData.name} onChange={handleChange} style={inputStyle(theme)} required />
                </div>

                <div className="field">
                  <label style={labelStyle}><Layers size={12} style={{marginRight: '5px'}}/> CATEGORY</label>
                  <select name="category" value={formData.category} onChange={handleChange} style={inputStyle(theme)} required>
                    <option value="" style={{background: theme.card}}>Select Category</option>
                    <option value="Electronics" style={{background: theme.card}}>Electronics</option>
                    <option value="Fashion" style={{background: theme.card}}>Fashion</option>
                    <option value="Accessories" style={{background: theme.card}}>Accessories</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}><IndianRupee size={12} style={{marginRight: '5px'}}/> PRICE</label>
                    <input name="price" type="number" placeholder="0.00" value={formData.price} onChange={handleChange} style={inputStyle(theme)} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>STOCK UNITS</label>
                    <input name="stock" type="number" placeholder="0" value={formData.stock} onChange={handleChange} style={inputStyle(theme)} required />
                  </div>
                </div>

                <div className="field">
                  <label style={labelStyle}>DESCRIPTION</label>
                  <textarea name="description" placeholder="Technical specifications..." value={formData.description} onChange={handleChange} style={{ ...inputStyle(theme), height: "130px", resize: "none" }} required />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: MEDIA & UPLOAD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              <div style={formCard(theme)}>
                <div style={cardHeader}><ImageIcon size={16} /> Media Assets</div>
                
                <div style={dropzoneStyle(theme)}>
                  <input type="file" multiple onChange={handleImageChange} style={fileInputHidden} />
                  <div style={{ opacity: 0.6, fontSize: '14px' }}>
                    <Plus size={30} style={{ margin: '0 auto 10px', display: 'block' }} />
                    Click or Drag to Upload Images
                  </div>
                </div>

                {/* PREVIEW GRID */}
                {previews.length > 0 && (
                  <div style={previewGrid}>
                    {previews.map((src, index) => (
                      <div key={index} style={previewWrapper}>
                        <img src={src} alt="preview" style={imgStyle} />
                        <button type="button" onClick={() => removeImage(index)} style={removeBtn}>
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={loading} style={submitBtn(theme, loading)}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <div className="spin-loader"></div> PROCESSING...
                  </div>
                ) : "DEPLOY TO PRODUCTION"}
              </button>
            </div>

          </form>
        </main>
      </div>

      <style>{`
        .spin-loader {
          width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus, select:focus {
          border-color: #6366f1 !important;
          background: rgba(99, 102, 241, 0.05) !important;
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
        }
      `}</style>
    </div>
  );
};

// --- STYLES ---

const formCard = (theme) => ({
  background: theme.card,
  padding: "30px",
  borderRadius: "24px",
  border: `1px solid ${theme.border}`,
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
});

const cardHeader = {
  fontSize: '14px', fontWeight: '700', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', opacity: 0.8
};

const labelStyle = { display: "flex", alignItems: 'center', fontSize: "11px", fontWeight: "800", opacity: 0.4, marginBottom: "10px", letterSpacing: "1px" };

const inputStyle = (theme) => ({
  width: "100%", padding: "14px 18px", background: "#1e293b55", border: `1px solid ${theme.border}`,
  borderRadius: "12px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box", transition: '0.3s'
});

const dropzoneStyle = (theme) => ({
  border: `2px dashed ${theme.border}`,
  padding: "40px 20px",
  borderRadius: "16px",
  textAlign: "center",
  cursor: "pointer",
  position: "relative",
  background: "rgba(255,255,255,0.01)",
  transition: '0.3s',
  marginBottom: '20px'
});

const fileInputHidden = { opacity: 0, position: "absolute", inset: 0, cursor: "pointer", width: '100%' };

const previewGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '12px' };

const previewWrapper = { position: 'relative', width: '80px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' };

const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };

const removeBtn = {
  position: 'absolute', top: '5px', right: '5px', background: '#ef4444', color: '#fff', border: 'none', 
  borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
};

const submitBtn = (theme, loading) => ({
  width: "100%",
  background: theme.accent,
  color: "#fff",
  border: "none",
  padding: "20px",
  borderRadius: "16px",
  fontWeight: "800",
  fontSize: "14px",
  letterSpacing: '1px',
  cursor: loading ? "not-allowed" : "pointer",
  boxShadow: loading ? "none" : `0 10px 30px ${theme.accent}44`,
  transition: "0.3s"
});

export default AddProduct;