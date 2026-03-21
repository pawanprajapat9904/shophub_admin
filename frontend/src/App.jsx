import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct";
import Products from "./pages/Products";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";

// 🔐 Protected Route Component
// Ye check karega ki user ke paas token hai ya nahi
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");

  if (!token || isAdmin !== "true") {
    // Agar authenticated nahi hai toh login page par redirect kar do
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* 🔒 All Admin Protected Routes */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
        />
        
        <Route 
          path="/add-product" 
          element={<ProtectedRoute><AddProduct /></ProtectedRoute>} 
        />
        
        <Route 
          path="/products" 
          element={<ProtectedRoute><Products /></ProtectedRoute>} 
        />
        
        <Route 
          path="/edit-product/:id" 
          element={<ProtectedRoute><EditProduct /></ProtectedRoute>} 
        />
        
        <Route 
          path="/orders" 
          element={<ProtectedRoute><Orders /></ProtectedRoute>} 
        />

        {/* Catch-all: Agar koi galat URL daale toh wapas login ya dashboard bhej do */}
        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;