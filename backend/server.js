import express from "express"
import 'dotenv/config'
import connectDB from "./database/db.js"
import userRoute from "./routes/userRoute.js"
import authRoute from "./routes/authRoute.js"
import cors from 'cors'

const app = express()

const PORT = process.env.PORT || 8000

// Middleware
app.use(express.json())
app.use(cors({
    origin: 'http://3.107.249.139',
    credentials: true
}))

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Server is running!',
        status: 'OK'
    });
});

// Routes - make sure these imports are correct
app.use('/auth', authRoute)
app.use('/user', userRoute)

// Start server
app.listen(PORT, () => {
    connectDB()
    console.log(`Server is listening at port ${PORT}`);
})