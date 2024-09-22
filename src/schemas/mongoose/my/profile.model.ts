import { Model, model, models, Schema } from "mongoose";
import { ImageDoc, imageSchema } from "../cloudinary/image.model";

interface ProfileDoc {
  _id: string;
  userId: string;
  firstName: string;
  lastName?: string;
  fullName: string; // Virtual
  phoneNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  postcode?: string;
  avatar?: ImageDoc;
  createdAt: Date;
  updatedAt: Date;
}

interface ProfileVirtuals {
  fullName: string;
}

type ProfileModel = Model<ProfileDoc, {}, ProfileVirtuals>;
type TProfile = ReturnType<ProfileModel["hydrate"]>;

const profileSchema = new Schema<ProfileDoc, ProfileModel, ProfileVirtuals>(
  {
    userId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: String,
    phoneNumber: String,
    street: String,
    city: String,
    state: String,
    postcode: String,
    avatar: { type: imageSchema, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    virtuals: {
      fullName: {
        get(this: ProfileDoc) {
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
  }
);

const Profile = (models.Profile as ProfileModel) || model("Profile", profileSchema);

export { Profile, type ProfileDoc, type TProfile };
