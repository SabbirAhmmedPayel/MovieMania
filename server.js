require('dotenv').config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const watchlistRoutes = require('./routes/watchlists');
const reviewRoutes = require('./routes/reviews');
const moviePersonsRoutes = require('./routes/moviePersons');
const upcomingRoutes = require('./routes/upcoming');
const genreRoutes = require('./routes/genres');
const notificationRoutes = require('./routes/notifications');
const editorRoutes = require('./routes/editor');

// Import Socket configuration and handler
const socketConfig = require('./config/socketConfig');
const SocketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with configuration from .env
const io = socketIo(server, socketConfig);

// Initialize notification service
const notificationService = require('./services/notificationService');

// Make io globally available
global.io = io;

// Initialize Socket Handler
const socketHandler = new SocketHandler(io, notificationService);

// CORS configuration from environment
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5001",
  credentials: true
}));

app.use(express.json());

// API endpoint to send notification to specific user
app.post('/api/notifications/send-to-user', (req, res) => {
  const { username, notification } = req.body;
  const result = socketHandler.sendNotificationToUser(username, notification);
  res.json(result);
});

// Send ALL future notifications to specific user
app.post('/api/notifications/send-all-future', async (req, res) => {
  const { username } = req.body;
  
  if (!username) {
    return res.json({ success: false, error: 'Username required' });
  }
  
  try {
    const result = await notificationService.sendAllFutureNotifications(username);
    res.json(result);
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Check all upcoming releases manually
app.post('/api/notifications/check-all-future', async (req, res) => {
  try {
    await notificationService.checkAllUpcomingReleases();
    res.json({ success: true, message: 'All future releases checked and notifications sent' });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Use routes
app.use('/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/watchlists', watchlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/movie-persons', moviePersonsRoutes);
app.use('/api/upcoming', upcomingRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/editor', editorRoutes);



// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    connectedUsers: socketHandler.getConnectedUsers().size
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server with Socket.IO listening on port ${PORT}`);
  console.log(`🔔 Auto notification system is running`);
  console.log(`👥 User-based notifications enabled`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`📡 Socket CORS Origin: ${process.env.SOCKET_CORS_ORIGIN}`);
});
