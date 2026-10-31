import { app } from "./app.js";
import "dotenv/config";
import { useMongoose } from "./db/db.js";
import { userAuthRouter } from "./routes/userAuth.route.js";
import { adminAuthRouter } from "./routes/adminAuth.route.js";
import { redisClient } from "./db/redis.js";

try {
  await Promise.all([useMongoose(), redisClient.connect()]);
  console.log("DB Connected Successfully");

  app.listen(process.env.PORT, () => {
    console.log(`Server Listening at PORT : ${process.env.PORT}`);
  });

  app.use("/user", userAuthRouter);
  app.use("/admin", adminAuthRouter);
} catch (error) {
  console.log(`Error Occured: ${error}`);
  process.exit(1);
}
