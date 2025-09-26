import express from "express";
import router from "./routes/api.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import connectDB from "./database/db.js";
import Ninja from "./models/ninja.js";
import cors from "cors";
import AuthRouter from './routes/AuthRouter.js'

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/auth' , AuthRouter )
app.use("/api", router);


const PORT = process.env.PORT || 4000;

connectDB().then(async () => {
  try {
    await Ninja.init(); // forcing the index recreation because NinjaSchema.index({ geometry: "2dsphere" })   not working
    console.log("Indexes ensured");
  } catch (error) {
    console.error("Index creation failed", err);
  }
  
})
.catch((err) => {
  console.error("DB connect failed", err);
  process.exit(1);
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

app.listen(PORT, () => {
  console.log(`🚀 Server ghg is running on http://localhost:${PORT}`);
});
