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

const setNewSchool = async (schoolName, value) => {
	  try {
		      const reply = await client.set(schoolName, value);
		      console.log(`Reply: ${reply}`); // this is like  redis.print
		    } catch (err) {
			        console.error(`Error setting key "${schoolName}": ${err.message}`);
			      }
};

const displaySchoolValue = async (schoolName) => {
	  try {
		      const value = await client.get(schoolName);
		      if (value) {
			            console.log(value);
			          } else {
					        console.log(`Key "${schoolName}" does not exist`);
					      }
		    } catch (err) {
			        console.error(`Error getting key "${schoolName}": ${err.message}`);
			      }
};

async function connectToRedis() {
	  try {
		      await client.connect();

		      await displaySchoolValue("ALX");
		      await setNewSchool("ALXSanFrancisco", "100");
		      await displaySchoolValue("ALXSanFrancisco");
		    } catch (err) {
			        console.error(`Failed to connect or perform operations: ${err.message}`);
			      } finally {
				          try {
						        await client.disconnect();
						        console.log("Redis client disconnected");
						      } catch (disconnectErr) {
							            console.error(`Error disconnecting: ${disconnectErr.message}`);
							          }
				        }
}

connectToRedis();

