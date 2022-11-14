// ==UserScript==
// @name         Show Letterboxd rating on IMDb
// @version      1.0.1
// @namespace    https://github.com/chrisjp
// @description  Shows a film's Letterboxd rating on its corresponding IMDb page.
// @license      MIT

// @updateURL    https://raw.githubusercontent.com/chrisjp/LetterboxdOnIMDb/master/Letterboxd%20rating%20on%20IMDb.user.js
// @downloadURL  https://raw.githubusercontent.com/chrisjp/LetterboxdOnIMDb/master/Letterboxd%20rating%20on%20IMDb.user.js
// @homepageURL  https://github.com/chrisjp/LetterboxdOnIMDb
// @supportURL   https://github.com/chrisjp/LetterboxdOnIMDb/issues

// @match        https://*.imdb.com/title/tt*
// @connect      letterboxd.com
// @grant        GM.xmlHttpRequest
//
// @run-at       document-end
// @noframes
// ==/UserScript==

(function() {
    'use strict';

    // Check that this film has a rating (i.e. it's been released)
    let filmHasRating = document.querySelector('[data-testid="hero-rating-bar__aggregate-rating__score"]');
    // Get IMDb ID from the URL
    let imdbId = document.URL.match(/\/tt([0-9]+)\//)[1].trim('tt');
    if(filmHasRating && imdbId > 0)
    {
        //console.log("IMDb ID found: " + imdbId);
        getLetterboxdRating(imdbId);
    }
    else {
        console.log("Letterboxd on IMDb user script: No rating bar found. Film has probably not yet been released, or we're on a subpage of this film.");
    }
})();

function getLetterboxdRating(imdbId)
{
    const letterboxd = "https://letterboxd.com";
    const url = letterboxd + "/imdb/" + imdbId + "/";
    GM.xmlHttpRequest({
        method:  "GET",
        timeout: 10000,
        url:     url,
        onload:  function(response) {
            if (response.finalUrl != url) {
                // We were redirected, so the film exists on Letterboxd
                const letterboxdUrl = response.finalUrl;
                const letterboxdId = letterboxdUrl.split(letterboxd)[1];
                const letterboxdHistUrl = letterboxd + "/csi" + letterboxdId + "rating-histogram/";
                getLetterboxdHistogram(letterboxdUrl, letterboxdHistUrl);
            }
            else {
                // We did not get redirected to the film's URL on Letterboxd, meaning it hasn't been added to their database.
                console.log("Film not found on Letterboxd.");
            }
        },
        onerror: function() {
            console.log("Letterboxd on IMDb user script: Request Error in getLetterboxdRating.");
        },
        onabort: function() {
            console.log("Letterboxd on IMDb user script: Request is aborted in getLetterboxdRating");
        },
        ontimeout: function() {
            console.log("Letterboxd on IMDb user script: Request timed out in getLetterboxdRating.");
        }
    });
}

function getLetterboxdHistogram(letterboxdUrl, letterboxdHistUrl)
{
    // Scraping the rating histogram page is much more reliable than the film page
    // especially for films with very few ratings
    GM.xmlHttpRequest({
        method:  "GET",
        timeout: 10000,
        url:     letterboxdHistUrl,
        onload: function(response) {
            const parser = new DOMParser();
            const result = parser.parseFromString(response.responseText, "text/html");

            //
            const letterboxdRatingA = result.getElementsByClassName("display-rating")[0];
            if (letterboxdRatingA) {
                const letterboxdRating = parseFloat(letterboxdRatingA.innerText);
                const letterboxdTotalRatingsText = letterboxdRatingA.title;
                const letterboxdTotalRatings = parseInt(letterboxdTotalRatingsText.match("based on \(.*\)ratings")[1].replace(",",""));

                addLetterboxdRatingToIMDb(letterboxdUrl, letterboxdRating, letterboxdTotalRatings);
            }
            else {
                // If we reached this point it's almost certainly because the film does not yet have enough ratings for Letterboxd to calculate the weighted average.
                // Check for "not enough ratings"
                const notEnoughRatings = result.querySelector('[title="Not enough ratings to calculate average"]');
                if (notEnoughRatings) {
                    addLetterboxdRatingToIMDb(letterboxdUrl, "-", "-");
                }
                else {
                    console.log("Letterboxd on IMDb user script: Film exists on Letterboxd but there was a problem scraping ratings data. URL tried: " + letterboxdHistUrl);
                }
            }
        },
        onerror: function() {
            console.log("Letterboxd on IMDb user script: Request Error in getLetterboxdHistogram.");
        },
        onabort: function() {
            console.log("Letterboxd on IMDb user script: Request is aborted in getLetterboxdHistogram.");
        },
        ontimeout: function() {
            console.log("Letterboxd on IMDb user script: Request timed out in getLetterboxdHistogram.");
        }
    });
}

function addLetterboxdRatingToIMDb(letterboxdUrl, letterboxdRating, letterboxdTotalRatings)
{
    // Since a lot of relevant class names are random on each page load... Basically we...
    // 1. get the div.rating-bar__base-button elements
    // 2. clone the first one (IMDb average user rating)
    // 3. set its HTML to the information we just scraped from Letterboxd
    // 4. add it to the DOM before the other div.rating-bar__base-button elements
    // That way it keeps all IMDB's styling and looks like a normal part of the page

    // clone the node
    let ratingBarBtns = document.querySelectorAll(".rating-bar__base-button");
    let ratingBarBtnLetterboxd = ratingBarBtns[0].cloneNode(true);

    // set title
    ratingBarBtnLetterboxd.children[0].innerHTML = "Letterboxd".toUpperCase();

    // set a.href
    let letterboxdElementA = ratingBarBtnLetterboxd.children[1];
    letterboxdElementA.href = letterboxdUrl;

    // edit all its child elements
    let letterboxdElementADiv = letterboxdElementA.children[0].children[0];
    // icon set to 24x24 (data URI so we don't need to hotlink from anywhere)
    letterboxdElementADiv.children[0].innerHTML = '<img src="data:image/png;base64,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" alt="" width="24" height="24">';
    // ratings data
    let letterboxdElementRatingDiv = letterboxdElementADiv.children[1];
    // average rating
    letterboxdElementRatingDiv.children[0].children[0].innerHTML = letterboxdRating;
    letterboxdElementRatingDiv.children[0].children[1].innerHTML = "/5";
    // total ratings
    letterboxdElementRatingDiv.children[2].innerHTML = letterboxdTotalRatings != "-" ? numRound(letterboxdTotalRatings) : "-";

    // Add it to the DOM
    ratingBarBtns[0].parentNode.innerHTML = ratingBarBtnLetterboxd.outerHTML + ratingBarBtns[0].parentNode.innerHTML;
}

function numRound(num)
{
    // https://stackoverflow.com/a/68273755/403476
    num = Math.abs(Number(num))
    const billions = num/1.0e+9
    const millions = num/1.0e+6
    const thousands = num/1.0e+3
    return num >= 1.0e+9 && billions >= 100  ? Math.round(billions)  + "B"
         : num >= 1.0e+9 && billions >= 10   ? billions.toFixed(1)   + "B"
         : num >= 1.0e+9                     ? billions.toFixed(2)   + "B"
         : num >= 1.0e+6 && millions >= 100  ? Math.round(millions)  + "M"
         : num >= 1.0e+6 && millions >= 10   ? millions.toFixed(1)   + "M"
         : num >= 1.0e+6                     ? millions.toFixed(2)   + "M"
         : num >= 1.0e+3 && thousands >= 100 ? Math.round(thousands) + "K"
         : num >= 1.0e+3 && thousands >= 10  ? thousands.toFixed(1)  + "K"
         : num >= 1.0e+3                     ? thousands.toFixed(2)  + "K"
         : num.toFixed()
}