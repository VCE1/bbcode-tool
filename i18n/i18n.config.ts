import en from "./locales/en.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";

export default () => ({
  legacy: false,
  fallbackLocale: "en",
  messages: {
    en,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
  },
});
