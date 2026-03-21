import { useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  ClipboardList, 
  LogOut, 
  Menu, 
  X,
  Globe,
  WifiOff
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Initial state browser ki information se
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 🛰️ HARD CHECK: Real-world connectivity check
  const checkConnection = useCallback(async () => {
    // 1 second ka timeout set karte hain taaki status turant change ho
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    try {
      // Cache bust karne ke liye timestamp lagaya hai
      const response = await fetch(`https://www.google.com/favicon.ico?t=${Date.now()}`, { 
        mode: 'no-cors', 
        cache: 'no-store',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      if (response) setIsOnline(true);
    } catch (err) {
      clearTimeout(timeoutId);
      setIsOnline(false); // Agar timeout hua ya fetch fail, toh offline
    }
  }, []);

  useEffect(() => {
    // Instant browser event triggers
    const handleOnline = () => {
      setIsOnline(true);
      checkConnection(); // Dubara verify karo
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Actively check every 3 seconds for zero latency UI
    const heartbeat = setInterval(checkConnection, 3000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(heartbeat);
    };
  }, [checkConnection]);

  const theme = {
    dark: "#0f172a",
    accent: "#6366f1",
    text: "#f8fafc",
    textMuted: "rgba(248, 250, 252, 0.5)",
    border: "rgba(255, 255, 255, 0.06)",
    danger: "#ef4444",
    success: "#10b981"
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Add Product", path: "/add-product", icon: <PlusCircle size={20} /> },
    { name: "Products", path: "/products", icon: <Package size={20} /> },
    { name: "Orders", path: "/orders", icon: <ClipboardList size={20} /> },
  ];

  const handleLogout = () => {
    if (window.confirm("🚨 Confirm Action: Sign out from Admin OS?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={mobileToggleStyle(theme)}
        className="mobile-toggle"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div onClick={() => setIsOpen(false)} style={backdropStyle} />
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`} style={sidebarContainerStyle(theme)}>
        
        {/* Logo */}
        <div style={{ marginBottom: "50px", paddingLeft: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={logoBoxStyle(theme)}>
              <Zap size={20} fill="white" color="white" />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "-0.5px", margin: 0 }}>
              ADMIN <span style={{ color: theme.accent }}>OS</span>
            </h2>
          </div>
        </div>

        {/* Links */}
        <nav style={{ flex: 1 }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} style={{ marginBottom: "8px" }}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    style={navLinkStyle(theme, isActive)}
                  >
                    {isActive && <div style={activeBar(theme)} />}
                    <span style={{ color: isActive ? theme.accent : "inherit" }}>
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer with Status */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <div style={statusCard(theme, isOnline)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isOnline ? (
                <Globe size={14} className="pulse-icon" />
              ) : (
                <WifiOff size={14} style={{ color: theme.danger }} />
              )}
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px' }}>
                {isOnline ? "UPLINK ACTIVE" : "SIGNAL LOST"}
              </span>
            </div>
            <div style={{ fontSize: '9px', marginTop: '4px', opacity: 0.6 }}>
              {isOnline ? "Protocol: Stable" : "Waiting for network..."}
            </div>
          </div>

          <button onClick={handleLogout} style={logoutBtn(theme)}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>

          <div style={{ padding: "10px", fontSize: "10px", textAlign: "center", color: theme.textMuted }}>
            SYSTEM v2.4.0
          </div>
        </div>

        <style>{`
          .pulse-icon { color: #10b981; animation: pulse 2s infinite; }
          @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
          
          @media (max-width: 900px) {
            .sidebar { width: 85px !important; }
            .sidebar h2, .sidebar span, .sidebar div[style*="fontSize: 9px"] { display: none !important; }
          }
          @media (max-width: 600px) {
             .sidebar { position: fixed !important; left: -260px; width: 260px !important; }
             .sidebar.open { left: 0; }
             .sidebar h2, .sidebar span { display: block !important; }
             .mobile-toggle { display: flex !important; }
          }
        `}</style>
      </div>
    </>
  );
};

// --- Updated Styles ---
const sidebarContainerStyle = (theme) => ({
  width: "260px", height: "100vh", background: `linear-gradient(180deg, ${theme.dark} 0%, #020617 100%)`,
  color: theme.text, padding: "40px 15px", borderRight: `1px solid ${theme.border}`, display: "flex",
  flexDirection: "column", position: "sticky", top: 0, boxSizing: "border-box", transition: "0.4s ease", zIndex: 2002
});

const statusCard = (theme, isOnline) => ({
  padding: "15px",
  background: isOnline ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.1)",
  borderRadius: "14px",
  border: `1px solid ${isOnline ? theme.success : theme.danger}33`,
  color: isOnline ? theme.success : theme.danger,
  transition: "0.3s all"
});

const navLinkStyle = (theme, isActive) => ({
  display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", textDecoration: "none",
  color: isActive ? "#fff" : theme.textMuted, background: isActive ? `rgba(99, 102, 241, 0.1)` : "transparent",
  borderRadius: "12px", fontSize: "14px", fontWeight: isActive ? "700" : "500", position: "relative"
});

const activeBar = (theme) => ({
  position: "absolute", left: 0, top: "20%", bottom: "20%", width: "4px", background: theme.accent, borderRadius: "0 4px 4px 0"
});

const logoutBtn = (theme) => ({
  display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "rgba(239, 68, 68, 0.05)",
  border: "none", borderRadius: "12px", color: theme.danger, cursor: "pointer", fontWeight: "600"
});

const logoBoxStyle = (theme) => ({
  width: "35px", height: "35px", background: theme.accent, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center"
});

const mobileToggleStyle = (theme) => ({
  position: "fixed", top: "20px", left: "20px", zIndex: 3000, background: theme.accent, border: "none", color: "white", width: "40px", height: "40px", borderRadius: "10px", display: "none", alignItems: "center", justifyContent: "center"
});

const backdropStyle = { position: "fixed", inset: 0, background: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(4px)", zIndex: 2001 };

const Zap = ({ size, color, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

export default Sidebar;