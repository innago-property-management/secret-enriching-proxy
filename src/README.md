This Deno server acts as a secure proxy.
It listens for incoming JSON requests, adds a secret key to the body,
and forwards the request to a third-party API.

## --- How to Run ---
1. Set environment variables
   - `export API_SECRET="your-real-secret-key-goes-here"`
   - `export THIRD_PARTY_API_URL="https://real.url/goes/here"`
   - `export PROXY_PORT=8080`
   - `export HEADER_NAME="x-api-key"` **-OR-** `export BODY_KEY="propertyNameForApiKey"` 
     - **IMPORTANT** if `HEADER_NAME` has a value, the `API_SECRET` is sent in the header; if you wish to send in the body, use `BODY_KEY` -- the options are mutually exclusive and header wins.
2. Run the server:
   - `deno run --allow-net --allow-env main.ts`

## --- How to Test ---
In another terminal, use curl. This only works for methods with a body.
`curl -X POST -H "Content-Type: application/json" -d '{"name":"Alice"}' http://localhost:8080/users`
