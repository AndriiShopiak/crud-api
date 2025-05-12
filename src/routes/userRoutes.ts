import { IncomingMessage, ServerResponse } from 'http';
import {
  getAllUsers,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/userController';

export const handleUserRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;
  const match = url?.match(/^\/api\/users\/?([a-zA-Z0-9-]*)?$/);
  const userId = match?.[1];

  if (method === 'GET' && url === '/api/users') return getAllUsers(res);
  if (method === 'GET' && userId) return getUserById(res, userId);
  if (method === 'POST' && url === '/api/users') return createUser(req, res);
  if (method === 'DELETE' && userId) return deleteUser(res, userId);
  if (method === 'PUT' && userId) return updateUser(req, res, userId);

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
};
