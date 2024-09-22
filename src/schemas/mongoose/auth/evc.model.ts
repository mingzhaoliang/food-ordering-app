import { model, Model, models, Schema } from "mongoose";

export interface EvcDoc {
  userId: string;
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const evcSchema = new Schema<EvcDoc>(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 60 * 5 },
  },
  { timestamps: true }
);

const Evc = (models.Evc as Model<EvcDoc>) || model<EvcDoc>("Evc", evcSchema);
export default Evc;
