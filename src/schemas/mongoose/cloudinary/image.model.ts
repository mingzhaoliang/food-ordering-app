import { cloudinaryUrl } from "@/lib/utils/cloudinary";
import { Model, Schema, Types } from "mongoose";

interface ImageDoc {
  _id: Types.ObjectId;
  publicId: string;
  type: "upload" | "authenticated" | "private";
  resourceType: "image" | "raw" | "video" | "auto";
  version: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ImageVirtuals {
  imageUrl: string;
}

type ImageModel = Model<ImageDoc, {}, ImageVirtuals>;

const imageSchema = new Schema<ImageDoc, ImageModel, ImageVirtuals>(
  {
    publicId: { type: String, required: true },
    type: { type: String, enum: ["upload", "authenticated", "private"], required: true },
    resourceType: { type: String, enum: ["image", "raw", "video", "auto"], required: true },
    version: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    virtuals: {
      imageUrl: {
        get(this: ImageDoc) {
          return cloudinaryUrl(this);
        },
      },
    },
  }
);

export { imageSchema, type ImageDoc, type ImageModel };
