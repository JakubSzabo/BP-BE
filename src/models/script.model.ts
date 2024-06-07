import {EventModel} from "./event.model";
import {model, Schema, Types} from "mongoose";

export interface ScriptModel {
    id: string;
    title: string;
    date: Date;
    onMeeting: string[];
    events: Types.Array<EventModel['id']>;
    other: string;
}

export interface ScriptModelDocument extends ScriptModel, Document {
}

const ScriptSchema = new Schema<ScriptModel>(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        onMeeting: { type: [String], default: [] },
        events: [{ type: Schema.Types.ObjectId, ref: 'Event'}],
        other: { type: String, required: false },
    }, {
        toJSON: {
            virtuals: true
        },
        toObject: {
        },
        timestamps: true
    }
);

export const ScriptModel = model<ScriptModel>('Script', ScriptSchema);


