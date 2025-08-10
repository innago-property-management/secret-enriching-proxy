import { expect } from "jsr:@std/expect";
import { addHeader } from "./add-header.ts";

Deno.test("add-header tests", async (t) => {
  await t.step("should add a new header with the given name and value", () => {
    const req = new Request("https://example.com", {
      headers: { "Content-Type": "application/json" },
    });
    const headerKeyName = `x-test-header-${crypto.randomUUID()}`;
    const apiKeyValue = crypto.randomUUID();

    const newHeaders = addHeader({ req, headerKeyName, apiKeyValue });

    expect(newHeaders.get(headerKeyName)).toBe(apiKeyValue);
    expect(newHeaders.get("Content-Type")).toBe("application/json");
  });

  await t.step("should use the default header name 'x-api-key' if not provided", () => {
    const req = new Request("https://example.com");
    const apiKeyValue = crypto.randomUUID();

    const newHeaders = addHeader({ req, apiKeyValue });

    expect(newHeaders.get("x-api-key")).toBe(apiKeyValue);
  });

  await t.step("should overwrite an existing header with the same name", () => {
    const headerKeyName = "x-to-be-overwritten";
    const originalValue = "original-value";
    const apiKeyValue = "new-value";

    const req = new Request("https://example.com", {
      headers: { [headerKeyName]: originalValue },
    });

    const newHeaders = addHeader({ req, headerKeyName, apiKeyValue });

    expect(newHeaders.get(headerKeyName)).toBe(apiKeyValue);
  });

  await t.step("should preserve other headers from the original request", () => {
    const originalHeaders = {
      "Accept": "application/json",
      "X-Request-ID": `req-${crypto.randomUUID()}`,
    };
    const req = new Request("https://example.com", {
      headers: originalHeaders,
    });
    const headerKeyName = "x-new-header";
    const apiKeyValue = crypto.randomUUID();

    const newHeaders = addHeader({ req, headerKeyName, apiKeyValue });

    expect(newHeaders.get("Accept")).toBe(originalHeaders.Accept);
    expect(newHeaders.get("X-Request-ID")).toBe(originalHeaders["X-Request-ID"]);
    expect(newHeaders.get(headerKeyName)).toBe(apiKeyValue);
  });
});
