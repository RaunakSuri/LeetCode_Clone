import { app } from "./index.js";
import "dotenv/config";
import { useMongoose } from "./db/db.js";

try {
  await useMongoose();
  app.listen(process.env.PORT, () => {
    console.log(`Server Listening at PORT : ${process.env.PORT}`);
  });
} catch (error) {
  console.log(`Error Occured: ${error}`);
}
