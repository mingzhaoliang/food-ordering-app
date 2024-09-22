import { Model, model, models, Schema } from "mongoose";

const userRoleEnum = ["user", "admin", "demo", "superadmin"] as const;
type UserRole = (typeof userRoleEnum)[number];

interface UserDoc {
  _id: string;
  email: string;
  passwordHash?: string;
  role?: UserRole;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    _id: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: String,
    role: { type: String, enum: userRoleEnum, default: "user" },
    emailVerified: { type: Boolean, default: false },
  },
  { _id: false, timestamps: true }
);

const User = (models.User as Model<UserDoc>) || model<UserDoc>("User", userSchema);

export { User, type UserDoc, type UserRole };
