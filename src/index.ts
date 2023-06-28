import http from 'http';
import fs from 'fs';

interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

const server = http.createServer(function (req, res) {
  const db = './src/db.json';
  const method = req.method;
    const id = Number(req.url?.split('/')[2]);

  switch (method) {
    case 'GET':
      if (req.url === '/users') {
        fs.readFile(db, 'utf-8', (error, data) => {
          if (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
          }
        });
      } else if (id) {
        fs.readFile(db, 'utf-8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
          } else {
            const users: User[] = JSON.parse(data);
              const user = users.find((user) => user.id === id);
            if (user) {
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(user));
            } else {
              res.writeHead(404, { 'Content-Type': 'application/json' });
              res.end(
                JSON.stringify({ message: `User with id: ${id} not found` })
              );
            }
          }
        });
      }
          
    case 'POST':
          
      break;

    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Route not found');
  }
});

server.listen(8080, () => console.log('Server up, and running!'));
