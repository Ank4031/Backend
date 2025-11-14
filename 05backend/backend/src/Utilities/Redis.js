import {createClient} from "redis"
import dotenv from "dotenv"
dotenv.config()

const redisClient = createClient({
    url : `redis://default:${process.env.REDIS_ADD}@redis-10010.crce206.ap-south-1-1.ec2.redns.redis-cloud.com:10010`
})

redisClient.on("error", (e)=> console.error("Redis error", e));

redisClient.connect().catch(console.error);

export const getCache = async (key) => {
  const v = await redisClient.get(key);
  return v ? JSON.parse(v) : null;
};

export const setCache = async (key, value, ttl = 3600) => {
  const s = JSON.stringify(value);
  if (ttl) await redisClient.set(key, s, { EX: ttl });
  else await redisClient.set(key, s);
};

export const delCache = async (key) => {
  await redisClient.del(key);
};

export default redisClient;