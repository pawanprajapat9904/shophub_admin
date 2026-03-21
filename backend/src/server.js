require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const adminAuthRoutes = require("./routes/adminAuthRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes"); // ⭐ NEW
console.log("MONGO_URI:", process.env.MONGO_URI);
const app = express();

connectDB();
 
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/orders", orderRoutes); // ⭐ NEW

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log(`Server running on network: http://0.0.0.0:${process.env.PORT}`);
});