import {model, Schema} from "mongoose";

export interface PhotoModel {
    id: string;
    data: string;
    category: string;
}

const PhotoSchema = new Schema<PhotoModel>(
    {
        data: { type: String, required: true },
        category: { type: String, required: true }
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true
    }
);

export const PhotoModel = model<PhotoModel>('Photo', PhotoSchema);