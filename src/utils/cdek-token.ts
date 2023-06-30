import fetch from "node-fetch";
import NodeCache from "node-cache";
import dotenv from "dotenv";

const ENV = dotenv.config();
const CDEK_AUTH_URL = ENV.parsed!.CDEK_AUTH_URL;
const CDEK_CLIENT_ID = ENV.parsed!.CDEK_CLIENT_ID;
const CDEK_CLIENT_SECRET = ENV.parsed!.CDEK_CLIENT_SECRET;

export const myCache = new NodeCache({ checkperiod: 1 });

export const getCdekToken = async () => {
  // При запросе  проверка в памяти
  if (myCache.has("myKey")) {
    console.log("from memory>>>");
    return myCache.get("myKey");
  } else {
    // Если в памяти нет, выполняет запрос! И при загрузке сервера идет первый запрос!
    fetch(
      `${CDEK_AUTH_URL}/token?grant_type=client_credentials&client_id=${CDEK_CLIENT_ID}&client_secret=${CDEK_CLIENT_SECRET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        return myCache.set("myKey", json.access_token, 3599);
      })
      .catch((err) => {
        throw new Error();
      });
  }
};

myCache.on("expired", async (key, value) => {
  await getCdekToken();
});
