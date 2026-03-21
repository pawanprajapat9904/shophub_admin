import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) return alert("Please fill all fields");

    setLoading(true);
    try {
      const res = await api.post("/admin/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", "true"); // Admin authentication flag

      // Success animation delay (optional but looks cool)
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      
    } catch (error) {
      alert(error.response?.data?.message || "Access Denied: Invalid Credentials");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Technical Fix: Enter key dabane par login trigger ho
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const theme = {
    bg: "#05070a",
    card: "#0f172a",
    accent: "#6366f1",
    border: "rgba(255, 255, 255, 0.1)"
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.bg,
      color: "#fff",
      fontFamily: "'Inter', sans-serif",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        padding: "40px",
        background: theme.card,
        borderRadius: "24px",
        border: `1px solid ${theme.border}`,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        textAlign: "center",
        boxSizing: "border-box"
      }}>
        
        {/* Shield Icon */}
        <div style={{
          width: "60px", height: "60px", background: "rgba(99, 102, 241, 0.1)",
          borderRadius: "16px", display: "flex", alignItems: "center",
          justifyContent: "center", margin: "0 auto 20px", border: `1px solid ${theme.accent}`
        }}>
          <span style={{ fontSize: "24px" }}>🛡️</span>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "10px", letterSpacing: "-0.5px" }}>
          ADMIN <span style={{ color: theme.accent }}>PORTAL</span>
        </h2>
        <p style={{ fontSize: "14px", opacity: 0.5, marginBottom: "30px" }}>
          Identify yourself to access the terminal.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ textAlign: "left" }}>
            <label style={labelStyle}>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="admin@system.com"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle(theme)}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={labelStyle}>ACCESS KEY</label>
            <input
              placeholder="••••••••"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              style={inputStyle(theme)}
            />
          </div>

          <button 
            onClick={handleLogin}
            disabled={loading}
            className="login-btn"
            style={{
              marginTop: "10px",
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: theme.accent,
              color: "#fff",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: `0 10px 20px ${theme.accent}33`,
              transition: "0.3s"
            }}
          >
            {loading ? "AUTHENTICATING..." : "INITIALIZE LOGIN"}
          </button>
        </div>

        <div style={{ marginTop: "25px", fontSize: "11px", opacity: 0.3, letterSpacing: "1.5px" }}>
          SECURED BY END-TO-END ENCRYPTION
        </div>
      </div>

      <style>{`
        .login-btn:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .login-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

// Internal Styling
const labelStyle = {
  fontSize: "10px",
  fontWeight: "800",
  opacity: 0.4,
  marginBottom: "5px",
  display: "block",
  paddingLeft: "5px"
};

const inputStyle = (theme) => ({
  width: "100%",
  padding: "14px 18px",
  borderRadius: "12px",
  border: `1px solid ${theme.border}`,
  backgroundColor: "rgba(255,255,255,0.03)",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  transition: "0.3s",
  boxSizing: "border-box"
});

export default Login;