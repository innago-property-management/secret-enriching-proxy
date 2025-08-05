// config/index.ts

const THIRD_PARTY_API_URL: string | undefined = Deno.env.get(
    "THIRD_PARTY_API_URL",
);

if (!THIRD_PARTY_API_URL) {
    throw new Error("Fatal: missing URL");
}

const API_SECRET: string = Deno.env.get("API_SECRET") ||
    "default-secret-for-testing";

if (API_SECRET === "default-secret-for-testing") {
    console.warn(
        "⚠️ Using default secret. Set the API_SECRET environment variable in production!",
    );
}

const BODY_KEY : string | undefined = Deno.env.get("BODY_KEY") || undefined;
const HEADER_KEY : string | undefined = Deno.env.get("HEADER_NAME") || undefined;

const port: number = parseInt(
    Deno.env.get("PROXY_PORT") ?? "8080",
);

export {
    THIRD_PARTY_API_URL,
    API_SECRET,
    BODY_KEY,
    HEADER_KEY,
    port };
