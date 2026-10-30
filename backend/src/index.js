import { app } from "./index.js";
import "dotenv/config";

app.listen(process.env.PORT, () => {
  console.log(`Server Listening at PORT : ${process.env.PORT}`);
});
