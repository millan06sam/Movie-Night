import { defineConfig, loadEnv } from "vite";
import { createMovieMiddleware } from "./server/tmdb.js";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "TMDB_");
  const middleware = createMovieMiddleware(env.TMDB_READ_ACCESS_TOKEN?.trim());

  return {
    plugins: [{
      name: "movie-api",
      configureServer(server) {
        server.middlewares.use(middleware);
      },
      configurePreviewServer(server) {
        server.middlewares.use(middleware);
      },
    }],
  };
});
