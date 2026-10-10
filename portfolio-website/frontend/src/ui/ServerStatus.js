/*
  RTK Query reports a backend that is not running in two different ways:

  - fetchBaseQuery returns { status: "FETCH_ERROR" } when no response arrives at all
    (server process stopped, connection refused, DNS failure, CORS-blocked, user offline).
  - A reverse proxy in front of a dead app (nginx, a host's load balancer) answers
    with 502 / 503 / 504 instead.

  Note: the Vite dev-server proxy answers 500 when its target is down, which is
  indistinguishable from a genuine 500. Calling the API by its full URL (as the
  VITE_API_BASE_URL setup does) gives FETCH_ERROR and avoids that ambiguity.
*/
const DOWN_HTTP_STATUSES = new Set([502, 503, 504]);

export function isServerDown(error) {
    if (!error) return false;
    return (
        error.status === "FETCH_ERROR" ||
        error.status === "TIMEOUT_ERROR" ||
        DOWN_HTTP_STATUSES.has(error.status)
    );
}

// Short, honest description for the diagnostics line. It states what was
// observed, not a guessed cause.
export function describeServerError(error) {
    if (!error) return "no response from server";
    if (error.status === "FETCH_ERROR") return "FETCH_ERROR · no response from server";
    if (error.status === "TIMEOUT_ERROR") return "TIMEOUT_ERROR · server took too long";
    if (typeof error.status === "number") return `HTTP ${error.status} · server unavailable`;
    return String(error.status);
}