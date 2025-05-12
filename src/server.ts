
import http from 'http';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import dotenv from 'dotenv';
import { users } from './data/users';

dotenv.config();

const PORT = process.env.PORT || 3000;

let userData = [...users];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // GET /api/users
  if (method === 'GET' && url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userData));
    return;
  }

  // GET /api/users/:userId
  const userIdMatch = url?.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);
  if (method === 'GET' && userIdMatch) {
    const userId = userIdMatch[1];

    if (!isUuid(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid UUID format' }));
      return;
    }

    const user = userData.find((u) => u.id === userId);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `User with id ${userId} not found` }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
    return;
  }

  // POST /api/users
  if (method === 'POST' && url === '/api/users') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const { name, age } = JSON.parse(body);

        if (typeof name !== 'string' || typeof age !== 'number') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid user data' }));
          return;
        }

        const newUser = {
          id: uuidv4(),
          name,
          age,
        };

        userData.push(newUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
      }
    });

    return;
  }

  // DELETE /api/users/:userId
  if (method === 'DELETE' && userIdMatch) {
    const userId = userIdMatch[1];

    if (!isUuid(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid UUID format' }));
      return;
    }

    const userIndex = userData.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }

    userData.splice(userIndex, 1);
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  // Default fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
