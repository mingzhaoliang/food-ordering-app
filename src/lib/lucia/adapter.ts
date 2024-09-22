import dbConnect from "@/services/mongoose/mongoose";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import mongoose from "mongoose";

await dbConnect();

export const adapter = new MongodbAdapter(
  mongoose.connection.collection("sessions") as any,
  mongoose.connection.collection("users") as any
);
