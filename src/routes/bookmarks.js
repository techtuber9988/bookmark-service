import { Router } from 'express';
import db from '../db.js';
import { validateBookmark, validateId } from '../middleware/validation.js';

const router = Router();

router.post('/', validateBookmark, (req, res) => {
  const { url, title, description } = req.validatedBody;

  const existing = db.prepare('SELECT id FROM bookmarks WHERE url = ?').get(url);
  if (existing) {
    return res.status(200).json({
      id: existing.id,
      url,
      title,
      description,
      message: 'bookmark already exists'
    });
  }

  const stmt = db.prepare('INSERT INTO bookmarks (url, title, description) VALUES (?, ?, ?)');
  const result = stmt.run(url, title, description);

  res.status(201).json({
    id: result.lastInsertRowid,
    url,
    title,
    description
  });
});

router.get('/', (req, res) => {
  const bookmarks = db.prepare('SELECT * FROM bookmarks ORDER BY created_at DESC').all();
  res.json(bookmarks);
});

router.get('/:id', validateId, (req, res) => {
  const bookmark = db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(req.validatedId);

  if (!bookmark) {
    return res.status(404).json({
      error: 'not_found',
      message: 'bookmark not found'
    });
  }

  res.json(bookmark);
});

router.delete('/:id', validateId, (req, res) => {
  const bookmark = db.prepare('SELECT * FROM bookmarks WHERE id = ?').get(req.validatedId);

  if (!bookmark) {
    return res.status(404).json({
      error: 'not_found',
      message: 'bookmark not found'
    });
  }

  db.prepare('DELETE FROM bookmarks WHERE id = ?').run(req.validatedId);

  res.status(204).send();
});

export default router;
