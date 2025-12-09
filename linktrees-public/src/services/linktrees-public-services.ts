import redisClient from "../redis-client.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const getLinktreeBySuffix = async (suffix: string) => {
  try {
    const cachedLinktree = await redisClient.get(`linktree:${suffix}`);
    if (cachedLinktree) {
      return JSON.parse(cachedLinktree);
    }
    const managementUrl = `${
      process.env.LINKTREES_MANAGEMENT_SERVICE_URL || "http://localhost:3002"
    }/${suffix}/public`;
    console.log("Calling management service:", managementUrl);
    const response = await axios.get(managementUrl);
    if (response.status !== 200) {
      console.log("Management service returned non-200 status:", response.status);
      return null;
    }
    console.log("Management service response:", response.data);
    // Cache for 2 hours (7200 seconds) - configurable via env
    const cacheTTL = Number(process.env.REDIS_CACHE_TTL) || 20; // Default: 2 hours
    await redisClient.setex(
      `linktree:${suffix}`,
      cacheTTL,
      JSON.stringify(response.data)
    );
    console.log(`Cached linktree:${suffix} for ${cacheTTL} seconds (${cacheTTL / 3600} hours)`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching linktree by suffix:", error.message);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    return null;
  }
};
