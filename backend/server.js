import express from 'express';
import db from './database.js';

const app = express();
app.use(express.json());

app.get('/tickets', (req, res) => {
  const tickets = db.prepare(`
    SELECT * 
    FROM tickets
  `).all();

  const allImages = db.prepare(`
    SELECT * 
    FROM ticket_images
  `).all();

  const partners = db.prepare(`
    SELECT * 
    FROM partners  
  `).all();

  const response = tickets.map((ticket) => {
    const ticketImages = allImages.filter((image) => {
      image.ticket_id === ticket.id;
    });

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

    const partner = partners.find((partner) => {
       partner.name === ticket.partner;
    });

    return {
      ...ticket,
      partner_info: partner || null,
      images: groupedImages
    };
  });

  res.json(response);
});

app.get('/tickets/:id', (req, res) => {
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


app.post('/tickets', (req, res) => {
  const { style, priority, partner, description, originals, attachments, recolours, user } = req.body;

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

  originals.forEach((image) => {
    insertImage.run(ticketId, 'original', `../public/photos/${image}`, user);
  });

  attachments.forEach((image) => {
    insertImage.run(ticketId, 'attachment', `../public/photos/${image}`, user);
  });

  recolours.forEach((image) => {
    insertImage.run(ticketId, 'recolour', `../public/photos/${image}`, user);
  });

  res.json({ message: 'Ticket created', ticketId });
});

app.post('/tickets/:id/send', (req, res) => {
  const id = req.params.id;
  const ticket = db.prepare(`
    SELECT * 
    FROM tickets WHERE id = ?
  `).get(id);
  const partner = db.prepare(`
    SELECT * 
    FROM partners WHERE name = ?
  `).get(ticket.partner);

  console.log(`Simulating sending ticket ${id} to ${partner.api_endpoint}...`);

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

// Backlog
app.post('/tickets/:id/complete', (req, res) => {});
app.post('/tickets/:id/reject', (req, res) => {});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
