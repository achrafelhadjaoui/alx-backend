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

const createHash = async () => {
	  try {
		      await client.connect();

		      const fields = {
			            Portland: "50",
			            Seattle: "80",
			            "New York": "20",
			            Bogota: "20",
			            Cali: "40",
			            Paris: "2",
			          };

		      for (const [field, value] of Object.entries(fields)) {
			            const reply = await client.hSet("ALX", field, value);
			            console.log(`Reply: ${reply}`);
			          }

		      const data = await client.hGetAll("ALX");
		      console.log(data);
		    } catch (err) {
			        console.error(`Error: ${err.message}`);
			      } finally {
				          try {
						        await client.disconnect();
						        console.log("Redis client disconnected");
						      } catch (disconnectErr) {
							            console.error(`Error during disconnect: ${disconnectErr.message}`);
							          }
				        }
};

createHash();

