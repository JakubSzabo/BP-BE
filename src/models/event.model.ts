import {model, Schema} from "mongoose";

export interface EventModel {
    id: string;
    title: string;
    date: Date;
    text: string;
}

export interface EventModelDocument extends EventModel, Document {
}

const EventSchema = new Schema<EventModel>(
    {
        title: { type: String, required: true },
        date: { type: Date, required: true },
        text: { type: String, required: true },
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

// Create and export the Event model based on the schema
export const EventModel = model<EventModel>('Event', EventSchema);
