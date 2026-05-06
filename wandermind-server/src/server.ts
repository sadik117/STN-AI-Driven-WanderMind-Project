import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import { logger, httpLogger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimit.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import destinationRoutes from './routes/destination.routes';
import experienceRoutes from './routes/experience.routes';
import bookingRoutes from './routes/booking.routes';
import itineraryRoutes from './routes/itinerary.routes';
import reviewRoutes from './routes/review.routes';
import blogRoutes from './routes/blog.routes';
import aiRoutes from './routes/ai.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Socket.io setup
export const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join', (userId: string) => {
    socket.join(`user:${userId}`);
    logger.info(`User ${userId} joined their notification room`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(httpLogger);
app.use(generalLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/experiences', experienceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/itineraries', itineraryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'WanderMind API is running 🌍', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('WanderMind is running..');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  logger.info(`WanderMind server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
