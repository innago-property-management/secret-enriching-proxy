const makeHandler = (
  host: string,
  key: string,
  headerName: string | undefined,
  bodyKey: string | undefined,
) =>
  async function handler(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const targetUrl = `${host}${url.pathname}${url.search}`;

    console.log(`[Proxy] Forwarding ${req.method} request to: ${targetUrl}`);

    const headers = new Headers(req.headers);
    headers.delete("host");
    headers.delete("content-length");

      let body: BodyInit | Error | null | undefined = req.body;

    if (!!headerName){
        // TODO
    }
    else {
        body = await modifyBody(req, bodyKey, key);

        if (body instanceof Error) {
            console.error(body);
        }
    }

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

const modifyBody = async function (
  req: Request,
  bodyKeyName: string | undefined,
  apiKeyValue: string
) : Promise<BodyInit | Error | undefined> {

  let body: BodyInit | null = req.body;

  const canModifyBody = (req.method === "POST" || req.method === "PUT") &&
    req.headers.get("content-type")?.includes("application/json");

  let retVal: BodyInit | Error | undefined;

  if (canModifyBody && !!bodyKeyName) {
    try {
      const originalPayload = await req.json();

      const modifiedPayload = {
        ...originalPayload,
        [bodyKeyName]: apiKeyValue,
      };

      body = JSON.stringify(modifiedPayload);
      console.log("[Proxy] Modified request body to include secret.");

      retVal = body;
    } catch (error) {
      console.error(
        "[Proxy] Could not parse JSON body, forwarding as-is.",
        (error as Error).message,
      );
      retVal = error as Error;
    }
  }

  return retVal;
};

export { makeHandler };
