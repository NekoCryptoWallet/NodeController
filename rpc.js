import fetch from "node-fetch";

const port = process.env["PORT"] || 3000;
const rpcPort = process.env["RPC_PORT"] || 8022;
const testnetRpcPort = process.env["TESTNET_RPC_PORT"];

const encodeBase64 = (data) => {
  return Buffer.from(data).toString("base64");
};

export async function makeRpc(isTestnet, name, ...params) {
  try {
    const output = await fetch(
      `http://127.0.0.1:${rpcPort}/`,
      {
        method: "POST",
        headers: {
          "content-type": "text/plain;",
          Authorization:
            "Basic " + encodeBase64(process.env["RPC_CREDENTIALS"]),
        },
        body: JSON.stringify({
          jsonrpc: "1.0",
          id: "curltest",
          method: name,
          params,
        }),
      },
    );
    const obj = await output.json();
    if (obj.error) {
      const imATeapot = 418;
      return { status: imATeapot, response: obj.error.message };
    } else {
      const ok = 200;
      return { status: ok, response: JSON.stringify(obj.result) };
    }
  } catch (error) {
    if (error.errno === "ECONNREFUSED") {
      return { status: 503, response: "PIVX node was not responsive." };
    }
    console.error(error);
    if (error.name === "AbortError") {
      return "brequbest was aborted'";
    } else {
      return "non u sac";
    }
  }
}
