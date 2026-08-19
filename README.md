# iPad 4 Dual-Weather Home Dashboard

This package is designed for a **non-jailbroken iPad 4 running iOS 10.3.3**.

It does **not** require a local server, Raspberry Pi, NAS, subscription, or weather API key after it is published.

## Dashboard configuration

### World clocks
- Amsterdam
- Lancaster
- Tel Aviv
- Sydney

### Weather
- Amsterdam
- Lancaster

### Other features
- Large Amsterdam date/time display
- Current temperature, apparent temperature and wind
- Compact 4-day forecast for both weather locations
- Rain probability
- Rotating photo album
- 30-second photo crossfade
- Weather refresh every 20 minutes
- Landscape layout optimised for a 9.7-inch 4:3 iPad
- iOS 10-compatible ES5 JavaScript
- No React, Vue, build tools or service worker

---

# SETUP GUIDE

## Part 1 — Extract the ZIP

Download and extract:

`ipad4-dashboard-dual-weather.zip`

Inside it you will see:

```text
ipad4-dashboard-dual-weather/
├── index.html
├── style.css
├── dashboard.js
├── config.js
├── photos.js
├── README.md
└── photos/
    ├── demo-1.jpg
    ├── demo-2.jpg
    └── demo-3.jpg
```

Do not upload the ZIP itself to GitHub Pages. Upload the files and folders inside the extracted folder.

---

## Part 2 — Add your own photographs

Put your JPG or PNG images inside:

```text
photos/
```

For example:

```text
photos/
├── sicily-01.jpg
├── butterflyfish.jpg
├── family-01.jpg
└── reef.jpg
```

Then open:

```text
photos.js
```

and change the list to:

```javascript
var DASHBOARD_PHOTOS = [
  "photos/sicily-01.jpg",
  "photos/butterflyfish.jpg",
  "photos/family-01.jpg",
  "photos/reef.jpg"
];
```

### Recommended photo size

Modern phone images can be very large and the iPad 4 only has 1 GB RAM.

For best reliability, resize images to approximately:

- 1600–2400 pixels on the long side
- JPEG quality around 80–90%

That is still more than enough for the iPad display.

---

## Part 3 — Create a GitHub repository

On a normal computer or phone:

1. Go to GitHub.
2. Sign in or create a free GitHub account.
3. Choose **New repository**.
4. Repository name:

```text
ipad-dashboard
```

5. Set it to **Public**.
6. Create the repository.

GitHub Pages can host a static dashboard like this for free.

---

## Part 4 — Upload the dashboard

Inside the new repository:

1. Choose **Add file**.
2. Choose **Upload files**.
3. Upload:
   - `index.html`
   - `style.css`
   - `dashboard.js`
   - `config.js`
   - `photos.js`
   - the entire `photos` folder
4. Commit the upload.

The important requirement is that `index.html` is in the root of the repository.

Your repository should look approximately like this:

```text
ipad-dashboard/
├── index.html
├── style.css
├── dashboard.js
├── config.js
├── photos.js
└── photos/
```

---

## Part 5 — Enable GitHub Pages

In the GitHub repository:

1. Open **Settings**.
2. Open **Pages**.
3. Find **Build and deployment**.
4. Under **Source**, select:

```text
Deploy from a branch
```

5. Select branch:

```text
main
```

6. Select folder:

```text
/ (root)
```

7. Save.

GitHub will provide a website address similar to:

```text
https://YOUR-USERNAME.github.io/ipad-dashboard/
```

That URL is your dashboard.

---

## Part 6 — Test it on a modern device first

Before using the iPad, open the GitHub Pages URL on your normal phone or computer.

Check:

- both weather locations load
- all four clocks show
- photos change
- layout fills the browser
- no filenames are missing

If a photo fails to display, check that its name in `photos.js` exactly matches the filename, including capitalisation.

---

## Part 7 — Open it on the iPad 4

On the iPad:

1. Connect to Wi-Fi.
2. Open Safari.
3. Enter the GitHub Pages URL.
4. Wait for the dashboard to load.

If the page loads but the weather is blank, first check that ordinary HTTPS websites still load in Safari. The dashboard itself does not require a jailbreak.

---

## Part 8 — Add it to the Home Screen

For the cleanest display:

1. Open the dashboard in Safari.
2. Tap the **Share** button.
3. Select **Add to Home Screen**.
4. Name it something like:

```text
Dashboard
```

5. Tap **Add**.
6. Return to the Home Screen.
7. Launch it using the new Dashboard icon.

The page includes Apple's web-app metadata, so launching it from the Home Screen should remove most normal Safari browser controls.

---

## Part 9 — Keep the display awake

On the iPad open:

```text
Settings → Display & Brightness → Auto-Lock
```

Select:

```text
Never
```

if that option is available.

Keep the iPad connected to power for permanent dashboard use.

Landscape orientation is strongly recommended.

---

# Changing locations later

Open:

```text
config.js
```

The clocks are configured here:

```javascript
clocks: [
  { city: "AMSTERDAM", zone: "NETHERLANDS", timeZone: "Europe/Amsterdam" },
  { city: "LANCASTER", zone: "UNITED KINGDOM", timeZone: "Europe/London" },
  { city: "TEL AVIV", zone: "ISRAEL", timeZone: "Asia/Jerusalem" },
  { city: "SYDNEY", zone: "AUSTRALIA", timeZone: "Australia/Sydney" }
]
```

The weather locations are configured immediately below that.

---

# Changing slideshow speed

In `config.js`:

```javascript
photoIntervalSeconds: 30
```

For one minute per photograph:

```javascript
photoIntervalSeconds: 60
```

---

# Changing weather refresh frequency

In `config.js`:

```javascript
weatherRefreshMinutes: 20
```

There is little benefit to refreshing weather every minute. Fifteen to thirty minutes is appropriate for this dashboard.

---

# Weather source

The dashboard retrieves weather directly from the Open-Meteo forecast API.

No API key is stored in the dashboard and no custom backend is required.

---

# Why this version is built differently from a modern website

The iPad 4 runs an old Safari/WebKit engine.

This dashboard therefore deliberately uses:

- ES5-style JavaScript
- `XMLHttpRequest` instead of `fetch`
- no JavaScript framework
- no npm packages
- no service worker
- simple CSS layout
- lightweight image handling

This improves the chance that it continues to work correctly on iOS 10.3.3.
