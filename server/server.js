require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const { Server } = require('socket.io');
const connectDB = require('./config/db');

connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/agent', require('./routes/agent.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/packages', require('./routes/package.routes'));
app.use('/api/reaction-vault', require('./routes/reactionVault.routes'));
app.use('/api/wishlist', require('./routes/wishlist.routes'));
app.use('/api/reviews', require('./routes/review.routes'));
app.use('/api/feedback', require('./routes/feedback.routes'));

require('./socket/tracker.socket')(io);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
