/*
  EASY CONFIGURATION
  ------------------
  This is the main file to edit if you later want different locations.
*/
var DASHBOARD_CONFIG = {
  title: "Home Dashboard",

  // Date and large clock at the top
  primaryTimeZone: "Europe/Amsterdam",

  // Four clocks shown along the bottom
  clocks: [
    { city: "AMSTERDAM", zone: "NETHERLANDS", timeZone: "Europe/Amsterdam" },
    { city: "LANCASTER", zone: "UNITED KINGDOM", timeZone: "Europe/London" },
    { city: "TEL AVIV", zone: "ISRAEL", timeZone: "Asia/Jerusalem" },
    { city: "SYDNEY", zone: "AUSTRALIA", timeZone: "Australia/Sydney" }
  ],

  // Two weather locations
  weatherLocations: [
    {
      name: "AMSTERDAM",
      latitude: 52.3676,
      longitude: 4.9041,
      timeZone: "Europe/Amsterdam"
    },
    {
      name: "LANCASTER",
      latitude: 54.0470,
      longitude: -2.8010,
      timeZone: "Europe/London"
    }
  ],

  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",

  // Slideshow
  photoIntervalSeconds: 30,

  // Weather refresh
  weatherRefreshMinutes: 20
};
