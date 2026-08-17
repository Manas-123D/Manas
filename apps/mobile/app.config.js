const appJson = require("./app.json");

// app.json holds the static config; this file layers in the Google Maps API
// key from the environment so the real key never gets committed to git.
module.exports = ({ config }) => ({
  ...appJson.expo,
  ...config,
  ios: {
    ...appJson.expo.ios,
    config: {
      ...(appJson.expo.ios?.config ?? {}),
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  android: {
    ...appJson.expo.android,
    config: {
      ...(appJson.expo.android?.config ?? {}),
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
});
