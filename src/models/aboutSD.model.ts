import {model, Schema} from "mongoose";

export interface AboutSDModel {
    id: string;
    title: string;
    text: string;
    map: string;
}

export const AboutSDSchema = new Schema<AboutSDModel>(
    {
        title: { type: String, required: true },
        text: { type: String, required: true },
        map: { type: String, required: true },
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

export const AboutSDModel = model<AboutSDModel>('AboutSD', AboutSDSchema);