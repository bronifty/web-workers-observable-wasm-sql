import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

// Add COOP and COEP headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

// Serve static files from the current directory
app.use(express.static(path.join(import.meta.dirname)));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

console.log(import.meta.dirname);
