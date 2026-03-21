import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, Bell, Search, UserCircle } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    if (window.confirm("Terminate admin session?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const theme = {
    card: "#0f172a",
    accent: "#6366f1",
    border: "rgba(255, 255, 255, 0.06)",
    danger: "#ef4444",
    success: "#10b981",
    glass: "rgba(15, 23, 42, 0.8)"
  };

  return (
    <header style={{
      height: "70px",
      background: theme.glass,
      backdropFilter: "blur(12px)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 clamp(15px, 4vw, 30px)",
      borderBottom: `1px solid ${theme.border}`,
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxSizing: "border-box",
    }}>
      
      {/* 🚀 Left: Brand/Status Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <div style={{ position: 'relative' }}>
          <ShieldCheck size={20} color={theme.accent} />
          <div style={pulseStatus(theme.success)}></div>
        </div>
        <div>
          <h3 style={{ fontSize: "14px", fontWeight: "900", margin: 0, letterSpacing: "1px", color: "#fff" }}>
            ADMIN <span style={{ color: theme.accent }}>INTERFACE</span>
          </h3>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: '700' }}>v2.4.0 ENCRYPTED</div>
        </div>
      </div>

      {/* 🛠️ Right: Actions Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        
        {/* Quick Tools (Hidden on Mobile) */}
        <div className="header-tools" style={{ display: "flex", gap: "15px", alignItems: "center" }}>
          <button style={iconBtnStyle}><Search size={18} opacity={0.5} /></button>
          <button style={iconBtnStyle}><Bell size={18} opacity={0.5} /></button>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "24px", background: theme.border }}></div>

        {/* Profile Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right", lineHeight: "1" }} className="user-text">
            <div style={{ fontWeight: "800", color: "#fff", fontSize: "12px" }}>SYSTEM ROOT</div>
            <div style={{ fontSize: "10px", color: theme.accent, marginTop: "4px", fontWeight: "700" }}>PRIVILEGED ACCESS</div>
          </div>
          <UserCircle size={32} strokeWidth={1.5} color="rgba(255,255,255,0.2)" />
        </div>

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="logout-btn"
          style={{
            background: "rgba(239, 68, 68, 0.05)",
            color: theme.danger,
            border: `1px solid rgba(239, 68, 68, 0.2)`,
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "11px",
            fontWeight: "800",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "0.3s all"
          }}
        >
          <LogOut size={14} />
          <span className="logout-text">LOGOUT</span>
        </button>
      </div>

      {/* Modern Styling */}
      <style>{`
        .logout-btn:hover {
          background: ${theme.danger} !important;
          color: #fff !important;
          box-shadow: 0 0 20px ${theme.danger}44;
          transform: translateY(-1px);
        }
        @media (max-width: 850px) {
          .header-tools, .user-text { display: none; }
        }
        @media (max-width: 500px) {
          .logout-text { display: none; }
          .logout-btn { padding: 8px; border-radius: 50%; }
        }
      `}</style>
    </header>
  );
};

// --- Helper Styles ---

const iconBtnStyle = {
  background: "none",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  padding: "5px",
  display: "flex",
  alignItems: "center"
};

const pulseStatus = (color) => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: color,
  position: "absolute",
  bottom: "-2px",
  right: "-2px",
  border: "2px solid #0f172a",
  boxShadow: `0 0 10px ${color}`
});

export default Header;