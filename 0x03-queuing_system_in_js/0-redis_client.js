import { createClient } from "redis";
import "dotenv/config";

const client = createClient({
	  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.on("connect", () => {
	  console.log("Redis client connected to the server");
});

client.on("error", (err) => {
	  console.error(`Redis client not connected to the server: ${err.message}`);
});

async function connectToRedis() {
	  try {
		      await client.connect();
		      // Perform operations here
		  } catch (err) {
			  console.error(`Failed to connect: ${err.message}`);
		  } finally {
		  //             // Ensure the client is disconnected when done
			  await client.disconnect();
			  console.log("Redis client disconnected");
		  }
}

connectToRedis();
