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
  if (myCache.has("myKey")) {
    return myCache.get("myKey");
  } else {
    try {
      const data = await fetch(
        `${CDEK_AUTH_URL}/token?grant_type=client_credentials&client_id=${CDEK_CLIENT_ID}&client_secret=${CDEK_CLIENT_SECRET}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      //console.log(await data.json());
      const token = await data.json();
      //console.log(token);
      // console.log("load new token:", token.access_token);
      return myCache.set("myKey", token.access_token, 3599);
    } catch (err) {
      console.log(err);
    }
  }
};

myCache.on("expired", async (key, value) => {
  await getCdekToken();
});
