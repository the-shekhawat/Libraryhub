import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("Server file started");

//dotenv.config({ path: "./.env" });
dotenv.config();

console.log(process.env.MONGO_URL);
//dotenv.config();
//dotenv.config({ path: "./.env" });
const app = express();

app.use(cors());
app.use(express.json());
//
console.log("Connecting to MongoDB...");
// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/fees", feeRoutes);

// Serve client static files
const clientBuildPath = path.join(__dirname, "../client/dist");
app.use(express.static(clientBuildPath));

// Serve client for all non-API routes (SPA routing)
app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

const PORT = process.env.PORT || 5000;
console.log("About to start server");
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}

export default app;