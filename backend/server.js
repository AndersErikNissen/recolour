import express from 'express';
import db from './database.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors()); 
app.use(express.json());
app.use('/api/public', express.static(path.join(__dirname, 'public')));

const createTicket = (ticket, images, partners) => {
  const ticketImages = images.filter((image) => {
    return image.ticket_id === ticket.id;
  });
  
  const groupedImages = {
    tickets: ticketImages.filter((image) => image.type === 'ticket'),
    attachments: ticketImages.filter((image) => image.type === 'attachment'),
    recolours: ticketImages.filter((image) => image.type === 'recolour'),
  };

  const partner = partners.find((partner) => {
    return partner.name === ticket.partner;
  });

  return {
    ...ticket,
    partner_info: partner || null,
    images: groupedImages
  };
}

app.get('/api/partners', (req, res) => {
  const partners = db.prepare(`
    SELECT * 
    FROM partners  
  `).all();

  return res.json(partners);
});

app.get('/api/available-photos', (req, res) => {
  const attachments = db.prepare('SELECT * FROM available_photos WHERE type = ?').all('attachment');
  const recolours = db.prepare('SELECT * FROM available_photos WHERE type = ?').all('recolour');
  const tickets = db.prepare('SELECT * FROM available_photos WHERE type = ?').all('ticket');

  res.json({
    attachments,
    recolours,
    tickets
  });
});

app.get('/api/tickets', (req, res) => {
  const tickets = db.prepare(`
    SELECT * 
    FROM tickets
  `).all();

  const images = db.prepare(`
    SELECT * 
    FROM ticket_images
  `).all();

  const partners = db.prepare(`
    SELECT * 
    FROM partners  
  `).all();

  const response = tickets.map((ticket) => createTicket(ticket, images, partners));

  res.json(response);
});

app.get('/api/tickets/:id', (req, res) => {
  const { id: ticketId } = req.params;
  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId);

  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const ticketImages = db.prepare('SELECT * FROM ticket_images WHERE ticket_id = ?').all(ticketId);

  const groupedImages = {
    original: ticketImages.filter((image) => {
      return image.type === 'original';
    }),
    attachment: ticketImages.filter((image) => {
      return image.type === 'attachment';
    }),
    recolour: ticketImages.filter((image) => {
      return image.type === 'recolour';
    }),
  };

  const partner = db.prepare('SELECT * FROM partners WHERE name = ?').get(ticket.partner);

  res.json({ 
    ...ticket, 
    partner_info: partner || null, 
    images: groupedImages 
  });
});

app.post('/api/tickets', (req, res) => {
  const { style, priority, partner, description, photos, user } = req.body;

  const theUser = user || 'operator default';

  const insertTicket = db.prepare(`
    INSERT INTO tickets (style, priority, partner, description)
    VALUES (?, ?, ?, ?)
  `);

  const result = insertTicket.run(style, priority, partner, description);
  const ticketId = result.lastInsertRowid;

  const insertImage = db.prepare(`
    INSERT INTO ticket_images (ticket_id, type, path, uploaded_by)
    VALUES (?, ?, ?, ?)
  `);

  photos.tickets.forEach((image) => {
    insertImage.run(ticketId, 'ticket', image.path, theUser);
  });

  photos.attachments.forEach((image) => {
    insertImage.run(ticketId, 'attachment', image.path, theUser);
  });

  photos.recolours.forEach((image) => {
    insertImage.run(ticketId, 'recolour', image.path, theUser);
  });

  const theNewTicket = db.prepare(`
    SELECT * 
    FROM tickets WHERE id = ?
  `).get(ticketId);

  const images = db.prepare(`
    SELECT * 
    FROM ticket_images
  `).all();

  const partners = db.prepare(`
    SELECT * 
    FROM partners  
  `).all();

  res.json(createTicket(theNewTicket, images, partners));
});

app.patch('/api/tickets/:id/send', (req, res) => {
  const id = req.params.id;

  const ticket = db.prepare(`
    SELECT * 
    FROM tickets WHERE id = ?
  `).get(id);

  const partner = db.prepare(`
    SELECT * 
    FROM partners WHERE name = ?
  `).get(ticket.partner);

  console.log(`✉️ Simulating sending ticket ${id} to ${partner.api_endpoint}...`);

  db.prepare(`
    UPDATE tickets SET status = ? 
    WHERE id = ?  
  `).run('sent', id);

  // Simulate the delay before the partner starts on the ticket process
  const delay = 5000;

  setTimeout(() => {
    db.prepare(`
      UPDATE tickets SET status = ? 
      WHERE id = ?
    `).run('in progress', id);
  }, delay);

  res.json({ 
    id: id,
    partner: partner,
    delay: delay
  });
});

app.patch('/api/tickets/:id/status', (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  const ticket = db.prepare(`
    SELECT * 
    FROM tickets WHERE id = ?
  `).get(id);

  const oldStatus = ticket.status;

  db.prepare(`
    UPDATE tickets SET status = ? 
    WHERE id = ?  
  `).run(status, id);

  res.json({ message: `Ticket status updated to ${status}, from ${oldStatus}` });
});

app.use(express.static(path.join(__dirname, '../frontend/app/dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/app/dist/index.html'));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
