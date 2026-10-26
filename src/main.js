import "./style.css";
import { searchMovies } from "./api.js";
import { readCachedSearch, writeCachedSearch } from "./cache.js";
import { normalizeMovies, filterMovies, summarizeRatings } from "./logic.js";
import { renderStatus, renderMovies, clearResults, setLoading, renderFilterOptions, renderRatingSummary } from "./render.js";

const searchForm = document.querySelector("#search-form");
const queryInput = document.querySelector("#movie-query");
const filters = document.querySelector("#filters");
const yearFilter = document.querySelector("#year-filter");
const ratingFilter = document.querySelector("#rating-filter");
let activeRequest = null;
let loadedMovies = [];
let loadedQuery = "";
let loadedFromCache = false;

function updateResults() {
  const year = yearFilter.value === "" ? null : Number(yearFilter.value);
  const minimumRating = Number(ratingFilter.value);
  const visibleMovies = filterMovies(loadedMovies, { year, minimumRating });
  renderMovies(visibleMovies);
  renderRatingSummary(visibleMovies.length === 0 ? null : summarizeRatings(visibleMovies));
  const source = loadedFromCache ? "Loaded from a saved search." : "Fetched from TMDB.";

  if (loadedMovies.length === 0) {
    renderStatus(`No movies found for "${loadedQuery}". Try another title. ${source}`);
  } else if (visibleMovies.length === 0) {
    renderStatus(`No loaded movies match these filters. Try another year or a lower rating. ${source}`);
  } else {
    renderStatus(`Showing ${visibleMovies.length} of ${loadedMovies.length} loaded movies for "${loadedQuery}". ${source}`);
  }
}

async function handleSearch(event) {
  event.preventDefault();
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  const query = queryInput.value.trim();
  loadedMovies = [];
  loadedQuery = query;
  loadedFromCache = false;
  renderFilterOptions(loadedMovies);
  clearResults();

  if (query === "") {
    renderStatus("Enter a movie title first.");
    setLoading(false);
    return;
  }

  setLoading(true);
  renderStatus(`Searching for "${query}"…`);

  try {
    let results = readCachedSearch(query);
    loadedFromCache = results !== null;

    if (!loadedFromCache) {
      results = await searchMovies(query, controller.signal);

      if (controller !== activeRequest) {
        return;
      }

      writeCachedSearch(query, results);
    }

    if (controller !== activeRequest) {
      return;
    }

    loadedMovies = normalizeMovies(results);
    renderFilterOptions(loadedMovies);
    updateResults();
  } catch (error) {
    if (controller !== activeRequest || error.name === "AbortError") {
      return;
    }

    const message = error instanceof TypeError
      ? "Could not connect to the movie service. Check your connection and try again."
      : error.message;
    renderStatus(message, true);
  } finally {
    if (controller === activeRequest) {
      setLoading(false);
    }
  }
}

searchForm.addEventListener("submit", handleSearch);
filters.addEventListener("change", updateResults);
renderStatus("Search for a movie title to get started.");
