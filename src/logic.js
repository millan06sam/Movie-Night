export function normalizeMovies(results) {
  return results
    .filter(movie => movie !== null && typeof movie === "object" && !Array.isArray(movie))
    .map(movie => ({
      id: Number.isInteger(movie.id) ? movie.id : null,
      title: typeof movie.title === "string" && movie.title.trim() !== "" ? movie.title : "Untitled movie",
      year: typeof movie.release_date === "string" && /^[1-9]\d{3}-/.test(movie.release_date)
        ? Number(movie.release_date.slice(0, 4)) : null,
      rating: Number.isFinite(movie.vote_average) && movie.vote_average >= 0 && movie.vote_average <= 10
        && Number.isFinite(movie.vote_count) && movie.vote_count > 0 ? movie.vote_average : null,
      overview: typeof movie.overview === "string" && movie.overview.trim() !== ""
        ? movie.overview : "No summary available.",
      posterUrl: typeof movie.poster_path === "string" && /^\/[a-zA-Z0-9._-]+$/.test(movie.poster_path)
        ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` : null,
    }));
}

export function filterMovies(movies, { year = null, minimumRating = 0 } = {}) {
  return movies.filter(movie => {
    const matchesYear = year === null || movie.year === year;
    const matchesRating = minimumRating === 0
      || (movie.rating !== null && movie.rating >= minimumRating);
    return matchesYear && matchesRating;
  });
}
