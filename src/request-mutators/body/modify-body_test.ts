import { expect } from "jsr:@std/expect";
import { modifyBody } from "./modify-body.ts";

Deno.test("modify-body tests", async (t) => {
  await t.step("should add key to JSON body for a POST request", async () => {
    const apiKeyValue = crypto.randomUUID();
    const bodyKeyName = crypto.randomUUID();
    const originalPayload = { test: "data" };

    const req = new Request("https://example.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(originalPayload),
    });

    const result = await modifyBody({ req, apiKeyValue, bodyKeyName });
    const modifiedPayload = JSON.parse(result as string);

    expect(modifiedPayload[bodyKeyName]).toBe(apiKeyValue);
    expect(modifiedPayload.test).toBe(originalPayload.test);
  });

  await t.step("should add key to JSON body for a PUT request", async () => {
    const apiKeyValue = crypto.randomUUID();
    const bodyKeyName = crypto.randomUUID();
    const originalPayload = { test: "data" };

    const req = new Request("https://example.com", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(originalPayload),
    });

    const result = await modifyBody({ req, apiKeyValue, bodyKeyName });
    const modifiedPayload = JSON.parse(result as string);

    expect(modifiedPayload[bodyKeyName]).toBe(apiKeyValue);
    expect(modifiedPayload.test).toBe(originalPayload.test);
  });

  await t.step("should return undefined for GET requests", async () => {
    const req = new Request("https://example.com", { method: "GET" });
    const result = await modifyBody({ req, apiKeyValue: "test-key" });
    expect(result).toBeUndefined();
  });

  await t.step("should return undefined for non-JSON content types", async () => {
    const req = new Request("https://example.com", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "hello",
    });
    const result = await modifyBody({ req, apiKeyValue: "test-key" });
    expect(result).toBeUndefined();
  });

  await t.step("should return an error for malformed JSON", async () => {
    const req = new Request("https://example.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ not json }",
    });
    const result = await modifyBody({ req, apiKeyValue: "test-key" });
    expect(result).toBeInstanceOf(Error);
  });

  await t.step("should use default bodyKeyName 'apiKey' when it is not provided", async () => {
    const apiKeyValue = crypto.randomUUID();
    const originalPayload = { test: "data" };

    const req = new Request("https://example.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(originalPayload),
    });

    const result = await modifyBody({ req, apiKeyValue });
    const modifiedPayload = JSON.parse(result as string);

    expect(modifiedPayload.apiKey).toBe(apiKeyValue);
  });
});
