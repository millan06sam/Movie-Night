const CACHE_PREFIX = "movie-night:search:v1:";
const CACHE_LIFETIME = 24 * 60 * 60 * 1000;

function getCacheKey(query) {
  return CACHE_PREFIX + query.trim().replace(/\s+/g, " ").toLowerCase();
}

export function readCachedSearch(query) {
  try {
    const key = getCacheKey(query);
    const stored = localStorage.getItem(key);

    if (stored === null) {
      return null;
    }

    const entry = JSON.parse(stored);
    const age = Date.now() - entry?.savedAt;

    if (!Number.isFinite(entry?.savedAt) || age < 0 || age >= CACHE_LIFETIME
      || !Array.isArray(entry?.results)) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.results;
  } catch {
    return null;
  }
}

export function writeCachedSearch(query, results) {
  try {
    if (!Array.isArray(results)) {
      return false;
    }

    const entry = { savedAt: Date.now(), results };
    localStorage.setItem(getCacheKey(query), JSON.stringify(entry));
    return true;
  } catch {
    return false;
  }
}
