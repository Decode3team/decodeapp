import express from 'express';
import cors from 'cors';

import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';
import { createContext } from './context';
import { appRouter } from './routers';
import { apiPort, hostUrl, wsApiHostUrl } from '@/lib/constants';

const app = express();

app.use(cors({ origin: hostUrl }));

app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

const server = app.listen(apiPort);
const wss = new ws.Server({ server });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
});

wss.on('connection', (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

console.log(`✅ WebSocket Server listening on ${wsApiHostUrl}`);
process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
