import { expect } from "jsr:@std/expect";
import { makeHandler } from "./handler.ts";

Deno.test("should add header if env variable set", async () => {
  const host = `https://${crypto.randomUUID()}.com`;
  const key = crypto.randomUUID();
  const headerName = `x-${crypto.randomUUID()}`;

  const handler = makeHandler({ host, key, headerName });

  const req = new Request(`${host}/test-path`, {
    method: "GET",
    headers: [["Content-Type", "application/json"]],
  });

  let capturedRequest: Request | undefined;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (request, init) => {
    capturedRequest = new Request(request, init);
    return Promise.resolve(new Response("ok"));
  };

  try {
    await handler(req);

    expect(capturedRequest).toBeDefined();
    expect(capturedRequest!.url).toBe(`${host}/test-path`);
    expect(capturedRequest!.headers.has(headerName)).toBe(true);
    expect(capturedRequest!.headers.get(headerName)).toBe(key);
    expect(capturedRequest!.headers.get("Content-Type")).toBe("application/json");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("should add key to json body if env variable set", async () => {
  const host = `https://${crypto.randomUUID()}.com`;
  const key = crypto.randomUUID();
  const bodyKey = crypto.randomUUID();

  const handler = makeHandler({ host, key, bodyKey });

  const originalPayload = { message: "Hello, world!" };
  const req = new Request(`${host}/test-path`, {
    method: "POST",
    headers: [["Content-Type", "application/json"]],
    body: JSON.stringify(originalPayload),
  });

  let capturedRequest: Request | undefined;
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (request, init) => {
    capturedRequest = new Request(request, init);
    return Promise.resolve(new Response("ok"));
  };

  try {
    await handler(req);

    expect(capturedRequest).toBeDefined();
    
    const capturedBody = await capturedRequest!.json();

    expect(capturedBody[bodyKey]).toBe(key);
    expect(capturedBody.message).toBe(originalPayload.message);
    expect(capturedRequest!.method).toBe("POST");
    expect(capturedRequest!.url).toBe(`${host}/test-path`);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
