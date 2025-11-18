// circuitBreaker.js
export function circuitBreaker(fn, options = {}) {
    const {
        failureThreshold = 3,
        successThreshold = 1,
        timeout = 5000,
        retries = 2,
        retryDelay = 300,
        fallback = null,
        isNetworkError = (err) => true
    } = options;

    let failures = 0;
    let successes = 0;
    let state = "CLOSED"; // CLOSED | OPEN | HALF_OPEN
    let nextTry = 0;

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    async function execute(...args) {

        // OPEN → check if time passed → HALF_OPEN
        if (state === "OPEN") {
            if (Date.now() >= nextTry) {
                state = "HALF_OPEN";
            } else {
                if (fallback) return fallback(...args);
                throw new Error("Circuit breaker is OPEN");
            }
        }

        // HALF-OPEN logic: allow ONE test call
        if (state === "HALF_OPEN") {
            try {
                const res = await fn(...args);

                successes++;
                if (successes >= successThreshold) {
                    // Fully close breaker
                    state = "CLOSED";
                    failures = 0;
                    successes = 0;
                }

                return res;

            } catch (err) {
                failures++;
                state = "OPEN";
                nextTry = Date.now() + timeout;

                if (fallback) return fallback(...args);
                throw err;
            }
        }

        // CLOSED → normal execution with retry
        let attempt = 0;

        while (attempt < retries) {
            try {
                const res = await fn(...args);

                // SUCCESS reset
                failures = 0;
                successes++;
                return res;

            } catch (err) {

                // Don't retry non-network errors
                if (!isNetworkError(err)) throw err;

                attempt++;
                if (attempt >= retries) break;

                await sleep(retryDelay);
            }
        }

        // RETRIES FAILED → mark failure
        failures++;

        if (failures >= failureThreshold) {
            state = "OPEN";
            nextTry = Date.now() + timeout;
        }

        if (fallback) return fallback(...args);

        throw new Error("Circuit breaker: Operation failed");
    }

    return execute;
}
