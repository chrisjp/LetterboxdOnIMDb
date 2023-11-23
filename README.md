# Letterboxd Rating on IMDb
This userscript will show a film's [Letterboxd](https://letterboxd.com) rating on its [IMDb](https://imdb.com) page alongside the IMDb rating. Clicking the rating will take you to the film's Letterboxd page.

For upcoming releases with no ratings yet, an attempt will be made to link to the Letterboxd page if a) the film exists and Letterboxd; and b) the film's rating bar is shown - this usually means it needs to be getting enough attention to trigger IMDb's Popularity Meter to show.

### Installation
You'll need a userscript manager installed in your browser. I personally use Tampermonkey, but others like Greasemonkey and Violentmonkey are also available.

Option 1: Install via [GreasyFork](https://greasyfork.org/en/scripts/452708-letterboxd-rating-on-imdb).

Option 2: If you don't wish to use GreasyFork, simply view the [.user.js file](https://raw.githubusercontent.com/chrisjp/LetterboxdOnIMDb/master/Letterboxd%20rating%20on%20IMDb.user.js) in your browser. Your userscript manager should prompt you to install it, if not you can and paste the contents of the file into a new script and save it.

### Screenshots
IMDb film page with Letterboxd rating added:
![Screenshot of Letterboxd rating on IMDb](https://i.imgur.com/1CztM6G.png)

Upcoming release with a Letterboxd link added (note that the Popularity Meter causes the ratings bar to be shown despite not being available to rate - this is necessary for the script to insert the correctly styled link):
![Screenshot of Letterboxd link on IMDb for an upcoming film](https://i.imgur.com/lnQLnFQ.png)

### Changelog
See [CHANGELOG.md](https://github.com/chrisjp/LetterboxdOnIMDb/blob/master/CHANGELOG.md)

