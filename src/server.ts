import http from 'http';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import dotenv from 'dotenv';
import { users as initialUsers } from './data/users';
import { User } from './types/User';

dotenv.config();

const PORT = process.env.PORT || 3000;
let users: User[] = [...initialUsers];

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // GET all users
  if (method === 'GET' && url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    return;
  }

  // GET user by ID
  const userIdMatch = url?.match(/^\/api\/users\/([a-zA-Z0-9-]+)$/);
  if (method === 'GET' && userIdMatch) {
    const userId = userIdMatch[1];

    if (!isUuid(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid UUID format' }));
      return;
    }

    const user = users.find((u) => u.id === userId);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `User with id ${userId} not found` }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
    return;
  }

  // POST create user
  if (method === 'POST' && url === '/api/users') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { username, age, hobbies } = JSON.parse(body);

        if (
          typeof username !== 'string' ||
          typeof age !== 'number' ||
          !Array.isArray(hobbies) ||
          !hobbies.every(h => typeof h === 'string')
        ) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid user data' }));
          return;
        }

        const newUser: User = {
          id: uuidv4(),
          username,
          age,
          hobbies,
        };

        users.push(newUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed JSON' }));
      }
    });
    return;
  }

  // DELETE user
  if (method === 'DELETE' && userIdMatch) {
    const userId = userIdMatch[1];

    if (!isUuid(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid UUID format' }));
      return;
    }

    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
      return;
    }

    users.splice(index, 1);
    res.writeHead(204);
    res.end();
    return;
  }

  // Unknown route
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
