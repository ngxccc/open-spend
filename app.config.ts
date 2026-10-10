import { ExpoConfig, ConfigContext } from "expo/config";

// Read version directly from package.json so there is only a single source of truth
const packageJson = require("./package.json");

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: config.name ?? "OpenSpend",
  slug: config.slug ?? "open-spend",
  version: packageJson.version,
});
