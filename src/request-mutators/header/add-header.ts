// header/add-header.ts

import { AddHeaderArg } from "./types.ts";

const addHeader = function (
  {
    req,
    headerKeyName = "x-api-key",
    apiKeyValue,
  }: AddHeaderArg,
): Headers {
  const headers = new Headers(req.headers);
  headers.set(headerKeyName, apiKeyValue);
  return headers;
};

export { addHeader };
