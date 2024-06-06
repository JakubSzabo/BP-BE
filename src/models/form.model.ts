import { model, Schema } from "mongoose";

export interface FormField {
    fieldType: string;
    inputType?: string;
    fieldName: string;
    requiredField: boolean;
}

export interface FormModel {
    maxAnswers: number;
    endDate: Date;
    form: FormField[];
}

const FormFieldSchema = new Schema<FormField>({
    fieldType: { type: String, required: true },
    inputType: { type: String, required: false },
    fieldName: { type: String, required: true },
    requiredField: { type: Boolean, required: true },
});

const FormSchema = new Schema<FormModel>(
    {
        maxAnswers: { type: Number, required: true },
        endDate: { type: Date, required: true },
        form: { type: [FormFieldSchema], required: true },
    },
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    }
);

export const FormModel = model<FormModel>('Form', FormSchema);
