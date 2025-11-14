const http = require('http');
const WebSocketServer = require('ws');
const app = require('./app')

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// const wss = new WebSocketServer({ server });
// wss.on('connection', (ws) => {
//   console.log('New WS connection');
//   ws.send('Hello from server');
// });

server.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));
