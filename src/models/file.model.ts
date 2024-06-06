import { model, Schema } from 'mongoose';

export interface FileModel {
    id: string;
    name: string;
    data: string;
    language: string;
}

export const FileSchema = new Schema<FileModel>({
    name: { type: String, required: true },
    data: { type: String, required: true },
    language: { type: String, required: true }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
});

export const FileModel = model<FileModel>('FileSchema', FileSchema);
