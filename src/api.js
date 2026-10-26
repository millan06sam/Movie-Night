export async function searchMovies(query, signal) {
  const parameters = new URLSearchParams({ query });
  const response = await fetch(`/api/movies?${parameters}`, { signal });

  if (!response.ok) {
    let message = "Movie search failed. Please try again.";

    try {
      const error = await response.json();
      if (typeof error?.message === "string") {
        message = error.message;
      }
    } catch {
      message = "The movie service returned an unreadable error. Please try again.";
    }

    throw new Error(message);
  }

  const data = await response.json();

  if (!Array.isArray(data?.results)) {
    throw new Error("The movie service returned unexpected data. Please try again.");
  }

  return data.results;
}
