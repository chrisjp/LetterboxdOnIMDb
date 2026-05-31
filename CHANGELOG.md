# Changelog

### 2026-05-31 - 1.1.0

* Added: New settings panel (click the ⚙️ icon next to the Letterboxd rating) where you can choose whether to show the Letterboxd rating out of 10
* Added: When a film has too few ratings for Letterboxd to show the weighted average, but does have at least 1 rating, the script will now calculate the mean average of those ratings instead of showing nothing
* Fix: Letterboxd changed the URL used for fetching ratings... again.

### 2025-07-06 - 1.0.5

* Fix: Letterboxd changed the URL used for fetching ratings.

### 2024-01-14 - 1.0.4

* Fix: Rating count will now correctly show M for million instead of K for thousands on films with over 1 million ratings on Letterboxd.

### 2023-11-23 - 1.0.3

* New: Letterboxd link and rate count will now be shown on pages for films that don't have enough IMDb ratings to show the average score.
  * You'll rarely encounter this, if you do it'll likely be some obscure short film or something that's just been added.
* New: Letterboxd link now shown on upcoming releases.
  * The film must be getting enough attention to trigger IMDb's Popularity Meter for this to work, otherwise there will be no ratings bar to add to.
* Changed: Letterboxd icon now matches their current favicon (the rounded version, as opposed to the square one in previous versions).

### 2022-11-14 - 1.0.2

* Fix: Changed the way the Letterboxd rating node gets added to the DOM, which should avoid any potential conflicts with other scripts that also modify the ratings bar.

### 2022-11-14 - 1.0.1

* Fix: Replaced the old `GM_xmlhttpRequest` `@grant` with `GM.xmlHttpRequest` for better compatibility between browsers and different *monkey script managers.

### 2022-10-08 - 1.0.0

Initial release.
