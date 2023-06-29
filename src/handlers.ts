import { IncomingMessage, ServerResponse } from 'http';
import { v4 as randomId, validate } from 'uuid';

let users: User[] = [];

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export const handleGetUsers = (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(users));
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};

export const handleGetUser = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (!validate(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid userId' }));
        return;
      }
      const user = users.find((u) => u.id === id);
      if (user) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
        resolve();
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
      }
    } catch (err) {
      reject(err);
    }
  });
};

export const handleCreateUser = (
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newUser: User = JSON.parse(body);
        newUser.id = randomId();
        users.push(newUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
};

export const handleUpdateUser = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (!validate(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid userId' }));
        return;
      }
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const updatedUser: User = JSON.parse(body);
          const index = users.findIndex((user) => user.id === id);
          if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return;
          }
          users[index] = { ...users[index], ...updatedUser };
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(users[index]));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Invalid json in request body' }));
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

export const handleDeleteUser = (
  req: IncomingMessage,
  res: ServerResponse,
  id: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      if (!validate(id)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid userId' }));
        return;
      }
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
      }
      users.splice(index, 1);
      res.writeHead(204, { 'Content-Type': 'application/json' });
      res.end();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};
