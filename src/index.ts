import http from 'http';
import fs from 'fs';

const server = http.createServer(function (req, res) {
  const method = req.method;
  switch (method) {
    case 'GET':
      if (req.url === '/users') {
        fs.readFile('./db.json', 'utf-8', (error, data) => {
          if (error) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
          }
        });
      }
      break;
    default:
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Route not found');
  }
});

server.listen(8080, () => console.log('Server up, and running!'));
