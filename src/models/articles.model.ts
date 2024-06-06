import { model, Schema } from "mongoose"

export interface ArticlesModel {
    id: string;
    title: string;
    text: string;
    favorite: boolean;
}

export const ArticlesSchema = new Schema<ArticlesModel>(
    {
        title: { type: String, required: true },
        text: { type: String, required: true },
        favorite: { type: Boolean, required: true },
    }, {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

export const ArticlesModel = model<ArticlesModel>('Articles', ArticlesSchema);