import fetch from "node-fetch";
import NodeCache from "node-cache";
import dotenv from "dotenv";
import { isBoolean } from "util";

const ENV = dotenv.config();

const CDEK_AUTH_URL = ENV.parsed!.CDEK_AUTH_URL;
const CDEK_CLIENT_ID = ENV.parsed!.CDEK_CLIENT_ID;
const CDEK_CLIENT_SECRET = ENV.parsed!.CDEK_CLIENT_SECRET;

const myCache = new NodeCache({ checkperiod: 1 });

export const getCdekToken = async () => {
  let cache;
  if (myCache.has("myKey")) {
    return (cache = myCache.get("myKey"));
  } else {
    await fetch(
      `${CDEK_AUTH_URL}/token?grant_type=client_credentials&client_id=${CDEK_CLIENT_ID}&client_secret=${CDEK_CLIENT_SECRET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        return (cache = myCache.set("myKey", json.access_token, 3599));
        // Строка 28 нужна для проверки загрузки нового токена....
        // console.log("load new token:", myCache.has("myKey"));
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
  return cache;
};

myCache.on("expired", async (key, value) => {
  await getCdekToken();
});
