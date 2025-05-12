import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { users } from '../data/users';
import { User } from '../models/user';
import { sendJson, sendError } from '../utils/response';

let userData: User[] = [...users];

export const getAllUsers = (res: ServerResponse) => {
  sendJson(res, 200, userData);
};

export const getUserById = (res: ServerResponse, userId: string) => {
  if (!isUuid(userId)) return sendError(res, 400, 'Invalid UUID format');
  const user = userData.find((u) => u.id === userId);
  if (!user) return sendError(res, 404, `User with id ${userId} not found`);
  sendJson(res, 200, user);
};

export const createUser = (req: IncomingMessage, res: ServerResponse) => {
  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    try {
      const { username, age, hobbies } = JSON.parse(body);
      if (
        typeof username !== 'string' ||
        typeof age !== 'number' ||
        !Array.isArray(hobbies) ||
        !hobbies.every((h) => typeof h === 'string')
      ) {
        return sendError(res, 400, 'Invalid user data');
      }

      const newUser: User = {
        id: uuidv4(),
        username,
        age,
        hobbies,
      };

      userData.push(newUser);
      sendJson(res, 201, newUser);
    } catch {
      sendError(res, 400, 'Malformed JSON');
    }
  });
};

export const deleteUser = (res: ServerResponse, userId: string) => {
  if (!isUuid(userId)) return sendError(res, 400, 'Invalid UUID format');
  const index = userData.findIndex((u) => u.id === userId);
  if (index === -1) return sendError(res, 404, 'User not found');
  userData.splice(index, 1);
  res.writeHead(204);
  res.end();
};


export const updateUser = (req: IncomingMessage, res: ServerResponse, userId: string) => {
  if (!isUuid(userId)) {
    return sendError(res, 400, 'Invalid UUID format');
  }

  const userIndex = userData.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return sendError(res, 404, `User with id ${userId} not found`);
  }

  let body = '';
  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    try {
      const { username, age, hobbies } = JSON.parse(body);

      if (
        typeof username !== 'string' ||
        typeof age !== 'number' ||
        !Array.isArray(hobbies) ||
        !hobbies.every(h => typeof h === 'string')
      ) {
        return sendError(res, 400, 'Invalid user data');
      }

      const updatedUser: User = {
        id: userId,
        username,
        age,
        hobbies,
      };

      userData[userIndex] = updatedUser;
      sendJson(res, 200, updatedUser);
    } catch {
      sendError(res, 400, 'Malformed JSON');
    }
  });
};

