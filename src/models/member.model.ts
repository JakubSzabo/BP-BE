import { model, Schema, Document } from 'mongoose';

export interface Member {
    id: string;
    name: string;
    room: string;
    role: string;
    phoneNumber: string;
}

export const MemberSchema = new Schema<Member>(
    {
        name: { type: String, required: true },
        room: { type: String, required: false },
        role: { type: String, required: true },
        phoneNumber: { type: String, required: false }
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

export const MemberModel = model<Member>('Member', MemberSchema);
