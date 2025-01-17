import { createClient } from "redis";
import "dotenv/config";

const subscriber = createClient({
	  url: process.env.REDIS_URL || "redis://localhost:6379",
});


subscriber.on("connect", () => {
	  console.log("Redis client connected to the server");
});

subscriber.on("error", (err) => {
	  console.log(`Redis client not connected to the server: ${err.message}`);
});


subscriber.connect();

const startSubscription = async () => {
	  try {
		      await subscriber.subscribe("ALXchannel", async (message) => {
			            console.log(`Received message: ${message}`);

			            if (message === "KILL_SERVER") {
					            console.log("Received KILL_SERVER. Preparing to disconnect...");
					            await subscriber.unsubscribe("ALXchannel");
					            await subscriber.disconnect();
					            console.log("Redis client disconnected from the server");
					          }
			          });
		    } catch (err) {
			        console.error(`Error: ${err.message}`);
			      }
};

startSubscription();
