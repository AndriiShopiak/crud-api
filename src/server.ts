import http from 'http';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const requestId = uuidv4();

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Hello, world!',
    requestId,
    method: req.method,
    url: req.url,
  }));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
