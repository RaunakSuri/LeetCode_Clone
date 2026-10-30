import mongoose from "mongoose";

async function useMongoose() {
  await mongoose.connect(process.env.MONGODB_URI);
}

export { useMongoose };
