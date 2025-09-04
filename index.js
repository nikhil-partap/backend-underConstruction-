import express from "express";
import router from './routes/api.js';
import bodyParser from "body-parser";
import mongoose from 'mongoose'
import connectDB from "./database/db.js"

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api', router)


app.listen(PORT, () => {
    console.log(`🚀 Server ghg is running on http://localhost:${PORT}`);
})

app.get("/", (req, res) => {
    console.log("conected to the site (got the req from the site)")
    res.send("hi there 👋   plese head to http://localhost:4000/api/ninjas ")
})


// error handler (last middleware)
app.use((error, req, res, next) => {
    // console.log(error)
    console.error(error.stack);
    res.status(error.status || 500).json({
        error: error.message || "Internal Server Error",
    });
});
