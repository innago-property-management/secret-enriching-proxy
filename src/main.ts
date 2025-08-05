// main.ts

import { makeHandler } from "./handler.ts";
import {
  API_SECRET,
  BODY_KEY,
  HEADER_KEY,
  port,
  THIRD_PARTY_API_URL,
} from "./config/index.ts";

const handler: (req: Request) => Promise<Response> = makeHandler({
  host: THIRD_PARTY_API_URL!,
  key: API_SECRET,
  headerName: HEADER_KEY,
  bodyKey: BODY_KEY,
});

const server: Deno.HttpServer<Deno.NetAddr> = Deno.serve({ handler, port });

console.log(`🚀 Deno proxy server running on http://localhost:${port}`);
console.log(`Forwarding requests to: ${THIRD_PARTY_API_URL}`);

await server.finished;
