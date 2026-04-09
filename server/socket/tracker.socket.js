const Booking = require('../models/Booking');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket Connected: ${socket.id}`);
    
    socket.on('join_job_room', (jobId) => {
      socket.join(`job:${jobId}`);
    });

    socket.on('agent:updateLocation', async (data) => {
      const { jobId, lat, lng } = data;
      try {
        await Booking.findByIdAndUpdate(jobId, { agentLiveLocation: { lat, lng } });
        io.to(`job:${jobId}`).emit('location:update', { lat, lng });
      } catch (error) {
        console.error('Error updating location:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });
};
