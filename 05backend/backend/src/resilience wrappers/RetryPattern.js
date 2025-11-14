async function withRetry(fn, retries = 3, delay = 1000, retryIf = null) {
    let attempt = 0;

    while (attempt < retries) {
        try {
            return await fn();
        } catch (error) {
            attempt++;

            // Check if we should retry this error
            const shouldRetry = retryIf ? retryIf(error) : true;

            if (!shouldRetry) throw error; // Don't retry non-transient errors

            console.log(`Retry attempt ${attempt} failed: ${error.message}`);

            if (attempt >= retries) {
                console.log("❌ All retries failed!");
                throw error; // Final failure
            }

            await new Promise(res => setTimeout(res, delay));
        }
    }
}
export { withRetry };