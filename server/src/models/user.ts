import { Schema, model } from "mongoose";

interface User {
  name: string;
  lastName: string;
  email: string;
  password: string;
  id: string;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
});

export default model("User", userSchema);
