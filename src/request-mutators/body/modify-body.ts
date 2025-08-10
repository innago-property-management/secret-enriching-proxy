// body/modify-body.ts

import {ModifyBodyArg} from "./types.ts";

const modifyBody = async function (
  {
    req,
    bodyKeyName = "apiKey",
    apiKeyValue,
  }: ModifyBodyArg,
): Promise<BodyInit | Error | undefined> {
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

export { modifyBody };
