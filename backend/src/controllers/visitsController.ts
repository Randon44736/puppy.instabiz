import { Request, Response } from 'express';

interface VisitBooking {
  id: string;
  name: string;
  phone: string;
  email: string;
  breed: string;
  date: string;
  time: string;
  message?: string;
  createdAt: string;
  status: 'Confirmed' | 'Pending';
}

// In-memory appointments storage
const bookings: VisitBooking[] = [];

export const createVisitBooking = (req: Request, res: Response) => {
  const { name, phone, email, breed, date, time, message } = req.body;

  // Validation
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Full name is required (min 2 characters).' });
  }
  if (!phone || phone.trim().length < 7) {
    return res.status(400).json({ success: false, error: 'Valid phone/WhatsApp number is required.' });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Valid email address is required.' });
  }
  if (!date) {
    return res.status(400).json({ success: false, error: 'Preferred visit date is required.' });
  }

  const booking: VisitBooking = {
    id: `TP-BOOK-${Date.now().toString(36).toUpperCase()}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    breed: breed || 'General',
    date,
    time: time || '11:00 AM',
    message: message?.trim() || '',
    createdAt: new Date().toISOString(),
    status: 'Confirmed'
  };

  bookings.push(booking);

  console.log(`[Showroom Booking Received] ${booking.id} for ${booking.name} on ${booking.date}`);

  res.status(201).json({
    success: true,
    message: 'Your Downtown Dubai showroom appointment has been received!',
    booking,
    conciergeWhatsApp: `https://wa.me/971541676733?text=${encodeURIComponent(
      `Hi TeddyPups! I have reserved a showroom visit (Ref: ${booking.id}) for ${booking.name} on ${booking.date}.`
    )}`
  });
};

export const getAllVisits = (_req: Request, res: Response) => {
  res.json({
    success: true,
    total: bookings.length,
    bookings
  });
};
