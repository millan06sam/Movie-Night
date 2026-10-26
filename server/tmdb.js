function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

export function createMovieMiddleware(token, requestMovie = fetch) {
  return async function handleMovieRequest(request, response, next) {
    const url = new URL(request.url, "http://localhost");

    if (url.pathname !== "/api/movies") {
      next();
      return;
    }

    if (request.method !== "GET") {
      sendJson(response, 405, { message: "Use GET to search for movies." });
      return;
    }

    const query = (url.searchParams.get("query") ?? "").trim();

    if (query === "" || query.length > 100) {
      sendJson(response, 400, { message: "Enter a movie title between 1 and 100 characters." });
      return;
    }

    if (!token) {
      sendJson(response, 503, { message: "TMDB access is not configured. Check .env.local and restart Vite." });
      return;
    }

    const endpoint = new URL("https://api.themoviedb.org/3/search/movie");
    endpoint.searchParams.set("query", query);
    endpoint.searchParams.set("include_adult", "false");
    endpoint.searchParams.set("language", "en-US");

    try {
      const upstream = await requestMovie(endpoint, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      });

      if (!upstream.ok) {
        const message = upstream.status === 401 || upstream.status === 403
          ? "TMDB rejected the credential. Check the Read Access Token in .env.local."
          : "TMDB could not complete the search. Please try again shortly.";
        sendJson(response, 502, { message });
        return;
      }

      const data = await upstream.json();

      if (!Array.isArray(data?.results)) {
        sendJson(response, 502, { message: "TMDB returned an unexpected response. Please try again." });
        return;
      }

      sendJson(response, 200, { results: data.results });
    } catch (error) {
      const message = error.name === "TimeoutError"
        ? "TMDB took too long to respond. Please try again."
        : "Unable to reach TMDB. Check your connection and try again.";
      sendJson(response, 502, { message });
    }
  };
}
