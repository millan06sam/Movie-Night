import "./style.css";
import { searchMovies } from "./api.js";
import { normalizeMovies } from "./logic.js";
import { renderStatus, renderMovies, clearResults, setLoading } from "./render.js";

const searchForm = document.querySelector("#search-form");
const queryInput = document.querySelector("#movie-query");
let activeRequest = null;

async function handleSearch(event) {
  event.preventDefault();
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  const query = queryInput.value.trim();
  clearResults();

  if (query === "") {
    renderStatus("Enter a movie title first.");
    setLoading(false);
    return;
  }

  setLoading(true);
  renderStatus(`Searching for "${query}"…`);

  try {
    const results = await searchMovies(query, controller.signal);

    if (controller !== activeRequest) {
      return;
    }

    const movies = normalizeMovies(results);
    renderMovies(movies);
    renderStatus(movies.length === 0
      ? `No movies found for "${query}". Try another title.`
      : `Showing ${movies.length} movies from the first page of results for "${query}".`);
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
renderStatus("Search for a movie title to get started.");
