// handler.ts

import { addHeader, modifyBody } from "./request-mutators/index.ts";

export type MakeHandlerArg = {
  host: string;
  key: string;
  headerName?: string | undefined;
  bodyKey?: string | undefined;
};

const makeHandler = ({
  host,
  key,
  headerName,
  bodyKey,
}: MakeHandlerArg) =>
  async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const targetUrl = `${host}${url.pathname}${url.search}`;

    console.log(`[Proxy] Forwarding ${req.method} request to: ${targetUrl}`);

    let headers = new Headers(req.headers);

    let body: BodyInit | Error | null | undefined = req.body;

    if (headerName) {
      headers = addHeader({
        req: req,
        apiKeyValue: key,
        headerKeyName: headerName,
      });
    } else if (bodyKey) {
      body = await modifyBody({ req, bodyKeyName: bodyKey, apiKeyValue: key });

      if (body instanceof Error) {
        console.error(body);
      }
    }

    headers.delete("host");
    headers.delete("content-length");

    try {
      return await fetch(targetUrl, {
        method: req.method,
        headers: headers,
        body: body as BodyInit,
      });
    } catch (error) {
      console.error("[Proxy] Error forwarding request:", error);
      return new Response(
        "Proxy error: Could not connect to the upstream server.",
        { status: 502 },
      );
    }
  };

export { makeHandler };
