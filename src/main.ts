import { makeHandler } from "./handler.ts";

const THIRD_PARTY_API_URL : string | undefined = Deno.env.get("THIRD_PARTY_API_URL");

if (!THIRD_PARTY_API_URL){
  throw new Error("Fatal: missing URL");
}

const API_SECRET :string = Deno.env.get("API_SECRET") || "default-secret-for-testing";

if (API_SECRET === "default-secret-for-testing") {
  console.warn(
    "⚠️ Using default secret. Set the API_SECRET environment variable in production!",
  );
}

const port: number = parseInt(
  Deno.env.get("PROXY_PORT") ?? "8080",
);

console.log(`🚀 Deno proxy server running on http://localhost:${port}`);
console.log(`Forwarding requests to: ${THIRD_PARTY_API_URL}`);

const handler : (req: Request) => Promise<Response> = makeHandler(THIRD_PARTY_API_URL, API_SECRET);

const server : Deno.HttpServer<Deno.NetAddr> = Deno.serve({ handler, port });

await server.finished;
