import { createClient } from "redis";
import "dotenv/config";

const publisher = createClient({
	  url: process.env.REDIS_URL || "redis://localhost:6379",
});

publisher.on("connect", () => {
	  console.log("Redis client connected to the server");
});

publisher.on("error", (err) => {
	  console.log(`Redis client not connected to the server: ${err}`);
});

publisher.connect()

const publishMessage = (message, time) => {
	  setTimeout(async () => {
		      try {
			            console.log(`About to send message: ${message}`);
			            await publisher.publish("ALXchannel", message);
			          } catch (err) {
					        console.error(`Error publishing message: ${err.message}`);
					      }
		    }, time);
};


publishMessage("ALX Student #1 starts course", 2000);
publishMessage("ALX Student #2 starts course", 4000);
publishMessage("KILL_SERVER", 300);
publishMessage("ALX Student #3 starts course", 400);

