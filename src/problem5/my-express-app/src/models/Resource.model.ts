import { Schema, model, Document } from 'mongoose';

interface IResource extends Document {
  name: string;
  description: string;
}

const resourceSchema = new Schema<IResource>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Resource = model<IResource>('Resource', resourceSchema);