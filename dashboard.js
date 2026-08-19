/* iPad 4 / iOS 10 compatible dashboard JavaScript (ES5 syntax) */
(function () {
  "use strict";

  var cfg = window.DASHBOARD_CONFIG || DASHBOARD_CONFIG;
  var photos = window.DASHBOARD_PHOTOS || DASHBOARD_PHOTOS;

  var monthNames = [
    "JANUARY","FEBRUARY","MARCH","APRIL","MAY","JUNE",
    "JULY","AUGUST","SEPTEMBER","OCTOBER","NOVEMBER","DECEMBER"
  ];
  var dayNames = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

  function pad2(n) { return n < 10 ? "0" + n : String(n); }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (!el) return;
    if (typeof el.textContent !== "undefined") el.textContent = text;
    else el.innerText = text;
  }

  function formatTimeInZone(date, timeZone) {
    try {
      return new Intl.DateTimeFormat("en-GB", {
        timeZone: timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(date);
    } catch (e) {
      return pad2(date.getHours()) + ":" + pad2(date.getMinutes());
    }
  }

  function partsInZone(date, timeZone) {
    try {
      var f = new Intl.DateTimeFormat("en-US", {
        timeZone: timeZone,
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric"
      });
      if (f.formatToParts) {
        var parts = f.formatToParts(date);
        var out = {};
        var i;
        for (i = 0; i < parts.length; i++) out[parts[i].type] = parts[i].value;
        return {
          weekday: String(out.weekday || "").toUpperCase(),
          year: parseInt(out.year, 10),
          month: parseInt(out.month, 10),
          day: parseInt(out.day, 10)
        };
      }
    } catch (e) {}

    return {
      weekday: dayNames[date.getDay()],
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  function updateClocks() {
    var now = new Date();
    var parts = partsInZone(now, cfg.primaryTimeZone);

    setText("dayName", parts.weekday);
    setText("dateText", parts.day + " " + monthNames[parts.month - 1] + " " + parts.year);
    setText("mainClock", formatTimeInZone(now, cfg.primaryTimeZone));

    var i;
    for (i = 0; i < cfg.clocks.length && i < 4; i++) {
      setText("clock" + i, formatTimeInZone(now, cfg.clocks[i].timeZone));
    }
  }

  function weatherInfo(code) {
    if (code === 0) return { icon: "☀", text: "Clear sky" };
    if (code === 1) return { icon: "🌤", text: "Mainly clear" };
    if (code === 2) return { icon: "⛅", text: "Partly cloudy" };
    if (code === 3) return { icon: "☁", text: "Overcast" };
    if (code === 45 || code === 48) return { icon: "☁", text: "Fog" };
    if (code === 51 || code === 53 || code === 55) return { icon: "🌦", text: "Drizzle" };
    if (code === 56 || code === 57) return { icon: "🌧", text: "Freezing drizzle" };
    if (code === 61 || code === 63 || code === 65) return { icon: "🌧", text: "Rain" };
    if (code === 66 || code === 67) return { icon: "🌧", text: "Freezing rain" };
    if (code === 71 || code === 73 || code === 75 || code === 77) return { icon: "❄", text: "Snow" };
    if (code === 80 || code === 81 || code === 82) return { icon: "🌦", text: "Rain showers" };
    if (code === 85 || code === 86) return { icon: "🌨", text: "Snow showers" };
    if (code === 95 || code === 96 || code === 99) return { icon: "⛈", text: "Thunderstorm" };
    return { icon: "•", text: "Weather" };
  }

  function shortDay(dateString) {
    var bits = dateString.split("-");
    var d = new Date(
      parseInt(bits[0], 10),
      parseInt(bits[1], 10) - 1,
      parseInt(bits[2], 10)
    );
    return ["SUN","MON","TUE","WED","THU","FRI","SAT"][d.getDay()];
  }

  function renderWeather(index, data) {
    var current = data.current || {};
    var daily = data.daily || {};
    var info = weatherInfo(Number(current.weather_code));

    setText("weatherIcon" + index, info.icon);
    setText("temperature" + index, Math.round(Number(current.temperature_2m)) + "°");
    setText("weatherDescription" + index, info.text);
    setText("feelsLike" + index, Math.round(Number(current.apparent_temperature)) + "°");
    setText("windSpeed" + index, Math.round(Number(current.wind_speed_10m)) + " km/h");

    var forecast = document.getElementById("forecast" + index);
    forecast.innerHTML = "";

    var count = Math.min(4, daily.time ? daily.time.length : 0);
    var i;
    for (i = 0; i < count; i++) {
      var d = document.createElement("div");
      d.className = "forecastDay";

      var wi = weatherInfo(Number(daily.weather_code[i]));
      var rain = daily.precipitation_probability_max ?
        Math.round(Number(daily.precipitation_probability_max[i])) : 0;

      d.innerHTML =
        '<div class="forecastName">' + shortDay(daily.time[i]) + '</div>' +
        '<div class="forecastIcon">' + wi.icon + '</div>' +
        '<div class="forecastTemps">' +
          Math.round(Number(daily.temperature_2m_max[i])) + '°' +
          '<span class="forecastLow">' +
          Math.round(Number(daily.temperature_2m_min[i])) + '°</span>' +
        '</div>' +
        '<div class="rain">' + rain + '%</div>';

      forecast.appendChild(d);
    }

    var now = new Date();
    setText("weatherStatus" + index, "Updated " + pad2(now.getHours()) + ":" + pad2(now.getMinutes()));
  }

  function loadWeatherFor(index) {
    var w = cfg.weatherLocations[index];
    var url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=" + encodeURIComponent(w.latitude) +
      "&longitude=" + encodeURIComponent(w.longitude) +
      "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&timezone=" + encodeURIComponent(w.timeZone) +
      "&forecast_days=4" +
      "&temperature_unit=" + encodeURIComponent(cfg.temperatureUnit) +
      "&wind_speed_unit=" + encodeURIComponent(cfg.windSpeedUnit);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.timeout = 15000;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            renderWeather(index, JSON.parse(xhr.responseText));
          } catch (e) {
            setText("weatherStatus" + index, "Could not read weather");
          }
        } else {
          setText("weatherStatus" + index, "Weather unavailable");
        }
      }
    };

    xhr.onerror = function () {
      setText("weatherStatus" + index, "Weather unavailable");
    };

    xhr.ontimeout = function () {
      setText("weatherStatus" + index, "Weather timed out");
    };

    xhr.send(null);
  }

  function loadAllWeather() {
    var i;
    for (i = 0; i < cfg.weatherLocations.length && i < 2; i++) {
      loadWeatherFor(i);
    }
  }

  /* PHOTO SLIDESHOW */
  var photoIndex = 0;
  var showingA = true;

  function preloadPhoto(src, callback) {
    var img = new Image();
    img.onload = function () { callback(true); };
    img.onerror = function () { callback(false); };
    img.src = src;
  }

  function showPhoto(index, instant) {
    if (!photos || !photos.length) {
      setText("photoCaption", "ADD PHOTOS IN photos.js");
      setText("photoCounter", "");
      return;
    }

    var src = photos[index];
    preloadPhoto(src, function (ok) {
      if (!ok) {
        setText("photoCaption", "PHOTO NOT FOUND: " + src);
        return;
      }

      var incoming = document.getElementById(showingA ? "photoB" : "photoA");
      var outgoing = document.getElementById(showingA ? "photoA" : "photoB");

      incoming.src = src;
      incoming.alt = "Dashboard photo " + (index + 1);

      if (instant) {
        outgoing.className = "photo";
        incoming.className = "photo active";
      } else {
        incoming.className = "photo active";
        outgoing.className = "photo";
      }

      showingA = !showingA;
      setText("photoCounter", (index + 1) + " / " + photos.length);
    });
  }

  function nextPhoto() {
    if (!photos || !photos.length) return;
    photoIndex = (photoIndex + 1) % photos.length;
    showPhoto(photoIndex, false);
  }

  function initialisePhoto() {
    if (!photos || !photos.length) return;
    var first = document.getElementById("photoA");
    first.src = photos[0];
    first.alt = "Dashboard photo 1";
    first.className = "photo active";
    setText("photoCounter", "1 / " + photos.length);
    window.setInterval(nextPhoto, Math.max(5, cfg.photoIntervalSeconds) * 1000);
  }

  function applyConfigLabels() {
    var cards = document.getElementsByClassName("clockCard");
    var i;
    for (i = 0; i < cards.length && i < cfg.clocks.length; i++) {
      var city = cards[i].getElementsByClassName("city")[0];
      var zone = cards[i].getElementsByClassName("zone")[0];
      if (city) city.innerHTML = cfg.clocks[i].city;
      if (zone) zone.innerHTML = cfg.clocks[i].zone;
    }

    for (i = 0; i < cfg.weatherLocations.length && i < 2; i++) {
      setText("weatherTitle" + i, cfg.weatherLocations[i].name + " WEATHER");
    }

    document.title = cfg.title || "Home Dashboard";
  }

  applyConfigLabels();
  updateClocks();
  initialisePhoto();
  loadAllWeather();

  window.setInterval(updateClocks, 1000);
  window.setInterval(loadAllWeather, Math.max(5, cfg.weatherRefreshMinutes) * 60 * 1000);
}());
