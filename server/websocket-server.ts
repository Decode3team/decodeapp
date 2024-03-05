import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { appRouter } from './routers';
import { createContext } from './context';
import { wssHostUrl, wssPort } from '@/lib/constants';

const wss = new ws.Server({
  port: wssPort,
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext });
wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

console.log(`✅ WebSocket Server listening on ${wssHostUrl}`);
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
