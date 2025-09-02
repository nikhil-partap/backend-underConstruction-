import express from "express";
import router from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json())
app.use('', router)


app.listen(PORT, () => {
    console.log(`🚀 Server ghg is running on http://localhost:${PORT}`);
})

app.get("/", (req, res) => {
    console.log("conected to the site (got the req from the site)")
    res.send("hi there")
})


// error handler (last middleware)
app.use((err, req, res, next) => {
    console.error(err.stack); // detailed error for dev logs
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
    });
});
