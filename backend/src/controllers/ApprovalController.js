const Booking = require('../models/Booking');

module.exports = {
  async store(req, res){
    const { booking_id } = req.params; //pega o id que vem como parametro na rota

    const booking = await Booking.findById(booking_id).populate('spot');

    booking.approved = true;

    await booking.save();

    const bookingUserSocket = req.connectedUsers[booking.user]; //vai procurar pelo usuario que ta fazendo aquele booking

    if(bookingUserSocket){
      req.io.to(bookingUserSocket).emit('booking_response', booking);
    }

    return res.json(booking);
  }
};