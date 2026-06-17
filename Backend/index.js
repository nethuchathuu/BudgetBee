require('dotenv').config();
const express = require('express');
const { checkConnection } = require('./config/db');
const authRoutes = require('./routes/authRouter');
const ocrRoutes = require('./routes/ocrRouter');
const expensesRoutes = require('./routes/expensesRouter');
const notificationRoutes = require('./routes/notificationRouter');
const limitsRoutes = require('./routes/limitsRouter');
const userRoutes = require('./routes/userRouter');
const diaryRoutes = require('./routes/diaryRouter');
const supportRoutes = require('./routes/supportRouter');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/limits', limitsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/diary', diaryRoutes);
app.use('/api/support', supportRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await checkConnection();
    } catch (error) {
        console.error("Failed to initialize database:", error);
    }
});