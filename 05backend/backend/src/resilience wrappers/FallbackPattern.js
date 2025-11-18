const safeSetCache = async (key, value, ttl = 6000) => {
    try {
        await setCache(key, value, ttl);
    } catch (e) {
        console.error("Redis SET failed, fallback → continue without cache:", e.message);
    }
};

const safeGetCache = async (key) => {
    try {
        return await getCache(key);
    } catch (e) {
        console.error("Redis GET failed, using fallback:", e.message);
        return null; // fallback → act as if cache is empty
    }
};
