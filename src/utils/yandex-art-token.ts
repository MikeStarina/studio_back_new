import fetch from "node-fetch";
import NodeCache from "node-cache";
import dotenv from "dotenv";

const ENV = dotenv.config();

const YANDEX_ART_OAUTH = ENV.parsed!.YANDEX_ART;

const appCache = new NodeCache({ checkperiod: 1 });

export const getYandexArtToken = async () => {
  const requestBodyData = {
    yandexPassportOauthToken: YANDEX_ART_OAUTH
  }
  if (appCache.has("yandexArtIamToken")) {
    return appCache.get("yandexArtIamToken");
  } else {
    try {
      const data = await fetch(
        `https://iam.api.cloud.yandex.net/iam/v1/tokens`,
        {
          method: "POST",
          body: JSON.stringify(requestBodyData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const token = await data.json();


      // console.log("load new token:", token.access_token);
      return appCache.set("yandexArtIamToken", token.iamToken, 1800);
    } catch (err) {
      throw new Error("Ошибка запроса токена");
    }
  }
};

appCache.on("expired", async (key, value) => {
  await getYandexArtToken();
});
