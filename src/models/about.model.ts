import { model, Schema } from "mongoose";

export interface AboutModel {
    id: string;
    firstText: string;
    secondText: string;
    firstPhotos: string;
    secondPhotos: string;
}

export const AboutSchema = new Schema<AboutModel>(
    {
        firstText: { type: String, required: true },
        secondText: { type: String, required: true },
        firstPhotos: { type: String, required: true },
        secondPhotos: { type: String, required: true },
    },
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export const AboutModel = model<AboutModel>('About', AboutSchema);
