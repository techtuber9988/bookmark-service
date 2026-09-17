import express from 'express';
import bookmarkRoutes from './routes/bookmarks.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10kb' }));

app.use('/bookmarks', bookmarkRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'internal_error',
    message: 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`Bookmark service running on port ${PORT}`);
});
