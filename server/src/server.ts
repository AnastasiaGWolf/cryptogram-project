import http from 'http';
import { WebSocketServer } from 'ws';
import app from './app';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const wss = new WebSocketServer({ server });
wss.on('connection', (ws) => {
  console.log('New WS connection');
  ws.send('Hello from server');
});

server.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
