require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const dealRoutes = require("./routes/deals.routes"); // ⬅️ nouveau
const commentRoutes = require("./routes/comments.routes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "DealExpress API is running 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/deals", dealRoutes); // ⬅️ nouveau

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

const adminRoutes = require("./routes/admin.routes");
app.use("/api/auth", authRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/admin", adminRoutes); // ⬅️ nouveau
app.use("/api/auth", authRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", commentRoutes); // ⬅️ ajoute ça
