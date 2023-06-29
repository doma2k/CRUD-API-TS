import http from 'http';
import { URL } from 'url';
import dotenv from 'dotenv';
import {
  handleGetUsers,
  handleGetUser,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
} from './handlers';

dotenv.config();
const port = process.env.SERVER_PORT;

const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    try {
      const url = new URL(req.url as string, `http://${req.headers.host}`);
      const id = url.pathname.split('/')[3];

      if (url.pathname === '/api/users' && req.method === 'GET') {
        await handleGetUsers(req, res);
      } else if (
        url.pathname.startsWith('/api/users/') &&
        req.method === 'GET'
      ) {
        await handleGetUser(req, res, id);
      } else if (url.pathname === '/api/users' && req.method === 'POST') {
        await handleCreateUser(req, res);
      } else if (
        url.pathname.startsWith('/api/users/') &&
        req.method === 'PUT'
      ) {
        await handleUpdateUser(req, res, id);
      } else if (
        url.pathname.startsWith('/api/users/') &&
        req.method === 'DELETE'
      ) {
        await handleDeleteUser(req, res, id);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
      }
    } catch (error) {
      console.error(`Caught an error: ${error}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Internal server error' }));
    }
  }
);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
