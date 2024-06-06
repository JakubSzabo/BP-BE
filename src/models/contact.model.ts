import {model, Schema} from "mongoose";

export interface ContactModel {
    id: string;
    name: string;
    logo: string;
    link: string;
    category: string;
}

const ContactSchema = new Schema<ContactModel>(
    {
        name: { type: String, required: true },
        logo: { type: String, required: true },
        link: { type: String, required: false },
        category: { type: String, required: true }
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

export const ContactModel = model<ContactModel>('Contact', ContactSchema);
