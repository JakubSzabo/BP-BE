import {model, Schema} from "mongoose";

export interface UserModel {
    id: string;
    userName: string;
    password: string;
}

const UserSchema = new Schema<UserModel>(
    {
        userName: { type: String, required: true },
        password: { type: String, required: true }
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

export const UserModel = model<UserModel>('User', UserSchema);