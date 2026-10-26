const status = document.querySelector("#status");
const results = document.querySelector("#results");
const filters = document.querySelector("#filters");
const yearFilter = document.querySelector("#year-filter");
const ratingFilter = document.querySelector("#rating-filter");
const ratingSummary = document.querySelector("#rating-summary");
const averageRating = document.querySelector("#average-rating");
const ratedCount = document.querySelector("#rated-count");
const unratedCount = document.querySelector("#unrated-count");

export function renderRatingSummary(summary) {
  ratingSummary.hidden = summary === null;
  averageRating.textContent = summary === null || summary.averageRating === null
    ? "Not available" : `${summary.averageRating.toFixed(1)} / 10`;
  ratedCount.textContent = summary?.ratedCount ?? 0;
  unratedCount.textContent = summary?.unratedCount ?? 0;
}

export function renderFilterOptions(movies) {
  const years = [...new Set(movies.map(movie => movie.year))]
    .filter(year => year !== null)
    .sort((first, second) => second - first);
  const anyYear = document.createElement("option");
  anyYear.value = "";
  anyYear.textContent = "Any year";
  yearFilter.replaceChildren(anyYear);

  for (const year of years) {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = year;
    yearFilter.append(option);
  }

  yearFilter.value = "";
  ratingFilter.value = "0";
  filters.disabled = movies.length === 0;
}

export function renderStatus(message, isError = false) {
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  paragraph.classList.toggle("error", isError);
  status.replaceChildren(paragraph);
}

export function setLoading(isLoading) {
  results.setAttribute("aria-busy", String(isLoading));
}

export function clearResults() {
  results.replaceChildren();
  renderRatingSummary(null);
}

export function renderMovies(movies) {
  const fragment = document.createDocumentFragment();

  for (const movie of movies) {
    const card = document.createElement("article");
    card.classList.add("movie-card");
    const placeholder = document.createElement("p");
    placeholder.classList.add("poster-placeholder");
    placeholder.textContent = "Poster unavailable";

    if (movie.posterUrl) {
      const poster = document.createElement("img");
      poster.classList.add("movie-poster");
      poster.src = movie.posterUrl;
      poster.alt = `Poster for ${movie.title}`;
      poster.loading = "lazy";
      poster.width = 96;
      poster.height = 144;
      poster.addEventListener("error", () => poster.replaceWith(placeholder), { once: true });
      card.append(poster);
    } else {
      card.append(placeholder);
    }

    const details = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = movie.title;
    const metadata = document.createElement("p");
    const year = movie.year ?? "Year unknown";
    const rating = movie.rating === null ? "Not rated" : `${movie.rating.toFixed(1)} / 10`;
    metadata.textContent = `${year} · ${rating}`;
    const overview = document.createElement("p");
    overview.textContent = movie.overview;
    details.append(title, metadata, overview);
    card.append(details);
    fragment.append(card);
  }

  results.replaceChildren(fragment);
}
