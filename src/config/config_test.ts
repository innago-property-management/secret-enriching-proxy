import { expect } from "jsr:@std/expect";

type Config = typeof import("./index.ts");

Deno.test("configuration tests", async (t) => {
  const originalGet = Deno.env.get;
  const mockEnv = new Map<string, string>();

  Deno.env.get = (key: string) => mockEnv.get(key);

  const loadConfig = async (): Promise<Config> => {
    // Bust the import cache to force re-evaluation of the module
    return await import(`./index.ts?v=${crypto.randomUUID()}`);
  };

  await t.step("should throw an error if THIRD_PARTY_API_URL is not set", async () => {
    mockEnv.clear();
    await expect(loadConfig()).rejects.toThrow("Fatal: missing URL");
  });

  await t.step("should use default API_SECRET when not set", async () => {
    mockEnv.clear();
    mockEnv.set("THIRD_PARTY_API_URL", "https://api.example.com");

    const config = await loadConfig();
    expect(config.API_SECRET).toBe("default-secret-for-testing");
  });

  await t.step("should read all environment variables correctly when set", async () => {
    mockEnv.clear();
    const testUrl = "https://test.com";
    const testSecret = "my-super-secret";
    const testBodyKey = "myBodyKey";
    const testHeaderKey = "x-my-header";
    const testPort = "9999";

    mockEnv.set("THIRD_PARTY_API_URL", testUrl);
    mockEnv.set("API_SECRET", testSecret);
    mockEnv.set("BODY_KEY", testBodyKey);
    mockEnv.set("HEADER_NAME", testHeaderKey);
    mockEnv.set("PROXY_PORT", testPort);

    const config = await loadConfig();

    expect(config.THIRD_PARTY_API_URL).toBe(testUrl);
    expect(config.API_SECRET).toBe(testSecret);
    expect(config.BODY_KEY).toBe(testBodyKey);
    expect(config.HEADER_KEY).toBe(testHeaderKey);
    expect(config.port).toBe(9999);
  });

  await t.step("should use default port when PROXY_PORT is not set", async () => {
    mockEnv.clear();
    mockEnv.set("THIRD_PARTY_API_URL", "https://api.example.com");

    const config = await loadConfig();
    expect(config.port).toBe(8080);
  });

  await t.step("should have undefined keys when optional variables are not set", async () => {
    mockEnv.clear();
    mockEnv.set("THIRD_PARTY_API_URL", "https://api.example.com");

    const config = await loadConfig();
    expect(config.BODY_KEY).toBeUndefined();
    expect(config.HEADER_KEY).toBeUndefined();
  });

  Deno.env.get = originalGet;
});
