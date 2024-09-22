import { Model, model, models, Schema } from "mongoose";

export interface AccountDoc {
  _id: {
    providerId: string;
    providerUserId: string;
  };
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<AccountDoc>(
  {
    _id: {
      providerId: { type: String, required: true },
      providerUserId: { type: String, required: true },
    },
    userId: { type: String, required: true },
  } as const,
  { _id: false, timestamps: true }
);

const Account = (models.Account as Model<AccountDoc>) || model<AccountDoc>("Account", accountSchema);

export { Account };
