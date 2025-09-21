import express from "express";
import router from "./routes/api.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import connectDB from "./database/db.js";
import Ninja from "./models/ninja.js";
import cors from "cors";

const app = express();
app.use(cors());
app.options("*", cors()); // allow preflight for all routes
const PORT = process.env.PORT || 4000;

connectDB().then(async () => {
  await Ninja.init(); // forcing the index recreation because NinjaSchema.index({ geometry: "2dsphere" })   not working
  console.log("Indexes ensured");
});

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`🚀 Server ghg is running on http://localhost:${PORT}`);
});

// Example test route
app.get("/", (req, res) => {
  console.log("conected to the site (got the req from the site)");
  res.send("hi there 👋   plese head to http://localhost:4000/api/ninjas ");
});

// error handler (last middleware)
app.use((error, req, res, next) => {
  // console.log(error)
  console.error(error.stack);
  res.status(error.status || 500).json({
    error: error.message || "Internal Server Error",
  });
});
